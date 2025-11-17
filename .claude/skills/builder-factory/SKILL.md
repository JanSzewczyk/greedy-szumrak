---
name: builder-factory
version: 1.0.0
description: Generate Fishery factory builders for TypeScript types to create mock data for tests and Storybook
tags: [testing, factories, mock-data, fishery, faker, typescript]
author: Szum Tech Team
examples:
  - Create a factory for User type
  - Generate factory for my Budget model
  - Build a factory for the Onboarding type with all relationships
  - Create factories for Product and Order types
---

# Builder Factory Generator

Generate Fishery factory builders for TypeScript types to create mock data for tests and Storybook stories.

## Context

This skill helps you create factories using Fishery and @faker-js/faker/locale/pl for generating realistic
Polish-localized mock data. Factories are used for:

- Unit tests (Vitest)
- Storybook stories
- E2E test data
- Development seeding

## Instructions

When the user provides a TypeScript type/interface or asks to create a factory for a model:

1. **Analyze the Type Structure**
   - Identify all fields, their types, and relationships
   - Check for nested types, arrays, optional fields
   - Look for Date fields, enum types, and union types
   - Identify any relationships to other models

2. **Determine Factory Location**
   - For feature-specific types: `features/[feature-name]/test/factories/`
   - For shared types: `tests/factories/`
   - Create directory if it doesn't exist

3. **Generate Factory Code**

   Follow this template structure:

   ```typescript
   import { Factory } from "fishery";
   import { faker } from "@faker-js/faker/locale/pl";

   // Import the type definition
   import type { YourType } from "~/features/[feature]/types/your-type";

   // Import any related factories for associations
   import { relatedFactory } from "./related.factory";

   /**
    * Factory for generating YourType test data.
    *
    * @example
    * // Basic usage
    * const item = yourTypeFactory.build();
    *
    * @example
    * // Override specific fields
    * const customItem = yourTypeFactory.build({
    *   fieldName: "custom value"
    * });
    *
    * @example
    * // Generate multiple items
    * const items = yourTypeFactory.buildList(5);
    */
   export const yourTypeFactory = Factory.define<YourType>(({ sequence, associations }) => ({
     // Fields here - use appropriate Faker methods
     id: faker.string.uuid(),
     name: faker.person.fullName()
     // ... other fields
   }));
   ```

4. **Field Mapping Guidelines**

   Use appropriate Faker methods for each field type:

   **Identifiers:**
   - `id: faker.string.uuid()`
   - `slug: faker.helpers.slugify(faker.lorem.words(3))`

   **Personal Data:**
   - `firstName: faker.person.firstName()`
   - `lastName: faker.person.lastName()`
   - `email: faker.internet.email()`
   - `phone: faker.phone.number()`
   - `avatar: faker.image.avatar()`

   **Addresses:**
   - `street: faker.location.streetAddress()`
   - `city: faker.location.city()`
   - `zipCode: faker.location.zipCode()`
   - `country: "Polska"` (or `faker.location.country()`)

   **Commerce:**
   - `productName: faker.commerce.productName()`
   - `price: parseFloat(faker.commerce.price({ min: 10, max: 1000 }))`
   - `currency: "PLN"`
   - `category: faker.commerce.department()`

   **Text Content:**
   - `title: faker.lorem.sentence()`
   - `description: faker.lorem.paragraph()`
   - `text: faker.lorem.text()`

   **Numbers:**
   - `amount: faker.number.float({ min: 0, max: 1000, fractionDigits: 2 })`
   - `count: faker.number.int({ min: 0, max: 100 })`
   - `percentage: faker.number.int({ min: 0, max: 100 })`

   **Dates:**
   - `createdAt: faker.date.past()`
   - `updatedAt: faker.date.recent()`
   - `scheduledAt: faker.date.future()`
   - `birthDate: faker.date.birthdate({ min: 18, max: 65, mode: 'age' })`

   **Booleans:**
   - `isActive: faker.datatype.boolean()`
   - `isPredefined: true` (for specific defaults)

   **Enums/Unions:**
   - `status: faker.helpers.arrayElement(["active", "inactive", "pending"])`
   - `role: faker.helpers.arrayElement(["admin", "user", "guest"] as const)`

   **Arrays:**
   - `tags: faker.helpers.arrayElements(["tag1", "tag2", "tag3"], { min: 1, max: 3 })`
   - `items: Array.from({ length: 3 }, () => itemFactory.build())`
   - `images: Array.from({ length: 3 }, () => faker.image.url())`

   **Objects/Relations:**
   - `address: associations.address ?? addressFactory.build()`
   - `author: associations.author` (optional)

5. **Handle Complex Patterns**

   **Traits** (for variants):

   ```typescript
   export const userFactory = Factory.define<User>(() => ({
     // base fields
   })).traits({
     admin: {
       role: "admin",
       permissions: ["read", "write", "delete"]
     },
     inactive: {
       isActive: false
     }
   });

   // Usage: userFactory.build({}, { traits: ["admin"] })
   ```

   **Transient Params** (helper parameters):

   ```typescript
   export const userFactory = Factory.define<User, { premium?: boolean }>(({ transientParams }) => ({
     id: faker.string.uuid(),
     role: transientParams.premium ? "admin" : "user"
     // ...
   }));

   // Usage: userFactory.build({}, { transient: { premium: true } })
   ```

   **Associations** (relationships):

   ```typescript
   export const orderFactory = Factory.define<Order>(({ associations }) => {
     const products = associations.products ?? productFactory.buildList(3);
     const totalAmount = products.reduce((sum, p) => sum + p.price, 0);

     return {
       id: faker.string.uuid(),
       userId: associations.userId ?? faker.string.uuid(),
       products,
       totalAmount
       // ...
     };
   });
   ```

6. **Create Test Examples**

   Always include usage examples in comments or a separate test file:

   ```typescript
   /**
    * @example
    * // Basic usage
    * const user = userFactory.build();
    *
    * @example
    * // Override fields
    * const admin = userFactory.build({ role: "admin" });
    *
    * @example
    * // Multiple instances
    * const users = userFactory.buildList(10);
    *
    * @example
    * // With associations
    * const userWithAddress = userFactory.build({
    *   address: addressFactory.build({ city: "Warszawa" })
    * });
    */
   ```

7. **Export Pattern**

   ```typescript
   // Individual export (preferred)
   export const yourTypeFactory = Factory.define<YourType>(...);

   // Or grouped export for multiple related factories
   export const factories = {
     user: userFactory,
     address: addressFactory,
     order: orderFactory
   };
   ```

8. **Integration with Project Patterns**

   For types that match Firebase patterns (see CLAUDE.md):
   - Use `*Base` type for factory (without `id`, `createdAt`, `updatedAt`)
   - Add timestamps in factory: `createdAt: faker.date.past(), updatedAt: faker.date.recent()`
   - Export separate factories if needed for different type variants

   ```typescript
   import type { OnboardingBase } from "~/features/onboarding/types/onboarding";

   export const onboardingFactory = Factory.define<OnboardingBase>(() => ({
     completed: false,
     currentStep: OnboardingSteps.PREFERENCES,
     products: productsFactory.build()
   }));

   // For application use (with id and dates)
   export const onboardingWithMetaFactory = Factory.define<Onboarding>(() => ({
     id: faker.string.uuid(),
     ...onboardingFactory.build(),
     createdAt: faker.date.past(),
     updatedAt: faker.date.recent()
   }));
   ```

## Workflow

1. User provides a TypeScript type or asks to create a factory
2. Analyze the type structure and dependencies
3. Check if related factories already exist
4. Create factory file in appropriate location
5. Generate factory code with proper Faker methods
6. Add JSDoc comments with usage examples
7. Export factory for use in tests

## Important Notes

- Always use `@faker-js/faker/locale/pl` for Polish localization
- Follow project's test structure: `features/*/test/factories/` or `tests/factories/`
- Use realistic data that matches production patterns
- Include JSDoc comments with examples
- Consider creating helper seed functions for common test scenarios
- Ensure factories are type-safe and match TypeScript definitions exactly
- Use `sequence` parameter from Fishery for unique sequential values if needed
- Use `associations` parameter for related entities

## Common Patterns

**Percentage/Allocation Fields:**

```typescript
allocation: faker.number.int({ min: 0, max: 100 });
```

**Currency Amounts:**

```typescript
amount: faker.number.float({ min: 0, max: 10000, fractionDigits: 2 });
```

**Icons (from project's design system):**

```typescript
icon: faker.helpers.arrayElement(["home", "car", "food", "health", "education"]);
```

**Colors (Tailwind classes):**

```typescript
color: faker.helpers.arrayElement(["red", "blue", "green", "yellow", "purple"]);
```

**Unique Emails (using sequence):**

```typescript
export const userFactory = Factory.define<User>(({ sequence }) => ({
  email: `user${sequence}@example.com`
  // ...
}));
```

## Expected Output

For each factory creation:

1. Factory file in correct location
2. Type-safe factory with Fishery
3. Realistic Faker data generation
4. Usage examples in comments
5. Exports for easy importing

Ask clarifying questions if:

- Type structure is ambiguous
- Need to know specific business rules for data generation
- Unclear whether to create traits or transient params
- Multiple possible locations for the factory file
