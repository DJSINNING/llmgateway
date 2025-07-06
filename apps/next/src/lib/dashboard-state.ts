"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { usePostHog } from "posthog-js/react";
import { useEffect, useMemo } from "react";

import { useUser } from "@/hooks/useUser";
import { useApi } from "@/lib/fetch-client";
import type { Organization, Project } from "@/lib/types";

interface UseDashboardStateProps {
	initialOrganizationsData?: unknown;
	initialProjectsData?: unknown;
}

export function useDashboardState({
	initialOrganizationsData,
	initialProjectsData,
}: UseDashboardStateProps = {}) {
	const posthog = usePostHog();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const router = useRouter();
	const api = useApi();

	useUser({ redirectTo: "/login", redirectWhen: "unauthenticated" });

	// Get URL parameters
	const orgId = searchParams.get("orgId");
	const projectId = searchParams.get("projectId");

	// Fetch organizations
	const { data: organizationsData } = api.useQuery(
		"get",
		"/orgs",
		{},
		{
			initialData: initialOrganizationsData as
				| { organizations: Organization[] }
				| undefined,
			staleTime: 5 * 60 * 1000, // 5 minutes
			refetchOnWindowFocus: false,
		},
	);
	const organizations = useMemo(
		() => organizationsData?.organizations || [],
		[organizationsData?.organizations],
	);

	// Derive selected organization from URL or default to first
	const selectedOrganization = useMemo(() => {
		if (orgId) {
			return organizations.find((org) => org.id === orgId) || null;
		}
		return organizations[0] || null;
	}, [orgId, organizations]);

	// Fetch projects for selected organization
	const { data: projectsData } = api.useQuery(
		"get",
		"/orgs/{id}/projects",
		{
			params: {
				path: {
					id: selectedOrganization?.id || "",
				},
			},
		},
		{
			enabled: !!selectedOrganization?.id,
			initialData: initialProjectsData as { projects: Project[] } | undefined,
			staleTime: 5 * 60 * 1000, // 5 minutes
			refetchOnWindowFocus: false,
		},
	);

	// Get current projects from query data
	const projects = useMemo(
		() => projectsData?.projects || [],
		[projectsData?.projects],
	);

	// Derive selected project from URL
	const selectedProject = useMemo(() => {
		if (projectId && projects.length > 0) {
			return projects.find((project) => project.id === projectId) || null;
		}
		return projects[0] || null;
	}, [projectId, projects]);

	// Auto-select first organization if none selected
	useEffect(() => {
		if (organizations.length > 0 && !orgId) {
			const params = new URLSearchParams(searchParams.toString());
			params.set("orgId", organizations[0].id);
			router.replace(`${pathname}?${params.toString()}`);
		}
	}, [organizations, orgId, searchParams, pathname, router]);

	// Auto-select first project if none selected
	useEffect(() => {
		if (projects.length > 0 && !projectId && selectedOrganization) {
			const firstProject = projects[0];
			if (
				firstProject &&
				firstProject.organizationId === selectedOrganization.id
			) {
				const params = new URLSearchParams(searchParams.toString());
				params.set("projectId", firstProject.id);
				router.replace(`${pathname}?${params.toString()}`);
			}
		}
	}, [
		projects,
		projectId,
		selectedOrganization,
		searchParams,
		pathname,
		router,
	]);

	useEffect(() => {
		posthog.capture("page_viewed_dashboard");
	}, [posthog]);

	// URL update functions
	const handleOrganizationCreated = (org: Organization) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set("orgId", org.id);
		params.delete("projectId"); // Clear project when switching organizations
		router.replace(`${pathname}?${params.toString()}`);
	};

	const handleProjectCreated = (project: Project) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set("projectId", project.id);
		router.replace(`${pathname}?${params.toString()}`);
	};

	const handleOrganizationSelect = (org: Organization | null) => {
		const params = new URLSearchParams(searchParams.toString());
		if (org?.id) {
			params.set("orgId", org.id);
		} else {
			params.delete("orgId");
		}
		params.delete("projectId"); // Clear project when switching organizations
		router.replace(`${pathname}?${params.toString()}`);
	};

	const handleProjectSelect = (project: Project | null) => {
		const params = new URLSearchParams(searchParams.toString());
		if (project?.id) {
			params.set("projectId", project.id);
		} else {
			params.delete("projectId");
		}
		router.replace(`${pathname}?${params.toString()}`);
	};

	return {
		selectedOrganization,
		selectedProject,
		organizations,
		projects,
		handleOrganizationSelect,
		handleProjectSelect,
		handleOrganizationCreated,
		handleProjectCreated,
	};
}
