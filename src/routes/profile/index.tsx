import {
	Avatar,
	Badge,
	Button,
	Card,
	Container,
	Group,
	SimpleGrid,
	Stack,
	Text,
	ThemeIcon,
	Title,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Calendar, LogOut, Mail, MapPin, Shield, User } from "lucide-react";
import { api } from "@/lib/api-client";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/profile/")({
	component: ProfilePage,
});

function ProfilePage() {
	const navigate = useNavigate();

	const { data: user } = useQuery({
		queryKey: ["users"],
		queryFn: async () => {
			const { data } = await api.user.get();
			return data?.data;
		},
	});

	const handleSignOut = async () => {
		await authClient.signOut();
		navigate({ to: "/auth/signin" });
	};

	const roleColor = user?.role === "ADMIN" ? "blue" : "gray";

	return (
		<Container size="lg" py={40}>
			{/* Profile Header Card */}
			<Card
				withBorder
				shadow="sm"
				radius="lg"
				style={{
					overflow: "visible",
				}}
			>
				{/* Cover Background */}
				<div
					style={{
						height: 120,
						borderRadius:
							"var(--mantine-radius-lg) var(--mantine-radius-lg) 0 0",
						margin: "-var(--mantine-spacing-md)",
						marginBottom: 40,
					}}
				/>

				<Stack align="center" style={{ marginTop: -50, marginBottom: 20 }}>
					<Avatar
						src={user?.image}
						alt={user?.name}
						size={100}
						radius="50%"
						style={{
							border: "4px solid white",
							boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
						}}
					/>
					<Stack gap={4} align="center">
						<Title order={2}>{user?.name}</Title>
						<Badge size="lg" variant="light" color={roleColor}>
							{user?.role}
						</Badge>
					</Stack>
				</Stack>

				{/* User Info Section */}
				<SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
					<Group gap="xs">
						<ThemeIcon variant="light" color="gray" size="sm">
							<Mail size={14} />
						</ThemeIcon>
						<Text size="sm" c="dimmed">
							{user?.email}
						</Text>
					</Group>
					<Group gap="xs">
						<ThemeIcon variant="light" color="gray" size="sm">
							<User size={14} />
						</ThemeIcon>
						<Text size="sm" c="dimmed">
							ID: {user?.id?.slice(0, 8)}...
						</Text>
					</Group>
					<Group gap="xs">
						<ThemeIcon variant="light" color="gray" size="sm">
							<Calendar size={14} />
						</ThemeIcon>
						<Text size="sm" c="dimmed">
							Joined recently
						</Text>
					</Group>
				</SimpleGrid>

				{/* Actions */}
				<Group
					justify="flex-end"
					mt="md"
					pt="md"
					style={{ borderTop: "1px solid var(--mantine-color-gray-3)" }}
				>
					<Button
						variant="light"
						color="red"
						leftSection={<LogOut size={16} />}
						onClick={handleSignOut}
					>
						Sign Out
					</Button>
				</Group>
			</Card>

			{/* Quick Actions Section */}
			<Title order={3} mt="xl" mb="md">
				Quick Actions
			</Title>

			<SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
				{user?.role === "ADMIN" && (
					<Card
						withBorder
						shadow="sm"
						radius="lg"
						component="a"
						href="/dashboard"
						style={{
							textDecoration: "none",
							color: "inherit",
							cursor: "pointer",
						}}
						className="hover-card"
					>
						<Group>
							<ThemeIcon size={40} variant="light" color="blue" radius="md">
								<Shield size={20} />
							</ThemeIcon>
							<div>
								<Text fw={600} size="sm">
									Admin Dashboard
								</Text>
								<Text size="xs" c="dimmed">
									Manage users and settings
								</Text>
							</div>
						</Group>
					</Card>
				)}

				<Card
					withBorder
					shadow="sm"
					radius="lg"
					style={{ cursor: "pointer" }}
					className="hover-card"
				>
					<Group>
						<ThemeIcon size={40} variant="light" color="violet" radius="md">
							<User size={20} />
						</ThemeIcon>
						<div>
							<Text fw={600} size="sm">
								Account Settings
							</Text>
							<Text size="xs" c="dimmed">
								Update your profile and preferences
							</Text>
						</div>
					</Group>
				</Card>

				<Card
					withBorder
					shadow="sm"
					radius="lg"
					style={{ cursor: "pointer" }}
					className="hover-card"
				>
					<Group>
						<ThemeIcon size={40} variant="light" color="teal" radius="md">
							<MapPin size={20} />
						</ThemeIcon>
						<div>
							<Text fw={600} size="sm">
								Saved Locations
							</Text>
							<Text size="xs" c="dimmed">
								View your saved places
							</Text>
						</div>
					</Group>
				</Card>
			</SimpleGrid>

			{/* Stats Cards */}
			<Title order={3} mt="xl" mb="md">
				Activity Overview
			</Title>

			<SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
				<Card withBorder shadow="sm" radius="lg" p="md">
					<Text size="xs" c="dimmed" tt="uppercase" fw={600}>
						Total Bookings
					</Text>
					<Text size="xl" fw={700}>
						0
					</Text>
					<Text size="xs" c="dimmed">
						Since registration
					</Text>
				</Card>

				<Card withBorder shadow="sm" radius="lg" p="md">
					<Text size="xs" c="dimmed" tt="uppercase" fw={600}>
						Favorites
					</Text>
					<Text size="xl" fw={700}>
						0
					</Text>
					<Text size="xs" c="dimmed">
						Saved items
					</Text>
				</Card>

				<Card withBorder shadow="sm" radius="lg" p="md">
					<Text size="xs" c="dimmed" tt="uppercase" fw={600}>
						Reviews
					</Text>
					<Text size="xl" fw={700}>
						0
					</Text>
					<Text size="xs" c="dimmed">
						Written reviews
					</Text>
				</Card>
			</SimpleGrid>

			<style>{`
				.hover-card {
					transition: all 0.2s ease;
				}
				.hover-card:hover {
					transform: translateY(-2px);
					boxShadow: "0 8px 25px rgba(0, 0, 0, 0.12)";
				}
			`}</style>
		</Container>
	);
}
