declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL?: string;
    PORT?: string;
    JWT_SECRET?: string;
    VITE_API_BASE_URL?: string;
    PUBLIC_BASE_URL?: string;
    BETTER_AUTH_SECRET?: string;
    BETTER_AUTH_URL?: string;
    GITHUB_CLIENT_ID?: string;
    GITHUB_CLIENT_SECRET?: string;
  }
}
