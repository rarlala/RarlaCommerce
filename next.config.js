/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    emotion: true,
  },
  images: {
    domains: [
      "picsum.photos",
      "www.bobbies.com",
      "cdn.shopify.com",
      "m.media-amazon.com",
      "lh3.googleusercontent.com",
    ],
  },
};

module.exports = nextConfig;
