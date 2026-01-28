import {
	ActionIcon,
	Avatar,
	Badge,
	Card,
	Container,
	Group,
	Table,
	Text,
	Title,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Pencil, Trash } from "lucide-react";
import { api } from "@/lib/api-client";

export const Route = createFileRoute("/dashboard/users")({
	component: RouteComponent,
});

function RouteComponent() {
	const { data: users, isLoading } = useQuery({
		queryKey: ["users"],
		queryFn: async () => {
			const { data } = await api.user.list.get();
			return data?.data;
		},
	});

	return (
		<Container size="lg" py="lg">
			<Title order={2} mb="xs">
				Users
			</Title>
			<Text size="sm" c="dimmed" mb="lg">
				Manage your application's users.
			</Text>

			<Card withBorder radius="md" p="md">
				<Table verticalSpacing="sm">
					<Table.Thead>
						<Table.Tr>
							<Table.Th>User</Table.Th>
							<Table.Th>Role</Table.Th>
							<Table.Th>Actions</Table.Th>
						</Table.Tr>
					</Table.Thead>
					<Table.Tbody>
						{isLoading ? (
							<Table.Tr>
								<Table.Td colSpan={3} align="center">
									Loading...
								</Table.Td>
							</Table.Tr>
						) : users?.length === 0 ? (
							<Table.Tr>
								<Table.Td colSpan={3} align="center">
									No users found.
								</Table.Td>
							</Table.Tr>
						) : (
							users?.map((user) => (
								<Table.Tr key={user.id}>
									<Table.Td>
										<Group gap="sm">
											<Avatar
												size={40}
												src={user.image ?? undefined}
												radius={40}
											/>
											<div>
												<Text size="sm" fw={500}>
													{user.name}
												</Text>
												<Text size="xs" c="dimmed">
													{user.email}
												</Text>
											</div>
										</Group>
									</Table.Td>
									<Table.Td>
										<Badge
											color={user.role === "ADMIN" ? "blue" : "gray"}
											variant="light"
										>
											{user.role}
										</Badge>
									</Table.Td>
									<Table.Td>
										<Group gap={0} justify="flex-end">
											<ActionIcon variant="subtle" color="gray">
												<Pencil size={16} />
											</ActionIcon>
											<ActionIcon variant="subtle" color="red">
												<Trash size={16} />
											</ActionIcon>
										</Group>
									</Table.Td>
								</Table.Tr>
							))
						)}
					</Table.Tbody>
				</Table>
			</Card>
		</Container>
	);
}
