import {
	Badge,
	Button,
	Card,
	Container,
	Grid,
	Group,
	List,
	Paper,
	Stack,
	Text,
	ThemeIcon,
	Title,
	useMantineColorScheme,
} from "@mantine/core";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
	Activity,
	ArrowRight,
	CheckCircle,
	ClipboardList,
	MessageSquare,
	ShieldCheck,
	Star,
	Timer,
	TrendingUp,
	Users,
} from "lucide-react";
import React from "react";

export const Route = createFileRoute("/")({
	component: LandingPage,
});

function LandingPage() {
	const { setColorScheme } = useMantineColorScheme();

	React.useEffect(() => {
		const stored = localStorage.getItem("theme") as "light" | "dark" | null;
		if (stored) {
			setColorScheme(stored);
		} else {
			const prefersDark = window.matchMedia(
				"(prefers-color-scheme: dark)",
			).matches;
			setColorScheme(prefersDark ? "dark" : "light");
		}
	}, [setColorScheme]);

	return (
		<Stack gap={0} mih="100vh">
			<Paper
				component="section"
				radius={0}
				style={{
					background: "linear-gradient(to bottom right, #4f46e5, #1e293b)",
					color: "white",
				}}
			>
				<Container size="xl" py={112} px="md">
					<Badge variant="light" color="gray" mb="md">
						Modern Workforce Platform
					</Badge>
					<Title
						order={1}
						maw={720}
						fz={{ base: 32, md: 48 }}
						fw={700}
						lh={1.2}
					>
						Satu Platform untuk Aktivitas Karyawan, Project & Kolaborasi Tim
					</Title>
					<Text mt="lg" maw={640} c="indigo.1" size="lg">
						Employee activity tracking, project manager, task manager, dan media
						sosial internal — dirancang untuk perusahaan modern dan startup yang
						ingin bergerak cepat.
					</Text>
					<Group mt={40} gap="md">
						<Button size="lg" rightSection={<ArrowRight size={16} />}>
							Coba Gratis 14 Hari
						</Button>
						<Button
							size="lg"
							variant="white"
							color="dark"
							// onClick={() => navigate({ to: "/profile", reloadDocument: true })}
						>
							Request Demo
						</Button>
					</Group>
				</Container>
			</Paper>

			<Container component="section" size="xl" py={96} px="md">
				<Stack align="center" mb={64}>
					<Title order={2} fz={{ base: 28, md: 36 }} ta="center">
						Semua yang Dibutuhkan Tim Produktif
					</Title>
					<Text c="dimmed" ta="center">
						Tidak perlu banyak tools. Semua terintegrasi dalam satu sistem.
					</Text>
				</Stack>

				<Grid gutter="lg">
					<Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
						<Feature
							icon={<Activity size={20} />}
							title="Employee Activity"
							desc="Pantau jam kerja, fokus, dan aktivitas karyawan secara objektif dan real-time."
						/>
					</Grid.Col>
					<Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
						<Feature
							icon={<ClipboardList size={20} />}
							title="Project Manager"
							desc="Kelola project, milestone, dependensi, dan timeline dengan visibilitas penuh."
						/>
					</Grid.Col>
					<Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
						<Feature
							icon={<CheckCircle size={20} />}
							title="Task Manager"
							desc="Task berbasis prioritas, assignee, SLA, dan progress tracking otomatis."
						/>
					</Grid.Col>
					<Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
						<Feature
							icon={<MessageSquare size={20} />}
							title="Employee Social"
							desc="Timeline internal perusahaan untuk update, diskusi, dan knowledge sharing."
						/>
					</Grid.Col>
				</Grid>
			</Container>

			<Paper component="section" radius={0} bg="gray.0" darkHidden>
				<EnterpriseSection />
			</Paper>
			<Paper component="section" radius={0} bg="dark.6" lightHidden>
				<EnterpriseSection />
			</Paper>

			<Container component="section" size="xl" py={96} px="md">
				<Stack align="center" mb={64}>
					<Title order={3} fz={{ base: 28, md: 36 }} ta="center">
						Pricing Transparan
					</Title>
					<Text c="dimmed" ta="center">
						Fleksibel untuk startup hingga enterprise
					</Text>
				</Stack>

				<Grid gutter="lg">
					<Grid.Col span={{ base: 12, md: 4 }}>
						<Pricing
							title="Starter"
							price="Gratis"
							desc="Untuk tim kecil"
							features={[
								"Up to 5 user",
								"Task & project basic",
								"Employee activity limited",
							]}
						/>
					</Grid.Col>
					<Grid.Col span={{ base: 12, md: 4 }}>
						<Pricing
							title="Pro"
							price="Rp49.000 / user"
							highlight
							desc="Untuk tim berkembang"
							features={[
								"Unlimited project & task",
								"Full activity tracking",
								"Employee social",
								"Analytics dashboard",
							]}
						/>
					</Grid.Col>
					<Grid.Col span={{ base: 12, md: 4 }}>
						<Pricing
							title="Enterprise"
							price="Custom"
							desc="Untuk organisasi besar"
							features={[
								"Custom SLA & KPI",
								"SSO & RBAC",
								"Audit log",
								"Dedicated support",
							]}
						/>
					</Grid.Col>
				</Grid>
			</Container>

			<Paper component="section" radius={0} bg="gray.0" darkHidden>
				<TestimonialsSection />
			</Paper>
			<Paper component="section" radius={0} bg="dark.6" lightHidden>
				<TestimonialsSection />
			</Paper>

			<Container component="section" size="xl" py={96} px="md">
				<Stack align="center">
					<Title order={3} fz={{ base: 28, md: 36 }} ta="center">
						Siap Meningkatkan Produktivitas Tim Anda?
					</Title>
					<Text c="dimmed" ta="center">
						Daftar sekarang atau login untuk mulai mengelola tim Anda.
					</Text>
					<Group mt="xl" gap="md">
						<Button size="lg">Daftar</Button>
						<Button size="lg" variant="outline" component={Link} to="/">
							Login
						</Button>
					</Group>
				</Stack>
			</Container>

			<Paper
				component="footer"
				radius={0}
				py="md"
				style={{ borderTop: "1px solid var(--mantine-color-default-border)" }}
			>
				<Text ta="center" size="sm" c="dimmed">
					© {new Date().getFullYear()} Workforce Platform. All rights reserved.
				</Text>
			</Paper>
		</Stack>
	);
}

function EnterpriseSection() {
	return (
		<Container size="xl" py={96} px="md">
			<Grid gutter={64}>
				<Grid.Col span={{ base: 12, md: 6 }}>
					<Badge mb="sm">Enterprise Ready</Badge>
					<Title order={3} fz={{ base: 28, md: 36 }}>
						Keputusan Berbasis Data & KPI Nyata
					</Title>
					<Text mt="md" c="dimmed">
						Dirancang untuk HR, Manager, dan Executive agar dapat memonitor
						performa tim secara terukur.
					</Text>
					<List spacing="sm" mt="xl" size="sm" center>
						<List.Item
							icon={
								<ThemeIcon size={20} radius="xl" color="blue">
									<CheckCircle size={12} />
								</ThemeIcon>
							}
						>
							↑ 32% peningkatan produktivitas tim
						</List.Item>
						<List.Item
							icon={
								<ThemeIcon size={20} radius="xl" color="blue">
									<CheckCircle size={12} />
								</ThemeIcon>
							}
						>
							↓ 24% keterlambatan project delivery
						</List.Item>
						<List.Item
							icon={
								<ThemeIcon size={20} radius="xl" color="blue">
									<CheckCircle size={12} />
								</ThemeIcon>
							}
						>
							↑ 40% engagement karyawan
						</List.Item>
						<List.Item
							icon={
								<ThemeIcon size={20} radius="xl" color="blue">
									<CheckCircle size={12} />
								</ThemeIcon>
							}
						>
							Audit log & role-based access control
						</List.Item>
					</List>
				</Grid.Col>
				<Grid.Col span={{ base: 12, md: 6 }}>
					<Grid gutter="lg">
						<Grid.Col span={6}>
							<KpiCard
								icon={<TrendingUp size={20} />}
								label="Project Success Rate"
								value="96%"
							/>
						</Grid.Col>
						<Grid.Col span={6}>
							<KpiCard
								icon={<Timer size={20} />}
								label="On-Time Delivery"
								value="92%"
							/>
						</Grid.Col>
						<Grid.Col span={6}>
							<KpiCard
								icon={<Users size={20} />}
								label="Active Employees"
								value="1.200+"
							/>
						</Grid.Col>
						<Grid.Col span={6}>
							<KpiCard
								icon={<ShieldCheck size={20} />}
								label="Compliance Score"
								value="ISO-ready"
							/>
						</Grid.Col>
					</Grid>
				</Grid.Col>
			</Grid>
		</Container>
	);
}

function TestimonialsSection() {
	return (
		<Container size="xl" py={96} px="md">
			<Stack align="center" mb={64}>
				<Title order={3} fz={{ base: 28, md: 36 }} ta="center">
					Dipercaya oleh Tim Modern
				</Title>
			</Stack>

			<Grid gutter="lg">
				<Grid.Col span={{ base: 12, md: 4 }}>
					<Testimonial
						name="CTO, Fintech Company"
						text="Satu platform ini menggantikan 4 tools lama kami. Productivity naik signifikan."
					/>
				</Grid.Col>
				<Grid.Col span={{ base: 12, md: 4 }}>
					<Testimonial
						name="HR Manager, Software House"
						text="Monitoring karyawan jadi objektif tanpa micro-management."
					/>
				</Grid.Col>
				<Grid.Col span={{ base: 12, md: 4 }}>
					<Testimonial
						name="Founder, Startup SaaS"
						text="Cepat, modern, dan cocok untuk scale-up team remote."
					/>
				</Grid.Col>
			</Grid>
		</Container>
	);
}

function Feature({
	icon,
	title,
	desc,
}: {
	icon: React.ReactNode;
	title: string;
	desc: string;
}) {
	return (
		<Card withBorder padding="lg" radius="md" h="100%">
			<ThemeIcon size={40} radius="md" variant="light" color="blue" mb="md">
				{icon}
			</ThemeIcon>
			<Text fw={600} size="lg" mb="xs">
				{title}
			</Text>
			<Text size="sm" c="dimmed">
				{desc}
			</Text>
		</Card>
	);
}

function KpiCard({
	icon,
	label,
	value,
}: {
	icon: React.ReactNode;
	label: string;
	value: string;
}) {
	return (
		<Card withBorder padding="lg" radius="md">
			<Group gap="md">
				<ThemeIcon size={40} radius="md" variant="light" color="blue">
					{icon}
				</ThemeIcon>
				<div>
					<Text size="sm" c="dimmed">
						{label}
					</Text>
					<Text size="xl" fw={700}>
						{value}
					</Text>
				</div>
			</Group>
		</Card>
	);
}

function Pricing({
	title,
	price,
	desc,
	features,
	highlight,
}: {
	title: string;
	price: string;
	desc: string;
	features: string[];
	highlight?: boolean;
}) {
	return (
		<Card
			withBorder
			padding="xl"
			radius="md"
			h="100%"
			style={
				highlight
					? {
							borderColor: "var(--mantine-color-blue-6)",
							boxShadow: "var(--mantine-shadow-lg)",
						}
					: undefined
			}
		>
			<Text fw={600} size="lg">
				{title}
			</Text>
			<Text size="xl" fw={700} mt="xs">
				{price}
			</Text>
			<Text size="sm" c="dimmed" mb="lg">
				{desc}
			</Text>
			<List spacing="xs" size="sm" center>
				{features.map((f) => (
					<List.Item
						key={f}
						icon={
							<ThemeIcon size={18} radius="xl" color="blue">
								<CheckCircle size={12} />
							</ThemeIcon>
						}
					>
						{f}
					</List.Item>
				))}
			</List>
		</Card>
	);
}

function Testimonial({ name, text }: { name: string; text: string }) {
	return (
		<Card withBorder padding="lg" radius="md" h="100%">
			<Group gap={4} mb="sm">
				{[...Array(5)].map((_, i) => (
					<Star
						key={`star-${name}-${i.toString()}`}
						size={16}
						fill="var(--mantine-color-blue-6)"
						color="var(--mantine-color-blue-6)"
					/>
				))}
			</Group>
			<Text size="sm" c="dimmed" mb="md">
				"{text}"
			</Text>
			<Text size="sm" fw={500}>
				{name}
			</Text>
		</Card>
	);
}
