/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['limitlesstcg.s3.us-east-2.amazonaws.com', 'images.pokemontcg.io']
  },
  async rewrites() {
    return [
      {
        source: '/pokedata/:path*',
        destination: 'https://pokedata.ovh/:path*',
      },
    ]
  },
}

module.exports = nextConfig
