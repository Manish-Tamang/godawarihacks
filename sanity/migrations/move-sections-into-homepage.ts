import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2026-10-13'})

function withoutMeta<T extends Record<string, unknown>>(doc: T) {
  const {_id, _rev, _createdAt, _updatedAt, _type, order, ...fields} = doc
  return {_key: String(_id).replace(/^drafts\./, ''), _type, ...fields}
}

async function run() {
  const [gallery, events, venue, team, sponsors, home] = await Promise.all([
    client.fetch<Record<string, unknown> | null>(`*[_id == "photoGallery"][0]`),
    client.fetch<Record<string, unknown>[]>(`*[_type == "scheduleEvent"] | order(order asc)`),
    client.fetch<Record<string, unknown> | null>(`*[_type == "venue"][0]`),
    client.fetch<Record<string, unknown>[]>(`*[_type == "teamMember"] | order(order asc)`),
    client.fetch<Record<string, unknown>[]>(`*[_type == "sponsor"] | order(order asc)`),
    client.getDocument('homePage'),
  ])

  if (!home) {
    throw new Error('Homepage document homePage does not exist')
  }

  const next: Record<string, unknown> = {}
  const photos = (gallery?.photos as unknown[] | undefined) ?? []
  if ((!home.photoGallery || !(home.photoGallery as {photos?: unknown[]}).photos?.length) && photos.length) {
    const {_id, _rev, _createdAt, _updatedAt, _type, ...fields} = gallery!
    next.photoGallery = {_type: 'photoGallery', ...fields}
  }
  if ((!Array.isArray(home.schedule) || home.schedule.length === 0) && events.length) {
    next.schedule = events.map(withoutMeta)
  }
  if (!(home.venue as {name?: string} | undefined)?.name && venue) {
    const {_id, _rev, _createdAt, _updatedAt, _type, ...fields} = venue
    next.venue = {_type: 'venue', ...fields}
  }
  if ((!Array.isArray(home.team) || home.team.length === 0) && team.length) {
    next.team = team.map(withoutMeta)
  }
  if ((!Array.isArray(home.sponsors) || home.sponsors.length === 0) && sponsors.length) {
    next.sponsors = sponsors.map(withoutMeta)
  }

  const keys = Object.keys(next)
  if (keys.length === 0) {
    console.log('Homepage already has these sections')
    return
  }

  await client.patch('homePage').set(next).commit()
  const draft = await client.getDocument('drafts.homePage')
  if (draft) {
    await client.patch('drafts.homePage').set(next).commit()
  }
  console.log(`Copied into homepage: ${keys.join(', ')}`)
}

run()
