// src/routes/index.tsx
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/")({
	component: LandingPage,
});

/* ----------------------------------------
 * Theme helpers (shadcn Vite style)
 * -------------------------------------- */

type Theme = "light" | "dark";

function applyTheme(theme: Theme) {
	const root = document.documentElement;

	if (theme === "dark") root.classList.add("dark");
	else root.classList.remove("dark");

	localStorage.setItem("theme", theme);
}

function getInitialTheme(): Theme {
	const stored = localStorage.getItem("theme") as Theme | null;
	if (stored) return stored;

	const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

	return prefersDark ? "dark" : "light";
}

function LandingPage() {
	/* ----------------------------------------
	 * Theme state (SAFE)
	 * -------------------------------------- */
	const [theme, setTheme] = React.useState<Theme | null>(null);
	const navigate = useNavigate();

	React.useEffect(() => {
		const initial = getInitialTheme();
		setTheme(initial);
		applyTheme(initial);
	}, []);

	if (!theme) return null;
	return (
		<div className="flex min-h-screen flex-col">
			{/* ================= HERO (Startup SaaS – Marketing) ================= */}
			<section className="relative bg-linear-to-br from-indigo-600 to-slate-900 text-white">
				<div className="mx-auto max-w-7xl px-6 py-28">
					<Badge variant="secondary" className="mb-4">
						Modern Workforce Platform
					</Badge>
					<h1 className="max-w-3xl text-4xl font-bold leading-tight md:text-6xl">
						Satu Platform untuk Aktivitas Karyawan, Project & Kolaborasi Tim
					</h1>
					<p className="mt-6 max-w-2xl text-indigo-100">
						Employee activity tracking, project manager, task manager, dan media
						sosial internal — dirancang untuk perusahaan modern dan startup yang
						ingin bergerak cepat.
					</p>
					<div className="mt-10 flex flex-wrap gap-4">
						<Button size="lg">
							Coba Gratis 14 Hari <ArrowRight className="ml-2 h-4 w-4" />
						</Button>
						<Button
							size="lg"
							className="text-gray-600"
							onClick={() => {
								navigate({ to: "/profile", reloadDocument: true });
							}}
						>
							Request Demo
						</Button>
					</div>
				</div>
			</section>

			{/* ================= FEATURES ================= */}
			<section className="mx-auto max-w-7xl px-6 py-24">
				<div className="mb-16 text-center">
					<h2 className="text-3xl font-bold md:text-4xl">
						Semua yang Dibutuhkan Tim Produktif
					</h2>
					<p className="mt-4 text-muted-foreground">
						Tidak perlu banyak tools. Semua terintegrasi dalam satu sistem.
					</p>
				</div>

				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
					<Feature
						icon={<Activity />}
						title="Employee Activity"
						desc="Pantau jam kerja, fokus, dan aktivitas karyawan secara objektif dan real-time."
					/>
					<Feature
						icon={<ClipboardList />}
						title="Project Manager"
						desc="Kelola project, milestone, dependensi, dan timeline dengan visibilitas penuh."
					/>
					<Feature
						icon={<CheckCircle />}
						title="Task Manager"
						desc="Task berbasis prioritas, assignee, SLA, dan progress tracking otomatis."
					/>
					<Feature
						icon={<MessageSquare />}
						title="Employee Social"
						desc="Timeline internal perusahaan untuk update, diskusi, dan knowledge sharing."
					/>
				</div>
			</section>

			{/* ================= B2B ENTERPRISE (KPI & DATA) ================= */}
			<section className="bg-muted/40 py-24">
				<div className="mx-auto max-w-7xl px-6">
					<div className="grid gap-16 md:grid-cols-2">
						<div>
							<Badge className="mb-3">Enterprise Ready</Badge>
							<h3 className="text-3xl font-bold">
								Keputusan Berbasis Data & KPI Nyata
							</h3>
							<p className="mt-4 text-muted-foreground">
								Dirancang untuk HR, Manager, dan Executive agar dapat memonitor
								performa tim secara terukur.
							</p>
							<ul className="mt-8 space-y-4 text-sm">
								<Benefit text="↑ 32% peningkatan produktivitas tim" />
								<Benefit text="↓ 24% keterlambatan project delivery" />
								<Benefit text="↑ 40% engagement karyawan" />
								<Benefit text="Audit log & role-based access control" />
							</ul>
						</div>

						<div className="grid grid-cols-2 gap-6">
							<KpiCard
								icon={<TrendingUp />}
								label="Project Success Rate"
								value="96%"
							/>
							<KpiCard icon={<Timer />} label="On-Time Delivery" value="92%" />
							<KpiCard
								icon={<Users />}
								label="Active Employees"
								value="1.200+"
							/>
							<KpiCard
								icon={<ShieldCheck />}
								label="Compliance Score"
								value="ISO-ready"
							/>
						</div>
					</div>
				</div>
			</section>

			{/* ================= PRICING ================= */}
			<section className="mx-auto max-w-7xl px-6 py-24">
				<div className="mb-16 text-center">
					<h3 className="text-3xl font-bold">Pricing Transparan</h3>
					<p className="mt-4 text-muted-foreground">
						Fleksibel untuk startup hingga enterprise
					</p>
				</div>

				<div className="grid gap-6 md:grid-cols-3">
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
				</div>
			</section>

			{/* ================= TESTIMONIALS ================= */}
			<section className="bg-muted/40 py-24">
				<div className="mx-auto max-w-7xl px-6">
					<div className="mb-16 text-center">
						<h3 className="text-3xl font-bold">Dipercaya oleh Tim Modern</h3>
					</div>

					<div className="grid gap-6 md:grid-cols-3">
						<Testimonial
							name="CTO, Fintech Company"
							text="Satu platform ini menggantikan 4 tools lama kami. Productivity naik signifikan."
						/>
						<Testimonial
							name="HR Manager, Software House"
							text="Monitoring karyawan jadi objektif tanpa micro-management."
						/>
						<Testimonial
							name="Founder, Startup SaaS"
							text="Cepat, modern, dan cocok untuk scale-up team remote."
						/>
					</div>
				</div>
			</section>

			{/* ================= AUTH CTA ================= */}
			<section className="mx-auto max-w-7xl px-6 py-24 text-center">
				<h3 className="text-4xl font-bold">
					Siap Meningkatkan Produktivitas Tim Anda?
				</h3>
				<p className="mt-4 text-muted-foreground">
					Daftar sekarang atau login untuk mulai mengelola tim Anda.
				</p>
				<div className="mt-10 flex justify-center gap-4">
					<Button size="lg">Daftar</Button>
					<Button size="lg" variant="outline" asChild>
						<Link to={Route.path}>Login</Link>
					</Button>
				</div>
			</section>

			<footer className="border-t py-6 text-center text-sm text-muted-foreground">
				© {new Date().getFullYear()} Workforce Platform. All rights reserved.
			</footer>
		</div>
	);
}

/* ================= COMPONENTS ================= */

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
		<Card>
			<CardHeader className="gap-2">
				<div className="w-fit rounded-md bg-primary/10 p-2 text-primary">
					{icon}
				</div>
				<CardTitle>{title}</CardTitle>
			</CardHeader>
			<CardContent className="text-sm text-muted-foreground">
				{desc}
			</CardContent>
		</Card>
	);
}

function Benefit({ text }: { text: string }) {
	return (
		<li className="flex items-center gap-2">
			<CheckCircle className="h-4 w-4 text-primary" />
			{text}
		</li>
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
		<Card>
			<CardHeader className="flex-row items-center gap-3">
				<div className="rounded-md bg-primary/10 p-2 text-primary">{icon}</div>
				<div>
					<p className="text-sm text-muted-foreground">{label}</p>
					<p className="text-xl font-bold">{value}</p>
				</div>
			</CardHeader>
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
		<Card className={highlight ? "border-primary shadow-lg" : ""}>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				<p className="text-2xl font-bold">{price}</p>
				<p className="text-sm text-muted-foreground">{desc}</p>
			</CardHeader>
			<CardContent>
				<ul className="space-y-2 text-sm">
					{features.map((f) => (
						<li key={f} className="flex gap-2">
							<CheckCircle className="h-4 w-4 text-primary" />
							{f}
						</li>
					))}
				</ul>
			</CardContent>
		</Card>
	);
}

function Testimonial({ name, text }: { name: string; text: string }) {
	return (
		<Card>
			<CardContent className="pt-6">
				<div className="mb-3 flex gap-1 text-primary">
					<Star />
					<Star />
					<Star />
					<Star />
					<Star />
				</div>
				<p className="text-sm text-muted-foreground">“{text}”</p>
				<p className="mt-4 text-sm font-medium">{name}</p>
			</CardContent>
		</Card>
	);
}
