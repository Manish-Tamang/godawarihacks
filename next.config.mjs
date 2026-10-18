/** @type {import('next').NextConfig} */
const config = {
  images: {
    remotePatterns: [
      // Sanity CDN (images served via @sanity/image-url)
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
    ],
  },
};

export default config;
