import { DashboardClient } from "@/components/dashboard/dashboard-client";
import { fetchServerData } from "@/lib/server-api";
import type { ActivitT } from "@/types/activity";

export default async function Dashboard({
	searchParams,
}: {
	searchParams?: Promise<{
		projectId?: string;
		days?: string;
	}>;
}) {
	// Safely handle searchParams
	let projectId: string | undefined;
	let days: string | undefined;
	try {
		const params = searchParams ? await searchParams : {};
		projectId = params?.projectId;
		days = params?.days;
	} catch (error) {
		console.warn("Failed to parse searchParams:", error);
		projectId = undefined;
		days = undefined;
	}

	// Parse days parameter, default to 7 if not provided or invalid
	const daysParam = days === "30" ? "30" : "7";

	const initialActivityData = await fetchServerData<ActivitT>(
		"GET",
		"/activity",
		{
			params: {
				query: {
					days: daysParam,
					projectId,
				},
			},
		},
	);

	return (
		<DashboardClient initialActivityData={initialActivityData || undefined} />
	);
}
