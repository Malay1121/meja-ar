/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: [
      'firebasestorage.googleapis.com',
      'lh3.googleusercontent.com',
      'images.unsplash.com',
    ],
  },
  env: {
    CUSTOM_KEY: 'mejar-admin-panel',
  },
}

module.exports = nextConfig