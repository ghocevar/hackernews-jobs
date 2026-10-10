/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    // On Vercel, /api/stories is the Go function. Locally, Next does not run
    // Go functions, so proxy that path to the process started by `pnpm dev`.
    if (process.env.VERCEL) {
      return [];
    }
    return [
      {
        source: '/api/:path*',
        destination: 'http://127.0.0.1:8080/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
