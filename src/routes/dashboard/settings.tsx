import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Group } from "@/components/ui/group";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Stack } from "@/components/ui/stack";
import { api } from "@/lib/api-client";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import useSwr from "swr";
import { toast } from "react-simple-toasts";

export const Route = createFileRoute("/dashboard/settings")({
	component: SettingPage,
});

function SettingPage() {
	return (
		<div>
			<ApikeyDisplay />
		</div>
	);
}

function ApikeyDisplay() {
	const { data, mutate } = useSwr("/", api.apikey.list.get);
	const [form, setForm] = useState({
		name: "",
		description: "",
		expiredAt: "",
	});

	async function handleCreateApiKey() {
		await api.apikey.create.post({
			name: form.name,
			description: form.description,
			expiredAt: new Date().toISOString(),
		});
		mutate();
	}

	async function handleDeleteApiKey(id: string) {
		await api.apikey.delete.post({ id });
		mutate();
	}
	return (
		<div className="flex flex-col gap-4 ">
			<div className="text-4xl w-full bg-muted p-2">Api Key</div>
			<table className="w-full border-collapse">
				<thead>
					<tr className="border-b bg-muted/40">
						<th className="px-4 py-3 text-left text-sm font-medium">Name</th>
						<th className="px-4 py-3 text-left text-sm font-medium">
							Description
						</th>
						<th className="px-4 py-3 text-right text-sm font-medium">
							Actions
						</th>
					</tr>
				</thead>

				<tbody>
					{data?.data?.data.map((v) => (
						<tr
							key={v.id}
							className="border-b last:border-b-0 hover:bg-muted/30"
						>
							<td className="px-4 py-3">{v.name}</td>

							<td className="px-4 py-3 text-sm text-muted-foreground">
								{v.description}
							</td>

							<td className="px-4 py-3">
								<div className="flex justify-end gap-2">
									<Button
										size="sm"
										onClick={() => {
											toast("Token copied to clipboard");
											navigator.clipboard.writeText(v.token || "");
										}}
									>
										Copy
									</Button>

									<Button
										size="sm"
										variant="destructive"
										onClick={() => handleDeleteApiKey(v.id)}
									>
										Delete
									</Button>
								</div>
							</td>
						</tr>
					))}
				</tbody>
			</table>
			{data?.data?.data ? null : (
				<div className="h-40 w-full animate-pulse rounded-md bg-muted" />
			)}

			<Card className="p-8">
				<Group>
					<Stack gap={4}>
						<Label>Title</Label>
						<Input
							title="Title"
							placeholder="title"
							value={form.name}
							onChange={(e) => setForm({ ...form, name: e.target.value })}
						/>
						<Label>Description</Label>
						<Input
							title="Description"
							placeholder="description"
							value={form.description}
							onChange={(e) =>
								setForm({ ...form, description: e.target.value })
							}
						/>
						<Label>Expired Date</Label>
						<Input
							title="Expired Date"
							type="date"
							value={form.expiredAt}
							onChange={(e) => setForm({ ...form, expiredAt: e.target.value })}
						/>
					</Stack>
				</Group>
				<Group justify="end">
					<Button onClick={handleCreateApiKey}>Create API Key</Button>
				</Group>
			</Card>
		</div>
	);
}
