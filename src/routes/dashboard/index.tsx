import { api } from "@/lib/api-client";
import {
	Button,
	Card,
	Container,
	Group,
	SimpleGrid,
	Table,
	Text,
	Title
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/")({
	component: DashboardPage,
});

function DashboardPage() {

	const { data: users } = useQuery({
		queryKey: ["users"],
		queryFn: async () => {
			const { data } = await api.user.list.get();
			return data?.data;
		},
	});

	return (
		<Container size="xl" py={40}>
			<Group justify="space-between" mb="xl">
				<Title order={2}>Admin Dashboard</Title>
				<Button component={Link} to="/profile" variant="light">
					Back to Profile
				</Button>
			</Group>

			<SimpleGrid cols={{ base: 1, md: 4 }} mb="xl">
				<Card withBorder padding="lg" radius="md">
					<Text c="dimmed" size="sm">
						Total Users
					</Text>
					<Text size="xl" fw={700} mt="xs">
						{users?.length}
					</Text>
				</Card>

				<Card withBorder padding="lg" radius="md">
					<Text c="dimmed" size="sm">
						Active Sessions
					</Text>
					<Text size="xl" fw={700} mt="xs">
						{users?.length}
					</Text>
				</Card>

				<Card withBorder padding="lg" radius="md">
					<Text c="dimmed" size="sm">
						Admin Users
					</Text>
					<Text size="xl" fw={700} mt="xs">
						{users?.filter((user) => user.role === "ADMIN").length}
					</Text>
				</Card>

				<Card withBorder padding="lg" radius="md">
					<Text c="dimmed" size="sm">
						Regular Users
					</Text>
					<Text size="xl" fw={700} mt="xs">
						{users?.filter((user) => user.role === "USER").length}
					</Text>
				</Card>
			</SimpleGrid>

			<Title order={3} mb="md">
				All Users
			</Title>

			<Card withBorder padding="0" radius="md">
				<div style={{ overflowX: "auto" }}>
					<Table>
						<Table.Thead>
							<Table.Tr>
								<Table.Th>User</Table.Th>
								<Table.Th>Email</Table.Th>
								<Table.Th>Role</Table.Th>
							</Table.Tr>
						</Table.Thead>
						<Table.Tbody>
							{users?.map((user) => (
								<Table.Tr key={user.id}>
									<Table.Td>{user.name}</Table.Td>
									<Table.Td>{user.email}</Table.Td>
									<Table.Td>{user.role}</Table.Td>
								</Table.Tr>
							))}
						</Table.Tbody>
					</Table>
				</div>
			</Card>
		</Container>
	)
}
