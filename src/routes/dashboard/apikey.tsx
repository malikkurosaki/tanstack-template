import {
    ActionIcon,
    Button,
    Card,
    Container,
    Group,
    Modal,
    Stack,
    Table,
    Text,
    TextInput,
    Title,
    Tooltip,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useDisclosure, useInputState } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Copy, Plus, Trash2, X } from "lucide-react";
import { api } from "@/lib/api-client";
import { authMiddleware } from "@/middleware/auth";
import dayjs from "dayjs";

export const Route = createFileRoute("/dashboard/apikey")({
    component: RouteComponent,
    server: {
        middleware: [authMiddleware],
    },
});

function RouteComponent() {
    const queryClient = useQueryClient();
    const [opened, { open, close }] = useDisclosure(false);
    const [title, setTitle] = useInputState("");
    const [description, setDescription] = useInputState("");
    const [expiredAt, setExpiredAt] = useInputState<Date | null>(null);
    const [copiedId, setCopiedId] = useInputState<string | null>(null);

    const { data: apikeys, isLoading } = useQuery({
        queryKey: ["apikeys"],
        queryFn: async () => {
            const { data } = await api.apikey.get();
            return data?.data;
        },
    });

    const createMutation = useMutation({
        mutationFn: async () => {

            const { data } = await api.apikey.create.post({
                title,
                description,
                expiresAt: expiredAt ? dayjs(expiredAt).toISOString() : undefined,
            })

            return data?.data;
        },
        onSuccess: () => {
            console.log("success")
            queryClient.invalidateQueries({ queryKey: ["apikeys"] });
            handleClose();
            notifications.show({
                title: "Success",
                message: "API key created successfully",
                color: "green",
            });
        },
        onError: (e) => {
            console.log("ERROR", e)
            notifications.show({
                title: "Error",
                message: "Failed to create API key",
                color: "red",
            });
        },

    });

    const toggleMutation = useMutation({
        mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
            const { data } = await api.apikey({ id }).patch({ active })
            return data?.data
        },
        onSuccess: () => {
            console.log("success")
            queryClient.invalidateQueries({ queryKey: ["apikeys"] });
            notifications.show({
                title: "Success",
                message: "API key updated successfully",
                color: "green",
            });
        },
        onError: () => {
            console.log("error")
            notifications.show({
                title: "Error",
                message: "Failed to update API key",
                color: "red",
            });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const { data } = await api.apikey({ id }).delete()
            return data?.message
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["apikeys"] });
            notifications.show({
                title: "Success",
                message: "API key deleted successfully",
                color: "green",
            });
        },
        onError: () => {
            notifications.show({
                title: "Error",
                message: "Failed to delete API key",
                color: "red",
            });
        },
    });

    const handleCopy = (apikey: string, id: string) => {
        navigator.clipboard.writeText(apikey);
        setCopiedId(id);
        notifications.show({
            title: "Copied",
            message: "API key copied to clipboard",
            color: "blue",
        });
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleCreate = () => {
        if (!title) {
            notifications.show({
                title: "Error",
                message: "Title is required",
                color: "red",
            });
            return;
        }
        createMutation.mutate();
    };

    const handleClose = () => {
        setTitle("");
        setDescription("");
        setExpiredAt(null);
        close();
    };

    return (
        <Container size="xl" suppressHydrationWarning>
            <Stack>
                <Group justify="space-between">
                    <Title order={2}>API Keys</Title>
                    <Button leftSection={<Plus size={18} />} onClick={open}>
                        Create API Key
                    </Button>
                </Group>

                <Card withBorder>
                    {isLoading ? (
                        <Text>Loading...</Text>
                    ) : !apikeys || apikeys.length === 0 ? (
                        <Text c="dimmed">
                            No API keys found. Create one to get started.
                        </Text>
                    ) : (
                        <Table withColumnBorders withTableBorder>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>Title</Table.Th>
                                    <Table.Th>API Key</Table.Th>
                                    <Table.Th>Description</Table.Th>
                                    <Table.Th>Expires At</Table.Th>
                                    <Table.Th>Status</Table.Th>
                                    <Table.Th>Actions</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {apikeys.map((apikey) => (
                                    <Table.Tr key={apikey.id}>
                                        <Table.Td>
                                            <Text fw={500}>{apikey.title}</Text>
                                        </Table.Td>
                                        <Table.Td>
                                            <Group gap="xs">
                                                <Text size="sm" c="dimmed">
                                                    {apikey.apikey.slice(0, 12)}...
                                                </Text>
                                                <Tooltip
                                                    label={copiedId === apikey.id ? "Copied!" : "Copy"}
                                                >
                                                    <ActionIcon
                                                        variant="light"
                                                        size="sm"
                                                        onClick={() => handleCopy(apikey.apikey, apikey.id)}
                                                    >
                                                        {copiedId === apikey.id ? (
                                                            <X size={16} />
                                                        ) : (
                                                            <Copy size={16} />
                                                        )}
                                                    </ActionIcon>
                                                </Tooltip>
                                            </Group>
                                        </Table.Td>
                                        <Table.Td>
                                            <Text size="sm" c="dimmed">
                                                {apikey.description || "-"}
                                            </Text>
                                        </Table.Td>
                                        <Table.Td>
                                            <Text size="sm">
                                                {new Date(apikey.expiresAt || "").toLocaleDateString()}
                                            </Text>
                                        </Table.Td>
                                        <Table.Td>
                                            <Text
                                                size="sm"
                                                c={apikey.active ? "green" : "red"}
                                                fw={500}
                                            >
                                                {apikey.active ? "Active" : "Disabled"}
                                            </Text>
                                        </Table.Td>
                                        <Table.Td>
                                            <Group gap="xs">
                                                <Tooltip label={apikey.active ? "Disable" : "Enable"}>
                                                    <ActionIcon
                                                        variant="light"
                                                        color={apikey.active ? "yellow" : "green"}
                                                        size="sm"
                                                        onClick={() =>
                                                            toggleMutation.mutate({
                                                                id: apikey.id,
                                                                active: !apikey.active,
                                                            })
                                                        }
                                                    >
                                                        <X size={16} />
                                                    </ActionIcon>
                                                </Tooltip>
                                                <Tooltip label="Delete">
                                                    <ActionIcon
                                                        variant="light"
                                                        color="red"
                                                        size="sm"
                                                        onClick={() => deleteMutation.mutate(apikey.id)}
                                                    >
                                                        <Trash2 size={16} />
                                                    </ActionIcon>
                                                </Tooltip>
                                            </Group>
                                        </Table.Td>
                                    </Table.Tr>
                                ))}
                            </Table.Tbody>
                        </Table>
                    )}
                </Card>

                <Modal
                    opened={opened}
                    onClose={handleClose}
                    title="Create API Key"
                    centered
                >
                    <Stack>
                        <TextInput
                            label="Title"
                            placeholder="My API Key"
                            value={title}
                            onChange={setTitle}
                            required
                        />
                        <TextInput
                            label="Description"
                            placeholder="Optional description"
                            value={description}
                            onChange={setDescription}
                        />
                        <DateInput
                            label="Expiration Date"
                            placeholder="Optional expiration date"
                            value={expiredAt}
                            onChange={(value) => setExpiredAt(value as Date | null)}
                            minDate={new Date()}
                        />
                        <Text size="sm" c="dimmed">
                            The API key will expire in 3 months by default if no date is
                            selected.
                        </Text>
                        <Group justify="flex-end" mt="md">
                            <Button variant="light" onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button onClick={handleCreate} loading={createMutation.isPending}>
                                Create
                            </Button>
                        </Group>
                    </Stack>
                </Modal>
            </Stack>
        </Container>
    );
}
