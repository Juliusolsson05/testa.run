/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '76.13.77.252',
      },
    ],
  },
};

export default nextConfig;
