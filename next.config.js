/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        NEXT_PUBLIC_CLERK_FRONTEND_API: process.env.NEXT_PUBLIC_CLERK_FRONTEND_API,
        CLERK_API_KEY: process.env.CLERK_API_KEY,
        NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
        PAYSTACK_SECRET_KEY: process.env.PAYSTACK_SECRET_KEY,
        DATABASE_URL: process.env.DATABASE_URL,
    },
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
