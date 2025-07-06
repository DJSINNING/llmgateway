import { ActivityClient } from "@/components/activity/activity-client";
import { fetchServerData } from "@/lib/server-api";

export default async function ActivityPage({
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

	// Server-side data fetching for logs
	const initialLogsData = await fetchServerData("GET", "/logs", {
		params: {
			query: {
				orderBy: "createdAt_desc",
				...(projectId ? { projectId } : {}),
			},
		},
	});

	// Server-side data fetching for activity data
	const initialActivityData = await fetchServerData("GET", "/activity", {
		params: {
			query: {
				days: daysParam,
				...(projectId ? { projectId } : {}),
			},
		},
	});

	return (
		<ActivityClient
			initialLogsData={initialLogsData}
			initialActivityData={initialActivityData}
		/>
	);
}
