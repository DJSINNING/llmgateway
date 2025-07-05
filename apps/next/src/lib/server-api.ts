import createFetchClient from "openapi-fetch";
import { cookies } from "next/headers";

import { getConfig } from "./config";
import type { paths } from "./api/v1";

// Server-side API client
export async function createServerApiClient() {
	const config = getConfig();
	const cookieStore = await cookies();

	// Get session cookie for authentication
	const sessionCookie = cookieStore.get("better-auth.session_token");

	return createFetchClient<paths>({
		baseUrl: config.apiUrl,
		credentials: "include",
		headers: {
			Cookie: sessionCookie
				? `better-auth.session_token=${sessionCookie.value}`
				: "",
		},
	});
}

// Generic server-side data fetcher
export async function fetchServerData<T>(
	method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
	path: string,
	options?: {
		params?: any;
		body?: any;
	},
): Promise<T | null> {
	try {
		const client = await createServerApiClient();

		let response;
		const requestOptions = options || {};

		switch (method) {
			case "GET":
				response = await client.GET(path as any, requestOptions);
				break;
			case "POST":
				response = await client.POST(path as any, requestOptions);
				break;
			case "PUT":
				response = await client.PUT(path as any, requestOptions);
				break;
			case "DELETE":
				response = await client.DELETE(path as any, requestOptions);
				break;
			case "PATCH":
				response = await client.PATCH(path as any, requestOptions);
				break;
			default:
				throw new Error(`Unsupported HTTP method: ${method}`);
		}

		if (response.error) {
			console.error(`Server API error for ${method} ${path}:`, response.error);
			return null;
		}

		return response.data as T;
	} catch (error) {
		console.error(`Server API error for ${method} ${path}:`, error);
		return null;
	}
}
