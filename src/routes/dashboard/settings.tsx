import { createFileRoute } from "@tanstack/react-router";
import {
	Container,
	Title,
	Card,
	Grid,
	Stack,
	Text,
	TextInput,
	Button,
	Group,
	Switch,
	Avatar,
	Textarea,
	Select,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { Bell, Globe, Lock, Mail, MapPin, Phone, Save, User } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/dashboard/settings")({
	component: SettingsPage,
});

function SettingsPage() {
	const [activeTab, setActiveTab] = useState("profile");

	const profileForm = useForm({
		initialValues: {
			firstName: "John",
			lastName: "Doe",
			email: "john.doe@example.com",
			phone: "+1 (555) 123-4567",
			jobTitle: "Software Engineer",
			bio: "Passionate developer working with modern web technologies.",
			location: "San Francisco, CA",
		},
	});

	const accountForm = useForm({
		initialValues: {
			timezone: "America/Los_Angeles",
			language: "en-US",
			notifications: true,
			marketingEmails: false,
			newsletter: true,
		},
	});

	const tabs = [
		{ id: "profile", label: "Profile", icon: User },
		{ id: "account", label: "Account", icon: Lock },
		{ id: "notifications", label: "Notifications", icon: Bell },
	];

	return (
		<Container size="xl" py={40}>
			<Title order={2} mb="xl">Settings</Title>

			<Grid>
				<Grid.Col span={{ base: 12, md: 3 }}>
					<Card withBorder radius="md" p="md">
						<Stack gap="sm">
							{tabs.map((tab) => {
								const Icon = tab.icon;
								return (
									<Group
										key={tab.id}
										onClick={() => setActiveTab(tab.id)}
										style={{
											cursor: "pointer",
											background: activeTab === tab.id ? "var(--mantine-color-blue-light)" : "transparent",
											padding: "8px",
											borderRadius: "var(--mantine-radius-sm)",
										}}
									>
										<Icon size={18} />
										<Text size="sm">{tab.label}</Text>
									</Group>
								);
							})}
						</Stack>
					</Card>
				</Grid.Col>

				<Grid.Col span={{ base: 12, md: 9 }}>
					<Card withBorder radius="md" p="xl">
						{activeTab === "profile" && (
							<form onSubmit={profileForm.onSubmit((values) => console.log(values))}>
								<Stack gap="lg">
									<Group>
										<Avatar size={80} radius="xl">
											<User size={32} />
										</Avatar>
										<Group>
											<Button variant="light" size="sm">
												Change Photo
											</Button>
											<Button variant="outline" size="sm" color="red">
												Remove
											</Button>
										</Group>
									</Group>

									<Grid>
										<Grid.Col span={{ base: 12, md: 6 }}>
											<TextInput
												label="First Name"
												placeholder="Enter your first name"
												{...profileForm.getInputProps("firstName")}
											/>
										</Grid.Col>
										<Grid.Col span={{ base: 12, md: 6 }}>
											<TextInput
												label="Last Name"
												placeholder="Enter your last name"
												{...profileForm.getInputProps("lastName")}
											/>
										</Grid.Col>
									</Grid>

									<TextInput
										label="Email"
										placeholder="your.email@example.com"
										leftSection={<Mail size={16} />}
										{...profileForm.getInputProps("email")}
									/>

									<TextInput
										label="Phone"
										placeholder="+1 (555) 123-4567"
										leftSection={<Phone size={16} />}
										{...profileForm.getInputProps("phone")}
									/>

									<TextInput
										label="Job Title"
										placeholder="Your job title"
										{...profileForm.getInputProps("jobTitle")}
									/>

									<TextInput
										label="Location"
										placeholder="City, Country"
										leftSection={<MapPin size={16} />}
										{...profileForm.getInputProps("location")}
									/>

									<Textarea
										label="Bio"
										placeholder="Tell us about yourself"
										rows={4}
										{...profileForm.getInputProps("bio")}
									/>

									<Group justify="flex-end" mt="md">
										<Button
											variant="light"
											color="gray"
											onClick={() => profileForm.reset()}
										>
											Cancel
										</Button>
										<Button type="submit" leftSection={<Save size={16} />}>
											Save Profile
										</Button>
									</Group>
								</Stack>
							</form>
						)}

						{activeTab === "account" && (
							<form onSubmit={accountForm.onSubmit((values) => console.log(values))}>
								<Stack gap="lg">
									<Title order={4}>Account Preferences</Title>

									<Select
										label="Language"
										placeholder="Select your language"
										leftSection={<Globe size={16} />}
										data={[
											{ value: "en-US", label: "English (US)" },
											{ value: "en-GB", label: "English (UK)" },
											{ value: "es", label: "Spanish" },
											{ value: "fr", label: "French" },
											{ value: "de", label: "German" },
										]}
										{...accountForm.getInputProps("language")}
									/>

									<Select
										label="Timezone"
										placeholder="Select your timezone"
										leftSection={<Globe size={16} />}
										data={[
											{ value: "America/New_York", label: "(GMT-05:00) Eastern Time" },
											{ value: "America/Chicago", label: "(GMT-06:00) Central Time" },
											{ value: "America/Denver", label: "(GMT-07:00) Mountain Time" },
											{ value: "America/Los_Angeles", label: "(GMT-08:00) Pacific Time" },
											{ value: "Europe/London", label: "(GMT+00:00) London" },
											{ value: "Europe/Paris", label: "(GMT+01:00) Paris" },
											{ value: "Asia/Tokyo", label: "(GMT+09:00) Tokyo" },
										]}
										{...accountForm.getInputProps("timezone")}
									/>

									<Title order={4} mt="xl">Privacy & Security</Title>

									<Switch
										label="Two-factor authentication"
										description="Add an extra layer of security to your account"
										checked
										onChange={() => {}}
									/>

									<Title order={4} mt="xl">Communication</Title>

									<Switch
										label="Email notifications"
										description="Receive notifications via email"
										{...accountForm.getInputProps("notifications", { type: "checkbox" })}
									/>

									<Switch
										label="Marketing emails"
										description="Receive marketing and promotional emails"
										{...accountForm.getInputProps("marketingEmails", { type: "checkbox" })}
									/>

									<Switch
										label="Newsletter"
										description="Subscribe to our newsletter for updates"
										{...accountForm.getInputProps("newsletter", { type: "checkbox" })}
									/>

									<Group justify="flex-end" mt="md">
										<Button
											variant="light"
											color="gray"
											onClick={() => accountForm.reset()}
										>
											Cancel
										</Button>
										<Button type="submit" leftSection={<Save size={16} />}>
											Save Account Settings
										</Button>
									</Group>
								</Stack>
							</form>
						)}

						{activeTab === "notifications" && (
							<Stack gap="lg">
								<Title order={4}>Notification Preferences</Title>

								<Switch
									label="Email notifications"
									description="Receive notifications via email"
									checked
									onChange={() => {}}
								/>

								<Switch
									label="Push notifications"
									description="Receive push notifications on your devices"
									checked
									onChange={() => {}}
								/>

								<Switch
									label="SMS notifications"
									description="Receive important notifications via SMS"
									checked={false}
									onChange={() => {}}
								/>

								<Title order={4} mt="xl">Notification Channels</Title>

								<Switch
									label="Activity on your projects"
									description="Get notified when someone interacts with your projects"
									checked
									onChange={() => {}}
								/>

								<Switch
									label="Comments and mentions"
									description="Get notified when someone mentions you or comments on your posts"
									checked
									onChange={() => {}}
								/>

								<Switch
									label="System updates"
									description="Get notified about system maintenance and updates"
									checked
									onChange={() => {}}
								/>

								<Switch
									label="Weekly digest"
									description="Receive a weekly summary of activity"
									checked={false}
									onChange={() => {}}
								/>

								<Group justify="flex-end" mt="md">
									<Button variant="light" color="gray">
										Cancel
									</Button>
									<Button leftSection={<Save size={16} />}>
										Save Notification Settings
									</Button>
								</Group>
							</Stack>
						)}
					</Card>
				</Grid.Col>
			</Grid>
		</Container>
	);
}
