/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // API paths are passed through to the USAspending API exactly as written, with or without a trailing slash.
  skipTrailingSlashRedirect: true,
};
export default nextConfig;
