/**
 * Adds the 2026 news coverage to the About page's "Featured in" list.
 *
 * Each article's cover image is copied from the outlet into Sanity's asset
 * store, so the site serves it from cdn.sanity.io rather than hotlinking.
 *
 * Dry run (default):
 *   npx tsx --env-file=.env --env-file=.env.local sanity/migrations/import-press-mentions.ts
 * Commit:
 *   ... same command ... --commit
 *
 * Re-runs skip any article whose URL is already in the list. The published
 * document and, if one exists, its draft are both patched, so publishing an
 * open draft later doesn't drop the new entries.
 */
import {createClient} from '@sanity/client'

const COMMIT = process.argv.includes('--commit')
const DOC_ID = 'aboutPage'

interface Mention {
  key: string
  outlet: string
  title: string
  url: string
  publishedAt: string
  imageUrl: string
  imageAlt: string
}

const MENTIONS: Mention[] = [
  {
    key: 'techpana-2026',
    outlet: 'TechPana',
    title:
      'इटहरीमा २४ घण्टे ‘गोदावरी ह्याक्स’ आयोजना हुँदै, किशोर-किशोरीले प्रतिभा देखाउने',
    url: 'https://techpana.com/2026/155000/teen-developers-to-showcase-talent-at-godawari-hacks-in-itahari',
    publishedAt: '2026-01-15',
    imageUrl: 'https://techpana.prixacdn.net/media/albums/Hackathon_EP1RnG9AH8.jpg',
    imageAlt: 'Hands holding an orange sign that reads “Hackathon”',
  },
  {
    key: 'ictsamachar-2026',
    outlet: 'ICT Samachar',
    title: 'इटहरीमा आजदेखि गोदावरी ह्याक्स २०२६',
    url: 'https://ictsamachar.com/news/godawari-hacks-2026-to-begin-in-itahari-today/',
    publishedAt: '2026-01-18',
    imageUrl:
      'https://ictsamacharcdn.prixacdn.net/media/albums/New_Project_13_mxhn1rpjOr_GDmx3ccvWT.jpg',
    imageAlt: 'Godawari Hacks 2026 poster: registration deadline extended, 18 to 19 January',
  },
]

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

async function uploadCover(mention: Mention) {
  const response = await fetch(mention.imageUrl)
  if (!response.ok) {
    throw new Error(`Could not download ${mention.imageUrl}: HTTP ${response.status}`)
  }
  const buffer = Buffer.from(await response.arrayBuffer())
  const filename = new URL(mention.imageUrl).pathname.split('/').pop()
  return sanity.assets.upload('image', buffer, {filename})
}

async function run() {
  console.log(COMMIT ? 'Running in COMMIT mode\n' : 'Running in DRY RUN mode\n')

  const docs = await sanity.fetch<Array<{_id: string; urls: string[] | null}>>(
    `*[_id in [$id, "drafts." + $id]]{_id, "urls": featuredIn[].url}`,
    {id: DOC_ID},
  )
  if (!docs.some((doc) => doc._id === DOC_ID)) {
    throw new Error(`No published "${DOC_ID}" document. Publish the About page in Studio first.`)
  }

  const present = new Set(docs.flatMap((doc) => doc.urls ?? []))
  const missing = MENTIONS.filter((mention) => !present.has(mention.url))

  console.log(`Documents to patch: ${docs.map((doc) => doc._id).join(', ')}`)
  for (const mention of MENTIONS) {
    console.log(`${present.has(mention.url) ? 'skip' : 'add '}  ${mention.outlet}: ${mention.url}`)
  }

  if (missing.length === 0 || !COMMIT) {
    if (!COMMIT) console.log('\nDry run only. Re-run with --commit to write.')
    return
  }

  const items: Array<Record<string, unknown> & {url: string}> = []
  for (const mention of missing) {
    const asset = await uploadCover(mention)
    console.log(`uploaded cover for ${mention.outlet} → ${asset._id}`)
    items.push({
      _type: 'pressMention',
      _key: mention.key,
      outlet: mention.outlet,
      title: mention.title,
      url: mention.url,
      publishedAt: mention.publishedAt,
      image: {
        _type: 'image',
        asset: {_type: 'reference', _ref: asset._id},
        alt: mention.imageAlt,
      },
    })
  }

  const transaction = sanity.transaction()
  for (const doc of docs) {
    // Only append what this document is actually missing.
    const docUrls = new Set(doc.urls ?? [])
    const toAdd = items.filter((item) => !docUrls.has(item.url))
    if (toAdd.length === 0) continue
    transaction.patch(doc._id, (patch) =>
      patch
        .setIfMissing({featuredTitle: 'We are featured in', featuredIn: []})
        .append('featuredIn', toAdd),
    )
  }
  await transaction.commit()
  console.log(`\nAdded ${items.length} press mention(s).`)
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
