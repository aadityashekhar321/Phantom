/** @type {import('next').NextConfig} */
import withPWAInit from 'next-pwa';

const withPWA = withPWAInit({
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
});

const nextConfig = {
    experimental: {
        optimizePackageImports: ['lucide-react'],
    },
};

export default withPWA(nextConfig);
