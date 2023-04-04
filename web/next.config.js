/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
    output: 'export',
    distDir: 'dist',
    experimental: {
        appDir: true,
    },
    compiler: {
        styledComponents: true,
    },
};

module.exports = nextConfig;
