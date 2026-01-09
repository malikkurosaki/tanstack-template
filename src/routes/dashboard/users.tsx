import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api-client";
import { createFileRoute } from "@tanstack/react-router";
import useSWR from "swr";

export const Route = createFileRoute("/dashboard/users")({
	component: RouteComponent,
});

function RouteComponent() {
	const { data, isLoading } = useSWR("/", api.user.list.get);

	if (isLoading) return <Skeleton h={85} />;
	return (
		<div>
			<Card className="p-4">
				{data?.data?.data.map((v) => (
					<div key={v.id}>
						<div>{v.name}</div>
					</div>
				))}
			</Card>
		</div>
	);
}
