import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/profile/privacy")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/profile/privacy"!</div>;
}
