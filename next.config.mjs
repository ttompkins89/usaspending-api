/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // API paths are passed through to the USAspending API exactly as written, with or without a trailing slash.
  skipTrailingSlashRedirect: true,
  async redirects() {
    return [
      { source: '/start', destination: '/quickstart', permanent: true },
      { source: '/start/filters', destination: '/filters', permanent: true },
    ];
  },
};
export default nextConfig;
