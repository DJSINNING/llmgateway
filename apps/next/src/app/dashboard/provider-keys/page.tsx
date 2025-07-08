import { ProviderKeysClient } from "@/components/provider-keys/provider-keys-client";
import { fetchServerData } from "@/lib/server-api";

// Force dynamic rendering since this page uses server-side data fetching with cookies
export const dynamic = "force-dynamic";

export default async function ProviderKeysPage() {
	// Server-side data fetching for provider keys
	const initialProviderKeysData = await fetchServerData<{
		providerKeys: {
			id: string;
			createdAt: string;
			updatedAt: string;
			provider: string;
			baseUrl: string | null;
			status: "active" | "inactive" | "deleted" | null;
			organizationId: string;
			maskedToken: string;
		}[];
	}>("GET", "/keys/provider", {});

	if (!initialProviderKeysData) {
		return <div>No provider keys data</div>;
	}

	return (
		<ProviderKeysClient initialProviderKeysData={initialProviderKeysData} />
	);
}
