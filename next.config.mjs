/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns:[
            {
                protocol: 'https',
                hostname: 'cheat-day-bakes.s3.amazonaws.com'
            }
        ]
    }
};

export default nextConfig;
