import { UserProvider } from "@/components/providers/user-provider";
import { fetchServerData } from "@/lib/server-api";
import type { User } from "@/lib/types";
import { OnboardingClient } from "./onboarding-client";

export default async function OnboardingPage() {
	const initialUserData = await fetchServerData<{ user: User }>(
		"GET",
		"/user/me",
	);

	return (
		<UserProvider initialUserData={initialUserData}>
			<OnboardingClient />
		</UserProvider>
	);
}
