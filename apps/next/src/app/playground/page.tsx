import { PlaygroundClient } from "./playground-client";
import { UserProvider } from "@/components/providers/user-provider";
import { fetchServerData } from "@/lib/server-api";
import type { User } from "@/lib/types";

export default async function PlaygroundPage() {
	const initialUserData = await fetchServerData<{ user: User }>(
		"GET",
		"/user/me",
	);

	return (
		<UserProvider initialUserData={initialUserData}>
			<PlaygroundClient />
		</UserProvider>
	);
}
