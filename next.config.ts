/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',

        pathname: '**',
      },
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3001'],
    },
  },
  turbopack: {
    root: '.',
  },
};

module.exports = nextConfig;