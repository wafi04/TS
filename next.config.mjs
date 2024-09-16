/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true
    },
    typescript : {
        ignoreBuildErrors : true
    },
    images: {
        remotePatterns: [
            {
                hostname: "lh3.googleusercontent.com"
            }, {
                hostname : "nautical-eagle-852.convex.cloud"
            }
        ]
    }
};

export default nextConfig;
