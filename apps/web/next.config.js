/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [], // Add any image domains you need here
  },
  transpilePackages: [
    "@greatforai/ai-core",
    "@greatforai/core",
    "@greatforai/database",
    "@greatforai/ui"
  ],
  output: 'standalone',
  outputFileTracingRoot: process.env.NEXT_PRIVATE_LOCAL_WEBPACK ? undefined : process.cwd(),
  experimental: {
    externalDir: true
  }
};

export default nextConfig;