import {createClient, type SanityClient} from 'next-sanity'
import {apiVersion, dataset, projectId} from '../env'

let cached: SanityClient | undefined

/**
 * Built on first use rather than at import time. `next build` evaluates the
 * route modules that import this to collect their config, and the write token
 * is a runtime-only secret that is not necessarily present then — throwing
 * during module evaluation failed the build instead of the request.
 */
export function getWriteClient(): SanityClient {
  if (!cached) {
    const token = process.env.SANITY_WRITE_TOKEN

    if (!token) {
      throw new Error('Missing environment variable: SANITY_WRITE_TOKEN')
    }

    cached = createClient({
      projectId,
      dataset,
      apiVersion,
      token,
      useCdn: false,
    })
  }

  return cached
}
