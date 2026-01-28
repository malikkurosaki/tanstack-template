import {
	AppShell,
	Burger,
	Group,
	NavLink,
	rem,
	Title,
	Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
	createFileRoute,
	Outlet,
	useLocation,
	useNavigate,
} from "@tanstack/react-router";
import {
	Key,
	LayoutDashboard,
	Settings,
	Users,
} from "lucide-react";
import { useEffect, useState } from "react";

// List Navbar
const listNavbar = [
	{
		label: "Overview",
		to: "/dashboard",
		icon: <LayoutDashboard style={{ width: rem(18), height: rem(18) }} />,
	},
	{
		label: "Users",
		to: "/dashboard/users",
		icon: <Users style={{ width: rem(18), height: rem(18) }} />,
	},
	{
		label: "API Keys",
		to: "/dashboard/apikey",
		icon: <Key style={{ width: rem(18), height: rem(18) }} />,
	},
	{
		label: "Settings",
		to: "/dashboard/settings",
		icon: <Settings style={{ width: rem(18), height: rem(18) }} />,
	},
];

// Route definition
export const Route = createFileRoute("/dashboard")({
	component: RouteComponent,
	// server: {
	// 	middleware: [authMiddleware],
	// },
});

// Client-only wrapper to avoid SSR mismatch
function ClientOnly({ children }: { children: React.ReactNode }) {
	const [mounted, setMounted] = useState(false);
	useEffect(() => setMounted(true), []);
	return mounted ? children : null;
}

// Function to check active nav link
function isActive(path: string, to: string) {
	if (to === "/dashboard") {
		return path === to;
	}
	return path.startsWith(to);
}

// Main component
function RouteComponent() {
	const navigate = useNavigate();
	const location = useLocation();
	const path = location?.pathname ?? "";
	const [opened, { toggle }] = useDisclosure(true);

	return (
		<AppShell
			header={{ height: 60 }}
			navbar={{
				width: { base: 250, sm: opened ? 250 : 80 },
				breakpoint: "sm",
				collapsed: { mobile: !opened, desktop: !opened },
			}}
			padding="md"
		>
			<AppShell.Header>
				<Group h="100%" px="md">
					<Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
					<Burger opened={opened} onClick={toggle} visibleFrom="sm" size="sm" />
					<Title order={3}>Dashboard</Title>
				</Group>
			</AppShell.Header>

			<ClientOnly>
				<AppShell.Navbar p="md">
					{listNavbar.map(({ label, to, icon }) => (
						<Tooltip label={label} position="right" disabled={opened} key={to}>
							<NavLink
								label={opened ? label : undefined}
								leftSection={icon}
								onClick={() => navigate({ to })}
								active={isActive(path, to)}
								childrenOffset={28}
							/>
						</Tooltip>
					))}
				</AppShell.Navbar>
			</ClientOnly>

			<AppShell.Main>
				<Outlet />
			</AppShell.Main>
		</AppShell>
	);
}
