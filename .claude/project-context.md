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

> **Full documentation**: See `.claude/skills/firebase-firestore/` skill for complete patterns, types, error handling, and seeding.

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
  if (!id?.trim()) {
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

**Related Skills:**
- `firebase-firestore` - Complete database patterns, types, error handling, seeding
- `db-migration` - Database migration scripts

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

## React 19 Patterns

> **Full documentation**: See `.claude/skills/react-19-compiler/` skill for complete patterns.

### React Compiler

The project has React Compiler enabled in `next.config.ts`:
- **Remove unnecessary memoization** - Compiler handles `useMemo`, `useCallback`, `React.memo`
- **Keep memoization only for** - External library callbacks, complex context values, >100ms computations

### Form Handling with useActionState

```typescript
"use client";
import { useActionState } from "react";

function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitForm, null);

  return (
    <form action={formAction}>
      <input name="email" type="email" />
      <SubmitButton />
      {state?.error && <p>{state.error}</p>}
    </form>
  );
}

// useFormStatus MUST be in child component
function SubmitButton() {
  const { pending } = useFormStatus();
  return <button disabled={pending}>{pending ? "Sending..." : "Send"}</button>;
}
```

**Related Skills:**
- `react-19-compiler` - Complete React 19 patterns, hooks, Server/Client Components

## Form Pattern

- Use React Hook Form for complex forms, useActionState for simple forms
- Use Zod schemas for validation
- Use ActionResponse pattern for server actions
- Use toast notifications for user feedback
- See `server-actions` skill for React Hook Form + Server Actions integration

## Test Data Pattern

- Use `@jackfranklin/test-data-bot` for builders
- Use `@faker-js/faker/locale/pl` for Polish localization
- Builder location: `features/[feature]/test/builders/`

## Common Pitfalls

These are frequent mistakes to avoid when working with this stack:

### Authentication (Clerk)

> **Full documentation**: See `.claude/skills/clerk-auth-proxy/` skill for complete patterns.

❌ **Don't:** Use `middleware.ts` for Clerk auth in Next.js 16
```typescript
// ❌ WRONG - middleware.ts doesn't work with Clerk in Next.js 16
export default clerkMiddleware();
```

✅ **Do:** Use `proxy.ts` instead
```typescript
// ✅ CORRECT - proxy.ts is the Next.js 16 way
import { clerkProxy } from "@clerk/nextjs/server";
export default clerkProxy();
```

**Related Skills:**
- `clerk-auth-proxy` - Proxy patterns, session claims, onboarding gates, testing

### Database Types

❌ **Don't:** Return raw Firestore Timestamp to client components
```typescript
// ❌ WRONG
return { createdAt: firestoreDoc.createdAt }; // Timestamp object
```

✅ **Do:** Transform to Date using transform functions
```typescript
// ✅ CORRECT
return {
  createdAt: firestoreDoc.createdAt?.toDate()
};
```

### Server Actions

❌ **Don't:** Forget to check authentication
```typescript
// ❌ WRONG - No auth check
export async function updateProfile(data: ProfileData) {
  await db.update(data);
}
```

✅ **Do:** Always verify authentication first
```typescript
// ✅ CORRECT
export async function updateProfile(data: ProfileData): ActionResponse {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Unauthorized" };
  }
  // ... rest of logic
}
```

❌ **Don't:** Use inconsistent return types
```typescript
// ❌ WRONG - Throwing errors in server actions
export async function createUser(data: UserData) {
  if (!data.email) throw new Error("Email required");
  return user;
}
```

✅ **Do:** Use standardized ActionResponse pattern
```typescript
// ✅ CORRECT
export async function createUser(data: UserData): ActionResponse<User> {
  if (!data.email) {
    return { success: false, error: "Email required" };
  }
  return { success: true, data: user };
}
```

### Error Handling

❌ **Don't:** Expose internal error details to client
```typescript
// ❌ WRONG
catch (error) {
  return { success: false, error: error.message }; // Could leak sensitive info
}
```

✅ **Do:** Use categorized errors and log internally
```typescript
// ✅ CORRECT
catch (error) {
  const dbError = categorizeDbError(error, "User");
  logger.error({ errorCode: dbError.code, userId }, "Operation failed");
  return { success: false, error: "Unable to complete operation" };
}
```

### Imports

❌ **Don't:** Use relative imports for project files
```typescript
// ❌ WRONG
import { db } from "../../../lib/firebase";
```

✅ **Do:** Use path aliases
```typescript
// ✅ CORRECT
import { db } from "~/lib/firebase";
```

### React Components

> **Full documentation**: See `.claude/skills/react-19-compiler/` skill for complete patterns.

❌ **Don't:** Add 'use client' unnecessarily
```typescript
// ❌ WRONG - No interactivity needed
'use client'
export function UserProfile({ user }) {
  return <div>{user.name}</div>;
}
```

✅ **Do:** Default to Server Components
```typescript
// ✅ CORRECT - Server Component by default
export function UserProfile({ user }) {
  return <div>{user.name}</div>;
}
```

❌ **Don't:** Use unnecessary memoization with React Compiler
```typescript
// ❌ WRONG - Compiler handles this automatically
const sorted = useMemo(() => items.sort(), [items]);
```

✅ **Do:** Let compiler optimize
```typescript
// ✅ CORRECT - Compiler handles memoization
const sorted = [...items].sort((a, b) => a.name.localeCompare(b.name));
```

**Related Skills:**
- `react-19-compiler` - Server/Client Components, hooks, memoization decisions

### Database Queries

❌ **Don't:** Return errors by throwing
```typescript
// ❌ WRONG
export async function getUserById(id: string) {
  if (!id) throw new Error("Invalid id");
  const user = await db.get(id);
  if (!user) throw new Error("Not found");
  return user;
}
```

✅ **Do:** Use tuple pattern for explicit error handling
```typescript
// ✅ CORRECT
export async function getUserById(
  id: string
): Promise<[null, User] | [DbError, null]> {
  if (!id) return [DbError.validation("Invalid id"), null];

  const doc = await db.get(id);
  if (!doc.exists) return [DbError.notFound("User"), null];

  return [null, transformToUser(doc)];
}
```

### Logging

❌ **Don't:** Use console.log in production code
```typescript
// ❌ WRONG
console.log("User created:", userId);
```

✅ **Do:** Use structured logging with Pino
```typescript
// ✅ CORRECT
logger.info({ userId, operation: "create" }, "User created");
```

## Available Skills

Skills provide detailed documentation and patterns. Located in `.claude/skills/`.

| Skill                 | Description                                                  | Use When                                       |
|-----------------------|--------------------------------------------------------------|------------------------------------------------|
| `clerk-auth-proxy`    | Clerk auth with Next.js 16 proxy pattern, session claims     | Authentication, onboarding gates, session claims |
| `react-19-compiler`   | React 19 hooks, React Compiler optimization guidance         | Forms with useActionState, memoization decisions |
| `server-actions`      | Server Actions patterns, types, validation, React integration | Creating/updating server actions, form handling |
| `firebase-firestore`  | Firebase Firestore queries, types, error handling, seeding   | Creating database queries, type definitions    |
| `api-test`            | API endpoint testing with Playwright                         | Testing route handlers, API endpoints          |
| `storybook-testing`   | Component testing with Storybook play functions              | Writing component interaction tests            |
| `builder-factory`     | Test data builders with test-data-bot                        | Creating mock data for tests/stories           |
| `db-migration`        | Database migration scripts                                   | Migrating Firestore data                       |
| `accessibility-audit` | WCAG accessibility audits                                    | Auditing components for a11y                   |
| `tailwind-css-4`      | Tailwind v4 CSS-first config, design system integration      | Styling components, responsive design, theming |
| `t3-env-validation`   | Type-safe env vars with @t3-oss/env-nextjs and Zod           | Environment configuration, validation          |
| `structured-logging`  | Pino logging with context enrichment and log levels          | Server-side logging, debugging, monitoring     |
| `toast-notifications` | Cookie-based toast system for server-to-client messaging     | User feedback after server actions, redirects  |
| `error-handling`      | DbError patterns, error boundaries, toast errors             | Error handling across all layers               |
| `performance-optimization` | Bundle analysis, React rendering, DB query optimization | Performance issues, slow pages, large bundles  |

**Invoking Skills:**
- User: `/skill-name` (e.g., `/server-actions`)
- Agent: Listed in agent's `skills` array in frontmatter