"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { RecentLogs } from "@/components/activity/recent-logs";
import { ActivityChart } from "@/components/dashboard/activity-chart";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/lib/components/card";
import type { ActivitT } from "@/types/activity";

type LogsData = {
	message?: string;
	logs: {
		id: string;
		requestId: string;
		createdAt: string;
		updatedAt: string;
		organizationId: string;
		projectId: string;
		apiKeyId: string;
		duration: number;
		requestedModel: string;
		requestedProvider: string | null;
		usedModel: string;
		usedProvider: string;
		responseSize: number;
		content: string | null;
		unifiedFinishReason: string | null;
		finishReason: string | null;
		promptTokens: string | null;
		completionTokens: string | null;
		totalTokens: string | null;
		reasoningTokens: string | null;
		messages?: unknown;
		temperature: number | null;
		maxTokens: number | null;
		topP: number | null;
		frequencyPenalty: number | null;
		presencePenalty: number | null;
		hasError: boolean | null;
		errorDetails: {
			statusCode: number;
			statusText: string;
			responseText: string;
		} | null;
		cost: number | null;
		inputCost: number | null;
		outputCost: number | null;
		requestCost: number | null;
		estimatedCost: boolean | null;
		canceled: boolean | null;
		streamed: boolean | null;
		cached: boolean | null;
		mode: "api-keys" | "credits" | "hybrid";
		usedMode: "api-keys" | "credits";
	}[];
	pagination: {
		nextCursor: string | null;
		hasMore: boolean;
		limit: number;
	};
};

interface ActivityClientProps {
	initialLogsData?: unknown;
	initialActivityData?: ActivitT;
}

export function ActivityClient({
	initialLogsData,
	initialActivityData,
}: ActivityClientProps) {
	const router = useRouter();
	const searchParams = useSearchParams();

	const daysParam = searchParams.get("days");

	useEffect(() => {
		if (!daysParam) {
			const params = new URLSearchParams(searchParams.toString());
			params.set("days", "7");
			router.replace(`/dashboard/activity?${params.toString()}`);
		}
	}, [daysParam, searchParams, router]);

	return (
		<div className="flex flex-col">
			<div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
				<div className="flex items-center justify-between space-y-2">
					<h2 className="text-3xl font-bold tracking-tight">Activity</h2>
				</div>
				<div className="space-y-4">
					<ActivityChart initialData={initialActivityData} />
					<Card>
						<CardHeader>
							<div>
								<CardTitle>Recent Activity</CardTitle>
								<CardDescription>
									Your recent API requests and system events
								</CardDescription>
							</div>
						</CardHeader>
						<CardContent>
							<RecentLogs
								initialData={initialLogsData as LogsData | undefined}
							/>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
