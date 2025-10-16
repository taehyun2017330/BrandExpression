/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // 일시적으로 비활성화 (INICIS 중복 요청 방지)
  // Disable x-powered-by header
  poweredByHeader: false,
  // Configure for GitHub Pages deployment
  output: 'export',
  images: {
    unoptimized: true, // Required for static export
  },
  // Ignore ESLint and TypeScript errors during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // No basePath - app will be at subdomain root
  // basePath: '/service',
}

module.exports = nextConfig