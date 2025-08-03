/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    staleTimes: {
      dynamic: 30,
    },
  },
  serverExternalPackages: ["@node-rs/argon2"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: `${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}.ufs.sh`,
        pathname: `/f/*`,
      },
      {
        protocol: "https",
        hostname: "utfs.io",
        pathname: `/f/*`,
      },
    ],
  },
  rewrites: () => [
    {
      source: "/hashtag/:tag",
      destination: "/search?q=%23:tag",
    },
  ],
};

console.log("UPLOADTHING_APP_ID:", process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID);

export default nextConfig;
