# AGENTS.md

This document provides essential, non-obvious guidance for AI agents working in the Carson's Village repository.

## Core Technologies

- **Framework**: Nuxt 4
- **Database**: SQLite with Prisma ORM
- **Deployment**: Docker, AWS (EC2, ECR, ECS), and GitHub Actions
- **Authentication**: Better-Auth
- **Payments**: Stripe
- **Email**: AWS SES
- **File Storage**: AWS S3

## Local Development Setup

1.  **Install Dependencies**: This project prefers `pnpm`.
    ```bash
    pnpm install
    ```

2.  **Environment Variables**: Create a `.env` file from `.env.example`. This is critical and requires secrets for AWS, Better-Auth, Stripe, and other services.

3.  **Initialize and Seed Database**:
    ```bash
    pnpm prisma generate
    pnpm prisma migrate dev
    pnpm seed
    ```
    Use `pnpm prisma studio` to view and edit data in the local database.

4.  **Run Development Server**:
    ```bash
    pnpm dev
    ```

## Key Commands

-   `pnpm dev`: Start the development server.
-   `pnpm build`: Build for production.
-   `pnpm lint`: Run ESLint.
-   `pnpm lint:fix`: Automatically fix linting issues.
-   `pnpm prisma migrate dev`: Apply database migrations.
-   `pnpm seed`: Seed the database with initial data.

## Project Structure & Conventions

-   **User Roles**: The application has three roles with distinct permissions: `admin`, `advocate`, and `family`. This is a core concept.
    -   `admin` users can only be created via the database (e.g., through seeding or `prisma studio`).
    -   `advocate` users can invite `family` users.
-   **Prisma**: Database schema is managed in `prisma/schema.prisma`.
-   **CI/CD**: Pushing to the `main` branch triggers a production deployment. Pushing to the `stage` branch triggers a staging deployment. The workflows are defined in `.github/workflows/`.

## Important Notes

-   **Seeding**: The `pnpm seed` command is important for creating initial admin users and other necessary data for local development.
-   **Environment**: The application will not run correctly without a fully populated `.env` file.
-   **Prisma Migration**: You should always assume that data in SQLite database is not important and can be discarded if necessary, for example if you run `pnpm prisma migrate dev` and you are asked to create a migration due the schema being out of sync and you didn't update the schema in this branch, then just delete the file `dev.db` and rerun the migrate command

<!-- caveman-begin -->
Respond terse like smart caveman. All technical substance stay. Only fluff die.

Rules:
- Answer first: Answer, then reason, then next step.
- Kill ceremony: No greeting, hedging, pleasantries, recap, or closer.
- Short word: "fix" not "implement a solution for".
- Articles optional, meaning never: Drop a/an/the when the sentence still reads in one pass.
- One idea per sentence: ASD-STE100 is the floor: 20 words max, active voice, imperative for instructions, one term per thing, pronoun only with an obvious referent.
- Payload verbatim: Code blocks unchanged.
- Tool runs: bounded status: No text between routine calls.
- User's language: Compress the style, not the language.
- Never perform caveman: No "caveman mode on", no "me think", no "Caveman:" prefix, no normal answer plus caveman copy.

Switch: /caveman (default), /ultracave (fragments, each fact once), /megacave (Classical Chinese 文言文)
Stop: "stop caveman" or "normal mode"

Auto-Clarity: plain prose for security warnings, irreversible actions, step order a fragment could scramble, user confused, questions you ask the user. Resume after.

Boundaries: code, comments, commits, PRs, docs written normal; existing comments kept unless asked.
Floor: code, commands, paths, numbers and error strings verbatim; never drop not/never/no/only.
<!-- caveman-end -->
