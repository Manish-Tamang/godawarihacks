/** @type {import('next').NextConfig} */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
let supabaseHost;
try {
  supabaseHost = supabaseUrl ? new URL(supabaseUrl).hostname : undefined;
} catch {}

const config = {
  images: {
    remotePatterns: [
      // Sanity CDN (images served via @sanity/image-url)
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
      // Allow optimized images from Supabase public storage
      ...(supabaseHost
        ? [
            {
              protocol: "https",
              hostname: supabaseHost,
              pathname: "/storage/v1/object/public/**",
            },
          ]
        : []),
    ],
  },
};

export default config;
