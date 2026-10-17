import {type QueryParams} from 'next-sanity'
import {client} from './client'

export async function sanityFetch<T>({
  query,
  params = {},
  revalidate = 60,
  tags = [],
}: {
  query: string
  params?: QueryParams
  revalidate?: number | false
  tags?: string[]
}): Promise<T> {
  const isDev = process.env.NODE_ENV === "development"

  return client.withConfig({useCdn: !isDev}).fetch<T>(query, params, {
    next: {
      revalidate: isDev ? 0 : revalidate,
      tags,
    },
  })
}
