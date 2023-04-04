/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
    output: 'export',
    distDir: 'dist',
    experimental: {
        appDir: true,
    },
};

module.exports = nextConfig;
