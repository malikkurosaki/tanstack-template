import {
	Alert,
	Avatar,
	Badge,
	Button,
	Card,
	Container,
	Group,
	SimpleGrid,
	Skeleton,
	Stack,
	Table,
	Text,
	Title,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { api } from "@/lib/api-client";

export const Route = createFileRoute("/dashboard/")({
	component: DashboardPage,
});

function getGreeting(): string {
	const hour = new Date().getHours();
	if (hour < 12) return "Selamat Pagi";
	if (hour < 15) return "Selamat Siang";
	if (hour < 18) return "Selamat Sore";
	return "Selamat Malam";
}

function DashboardPage() {
	const {
		data: users,
		isLoading,
		isError,
		error,
	} = useQuery({
		queryKey: ["users"],
		queryFn: async () => {
			const { data } = await api.user.list.get();
			return data?.data ?? [];
		},
	});

	const adminCount = users?.filter((user) => user.role === "ADMIN").length ?? 0;
	const userCount = users?.filter((user) => user.role === "USER").length ?? 0;

	if (isError) {
		return (
			<Container size="xl" py={40}>
				<Alert color="red" title="Error" mt="xl">
					Gagal memuat data:{" "}
					{error instanceof Error ? error.message : "Unknown error"}
				</Alert>
			</Container>
		);
	}

	return (
		<Container size="xl" py={40}>
			{/* Header Section */}
			<Group justify="space-between" mb="xl">
				<Stack gap={4}>
					<Text c="dimmed" size="sm">
						{getGreeting()}, Admin
					</Text>
					<Title order={2}>Admin Dashboard</Title>
				</Stack>
				<Button component={Link} to="/profile" variant="light" size="sm">
					Kembali ke Profil
				</Button>
			</Group>

			{/* Stats Cards */}
			<SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} mb="xl" spacing="md">
				<StatCard
					title="Total Users"
					value={isLoading ? "-" : (users?.length ?? 0)}
					loading={isLoading}
					color="blue"
				/>
				<StatCard
					title="Active Sessions"
					value={isLoading ? "-" : (users?.length ?? 0)}
					loading={isLoading}
					color="green"
				/>
				<StatCard
					title="Admin Users"
					value={isLoading ? "-" : adminCount}
					loading={isLoading}
					color="orange"
				/>
				<StatCard
					title="Regular Users"
					value={isLoading ? "-" : userCount}
					loading={isLoading}
					color="cyan"
				/>
			</SimpleGrid>

			{/* Users Table Section */}
			<Card withBorder padding="lg" radius="md" mb="xl">
				<Title order={3} mb="lg">
					Daftar Semua Users
				</Title>

				{isLoading ? (
					<Stack gap="sm">
						{[1, 2, 3].map((i) => (
							<Skeleton key={i} height={50} radius="sm" />
						))}
					</Stack>
				) : users?.length === 0 ? (
					<Text c="dimmed" ta="center" py="xl">
						Tidak ada data users
					</Text>
				) : (
					<Table.ScrollContainer minWidth={500}>
						<Table verticalSpacing="sm" highlightOnHover>
							<Table.Thead>
								<Table.Tr>
									<Table.Th style={{ width: 60 }}>Avatar</Table.Th>
									<Table.Th>Nama</Table.Th>
									<Table.Th>Email</Table.Th>
									<Table.Th style={{ width: 120 }}>Role</Table.Th>
								</Table.Tr>
							</Table.Thead>
							<Table.Tbody>
								{users?.map((user) => (
									<Table.Tr key={user.id}>
										<Table.Td>
											<Avatar size="sm" radius="xl" color="blue">
												{user.name?.charAt(0).toUpperCase() ?? "?"}
											</Avatar>
										</Table.Td>
										<Table.Td>
											<Text fw={500}>{user.name}</Text>
										</Table.Td>
										<Table.Td>
											<Text c="dimmed" size="sm">
												{user.email}
											</Text>
										</Table.Td>
										<Table.Td>
											<RoleBadge role={user.role} />
										</Table.Td>
									</Table.Tr>
								))}
							</Table.Tbody>
						</Table>
					</Table.ScrollContainer>
				)}
			</Card>
		</Container>
	);
}

function StatCard({
	title,
	value,
	loading,
	color,
}: {
	title: string;
	value: string | number;
	loading: boolean;
	color: string;
}) {
	if (loading) {
		return (
			<Card withBorder padding="lg" radius="md">
				<Skeleton height={16} width={80} mb="xs" />
				<Skeleton height={32} width={60} />
			</Card>
		);
	}

	return (
		<Card
			withBorder
			padding="lg"
			radius="md"
			style={{
				borderLeft: `4px solid var(--mantine-color-${color}-6)`,
			}}
		>
			<Text c="dimmed" size="sm" tt="uppercase" fw={500}>
				{title}
			</Text>
			<Text size="xl" fw={700} mt="xs" c={color}>
				{value}
			</Text>
		</Card>
	);
}

function RoleBadge({ role }: { role: string }) {
	const color = role === "ADMIN" ? "orange" : "gray";

	return (
		<Badge color={color} variant="light" radius="sm">
			{role === "ADMIN" ? "Admin" : "User"}
		</Badge>
	);
}
