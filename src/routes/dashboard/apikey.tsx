import {
	ActionIcon,
	Badge,
	Box,
	Button,
	Card,
	Container,
	Divider,
	Flex,
	Group,
	Modal,
	Paper,
	Skeleton,
	Stack,
	Text,
	TextInput,
	Title,
	Tooltip,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { createFileRoute } from "@tanstack/react-router";
import dayjs from "dayjs";
import {
	Calendar,
	Copy,
	FileText,
	Key,
	Plus,
	ToggleLeft,
	ToggleRight,
	Trash2,
	X,
} from "lucide-react";
import { useEffect } from "react";
import { useSnapshot } from "valtio";
import { authMiddleware } from "@/middleware/auth";
import {
	apiKeyState,
	copyApiKey,
	createApiKey,
	deleteApiKey,
	loadApiKeys,
	resetForm,
	setExpiredAt,
	setFormField,
	toggleApiKey,
} from "@/state/api_key.state";

export const Route = createFileRoute("/dashboard/apikey")({
	component: RouteComponent,
	server: {
		middleware: [authMiddleware],
	},
});

function RouteComponent() {
	const [opened, { open, close }] = useDisclosure(false);
	const snap = useSnapshot(apiKeyState);

	useEffect(() => {
		loadApiKeys();
	}, []);

	const handleCreate = () => {
		if (!apiKeyState.form.title) {
			notifications.show({
				title: "Error",
				message: "Title is required",
				color: "red",
			});
			return;
		}
		createApiKey()
			.then(() => {
				notifications.show({
					title: "Success",
					message: "API key created successfully",
					color: "green",
				});
				close();
			})
			.catch(() => {
				notifications.show({
					title: "Error",
					message: "Failed to create API key",
					color: "red",
				});
			});
	};

	const handleClose = () => {
		resetForm();
		close();
	};

	const formatDate = (date: string | Date | null | undefined) => {
		if (!date) return "No expiration";
		return dayjs(date).format("MMM D, YYYY");
	};

	const isActive = (key: (typeof snap.data)[0]) => key.active ?? false;

	return (
		<Container size="xl" suppressHydrationWarning>
			<Stack gap="lg">
				{/* Header */}
				<Flex justify="space-between" align="center" wrap="wrap" gap="md">
					<Box>
						<Title order={2}>API Keys</Title>
						<Text c="dimmed" size="sm" mt={4}>
							Manage your API keys for accessing the platform
						</Text>
					</Box>
					<Button leftSection={<Plus size={18} />} onClick={open} size="md">
						Create API Key
					</Button>
				</Flex>

				{/* API Keys List */}
				{snap.loading ? (
					<Card withBorder p="xl">
						<Stack gap="md">
							<Skeleton height={60} radius="md" />
							<Skeleton height={60} radius="md" />
							<Skeleton height={60} radius="md" />
						</Stack>
					</Card>
				) : !snap.data || snap.data.length === 0 ? (
					<Card withBorder p="xl">
						<Stack align="center" py="xl">
							<Box
								style={{
									width: 64,
									height: 64,
									borderRadius: "50%",
									backgroundColor: "var(--mantine-color-gray-1)",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
								}}
							>
								<Key size={32} color="var(--mantine-color-gray-5)" />
							</Box>
							<Text size="lg" fw={500}>
								No API Keys Yet
							</Text>
							<Text c="dimmed" ta="center" maw={300}>
								Create your first API key to start integrating with the
								platform.
							</Text>
							<Button leftSection={<Plus size={18} />} onClick={open} mt="md">
								Create Your First API Key
							</Button>
						</Stack>
					</Card>
				) : (
					<Stack gap="md">
						{snap.data.map((apikey) => (
							<Paper
								key={apikey.id}
								withBorder
								p="md"
								style={{
									transition: "all 150ms ease",
									cursor: "pointer",
								}}
								className="hover-shadow"
							>
								<Flex
									justify="space-between"
									align="center"
									wrap="wrap"
									gap="md"
								>
									{/* Left Section - Key Info */}
									<Flex
										align="center"
										gap="md"
										style={{ flex: 1, minWidth: 200 }}
									>
										<Box
											style={{
												width: 48,
												height: 48,
												borderRadius: 12,
												backgroundColor: isActive(apikey)
													? "var(--mantine-color-green-0)"
													: "var(--mantine-color-red-0)",
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
											}}
										>
											<Key
												size={24}
												color={
													isActive(apikey)
														? "var(--mantine-color-green-7)"
														: "var(--mantine-color-red-7)"
												}
											/>
										</Box>
										<Box style={{ flex: 1 }}>
											<Group gap="xs" mb={4}>
												<Text fw={600} size="md">
													{apikey.title}
												</Text>
												<Badge
													size="sm"
													variant="light"
													color={isActive(apikey) ? "green" : "red"}
												>
													{isActive(apikey) ? "Active" : "Disabled"}
												</Badge>
											</Group>
											<Group gap="xs">
												<Text size="sm" c="dimmed" ff="monospace">
													{apikey.apikey.slice(0, 8)}...
													{apikey.apikey.slice(-4)}
												</Text>
												<Tooltip
													label={
														snap.copiedId === apikey.id ? "Copied!" : "Copy"
													}
												>
													<ActionIcon
														variant="subtle"
														size="sm"
														color="gray"
														onClick={(e) => {
															e.stopPropagation();
															copyApiKey(apikey.apikey, apikey.id);
															notifications.show({
																title: "Copied",
																message: "API key copied to clipboard",
																color: "blue",
															});
														}}
													>
														{snap.copiedId === apikey.id ? (
															<X size={14} />
														) : (
															<Copy size={14} />
														)}
													</ActionIcon>
												</Tooltip>
											</Group>
										</Box>
									</Flex>

									{/* Middle Section - Details */}
									<Flex gap="xl" visibleFrom="sm" style={{ flex: 1 }}>
										<Box>
											<Group gap={4} mb={4}>
												<FileText
													size={14}
													color="var(--mantine-color-dimmed)"
												/>
												<Text size="xs" c="dimmed" tt="uppercase" fw={500}>
													Description
												</Text>
											</Group>
											<Text size="sm" lineClamp={1}>
												{apikey.description || "-"}
											</Text>
										</Box>
										<Box>
											<Group gap={4} mb={4}>
												<Calendar
													size={14}
													color="var(--mantine-color-dimmed)"
												/>
												<Text size="xs" c="dimmed" tt="uppercase" fw={500}>
													Expires
												</Text>
											</Group>
											<Text size="sm">{formatDate(apikey.expiresAt)}</Text>
										</Box>
									</Flex>

									{/* Right Section - Actions */}
									<Group gap="xs">
										<Tooltip label={isActive(apikey) ? "Disable" : "Enable"}>
											<ActionIcon
												variant="light"
												size="lg"
												color={isActive(apikey) ? "yellow" : "green"}
												onClick={() =>
													toggleApiKey(apikey.id, !isActive(apikey))
														.then(() => {
															notifications.show({
																title: "Success",
																message: "API key updated successfully",
																color: "green",
															});
														})
														.catch(() => {
															notifications.show({
																title: "Error",
																message: "Failed to update API key",
																color: "red",
															});
														})
												}
											>
												{isActive(apikey) ? (
													<ToggleRight size={18} />
												) : (
													<ToggleLeft size={18} />
												)}
											</ActionIcon>
										</Tooltip>
										<Tooltip label="Delete">
											<ActionIcon
												variant="light"
												size="lg"
												color="red"
												onClick={() =>
													deleteApiKey(apikey.id)
														.then(() => {
															notifications.show({
																title: "Success",
																message: "API key deleted successfully",
																color: "green",
															});
														})
														.catch(() => {
															notifications.show({
																title: "Error",
																message: "Failed to delete API key",
																color: "red",
															});
														})
												}
											>
												<Trash2 size={18} />
											</ActionIcon>
										</Tooltip>
									</Group>
								</Flex>
							</Paper>
						))}
					</Stack>
				)}

				{/* Create Modal */}
				<Modal
					opened={opened}
					onClose={handleClose}
					title={
						<Group gap="xs">
							<Key size={20} />
							<Text fw={600} size="lg">
								Create API Key
							</Text>
						</Group>
					}
					centered
					size="md"
				>
					<Stack>
						<TextInput
							label="Title"
							placeholder="My API Key"
							value={snap.form.title}
							onChange={(e) => setFormField("title", e.currentTarget.value)}
							required
							leftSection={<FileText size={16} />}
						/>
						<TextInput
							label="Description"
							placeholder="Optional description"
							value={snap.form.description}
							onChange={(e) =>
								setFormField("description", e.currentTarget.value)
							}
							leftSection={<FileText size={16} />}
						/>
						<DateInput
							label="Expiration Date"
							placeholder="Optional expiration date"
							value={
								snap.form.expiredAt
									? dayjs(snap.form.expiredAt).format("YYYY-MM-DD")
									: null
							}
							onChange={(value) => setExpiredAt(value ? new Date(value) : null)}
							minDate={new Date()}
							leftSection={<Calendar size={16} />}
						/>
						<Paper p="sm" withBorder bg="var(--mantine-color-gray-0)">
							<Text size="xs" c="dimmed">
								The API key will automatically expire in 3 months if no date is
								selected. You can disable or delete keys at any time.
							</Text>
						</Paper>
						<Divider />
						<Group justify="flex-end" gap="sm">
							<Button variant="light" onClick={handleClose}>
								Cancel
							</Button>
							<Button
								onClick={handleCreate}
								loading={snap.loadingCreate}
								leftSection={<Plus size={16} />}
							>
								Create API Key
							</Button>
						</Group>
					</Stack>
				</Modal>
			</Stack>
		</Container>
	);
}
