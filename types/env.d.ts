declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL?: string;
    PORT?: string;
    JWT_SECRET?: string;
    VITE_BASE_URL?: string;
    BETTER_AUTH_SECRET?: string;
    GITHUB_CLIENT_ID?: string;
    GITHUB_CLIENT_SECRET?: string;
    ANTHROPIC_API_KEY?: string;
    WINDSURF_API_KEY?: string;
    OPENROUTER_API_KEY?: string;
    TSS_DEV_SERVER?: string;
    ADMIN_EMAIL?: string;
  }
}
