/** biome-ignore-all lint/security/noDangerouslySetInnerHtml: false positive */
import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import appCss from "../styles.css?url";
import 'react-simple-toasts/dist/style.css';

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{ name: "viewport", content: "width=device-width, initial-scale=1" },
			{ title: "TanStack Start Starter" },
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
		<html lang="en" suppressHydrationWarning>
			<head>
				<HeadContent />

				{/* ----------------------------------------
				 * Theme init (shadcn/ui Vite style)
				 * Runs BEFORE React hydration
				 * -------------------------------------- */}
				<script
					dangerouslySetInnerHTML={{
						__html: `
(function () {
  try {
    const stored = localStorage.getItem("theme");
    if (stored === "dark") {
      document.documentElement.classList.add("dark");
      return;
    }
    if (stored === "light") {
      document.documentElement.classList.remove("dark");
      return;
    }

    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (prefersDark) {
      document.documentElement.classList.add("dark");
    }
  } catch (_) {}
})();
						`,
					}}
				/>
			</head>

			<body suppressHydrationWarning>
				{children}
				<Scripts />
			</body>
		</html>
	);
}
