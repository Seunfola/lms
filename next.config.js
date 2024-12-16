/** @type {import('next').NextConfig} */
const nextConfig = {

    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'smooth-bluebird-80.clerk.accounts.dev',
            },
        ],
    },
};

module.exports = nextConfig;
