/**
 * One-time import of Supabase team registrations into Sanity.
 *
 * Dry run (default):
 *   npx tsx --env-file=.env --env-file=.env.local sanity/migrations/import-registrations-from-supabase.ts
 * Commit:
 *   ... same command ... --commit
 *
 * Re-runs skip anything already carrying a matching legacySupabaseId.
 */
import {basename} from 'node:path'
import {createClient as createSanityClient} from '@sanity/client'
import {createClient as createSupabaseClient} from '@supabase/supabase-js'

const COMMIT = process.argv.includes('--commit')

const VALID_STATUSES = ['pending', 'approved', 'rejected', 'cancelled']
const PAYMENT_BUCKET = 'payment-screenshots'
const DOCUMENT_BUCKET = 'team-documents'

/** Everything in the Supabase tables belongs to the first event. */
const LEGACY_SEASON = '2026'

interface SupabaseTeam {
  id: string
  team_name: string
  status: string | null
  registration_date: string | null
  payment_screenshot_path: string | null
  payment_verified: boolean | null
}

interface SupabaseMember {
  team_id: string
  member_number: number | null
  full_name: string
  email: string
  phone: string
  document_type: string | null
  document_path: string | null
}

function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`Missing environment variable: ${name}`)
  return value
}

const supabase = createSupabaseClient(
  requireEnv('NEXT_PUBLIC_SUPABASE_URL'),
  requireEnv('SUPABASE_SERVICE_ROLE_KEY'),
)

const sanity = createSanityClient({
  projectId: requireEnv('NEXT_PUBLIC_SANITY_PROJECT_ID'),
  dataset: requireEnv('NEXT_PUBLIC_SANITY_DATASET'),
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-10-13',
  token: requireEnv('SANITY_WRITE_TOKEN'),
  useCdn: false,
})

async function transferAsset(
  kind: 'image' | 'file',
  bucket: string,
  path: string,
): Promise<string | null> {
  const {data, error} = await supabase.storage.from(bucket).download(path)
  if (error || !data) {
    console.warn(`  ! could not download ${bucket}/${path}: ${error?.message}`)
    return null
  }

  if (!COMMIT) return 'dry-run-asset-id'

  const buffer = Buffer.from(await data.arrayBuffer())
  const asset = await sanity.assets.upload(kind, buffer, {
    filename: basename(path),
    contentType: data.type || undefined,
  })
  return asset._id
}

async function run() {
  console.log(COMMIT ? 'Running in COMMIT mode\n' : 'Running in DRY RUN mode\n')

  const {data: teams, error: teamsError} = await supabase
    .from('teams')
    .select(
      'id, team_name, status, registration_date, payment_screenshot_path, payment_verified',
    )
    .order('registration_date', {ascending: true})

  if (teamsError) throw new Error(`Failed to read teams: ${teamsError.message}`)
  if (!teams?.length) {
    console.log('No teams found in Supabase. Nothing to import.')
    return
  }

  const migrated = new Set(
    await sanity.fetch<string[]>(
      `*[_type == "teamRegistration" && defined(legacySupabaseId)].legacySupabaseId`,
    ),
  )

  let imported = 0
  let skipped = 0

  for (const team of teams as SupabaseTeam[]) {
    if (migrated.has(team.id)) {
      console.log(`- ${team.team_name} (${team.id}) already imported, skipping`)
      skipped++
      continue
    }

    console.log(`> ${team.team_name} (${team.id})`)

    const {data: members, error: membersError} = await supabase
      .from('team_members')
      .select(
        'team_id, member_number, full_name, email, phone, document_type, document_path',
      )
      .eq('team_id', team.id)
      .order('member_number', {ascending: true})

    if (membersError) {
      console.warn(`  ! skipping, failed to read members: ${membersError.message}`)
      continue
    }
    if (!members?.length) {
      console.warn('  ! skipping, team has no members')
      continue
    }

    const paymentAssetId = team.payment_screenshot_path
      ? await transferAsset('image', PAYMENT_BUCKET, team.payment_screenshot_path)
      : null
    if (!paymentAssetId) {
      console.warn('  ! no payment screenshot — importing without one')
    }

    const memberDocs: Record<string, unknown>[] = []
    for (const member of members as SupabaseMember[]) {
      const documentAssetId = member.document_path
        ? await transferAsset('file', DOCUMENT_BUCKET, member.document_path)
        : null
      if (!documentAssetId) {
        console.warn(`  ! no document for ${member.email} — importing without one`)
      }

      memberDocs.push({
        _key: `member-${member.member_number ?? memberDocs.length + 1}`,
        _type: 'registrationMember',
        fullName: member.full_name,
        email: member.email?.toLowerCase(),
        phone: member.phone,
        documentType: member.document_type ?? undefined,
        ...(documentAssetId && {
          document: {
            _type: 'file',
            asset: {_type: 'reference', _ref: documentAssetId},
          },
        }),
      })
    }

    const status =
      team.status && VALID_STATUSES.includes(team.status) ? team.status : 'pending'
    if (status !== team.status) {
      console.warn(`  ! unknown status "${team.status}" — defaulting to pending`)
    }

    const doc = {
      _type: 'teamRegistration',
      legacySupabaseId: team.id,
      teamName: team.team_name,
      season: LEGACY_SEASON,
      status,
      registeredAt: team.registration_date ?? undefined,
      paymentVerified: team.payment_verified ?? false,
      members: memberDocs,
      ...(paymentAssetId && {
        paymentScreenshot: {
          _type: 'image',
          asset: {_type: 'reference', _ref: paymentAssetId},
        },
      }),
    }

    if (COMMIT) {
      await sanity.create(doc)
      console.log(`  ✓ imported with ${memberDocs.length} member(s)`)
    } else {
      console.log(`  would import with ${memberDocs.length} member(s)`)
    }
    imported++
  }

  console.log(
    `\n${COMMIT ? 'Imported' : 'Would import'} ${imported} team(s), skipped ${skipped} already present.`,
  )
  if (!COMMIT) console.log('Re-run with --commit to write to Sanity.')
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
