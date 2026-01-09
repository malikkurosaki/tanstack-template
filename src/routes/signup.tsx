import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/signup")({
	component: SignupPage,
});

function SignupPage() {
	const [form, setForm] = React.useState({
		name: "",
		email: "",
		phone: "",
		password: "",
	});

	const [loading, setLoading] = React.useState(false);
	const navigate = useNavigate();

	function onChange(e: React.ChangeEvent<HTMLInputElement>) {
		setForm((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}));
	}

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setLoading(true);

		const { error } = await authClient.signUp.email({
			email: form.email,
			password: form.password,
			name: form.name,
		});

		if (error) {
			alert(error.message);
			return;
		}

		navigate({ to: "/login" });
	}

	return (
		<div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
			<Card className="w-full max-w-md p-8">
				<CardHeader>
					<CardTitle className="text-2xl">Create account</CardTitle>
				</CardHeader>

				<CardContent>
					<form onSubmit={onSubmit} className="space-y-4">
						{/* Name */}
						<div className="space-y-2">
							<Label htmlFor="name">Name</Label>
							<Input
								name="name"
								placeholder="John Doe"
								value={form.name}
								onChange={onChange}
								required
							/>
						</div>

						{/* Email */}
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

						{/* Phone */}
						<div className="space-y-2">
							<Label htmlFor="phone">Phone number</Label>
							<Input
								name="phone"
								type="tel"
								placeholder="+62 812 3456 7890"
								value={form.phone}
								onChange={onChange}
								required
							/>
						</div>

						{/* Password */}
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
							{loading ? "Creating account..." : "Sign up"}
						</Button>
					</form>

					<div className="mt-4 text-center text-sm text-muted-foreground">
						Already have an account?{" "}
						<Link
							to="/login"
							className="font-medium text-primary hover:underline"
						>
							Login
						</Link>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
