/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // The storefront loads images directly (CSS backgrounds / ordinary img).
    // Keep the unused server-side optimizer disabled so /_next/image cannot
    // fetch and process attacker-controlled remote images.
    unoptimized: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
}

module.exports = nextConfig





