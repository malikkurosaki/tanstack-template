// src/routes/dashboard/_layout.tsx

import {
	createFileRoute,
	Outlet,
	redirect,
	useNavigate,
	useRouterState,
} from "@tanstack/react-router";
import { Home, Menu, Settings, Users } from "lucide-react";
import type * as React from "react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { authMiddleware } from "@/middleware/auth";

const listMenu = [
	{
		title: "Overview",
		to: "/dashboard",
		icon: Home,
	},
	{
		title: "Users",
		to: "/dashboard/users",
		icon: Users,
	},
	{
		title: "Settings",
		to: "/dashboard/settings",
		icon: Settings,
	},
];

export const Route = createFileRoute("/dashboard")({
	component: DashboardLayout,
	server: {
		middleware: [authMiddleware],
	},
	loader({ serverContext }) {
		if (!serverContext?.session) {
			throw redirect({ to: "/login" });
		}

		if (serverContext.session.roleId !== "ADMIN") {
			throw redirect({ to: "/profile" });
		}
		return serverContext?.session
	},
});

function DashboardLayout() {
	const navigate = useNavigate();
	const { location } = useRouterState();
	const title = (() => {
		return listMenu.find((x) => x.to === location.pathname)?.title;
	})();
	return (
		<div className="flex min-h-screen w-full bg-muted/40">
			{/* Sidebar desktop */}
			<aside className="hidden w-64 flex-col border-r bg-background md:flex">
				<SidebarContent />
			</aside>

			{/* Main area */}
			<div className="flex flex-1 flex-col">
				{/* Topbar */}
				<header className="flex h-14 items-center gap-4 border-b bg-background px-4 md:px-6">
					{/* Drawer mobile */}
					<Sheet>
						<SheetTrigger asChild>
							<Button variant="ghost" size="icon" className="md:hidden">
								<Menu className="h-5 w-5" />
							</Button>
						</SheetTrigger>
						<SheetContent side="left" className="p-0">
							<SidebarContent />
						</SheetContent>
					</Sheet>

					<div className="flex flex-1 items-center justify-between">
						<h1 className="text-lg font-semibold">{title}</h1>
						<Button onClick={() => navigate({ to: "/profile" })} size="sm">
							Profile
						</Button>
					</div>
				</header>

				{/* Page content */}
				<main className="flex-1 p-4 md:p-6">
					<Outlet />
				</main>
			</div>
		</div>
	);
}

function SidebarContent() {
	const navigate = useNavigate();
	const { location } = useRouterState();
	return (
		<div className="flex h-full flex-col">
			<div className="flex h-14 items-center border-b px-4 font-semibold">
				Dashboard
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

			<div className="border-t p-4">
				<Button
					variant="outline"
					className="w-full"
					onClick={async () => {
						await authClient.signOut();

						navigate({ to: "/login" });
					}}
				>
					Logout
				</Button>
			</div>
		</div>
	);
}

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
		<a
			href={to}
			className={cn(
				"flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
				bg
					? "bg-accent text-accent-foreground"
					: "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
			)}
		>
			<Icon className="h-4 w-4" />
			{label}
		</a>
	);
}
