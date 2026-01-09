import { treaty } from "@elysiajs/eden";
import type { AppApi } from "@/routes/api/$";

if (!import.meta.env.VITE_API_BASE_URL) {
	throw new Error("VITE_API_BASE_URL is not defined");
}

export const api = treaty<AppApi>(import.meta.env.VITE_API_BASE_URL).api;
