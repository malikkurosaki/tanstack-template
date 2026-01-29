import {
	ActionIcon,
	Avatar,
	Badge,
	Button,
	Card,
	Container,
	Flex,
	Group,
	Table,
	Text,
	TextInput,
	Title,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Pencil, Plus, Search, Trash } from "lucide-react";
import { useState } from "react";
import { api } from "@/lib/api-client";

export const Route = createFileRoute("/dashboard/users")({
	component: RouteComponent,
});

function RouteComponent() {
	const [search, setSearch] = useState("");
	const { data: users, isLoading } = useQuery({
		queryKey: ["users"],
		queryFn: async () => {
			const { data } = await api.user.list.get();
			return data?.data;
		},
	});

	const filteredUsers = users?.filter(
		(user) =>
			user.name.toLowerCase().includes(search.toLowerCase()) ||
			user.email.toLowerCase().includes(search.toLowerCase()),
	);

	return (
		<Container size="lg" py="xl">
			<Flex justify="space-between" align="center" mb="lg">
				<div>
					<Title order={2} fw={700}>
						Users
					</Title>
					<Text size="sm" c="dimmed" mt={4}>
						Manage your application's users and permissions.
					</Text>
				</div>
				<Button leftSection={<Plus size={16} />} variant="light">
					Add User
				</Button>
			</Flex>

			<Card withBorder radius="lg" p={0} shadow="sm">
				<Flex
					p="md"
				>
					<TextInput
						placeholder="Search users..."
						leftSection={<Search size={14} />}
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						style={{ flex: 1, maxWidth: 320 }}
					/>
				</Flex>

				<Table striped highlightOnHover verticalSpacing="md" p="sm">
					<Table.Thead>
						<Table.Tr>
							<Table.Th>User</Table.Th>
							<Table.Th>Role</Table.Th>
							<Table.Th w={120}>Actions</Table.Th>
						</Table.Tr>
					</Table.Thead>
					<Table.Tbody>
						{isLoading ? (
							<Table.Tr>
								<Table.Td colSpan={3} py="xl" ta="center">
									<Text c="dimmed">Loading users...</Text>
								</Table.Td>
							</Table.Tr>
						) : filteredUsers?.length === 0 ? (
							<Table.Tr>
								<Table.Td colSpan={3} py="xl" ta="center">
									<Text c="dimmed">
										{search ? "No users match your search." : "No users found."}
									</Text>
								</Table.Td>
							</Table.Tr>
						) : (
							filteredUsers?.map((user) => (
								<Table.Tr key={user.id}>
									<Table.Td>
										<Group gap="sm">
											<Avatar
												size={42}
												src={user.image ?? undefined}
												radius="xl"
												color="blue"
											>
												{user.name.charAt(0).toUpperCase()}
											</Avatar>
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
											radius="sm"
											size="sm"
										>
											{user.role}
										</Badge>
									</Table.Td>
									<Table.Td>
										<Group gap={4} justify="flex-end">
											<ActionIcon
												variant="subtle"
												color="gray"
												radius="md"
												size="lg"
											>
												<Pencil size={14} />
											</ActionIcon>
											<ActionIcon
												variant="subtle"
												color="red"
												radius="md"
												size="lg"
											>
												<Trash size={14} />
											</ActionIcon>
										</Group>
									</Table.Td>
								</Table.Tr>
							))
						)}
					</Table.Tbody>
				</Table>
			</Card>

			{users && users.length > 0 && (
				<Text size="xs" c="dimmed" mt="sm" ta="right">
					Showing {filteredUsers?.length ?? 0} of {users.length} users
				</Text>
			)}
		</Container>
	);
}
