/**
 * Imports the curated 2026 event photos into Sanity as archivePhoto docs.
 *
 * The curated list lives in data/archive-2026-photos.json: one entry per unique
 * scene, with alt text and caption written from a visual review. Near-duplicate
 * burst frames, PII (a bank receipt), screen captures and off-event shots were
 * excluded during that review — see duplicatesDropped for how many frames each
 * surviving photo stands in for.
 *
 * Dry run (default):
 *   npx tsx --env-file=.env --env-file=.env.local sanity/migrations/import-archive-photos.ts
 * Commit:
 *   ... same command ... --commit
 *
 * Re-runs skip anything already carrying a matching originalFilename.
 */
import {readFile} from 'node:fs/promises'
import {join} from 'node:path'
import {createClient} from '@sanity/client'
import sharp from 'sharp'

const COMMIT = process.argv.includes('--commit')

const SOURCE_DIR =
  '/mnt/c/Users/ACER/Downloads/Godawari Hacks 2026-20261017T111127Z-1-001/Godawari Hacks 2026/Photos'
const MANIFEST = new URL('./data/archive-2026-photos.json', import.meta.url)
const SEASON = '2026'
/** Originals run to 4000px; the grid never renders above ~1200. */
const MAX_EDGE = 2400

interface CuratedPhoto {
  file: string
  order: number
  alt: string
  caption: string
}

function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`Missing environment variable: ${name}`)
  return value
}

const sanity = createClient({
  projectId: requireEnv('NEXT_PUBLIC_SANITY_PROJECT_ID'),
  dataset: requireEnv('NEXT_PUBLIC_SANITY_DATASET'),
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-10-13',
  token: requireEnv('SANITY_WRITE_TOKEN'),
  useCdn: false,
})

async function run() {
  console.log(COMMIT ? 'Running in COMMIT mode\n' : 'Running in DRY RUN mode\n')

  const photos: CuratedPhoto[] = JSON.parse(
    await readFile(MANIFEST, 'utf8'),
  )

  const existing = new Set(
    await sanity.fetch<string[]>(
      `*[_type == "archivePhoto" && defined(originalFilename)].originalFilename`,
    ),
  )

  let imported = 0
  let skipped = 0

  for (const photo of photos) {
    if (existing.has(photo.file)) {
      skipped++
      continue
    }

    if (!COMMIT) {
      imported++
      continue
    }

    const buffer = await sharp(join(SOURCE_DIR, photo.file))
      .rotate()
      .resize({
        width: MAX_EDGE,
        height: MAX_EDGE,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .jpeg({quality: 82, mozjpeg: true})
      .toBuffer()

    const asset = await sanity.assets.upload('image', buffer, {
      filename: photo.file,
      contentType: 'image/jpeg',
    })

    await sanity.create({
      _type: 'archivePhoto',
      originalFilename: photo.file,
      season: SEASON,
      order: photo.order,
      alt: photo.alt,
      caption: photo.caption,
      image: {_type: 'image', asset: {_type: 'reference', _ref: asset._id}},
    })

    imported++
    if (imported % 25 === 0) console.log(`  ... ${imported} uploaded`)
  }

  console.log(
    `\n${COMMIT ? 'Imported' : 'Would import'} ${imported} photo(s), skipped ${skipped} already present.`,
  )
  if (!COMMIT) console.log('Re-run with --commit to write to Sanity.')
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
