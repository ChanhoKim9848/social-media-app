/** @type {import('next').NextConfig} */

// client's side, cashs the page for 30s
const nextConfig = {
  experimental: {
    staleTimes: {
      dynamic: 30,
    },
  },
};

export default nextConfig;
