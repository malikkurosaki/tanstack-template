import {
	Alert,
	Avatar,
	Badge,
	Box,
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
import {
	IconActivity,
	IconUser,
	IconUserShield,
	IconUsers,
} from "@tabler/icons-react";
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
			{/* Welcome Banner */}
			<Card
				shadow="sm"
				radius="lg"
				mb="xl"
				style={{
					background: "linear-gradient(135deg, #228be6 0%, #7950f2 100%)",
					border: "none",
				}}
			>
				<Group justify="space-between" wrap="wrap" gap="md">
					<Stack gap={4}>
						<Text c="white" size="sm" opacity={0.9}>
							{getGreeting()}, Admin
						</Text>
						<Title order={2} c="white">
							Admin Dashboard
						</Title>
					</Stack>
					<Button
						component={Link}
						to="/profile"
						variant="white"
						color="dark"
						size="sm"
						radius="md"
					>
						Kembali ke Profil
					</Button>
				</Group>
			</Card>

			{/* Stats Cards */}
			<SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} mb="xl" spacing="md">
				<StatCard
					title="Total Users"
					value={isLoading ? "-" : (users?.length ?? 0)}
					loading={isLoading}
					color="blue"
					icon={<IconUsers size={24} />}
					description="Terdaftar di sistem"
				/>
				<StatCard
					title="Active Sessions"
					value={isLoading ? "-" : (users?.length ?? 0)}
					loading={isLoading}
					color="green"
					icon={<IconActivity size={24} />}
					description="Sedang aktif"
				/>
				<StatCard
					title="Admin Users"
					value={isLoading ? "-" : adminCount}
					loading={isLoading}
					color="orange"
					icon={<IconUserShield size={24} />}
					description="Pengelola sistem"
				/>
				<StatCard
					title="Regular Users"
					value={isLoading ? "-" : userCount}
					loading={isLoading}
					color="cyan"
					icon={<IconUser size={24} />}
					description="Pengguna reguler"
				/>
			</SimpleGrid>

			{/* Users Table Section */}
			<Card withBorder padding="lg" radius="lg" mb="xl" shadow="sm">
				<Group justify="space-between" mb="lg">
					<Title order={3}>Daftar Semua Users</Title>
					<Badge variant="light" size="lg" radius="sm">
						{users?.length ?? 0} users
					</Badge>
				</Group>

				{isLoading ? (
					<Stack gap="sm">
						{[1, 2, 3, 4, 5].map((i) => (
							<Skeleton key={i} height={60} radius="sm" />
						))}
					</Stack>
				) : users?.length === 0 ? (
					<Text c="dimmed" ta="center" py="xl">
						Tidak ada data users
					</Text>
				) : (
					<Table.ScrollContainer minWidth={500}>
						<Table
							verticalSpacing="md"
							highlightOnHover
							striped="even"
							style={{
								"& thead tr th": {
									backgroundColor: "#f8f9fa",
									fontWeight: 600,
								},
							}}
						>
							<Table.Thead>
								<Table.Tr>
									<Table.Th style={{ width: 70 }}>Avatar</Table.Th>
									<Table.Th>Nama Lengkap</Table.Th>
									<Table.Th>Email</Table.Th>
									<Table.Th style={{ width: 130 }}>Role</Table.Th>
									<Table.Th style={{ width: 100 }}>Status</Table.Th>
								</Table.Tr>
							</Table.Thead>
							<Table.Tbody>
								{users?.map((user) => (
									<Table.Tr key={user.id}>
										<Table.Td>
											<Avatar
												size="md"
												radius="xl"
												color={user.role === "ADMIN" ? "orange" : "blue"}
											>
												{user.name?.charAt(0).toUpperCase() ?? "?"}
											</Avatar>
										</Table.Td>
										<Table.Td>
											<Text fw={600}>{user.name}</Text>
										</Table.Td>
										<Table.Td>
											<Text c="dimmed" size="sm">
												{user.email}
											</Text>
										</Table.Td>
										<Table.Td>
											<RoleBadge role={user.role} />
										</Table.Td>
										<Table.Td>
											<Badge color="green" variant="dot" size="sm">
												Aktif
											</Badge>
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
	icon,
	description,
}: {
	title: string;
	value: string | number;
	loading: boolean;
	color: string;
	icon: React.ReactNode;
	description: string;
}) {
	if (loading) {
		return (
			<Card withBorder padding="lg" radius="lg" shadow="sm">
				<Skeleton height={24} width={100} mb="sm" />
				<Skeleton height={40} width={60} mb="xs" />
				<Skeleton height={14} width={120} />
			</Card>
		);
	}

	const colorMap: Record<string, string> = {
		blue: "from-blue-500 to-blue-600",
		green: "from-green-500 to-green-600",
		orange: "from-orange-500 to-orange-600",
		cyan: "from-cyan-500 to-cyan-600",
	};

	return (
		<Card
			withBorder
			padding="lg"
			radius="lg"
			shadow="sm"
			style={{
				transition: "transform 0.2s ease, box-shadow 0.2s ease",
				cursor: "default",
			}}
			className="hover:shadow-md hover:-translate-y-1"
		>
			<Group justify="space-between" mb="md">
				<Box
					style={{
						width: 48,
						height: 48,
						borderRadius: 12,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						background: `linear-gradient(135deg, var(--mantine-color-${color}-3) 0%, var(--mantine-color-${color}-5) 100%)`,
					}}
				>
					<Text c={`${color}.6`}>{icon}</Text>
				</Box>
				<Badge variant="light" color={color} size="sm">
					{description}
				</Badge>
			</Group>
			<Text c="dimmed" size="sm" tt="uppercase" fw={500} mb={4}>
				{title}
			</Text>
			<Text size="xl" fw={700} c={color}>
				{value}
			</Text>
		</Card>
	);
}

function RoleBadge({ role }: { role: string }) {
	const color = role === "ADMIN" ? "orange" : "gray";

	return (
		<Badge color={color} variant="light" radius="sm" size="md">
			{role === "ADMIN" ? "Admin" : "User"}
		</Badge>
	);
}
