import {createClient} from 'next-sanity'
import {apiVersion, dataset, projectId} from '../env'

const token = process.env.SANITY_WRITE_TOKEN

if (!token) {
  throw new Error('Missing environment variable: SANITY_WRITE_TOKEN')
}

export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
})
