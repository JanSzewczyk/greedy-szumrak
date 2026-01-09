---
name: builder-factory
version: 3.0.0
description: Generate test-data-bot factory builders for TypeScript types to create mock data for tests and Storybook. Use when creating mock data, test fixtures, or Storybook story data.
tags: [testing, factories, mock-data, test-data-bot, faker, typescript]
author: Szum Tech Team
allowed-tools: Read, Write, Edit, Glob, Grep
user-invocable: true
examples:
  - Create a builder for User type
  - Generate builder for my Budget model
  - Build a builder for the Onboarding type with all relationships
  - Create builders for Product and Order types
---

# Builder Factory Generator

Generate test-data-bot factory builders for TypeScript types.

> **Reference Files:**
> - `field-mappings.md` - Field type to Faker method mappings
> - `examples.md` - Complete builder examples and patterns

## Context

Builders using `@jackfranklin/test-data-bot` and `@faker-js/faker/locale/pl` for:
- Unit tests (Vitest)
- Storybook stories
- E2E test data
- Development seeding

## Workflow

### 1. Pre-Check: Find Existing Builders

**IMPORTANT: Search for existing builders before creating new ones.**

```bash
find . -name "*.builder.ts" -type f
ls features/*/test/builders/ 2>/dev/null
```

### 2. Analyze the Type Structure

- Identify all fields, types, and relationships
- Check for nested types, arrays, optional fields
- Look for Date fields, enum types, union types

### 3. Builder Location

- Feature-specific: `features/[feature-name]/test/builders/`
- Shared types: `tests/builders/`

### 4. Naming Convention

**Builder name = camelCase(TypeName) + "Builder"**

```typescript
// Type: OnboardingProducts
export const onboardingProductsBuilder = build<OnboardingProducts>({...});
// File: onboarding-products.builder.ts

// Type: BudgetTemplate
export const budgetTemplateBuilder = build<BudgetTemplate>({...});
// File: budget-template.builder.ts
```

## Basic Template

```typescript
import { build, sequence, perBuild } from "@jackfranklin/test-data-bot";
import { faker } from "@faker-js/faker/locale/pl";
import type { YourType } from "~/features/[feature]/types/your-type";

/**
 * Builder for YourType test data.
 *
 * @example
 * const item = yourTypeBuilder.one();
 *
 * @example
 * const customItem = yourTypeBuilder.one({
 *   overrides: { fieldName: "custom value" }
 * });
 *
 * @example
 * const items = Array.from({ length: 5 }, () => yourTypeBuilder.one());
 */
export const yourTypeBuilder = build<YourType>({
  fields: {
    id: sequence(),
    name: perBuild(() => faker.person.fullName()),
    email: perBuild(() => faker.internet.email()),
    status: "active"
  }
});
```

## Key Methods

- `sequence()` - Auto-incremented number (1, 2, 3...)
- `sequence((n) => \`prefix-\${n}\`)` - Custom sequence
- `perBuild(() => ...)` - Fresh value each time
- Static values don't need wrapper

## Traits (Variants)

```typescript
export const userBuilder = build<User>({
  fields: {
    id: sequence(),
    role: "user",
    isActive: true
  },
  traits: {
    admin: {
      overrides: { role: "admin" }
    },
    inactive: {
      overrides: { isActive: false }
    }
  }
});

// Usage
userBuilder.one({ traits: ["admin"] })
userBuilder.one({ traits: ["admin", "inactive"] })
```

## postBuild Hook

```typescript
export const orderBuilder = build<Order>({
  fields: {
    products: perBuild(() => Array.from({ length: 3 }, () => productBuilder.one())),
    totalAmount: 0
  },
  postBuild: (order) => {
    order.totalAmount = order.products.reduce((sum, p) => sum + p.price, 0);
    return order;
  }
});
```

## Nested Builders

```typescript
export const userBuilder = build<User>({
  fields: {
    id: sequence(),
    address: perBuild(() => addressBuilder.one())
  }
});
```

## Firebase Types Pattern

```typescript
// Base type builder (without id, timestamps)
export const onboardingBaseBuilder = build<OnboardingBase>({...});

// Application type builder (with id, timestamps)
export const onboardingBuilder = build<Onboarding>({
  fields: {
    id: perBuild(() => faker.string.uuid()),
    // ... business fields
    createdAt: perBuild(() => faker.date.past()),
    updatedAt: perBuild(() => faker.date.recent())
  }
});
```

## Important Notes

- Always use `@jackfranklin/test-data-bot` (NOT Fishery)
- Always use `@faker-js/faker/locale/pl` for Polish localization
- Use `sequence()` for IDs
- Use `perBuild()` for values that should be fresh each time
- Static values don't need `perBuild()` wrapper
- Include JSDoc with usage examples
