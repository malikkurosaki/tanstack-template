import { api } from "@/lib/api-client";
import { authClient } from "@/lib/auth-client";
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
	Title,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/profile/")({
	component: ProfilePage,
});

function ProfilePage() {
	const navigate = useNavigate()

	const { data: user } = useQuery({
		queryKey: ["users"],
		queryFn: async () => {
			const { data } = await api.user.get();
			return data?.data;
		},
	});

	const handleSignOut = async () => {
		await authClient.signOut()
		navigate({ to: "/auth/signin" })
	}


	return (
		<Container size="md" py={40}>
			<Title order={2} mb="xl">
				Profile
			</Title>

			<Card withBorder shadow="sm" radius="md">
				<Group align="flex-start" gap="xl">
					<Avatar
						src={user?.image}
						alt={user?.name}
						size={80}
						radius="50%"
					/>

					<Stack gap="sm" style={{ flex: 1 }}>
						<Text fw={500} size="xl">
							{user?.name}
						</Text>
						<Text c="dimmed" size="sm">
							{user?.email}
						</Text>
						<Badge
							variant="light"
							color={user?.role === "ADMIN" ? "blue" : "gray"}
							w="fit"
						>
							{user?.role}
						</Badge>
					</Stack>
				</Group>
			</Card>

			<Title order={3} mt="xl" mb="md">
				Quick Actions
			</Title>

			<SimpleGrid cols={{ base: 1, sm: 2 }}>
				{user?.role === "ADMIN" && (
					<Card
						withBorder
						shadow="sm"
						radius="md"
						component="a"
						href="/dashboard"
						style={{ textDecoration: "none", color: "inherit" }}
					>
						<Text fw={500} mb="xs">
							Admin Dashboard
						</Text>
						<Text size="sm" c="dimmed">
							Manage users and settings
						</Text>
					</Card>
				)}

				<Card withBorder shadow="sm" radius="md">
					<Text fw={500} mb="xs">
						Account Settings
					</Text>
					<Text size="sm" c="dimmed">
						Update your profile and preferences
					</Text>
				</Card>
			</SimpleGrid>

			<Group mt="xl">
				<Button onClick={handleSignOut} variant="light" color="red">
					Sign Out
				</Button>
			</Group>
		</Container>
	)
}
