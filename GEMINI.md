# Project Overview

This is a web application built with the [TanStack](https://tanstack.com/) ecosystem. It uses [React](https://react.dev/) as the frontend framework, [Vite](https://vitejs.dev/) as the build tool, and [ElysiaJS](https://elysiajs.com/) for the backend.

## Key Technologies

*   **Frontend:**
    *   [React](https://react.dev/)
    *   [TanStack Router](https://tanstack.com/router) (file-based routing)
    *   [TanStack Query](https://tanstack.com/query) (data fetching)
    *   [TanStack Store](https://tanstack.com/store) (state management)
    *   [Mantine](https://mantine.dev/) (UI components)
    *   [Tailwind CSS](https://tailwindcss.com/) (styling)
*   **Backend:**
    *   [ElysiaJS](https://elysiajs.com/) (web framework)
*   **Database:**
    *   [Prisma](https://www.prisma.io/) (ORM)
    *   [PostgreSQL](https://www.postgresql.org/) (database)
*   **Tooling:**
    *   [Vite](https://vitejs.dev/) (build tool)
    *   [Vitest](https://vitest.dev/) (testing)
    *   [Biome](https://biomejs.dev/) (linting and formatting)

## Architecture

The project follows a typical full-stack architecture with a React frontend and an ElysiaJS backend. The frontend is built using a component-based approach, with routes defined in the `src/routes` directory. The backend uses ElysiaJS to provide a RESTful API, and Prisma to interact with the PostgreSQL database.

# Building and Running

*   **Development:**

    ```bash
    npm install
    npm run dev
    ```

*   **Production:**

    ```bash
    npm run build
    ```

*   **Testing:**

    ```bash
    npm run test
    ```

# Development Conventions

*   **Routing:** The project uses file-based routing with TanStack Router. Routes are defined in the `src/routes` directory. The root layout is defined in `src/routes/__root.tsx`.
*   **Styling:** The project uses Mantine for UI components and Tailwind CSS for styling.
*   **Linting and Formatting:** The project uses Biome for linting and formatting. Use the following commands to check and format the code:

    ```bash
    npm run lint
    npm run format
    npm run check
    ```
