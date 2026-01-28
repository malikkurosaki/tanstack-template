import {
	Alert,
	Anchor,
	Button,
	Container,
	Divider,
	Group,
	Paper,
	PasswordInput,
	Stack,
	Text,
	TextInput,
	Title,
} from "@mantine/core";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/auth/signin")({
	component: SigninPage,
});

export default function SigninPage() {
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSignin = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			const result = await authClient.signIn.email({
				email,
				password,
				callbackURL: "/profile",
			});

			if (result.error) {
				setError(result.error.message ?? "Signin failed");
			} else {
				navigate({ to: "/profile" });
			}
		} catch (_err) {
			setError("An error occurred during signin");
		} finally {
			setLoading(false);
		}
	};

	const handleGithubSignin = async () => {
		setLoading(true);
		setError(null);

		try {
			await authClient.signIn.social({
				provider: "github",
				callbackURL: "/profile",
			});
		} catch (_err) {
			setError("An error occurred during GitHub signin");
			setLoading(false);
		}
	};

	return (
		<Container size={420} my={40}>
			<Title ta="center" order={2}>
				Welcome back!
			</Title>
			<Text c="dimmed" size="sm" ta="center" mt={5}>
				Don't have an account?{" "}
				<Anchor
					size="sm"
					component="button"
					onClick={() => navigate({ to: "/auth/signup" })}
				>
					Create account
				</Anchor>
			</Text>

			<Paper withBorder shadow="md" p={30} mt={30} radius="md">
				{error && (
					<Alert color="red" mb="md">
						{error}
					</Alert>
				)}

				<form onSubmit={handleSignin}>
					<Stack>
						<TextInput
							label="Email"
							placeholder="your@email.com"
							required
							value={email}
							onChange={(e) => setEmail(e.currentTarget.value)}
						/>

						<PasswordInput
							label="Password"
							placeholder="Your password"
							required
							value={password}
							onChange={(e) => setPassword(e.currentTarget.value)}
						/>

						<Group justify="space-between" mt="xs">
							<Anchor component="button" size="sm" type="button">
								Forgot password?
							</Anchor>
						</Group>

						<Button fullWidth mt="xl" type="submit" loading={loading}>
							Sign in
						</Button>
					</Stack>
				</form>

				<Divider label="Or continue with" labelPosition="center" my="lg" />

				<Button
					fullWidth
					variant="default"
					leftSection={
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width={20}
							height={20}
							viewBox="0 0 24 24"
							fill="currentColor"
						>
							<title>GitHub logo</title>
							<path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405 1.02 0 2.04.135 3 .405 2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
						</svg>
					}
					onClick={handleGithubSignin}
					loading={loading}
				>
					Sign in with GitHub
				</Button>
			</Paper>
		</Container>
	);
}
