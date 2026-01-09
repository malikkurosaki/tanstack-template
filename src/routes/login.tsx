import { createFileRoute, Link } from "@tanstack/react-router";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { authClient } from "@/lib/auth-client";
import { Route as ProfileRoute } from "@/routes/profile";

export const Route = createFileRoute("/login")({
	component: LoginPage,
});

function LoginPage() {
	const [loading, setLoading] = React.useState(false);
	const [form, setForm] = React.useState({
		email: "",
		password: "",
	});

	function onChange(e: React.ChangeEvent<HTMLInputElement>) {
		setForm((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}));
	}

	async function signInWithEmail(e: React.FormEvent) {
		e.preventDefault();
		setLoading(true);

		try {
			const { error } = await authClient.signIn.email({
				email: form.email,
				password: form.password,
				callbackURL: ProfileRoute.to,
			});

			if (error) {
				alert(error.message);
				return;
			}
		} finally {
			setLoading(false);
		}
	}

	async function signInWithGithub() {
		setLoading(true);
		try {
			await authClient.signIn.social({
				provider: "github",
				callbackURL: ProfileRoute.to,
			});
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
			<Card className="w-full max-w-md p-8">
				<CardHeader>
					<CardTitle className="text-2xl">Welcome back</CardTitle>
				</CardHeader>

				<CardContent className="space-y-4">
					<form onSubmit={signInWithEmail} className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input
								name="email"
								type="email"
								placeholder="you@example.com"
								value={form.email}
								onChange={onChange}
								required
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="password">Password</Label>
							<Input
								name="password"
								type="password"
								value={form.password}
								onChange={onChange}
								required
							/>
						</div>

						<Button type="submit" className="w-full" disabled={loading}>
							{loading ? "Signing in..." : "Sign in"}
						</Button>
					</form>

					<div className="relative">
						<div className="absolute inset-0 flex items-center">
							<span className="w-full border-t" />
						</div>
						<div className="relative flex justify-center text-xs uppercase">
							<span className="bg-background px-2 text-muted-foreground">
								or
							</span>
						</div>
					</div>

					<Button
						variant="outline"
						className="w-full"
						disabled={loading}
						onClick={signInWithGithub}
					>
						Sign in with GitHub
					</Button>

					<div className="text-center text-sm text-muted-foreground">
						Don’t have an account?{" "}
						<Link
							to="/signup"
							className="font-medium text-primary hover:underline"
						>
							Sign up
						</Link>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
