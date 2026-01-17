# Project Context

This file contains project-specific configuration that agents and skills reference.
When using this configuration in other projects, update this file with your project's specifics.

## Tech Stack

| Category | Technology | Version |
|----------|------------|---------|
| Framework | Next.js | 16 (App Router, Turbopack) |
| UI Library | React | 19.2 (with React Compiler) |
| Authentication | Clerk | proxy-based (proxy.ts, NOT middleware.ts) |
| Database | Firebase Firestore | Admin SDK |
| Styling | Tailwind CSS | 4 |
| Design System | @szum-tech/design-system | (shadcn/ui based) |
| Type Safety | TypeScript | strict mode |
| Env Validation | T3 Env | @t3-oss/env-nextjs |
| Logging | Pino | with pretty-printing in dev |

## Testing Stack

| Type | Tool | Location | Command |
|------|------|----------|---------|
| Unit | Vitest | `tests/unit/`, `*.test.ts` | `npm run test:unit` |
| Component | Storybook + Vitest | `*.stories.tsx` | `npm run test:storybook` |
| E2E | Playwright | `tests/e2e/` | `npm run test:e2e` |
| All | Vitest | - | `npm run test` |

## Key Files

| Purpose | File |
|---------|------|
| Next.js config | `next.config.ts` |
| Auth config | `proxy.ts` (NOT middleware.ts) |
| Dependencies | `package.json` |
| TypeScript | `tsconfig.json` |
| Tailwind | `tailwind.config.ts` |
| Firebase setup | `lib/firebase/` |
| Environment vars | `data/env/server.ts`, `data/env/client.ts` |

## Database Patterns

### Type Lifecycle (Firebase)

```typescript
// 1. Base type - Business fields only
export type ResourceBase = {
  name: string;
  status: "active" | "inactive";
};

// 2. Firestore type - With Timestamp objects
export type ResourceFirestore = WithFirestoreTimestamps<ResourceBase>;

// 3. Application type - With id and Date objects
export type Resource = WithDates<ResourceBase>;

// 4. Create DTO - For creating documents
export type CreateResourceDto = CreateDto<ResourceBase>;

// 5. Update DTO - For updating documents
export type UpdateResourceDto = UpdateDto<ResourceBase>;
```

### Error Handling Pattern (DbError)

```typescript
import { categorizeDbError, DbError } from "~/lib/firebase/errors";

export async function getResourceById(id: string): Promise<[null, Resource] | [DbError, null]> {
  if (!id || id.trim() === "") {
    const error = DbError.validation("Invalid id provided");
    return [error, null];
  }

  try {
    const doc = await db.collection(COLLECTION_NAME).doc(id).get();

    if (!doc.exists) {
      return [DbError.notFound(RESOURCE_NAME), null];
    }

    return [null, transformFirestoreToResource(doc.id, doc.data()!)];
  } catch (error) {
    return [categorizeDbError(error, RESOURCE_NAME), null];
  }
}
```

## Server Action Patterns

> **Full documentation**: See `.claude/skills/server-actions/` skill for complete patterns, examples, and React integration.

**Quick Reference:**

```typescript
import type { ActionResponse, RedirectAction } from "~/lib/action-types";

// ActionResponse<T> - Returns data to client
// RedirectAction - Redirects on success (never returns)
```

**Server Action Structure:**
1. `"use server"` directive
2. Authentication check (`await auth()`)
3. Zod validation (`schema.safeParse()`)
4. Database operation (tuple error handling)
5. Cache revalidation (`revalidatePath()` / `revalidateTag()`)
6. Toast notification (for user feedback)
7. Return `ActionResponse` or `redirect()`

**File Location:** `features/[feature]/server/actions/[action-name].ts`

**Related Skills:**
- `server-actions` - Full patterns, types, validation, hooks integration
- `api-test` - Testing route handlers and endpoints

## Import Conventions

```typescript
// Path alias
import { db } from "~/lib/firebase";
import { createLogger } from "~/lib/logger";

// Design system
import { Button, Card } from "@szum-tech/design-system";

// Server-only code
import "server-only";
```

## Component Location

- **Shared components**: `components/`
- **Feature components**: `features/[feature]/components/`
- **Stories**: Same directory as component (`component.stories.tsx`)

## Logging Pattern

```typescript
const logger = createLogger({ module: "feature-name" });

// Success
logger.info({ userId, resourceId }, "Operation completed");

// Warning
logger.warn({ userId, errorCode: error.code }, "Resource not found");

// Error - always include errorCode and isRetryable
logger.error({
  userId,
  errorCode: dbError.code,
  isRetryable: dbError.isRetryable
}, "Operation failed");
```

## Form Pattern

- Use React Hook Form for all forms
- Use Zod schemas for validation
- Use ActionResponse pattern for server actions
- Use toast notifications for user feedback
- See `server-actions` skill for React Hook Form + Server Actions integration

## Test Data Pattern

- Use `@jackfranklin/test-data-bot` for builders
- Use `@faker-js/faker/locale/pl` for Polish localization
- Builder location: `features/[feature]/test/builders/`

## Available Skills

Skills provide detailed documentation and patterns. Located in `.claude/skills/`.

| Skill               | Description                                                  | Use When                                       |
|---------------------|--------------------------------------------------------------|------------------------------------------------|
| `server-actions`    | Server Actions patterns, types, validation, React integration | Creating/updating server actions, form handling |
| `api-test`          | API endpoint testing with Playwright                         | Testing route handlers, API endpoints          |
| `storybook-testing` | Component testing with Storybook play functions              | Writing component interaction tests            |
| `builder-factory`   | Test data builders with test-data-bot                        | Creating mock data for tests/stories           |
| `db-migration`      | Database migration scripts                                   | Migrating Firestore data                       |
| `accessibility-audit` | WCAG accessibility audits                                  | Auditing components for a11y                   |

**Invoking Skills:**
- User: `/skill-name` (e.g., `/server-actions`)
- Agent: Listed in agent's `skills` array in frontmatter