/** biome-ignore-all lint/suspicious/noExplicitAny: <explanation> */
import {
	createFileRoute,
	Link,
	Outlet,
	useNavigate,
	useRouterState,
} from "@tanstack/react-router";
import { Bell, Key, LogOut, Menu, Moon, Shield, Sun, User } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { authMiddleware } from "@/middleware/auth";

const listMenu = [
	{
		title: "Profile",
		to: "/profile",
		description: "My profile",
		icon: User,
	},
	{
		title: "Security",
		to: "/profile/security",
		description: "My security",
		icon: Key,
	},
	{
		title: "Privacy",
		to: "/profile/privacy",
		description: "My privacy",
		icon: Shield,
	},
	{
		title: "Notifications",
		to: "/profile/notifications",
		description: "My notifications",
		icon: Bell,
	},
];

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

/**
 * Layout khusus halaman Profile User
 */
export const Route = createFileRoute("/profile")({
	loader: async (x) => {
		return x.serverContext?.session;
	},
	component: ProfileLayout,
	server: {
		middleware: [authMiddleware],
	},
});

function ProfileLayout() {
	const navigate = useNavigate();
	const { location } = useRouterState();
	const session = Route.useLoaderData();
	// const [session, setSession] = React.useState<any>(null);

	/* ----------------------------------------
	 * Theme state (SAFE)
	 * -------------------------------------- */
	const [theme, setTheme] = React.useState<Theme | null>(null);

	React.useEffect(() => {
		const initial = getInitialTheme();
		setTheme(initial);
		applyTheme(initial);
	}, []);

	const title = (() => {
		return listMenu.find((x) => x.to === location.pathname)?.title;
	})();

	if (!theme) return null; // hindari flash / hydration issue

	return (
		<div className="flex min-h-screen w-full bg-muted/40">
			{/* Sidebar desktop */}
			<aside className="hidden w-64 flex-col border-r bg-background md:flex">
				<ProfileSidebar
					theme={theme}
					setTheme={setTheme}
					user={session as any}
				/>
			</aside>
			{/* Main */}
			<div className="flex flex-1 flex-col">
				{/* Topbar */}
				<header className="flex h-14 items-center gap-4 border-b bg-background px-4 md:px-6">
					{/* Mobile drawer */}
					<Sheet>
						<SheetTrigger asChild>
							<Button variant="ghost" size="icon" className="md:hidden">
								<Menu className="h-5 w-5" />
							</Button>
						</SheetTrigger>
						<SheetContent side="left" className="p-0">
							<ProfileSidebar
								theme={theme}
								setTheme={setTheme}
								user={session as any}
							/>
						</SheetContent>
					</Sheet>

					<div className="flex flex-1 items-center justify-between">
						<h1 className="text-lg font-semibold">{title}</h1>

						<Button
							size="sm"
							variant="outline"
							onClick={() => navigate({ to: "/" })}
						>
							Back to App
						</Button>
					</div>
				</header>

				{/* Content */}
				<main className="flex-1 p-4 md:p-6">
					<Outlet />
				</main>
			</div>
		</div>
	);
}

/* ----------------------------------------
 * Theme Toggle
 * -------------------------------------- */

function ThemeToggle({
	theme,
	setTheme,
}: {
	theme: Theme;
	setTheme: React.Dispatch<React.SetStateAction<Theme | null>>;
}) {
	const toggle = () => {
		const next = theme === "dark" ? "light" : "dark";
		setTheme(next);
		applyTheme(next);
	};

	return (
		<Button variant="outline" className="w-full gap-2" onClick={toggle}>
			{theme === "dark" ? (
				<>
					<Sun className="h-4 w-4" />
					Light mode
				</>
			) : (
				<>
					<Moon className="h-4 w-4" />
					Dark mode
				</>
			)}
		</Button>
	);
}

/* ----------------------------------------
 * Sidebar
 * -------------------------------------- */

function ProfileSidebar({
	user,
	theme,
	setTheme,
}: {
	user: Record<string, string>;
	theme: Theme;
	setTheme: React.Dispatch<React.SetStateAction<Theme | null>>;
}) {
	const navigate = useNavigate();

	return (
		<div className="flex h-full flex-col">
			<div className="flex h-14 items-center border-b px-4 text-sm font-semibold">
				Account Settings
			</div>

			<nav className="flex-1 space-y-1 p-2">
				{listMenu.map((v) => (
					<SidebarItem
						bg={location.pathname === v.to}
						key={v.title}
						icon={v.icon}
						label={v.title}
						to={v.to}
					/>
				))}
			</nav>

			<div className="flex flex-col gap-2 border-t p-4">
				<div className="flex items-center gap-2 p-2">
					<User className="h-4 w-4" />
					{user?.name}
				</div>
				<ThemeToggle theme={theme} setTheme={setTheme} />
				<Button
					variant="outline"
					className="w-full gap-2"
					onClick={async () => {
						await authClient.signOut();
						navigate({ to: "/login" });
					}}
				>
					<LogOut className="h-4 w-4" />
					Logout
				</Button>
			</div>
		</div>
	);
}

/* ----------------------------------------
 * Sidebar Item (TanStack native)
 * -------------------------------------- */

function SidebarItem({
	icon: Icon,
	label,
	to,
	bg,
}: {
	icon: React.ElementType;
	label: string;
	to: string;
	bg?: boolean;
}) {
	return (
		<Link
			to={to}
			className={cn(
				"flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
				bg
					? "bg-accent text-accent-foreground"
					: "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
			)}
		>
			<Icon className="h-4 w-4" />
			{label}
		</Link>
	);
}
