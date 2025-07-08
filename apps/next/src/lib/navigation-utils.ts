import { ReadonlyURLSearchParams } from "next/navigation";

export function buildUrlWithParams(
	basePath: string,
	searchParams: ReadonlyURLSearchParams,
	additionalParams?: Record<string, string | undefined>,
): string {
	const params = new URLSearchParams(searchParams.toString());

	// Add any additional parameters
	if (additionalParams) {
		Object.entries(additionalParams).forEach(([key, value]) => {
			if (value !== undefined) {
				params.set(key, value);
			} else {
				params.delete(key);
			}
		});
	}

	const queryString = params.toString();
	return queryString ? `${basePath}?${queryString}` : basePath;
}

export function preserveOrgAndProjectParams(
	basePath: string,
	searchParams: ReadonlyURLSearchParams,
): string {
	const params = new URLSearchParams();

	// Only preserve orgId and projectId
	const orgId = searchParams.get("orgId");
	const projectId = searchParams.get("projectId");

	if (orgId) {
		params.set("orgId", orgId);
	}
	if (projectId) {
		params.set("projectId", projectId);
	}

	const queryString = params.toString();
	return queryString ? `${basePath}?${queryString}` : basePath;
}
