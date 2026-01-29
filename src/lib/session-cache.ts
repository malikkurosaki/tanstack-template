import { auth } from "./auth";

const sessionCache = new WeakMap<Request, any>();

export async function getCachedSession(request: Request, headers: Headers) {
	if (sessionCache.has(request)) {
		return sessionCache.get(request);
	}

	const session = await auth.api.getSession({ headers });

	sessionCache.set(request, session);

	return session;
}
