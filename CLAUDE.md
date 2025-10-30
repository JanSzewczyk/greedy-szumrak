# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Build & Dev
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production with Turbopack
- `npm start` - Run production build
- `npm run type-check` - Run TypeScript compiler checks

### Code Quality
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Auto-fix linting issues
- `npm run prettier:check` - Check code formatting
- `npm run prettier:write` - Auto-fix formatting

### Testing
- `npm run test` - Run all tests (unit + integration)
- `npm run test:watch` - Run tests in watch mode
- `npm run test:unit` - Run unit tests only (Vitest, Node environment)
- `npm run test:storybook` - Run Storybook component tests (browser-based)
- `npm run test:coverage` - Generate coverage report
- `npm run test:e2e` - Run Playwright E2E tests
- `npm run test:e2e:ui` - Run E2E tests with Playwright UI

### Storybook
- `npm run storybook:dev` - Start Storybook dev server on port 6006
- `npm run storybook:build` - Build Storybook for production
- `npm run storybook:serve` - Serve built Storybook

### Analysis
- `npm run analyze` - Analyze bundle sizes (sets ANALYZE=true)

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 15 with App Router and Turbopack
- **Auth**: Clerk (middleware-based, enforces protected routes)
- **Database**: Firebase Firestore (via firebase-admin)
- **Logging**: Pino with pretty-printing in development
- **Styling**: Tailwind CSS 4 + @szum-tech/design-system
- **Testing**: Vitest (unit), Playwright (E2E), Storybook (component)
- **Type Safety**: TypeScript strict mode + @t3-oss/env-nextjs for env validation

### Project Structure

The codebase follows a feature-based architecture with clear separation between app routes and feature modules:

- **`app/`** - Next.js App Router pages, layouts, and API routes
- **`features/`** - Feature modules containing domain logic, server actions, DB queries, and feature-specific components
  - Each feature has its own subdirectory (e.g., `features/onboarding/`)
  - Structure within features: `components/`, `server/actions/`, `server/db/`, `server/services/`, `types/`
- **`components/`** - Shared UI components used across features
- **`lib/`** - Core infrastructure (Firebase client, logger setup)
- **`data/`** - Configuration and environment validation (`data/env/server.ts`, `data/env/client.ts`)
- **`utils/`** - General utility functions
- **`types/`** - Global TypeScript types
- **`tests/`** - Test files organized by type (`e2e/`, `unit/`)

### Authentication & Middleware

**Clerk middleware** (`middleware.ts`) enforces authentication on all routes except:
- Sign-in/sign-up routes
- Static assets and Next.js internals
- API routes (explicitly matched)

The middleware implements an **onboarding gate**:
- All authenticated users without `sessionClaims.metadata.onboardingComplete === true` are redirected to `/onboarding`
- Onboarding layout checks completion status and redirects to home if already complete
- To mark onboarding complete, update Clerk user metadata via Clerk API

### Firebase & Database

**Firebase Admin SDK** is initialized in `lib/firebase/index.ts`:
- Uses `server-only` package to prevent client-side bundling
- Configured with service account credentials from environment variables
- Exported `db` instance is used for all Firestore queries

**Firestore conventions**:
- Database queries are in `features/*/server/db/*.ts` files
- Error handling uses tuple pattern: `[Error | null, Data | null]`
- Always log queries with structured logging using Pino

**Example pattern from onboarding feature**:
```typescript
export async function getOnboardingByUserId(userId: string): Promise<[null, Onboarding | null] | [Error, null]> {
  try {
    logger.info({ userId }, "Fetching onboarding by userId");
    const querySnapshot = await db.collection("onboarding").where("userId", "==", userId).get();
    // ... query logic
    return [null, result];
  } catch (error) {
    logger.error({ userId, error }, "Error fetching onboarding by userId");
    return [error as Error, null];
  }
}
```

### Logging

**Structured logging with Pino** (`lib/logger.ts`):
- Default logger exported as `logger`
- Create child loggers with context: `createLogger({ module: 'feature-name' })`
- Log level controlled by `LOG_LEVEL` env var (default: "info")
- Pretty-printed in development, JSON in production
- Always include relevant context objects in log calls

**Best practices**:
```typescript
const logger = createLogger({ module: "onboarding-db" });
logger.info({ userId, onboardingId }, "Operation started");
logger.error({ userId, error }, "Operation failed");
```

### Environment Variables

**T3 Env** provides type-safe environment validation with Zod:
- Server-side: `data/env/server.ts` (imports as `env`)
- Client-side: `data/env/client.ts` (must be prefixed with `NEXT_PUBLIC_`)
- Build fails if required env vars are missing or invalid
- Client env vars are manually mapped in `experimental__runtimeEnv`

**Required environment variables**:
- `CLERK_SECRET_KEY`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, and Clerk URL configs
- `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`
- `LOG_LEVEL` (optional: fatal | error | warn | info | debug | trace)
- `ANALYZE` (optional: 'true' | 'false' for bundle analysis)
- `CI` (optional: detected automatically in CI environments)

### Path Aliases

TypeScript path mapping configured in `tsconfig.json`:
- `~/` maps to root directory
- Example: `import { db } from "~/lib/firebase"`

### Server-Only Code

Use `server-only` package to prevent server code from bundling on client:
```typescript
import "server-only";
// ... server-only code
```
Applied to `lib/firebase/index.ts` and should be used for all database/secrets modules.

### Health Endpoint

API health check available at `/api/health` with rewrites from:
- `/health`, `/healthz`, `/ping`

Useful for liveness/readiness probes in deployment.

### Testing Strategy

**Unit Tests** (Vitest):
- Run in Node environment
- Setup file: `tests/unit/vitest.setup.ts`
- Test files: `**/*.{test,spec}.ts`

**Storybook Tests** (Vitest + Browser):
- Run in Chromium browser via Playwright
- Setup file: `tests/integration/vitest.setup.ts`
- Use Storybook's `play` function for acceptance testing

**E2E Tests** (Playwright):
- Full user flow testing
- Config: `playwright.config.ts`
- Run with `--pass-with-no-tests` flag

### CI/CD

GitHub Actions workflows:
- **PR Check** (`pr-check.yml`): Build, lint, prettier, TypeScript, tests, E2E
- **Code Review** (`code-review.yml`): ChatGPT-powered reviews (requires `OPENAI_API_KEY` secret)
- **Publish** (`publish.yml`): Semantic Release on merge to `main` (uses Conventional Commits)

### Design System

The project uses **@szum-tech/design-system** for UI components:
- Import components directly: `import { Button } from "@szum-tech/design-system"`
- Includes design tokens, color palette, and utility functions
- [Documentation](https://szum-tech-design-system.vercel.app/?path=/docs/components--docs)

### Key Patterns

**Onboarding Flow**:
- Multi-step process: Welcome → Preferences → Goals → Categories
- Steps defined in `features/onboarding/types/onboarding.ts` as `OnboardingSteps` constant
- Current step stored in Firestore `onboarding` collection
- Onboarding state persisted across steps via cookie (`onboarding-cookie.ts`)
- Layout wraps all onboarding pages with `OnboardingStepper` component

**Error Handling**:
- Use tuple return pattern: `[Error | null, Data | null]`
- Log errors with structured context before returning
- Validate data with Zod schemas where applicable

**Conventional Commits**:
- Used for automated versioning and changelog generation
- Format: `type(scope): description`
- Types: feat, fix, chore, docs, refactor, test, etc.