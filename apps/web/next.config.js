import path from 'node:path'

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: path.join(process.cwd(), '../..'),
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '76.13.77.252',
      },
    ],
  },
}

export default nextConfig
