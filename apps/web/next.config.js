import path from 'node:path'

const monorepoRoot = path.join(process.cwd(), '../..')

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: monorepoRoot,
  turbopack: {
    root: monorepoRoot,
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
