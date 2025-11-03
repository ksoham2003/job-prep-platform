// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable Turbopack (new in Next.js 16)
  experimental: {
    turbo: {
      rules: {
        '*.node': {
          loaders: ['node-loader'],
        },
      },
    },
  },
  
  // Handle external packages for server components
  serverComponentsExternalPackages: ['mongoose', 'pdf-parse', 'cloudinary'],
  
  // Image domains
  images: {
    domains: [
      'images.clerk.dev',
      'res.cloudinary.com',
      'img.clerk.com',
    ],
  },
  
  // Environment variables
  env: {
    CUSTOM_ENV: process.env.CUSTOM_ENV,
  },
}

module.exports = nextConfig