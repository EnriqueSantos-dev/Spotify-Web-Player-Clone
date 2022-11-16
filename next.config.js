/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    imageSizes: [64, 640, 800],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.scdn.co",
        pathname: "/image/**",
      },
      {
        protocol: "https",
        hostname: "seed-mix-image.spotifycdn.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "mosaic.scdn.co",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "charts-images.scdn.co",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
