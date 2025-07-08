import { type ReactNode } from "react";

import { DashboardLayoutClient } from "@/components/dashboard/dashboard-layout-client";
import { UserProvider } from "@/components/providers/user-provider";
import { SidebarProvider } from "@/lib/components/sidebar";
import { fetchServerData } from "@/lib/server-api";
import type { User } from "@/lib/types";

// Force dynamic rendering since this layout uses cookies for authentication
export const dynamic = "force-dynamic";

interface DashboardLayoutProps {
	children: ReactNode;
	searchParams?: Promise<{
		orgId?: string;
		projectId?: string;
	}>;
}

export default async function DashboardLayout({
	children,
	searchParams,
}: DashboardLayoutProps) {
	// Safely handle searchParams
	let orgId: string | undefined;
	try {
		const params = searchParams ? await searchParams : {};
		orgId = params?.orgId;
	} catch (error) {
		console.warn("Failed to parse searchParams:", error);
		orgId = undefined;
	}

	// Fetch user data server-side
	const initialUserData = await fetchServerData<
		{ user: User } | undefined | null
	>("GET", "/user/me");

	// Fetch organizations server-side
	const initialOrganizationsData = await fetchServerData("GET", "/orgs");

	// Determine which organization to fetch projects for
	let targetOrgId = orgId;
	if (
		!targetOrgId &&
		initialOrganizationsData &&
		typeof initialOrganizationsData === "object"
	) {
		const data = initialOrganizationsData as {
			organizations?: Array<{ id: string }>;
		};
		if (data.organizations && data.organizations.length > 0) {
			targetOrgId = data.organizations[0].id;
		}
	}

	// Fetch projects for the target organization
	let initialProjectsData = null;
	if (targetOrgId) {
		try {
			initialProjectsData = await fetchServerData(
				"GET",
				"/orgs/{id}/projects",
				{
					params: {
						path: {
							id: targetOrgId,
						},
					},
				},
			);
		} catch (error) {
			console.warn(
				"Failed to fetch projects for organization:",
				targetOrgId,
				error,
			);
		}
	}

	return (
		<UserProvider initialUserData={initialUserData}>
			<SidebarProvider>
				<DashboardLayoutClient
					initialOrganizationsData={initialOrganizationsData}
					initialProjectsData={initialProjectsData}
				>
					{children}
				</DashboardLayoutClient>
			</SidebarProvider>
		</UserProvider>
	);
}
