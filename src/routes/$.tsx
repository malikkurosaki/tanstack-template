// src/routes/$tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export const Route = createFileRoute("/$")({
	component: NotFoundPage,
});

function NotFoundPage() {
	return (
		<div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
			<Card className="w-full max-w-md text-center shadow-lg">
				<CardHeader className="flex flex-col items-center gap-2">
					<div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
						<AlertTriangle className="h-7 w-7 text-destructive" />
					</div>
					<CardTitle className="text-2xl font-bold">
						404 – Page Not Found
					</CardTitle>
				</CardHeader>

				<CardContent className="text-sm text-muted-foreground">
					Halaman yang kamu cari tidak ditemukan atau sudah dipindahkan.
				</CardContent>

				<CardFooter className="flex justify-center gap-2">
					<Button asChild variant="default">
						<Link to="/">Kembali ke Home</Link>
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
