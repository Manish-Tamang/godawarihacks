/** @type {import('next').NextConfig} */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
let supabaseHost;
try {
  supabaseHost = supabaseUrl ? new URL(supabaseUrl).hostname : undefined;
} catch {}

const config = {
  images: {
    // Allow optimized images from Supabase public storage
    remotePatterns: supabaseHost
      ? [
          {
            protocol: "https",
            hostname: supabaseHost,
            pathname: "/storage/v1/object/public/**",
          },
        ]
      : [],
    // Simple domains fallback if remotePatterns ever changes
    domains: supabaseHost ? [supabaseHost] : [],
  },
};

export default config;
