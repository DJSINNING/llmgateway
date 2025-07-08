import type { NextConfig } from "next";
import { withContentCollections } from "@content-collections/next";

const nextConfig: NextConfig = {
	async rewrites() {
		return [
			{
				source: "/api/:path*",
				destination: "http://localhost:4002/:path*",
			},
		];
	},
};

// withContentCollections must be the outermost plugin
export default withContentCollections(nextConfig);
