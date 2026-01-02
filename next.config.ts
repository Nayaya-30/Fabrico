import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		domains: ["your-cdn-domain.com"],
	},
	experimental: {
		serverActions: {
			enabled: true,
		},
	},
};

export default nextConfig;