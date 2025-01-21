/** @type {import('next').NextConfig} */
const config = {
  images: {
    domains: [], // Add any image domains you need here
  },
  transpilePackages: [
    "@greatforai/ai-core",
    "@greatforai/core",
    "@greatforai/database",
    "@greatforai/ui"
  ],
  output: 'standalone'
};

export default config;