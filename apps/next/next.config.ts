import type { NextConfig } from "next";
import { withContentCollections } from "@content-collections/next";

const nextConfig: NextConfig = {
	async rewrites() {
		return [
			{
				source: "/api/:path*",
				destination:
					process.env.NODE_ENV === "development"
						? "http://localhost:4002/:path*"
						: "https://api.llmgateway.io/:path*",
			},
		];
	},
};

// withContentCollections must be the outermost plugin
export default withContentCollections(nextConfig);
