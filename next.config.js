/** @type {import('next').NextConfig} */
const nextConfig = {
  // This starter does not need the agent instruction files Next can write.
  agentRules: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

module.exports = nextConfig;
