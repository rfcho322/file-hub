/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: "scintillating-snake-679.convex.cloud",
            },
            {
                hostname: "tailwindui.com",
            },
            {
                hostname: "img.icons8.com",
            }
        ],
    },
};

export default nextConfig;
