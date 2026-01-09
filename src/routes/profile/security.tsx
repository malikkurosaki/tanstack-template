import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/profile/security")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/profile/security"!</div>;
}
