import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api-client";
import { createFileRoute } from "@tanstack/react-router";
import useSWR from "swr";

export const Route = createFileRoute("/profile/")({
	component: RouteComponent
});

function RouteComponent() {
	const { data, isLoading } = useSWR("/", api.user.me.get)
	if (isLoading) return <Skeleton h={200} />
	return <div>
		<pre>
			{JSON.stringify(data?.data?.data, null, 2)}
		</pre>
	</div>;
}
