import dayjs from "dayjs";
import { proxy } from "valtio";
import { api } from "@/lib/api-client";

export interface ApiKey {
	id: string;
	title: string;
	description: string | null;
	active: boolean | null;
	expiresAt: Date | string | null;
	apikey: string;
}

interface ApiKeyState {
	data: ApiKey[];
	loading: boolean;
	loadingCreate: boolean;
	loadingUpdate: boolean;
	loadingDelete: boolean;
	form: {
		title: string;
		description: string;
		expiredAt: Date | null;
	};
	copiedId: string | null;
	error: string | null;
}

const apiKeyState = proxy<ApiKeyState>({
	data: [],
	loading: false,
	loadingCreate: false,
	loadingUpdate: false,
	loadingDelete: false,
	form: {
		title: "",
		description: "",
		expiredAt: null,
	},
	copiedId: null,
	error: null,
});

export async function loadApiKeys() {
	apiKeyState.loading = true;
	apiKeyState.error = null;
	try {
		const { data } = await api.apikey.get();
		apiKeyState.data = data?.data || [];
	} catch (e) {
		apiKeyState.error = "Failed to load API keys";
		console.error("Error loading API keys:", e);
	} finally {
		apiKeyState.loading = false;
	}
}

export async function createApiKey() {
	if (!apiKeyState.form.title) {
		apiKeyState.error = "Title is required";
		return;
	}

	apiKeyState.loadingCreate = true;
	apiKeyState.error = null;
	try {
		const { data } = await api.apikey.create.post({
			title: apiKeyState.form.title,
			description: apiKeyState.form.description || undefined,
			expiresAt: apiKeyState.form.expiredAt
				? dayjs(apiKeyState.form.expiredAt).toISOString()
				: undefined,
		});

		if (data?.data) {
			apiKeyState.data = [data.data, ...apiKeyState.data];
			resetForm();
		}
	} catch (e) {
		apiKeyState.error = "Failed to create API key";
		console.error("Error creating API key:", e);
	} finally {
		apiKeyState.loadingCreate = false;
	}
}

export async function toggleApiKey(id: string, active: boolean) {
	apiKeyState.loadingUpdate = true;
	apiKeyState.error = null;
	try {
		const { data } = await api.apikey({ id }).patch({ active });
		if (data?.data) {
			apiKeyState.data = apiKeyState.data.map((key) =>
				key.id === id ? { ...key, active: data.data.active } : key,
			);
		}
	} catch (e) {
		apiKeyState.error = "Failed to update API key";
		console.error("Error toggling API key:", e);
	} finally {
		apiKeyState.loadingUpdate = false;
	}
}

export async function deleteApiKey(id: string) {
	apiKeyState.loadingDelete = true;
	apiKeyState.error = null;
	try {
		await api.apikey({ id }).delete();
		apiKeyState.data = apiKeyState.data.filter((key) => key.id !== id);
	} catch (e) {
		apiKeyState.error = "Failed to delete API key";
		console.error("Error deleting API key:", e);
	} finally {
		apiKeyState.loadingDelete = false;
	}
}

export function copyApiKey(apikey: string, id: string) {
	navigator.clipboard.writeText(apikey);
	apiKeyState.copiedId = id;
	setTimeout(() => {
		apiKeyState.copiedId = null;
	}, 2000);
}

export function setFormField(field: "title" | "description", value: string) {
	apiKeyState.form[field] = value;
}

export function setExpiredAt(value: Date | null) {
	apiKeyState.form.expiredAt = value;
}

export function resetForm() {
	apiKeyState.form = {
		title: "",
		description: "",
		expiredAt: null,
	};
}

export { apiKeyState };
