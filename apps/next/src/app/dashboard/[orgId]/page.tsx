import { redirect } from "next/navigation";

import { fetchServerData } from "@/lib/server-api";

interface OrgPageProps {
	params: Promise<{ orgId: string }>;
}

export default async function OrgPage({ params }: OrgPageProps) {
	const { orgId } = await params;

	console.log("OrgPage: Fetching projects for orgId:", orgId);

	// Fetch projects for this organization
	const projectsData = await fetchServerData("GET", "/orgs/{id}/projects", {
		params: {
			path: {
				id: orgId,
			},
		},
	});

	console.log("OrgPage: Raw projectsData:", projectsData);

	// Check if API returned null (error case)
	if (!projectsData) {
		console.log("OrgPage: Projects API returned null - possible API error");
		return (
			<div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
				<h1 className="text-2xl font-bold">Error Loading Projects</h1>
				<p className="text-muted-foreground">
					Failed to load projects for this organization. Please check your
					connection and try again.
				</p>
			</div>
		);
	}

	if (projectsData && typeof projectsData === "object") {
		const projects = projectsData as {
			projects?: Array<{ id: string; name: string }>;
		};

		console.log("OrgPage: Parsed projects:", projects.projects);
		console.log("OrgPage: Projects length:", projects.projects?.length);

		if (projects.projects && projects.projects.length > 0) {
			const firstProjectId = projects.projects[0].id;
			console.log("OrgPage: Redirecting to first project:", firstProjectId);
			// Redirect to the first project
			redirect(`/dashboard/${orgId}/${firstProjectId}`);
		}
	}

	// If no projects found, show a message or redirect to create project
	return (
		<div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
			<h1 className="text-2xl font-bold">No Projects Found</h1>
			<p className="text-muted-foreground">
				This organization doesn&apos;t have any projects yet. Create a project
				to get started.
			</p>
		</div>
	);
}
