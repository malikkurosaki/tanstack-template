import { MantineProvider } from "@mantine/core";
import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";
import appCss from "../styles.css?url";

export const Route = createRootRoute({
	// server: {
	// 	middleware: [authMiddleware]
	// },
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "TanStack Start Starter",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),

	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" data-mantine-color-scheme="dark" suppressHydrationWarning>
			<head>
				<HeadContent />
			</head>
			<body suppressHydrationWarning>
				<MantineProvider defaultColorScheme="dark" >{children}</MantineProvider>
				<Scripts />
			</body>
		</html>
	);
}
