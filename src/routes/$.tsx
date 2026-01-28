import {
	Button,
	Card,
	Center,
	Stack,
	Text,
	ThemeIcon,
	Title,
} from "@mantine/core";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/$")({
	component: NotFoundPage,
});

function NotFoundPage() {
	return (
		<Center mih="100vh" px="md">
			<Card shadow="lg" padding="xl" radius="md" w="100%" maw={400}>
				<Stack align="center" gap="lg">
					<ThemeIcon size={56} radius="xl" color="red" variant="light">
						<AlertTriangle size={28} />
					</ThemeIcon>

					<Title order={2} ta="center">
						404 – Page Not Found
					</Title>

					<Text c="dimmed" size="sm" ta="center">
						Halaman yang kamu cari tidak ditemukan atau sudah dipindahkan.
					</Text>

					<Button component={Link} to="/" size="md">
						Kembali ke Home
					</Button>
				</Stack>
			</Card>
		</Center>
	);
}
