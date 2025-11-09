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

**Firebase Type Pattern**:

Firebase uses different data types depending on the context:

- `FieldValue.serverTimestamp()` when creating/updating documents
- `Timestamp` objects when reading from Firestore
- `Date` objects in the application layer (after transformation)

We use type variants for different data lifecycle states:

1. **Base type** (`*Base`) - Business fields only, no `id` or timestamps
2. **Firestore type** (`*Firestore`) - Raw Firestore data with `Timestamp` objects (uses `WithFirestoreTimestamps<T>`)
3. **Application type** (main type, e.g., `Onboarding`) - Application data with `Date` objects and `id` field (uses
   `WithDates<T>`)
4. **Create DTO** (`Create*Dto`) - For creating documents with `FieldValue.serverTimestamp()` (uses `CreateDto<T>`)
5. **Update DTO** (`Update*Dto`) - For updating documents, all fields optional (uses `UpdateDto<T>`)

**Example type definition**:

```typescript
// 1. Base type (business fields only, Date objects for custom dates)
export type OnboardingBase = {
  completed: boolean;
  currentStep: OnboardingStep;
  products: OnboardingProducts;
};

// 2. Use generic types from lib/firebase/types.ts
export type OnboardingFirestore = WithFirestoreTimestamps<OnboardingBase>;
export type Onboarding = WithDates<OnboardingBase>;
export type CreateOnboardingDto = CreateDto<OnboardingBase>;
export type UpdateOnboardingDto = UpdateDto<OnboardingBase>;
```

**With custom Date fields**: The generic types automatically handle custom Date fields:

```typescript
// Base type with custom date fields
export type EventBase = {
  title: string;
  scheduledAt: Date; // Custom date field
  expiresAt?: Date; // Optional custom date field
};

// Firestore type - all Date fields become Timestamp
export type EventFirestore = WithFirestoreTimestamps<EventBase>;
// Result: { title: string; scheduledAt: Timestamp; expiresAt?: Timestamp; createdAt: Timestamp; updatedAt: Timestamp }

// Application type - preserves Date fields
export type Event = WithDates<EventBase>;
// Result: { id: string; title: string; scheduledAt: Date; expiresAt?: Date; createdAt: Date; updatedAt: Date }

// Create DTO - all Date fields become FieldValue
export type CreateEventDto = CreateDto<EventBase>;
// Result: { title: string; scheduledAt: FieldValue; expiresAt?: FieldValue; createdAt: FieldValue; updatedAt: FieldValue }

// Update DTO - all fields optional, Date fields become FieldValue
export type UpdateEventDto = UpdateDto<EventBase>;
// Result: { title?: string; scheduledAt?: FieldValue; expiresAt?: FieldValue }
```

**Transform helper** (in `features/*/server/db/*.ts`):

```typescript
// Basic transform (no custom date fields)
function transformFirestoreToOnboarding(docId: string, data: FirebaseFirestore.DocumentData): Onboarding {
  return {
    id: docId,
    ...data,
    updatedAt: data.updatedAt?.toDate(),
    createdAt: data.createdAt?.toDate()
  } as Onboarding;
}

// Transform with custom date fields
function transformFirestoreToEvent(docId: string, data: FirebaseFirestore.DocumentData): Event {
  return {
    id: docId,
    ...data,
    scheduledAt: data.scheduledAt?.toDate(), // Custom date field
    expiresAt: data.expiresAt?.toDate(), // Optional custom date field
    updatedAt: data.updatedAt?.toDate(),
    createdAt: data.createdAt?.toDate()
  } as Event;
}
```

**Database function pattern**:

```typescript
// CREATE
export async function createOnboardingByUserId(
  userId: string,
  products: ProductsFormData
): Promise<[null, Onboarding] | [Error, null]> {
  const data: CreateOnboardingDto = {
    completed: false,
    currentStep: OnboardingSteps.PREFERENCES,
    products,
    updatedAt: FieldValue.serverTimestamp(),
    createdAt: FieldValue.serverTimestamp()
  };

  try {
    const docRef = db.collection("onboarding").doc(userId);
    await docRef.create(data);
    const doc = await docRef.get();
    return [null, transformFirestoreToOnboarding(doc.id, doc.data()!)];
  } catch (error) {
    return [error as Error, null];
  }
}

// UPDATE
export async function updateOnboarding(
  onboardingId: string,
  updateData: UpdateOnboardingDto
): Promise<[null, Onboarding] | [Error, null]> {
  try {
    const docRef = db.collection("onboarding").doc(onboardingId);
    // Always add updatedAt automatically
    await docRef.update({
      ...updateData,
      updatedAt: FieldValue.serverTimestamp()
    });
    const doc = await docRef.get();
    return [null, transformFirestoreToOnboarding(doc.id, doc.data()!)];
  } catch (error) {
    return [error as Error, null];
  }
}

// READ
export async function getOnboardingById(userId: string): Promise<[null, Onboarding] | [Error, null]> {
  try {
    const doc = await db.collection("onboarding").doc(userId).get();
    if (!doc.exists) throw new Error("Not found");
    return [null, transformFirestoreToOnboarding(doc.id, doc.data()!)];
  } catch (error) {
    return [error as Error, null];
  }
}
```

**Usage in Server Actions**:

```typescript
// Basic update
export async function submitPreferencesStep(formData: PreferencesFormData, onboarding: Onboarding) {
  // Use UpdateDto - only fields to update
  const updateData: UpdateOnboardingDto = {
    currentStep: OnboardingSteps.PREFERENCES,
    preferences: formData
  };

  const [error] = await updateOnboarding(onboarding.id, updateData);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return redirect(OnboardingSteps.GOALS);
}

// Creating with custom date fields
export async function createEvent(data: { title: string; scheduledAt: Date }) {
  const eventData: CreateEventDto = {
    title: data.title,
    scheduledAt: FieldValue.serverTimestamp(), // or specific date: Timestamp.fromDate(data.scheduledAt)
    expiresAt: undefined,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp()
  };

  const [error, event] = await createEventInDb(eventData);
  if (error) return { error: error.message };
  return { event };
}

// Updating with custom date fields
export async function rescheduleEvent(eventId: string, newDate: Date) {
  const updateData: UpdateEventDto = {
    scheduledAt: Timestamp.fromDate(newDate) // Convert Date to Timestamp for update
  };

  const [error, event] = await updateEvent(eventId, updateData);
  if (error) return { error: error.message };
  return { event };
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

**Database Seeding**:

The application uses an automatic seeding mechanism to populate Firestore with predefined data on startup.

**Seeding Architecture**:
- `lib/firebase/seeder.ts` - Generic utilities (`seedCollection`, `seedDatabase`, `shouldSeedCollection`)
- `lib/firebase/auto-seed.ts` - Auto-seeding orchestrator (runs once per app lifecycle)
- `features/*/data/predefined-*.ts` - Predefined data definitions
- `features/*/server/db/seed-*.ts` - Feature-specific seeding functions
- `app/api/seed/route.ts` - Manual seeding API endpoint

**Auto-seeding workflow**:
1. Application starts → `app/layout.tsx` calls `autoSeedDatabase()`
2. Auto-seed checks if seeding is needed via `shouldSeedCollection()`
3. If needed, calls feature-specific seed functions (e.g., `seedBudgetProfiles()`)
4. Seeder creates only missing documents (preserves existing data)
5. Logs all operations with structured logging

**Adding new seedable data**:
```typescript
// 1. Define data in features/my-feature/data/predefined-items.ts
export const PREDEFINED_ITEMS = [
  { id: "item-1", name: "Item 1", /* ... */ }
];

// 2. Create seeder in features/my-feature/server/db/seed-items.ts
export async function seedItems(options: { force?: boolean } = {}) {
  const stats = await seedCollection({
    collectionName: "items",
    data: PREDEFINED_ITEMS,
    forceUpdate: options.force
  });
  return { stats };
}

// 3. Add to auto-seed in lib/firebase/auto-seed.ts
await seedBudgetTemplates();
await seedItems(); // Add this line
```

**Example: Budget Templates**

The application seeds 5 predefined budget templates on startup:
- `young_professional` - 50/30/20 split for early career (Recommended)
- `family` - 60/20/20 split with children-focused categories
- `aggressive_saver` - 40/10/50 split for FIRE goal
- `student` - 60/25/15 split for low income
- `custom` - Empty template for full customization

Each template includes detailed allocations (needs/wants/savings) with specific categories, percentages, icons, colors, and examples. See `features/budget/data/predefined-budget-templates.ts` for full definitions.

**Manual seeding via API**:
- `GET /api/seed` - Seed missing data only
- `GET /api/seed?force=true` - Force re-seed (updates existing)

**Seeding best practices**:
- Always use unique, stable IDs for predefined items (slugs, not UUIDs)
- Set `isPredefined: true` for system-generated items
- Use `forceUpdate: false` by default to preserve user modifications
- Log all seeding operations for debugging
- Don't block app startup if seeding fails (catch errors)
