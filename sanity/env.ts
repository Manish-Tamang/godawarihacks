export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-10-13'

// Every environment uses the same dataset name, so default it rather than
// throwing. A deploy that only set the project id used to fail the whole
// build here, while collecting the config for /api/register.
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  'Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID. ' +
    'It is inlined at build time, so it has to be set wherever `next build` ' +
    'runs (locally in .env.local, on Vercel in Project Settings → ' +
    'Environment Variables, for every environment you deploy).'
)

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined || v === '') {
    throw new Error(errorMessage)
  }

  return v
}
