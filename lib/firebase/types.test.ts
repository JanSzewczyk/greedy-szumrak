import { type FieldValue, type Timestamp } from "firebase-admin/firestore";

import { type CreateDto, type UpdateDto, type WithDates, type WithFirestoreTimestamps } from "./types";

describe("Firebase Type Utilities", () => {
  describe("WithDates", () => {
    test("should add id, createdAt, and updatedAt as Date", () => {
      type UserBase = {
        name: string;
        email: string;
      };

      type User = WithDates<UserBase>;

      // Test that User has all required properties
      expectTypeOf<User>().toHaveProperty("id");
      expectTypeOf<User>().toHaveProperty("name");
      expectTypeOf<User>().toHaveProperty("email");
      expectTypeOf<User>().toHaveProperty("createdAt");
      expectTypeOf<User>().toHaveProperty("updatedAt");

      // Test property types
      expectTypeOf<User["id"]>().toBeString();
      expectTypeOf<User["name"]>().toBeString();
      expectTypeOf<User["email"]>().toBeString();
      expectTypeOf<User["createdAt"]>().toEqualTypeOf<Date>();
      expectTypeOf<User["updatedAt"]>().toEqualTypeOf<Date>();
    });

    test("should preserve custom Date fields", () => {
      type EventBase = {
        title: string;
        scheduledAt: Date;
        expiresAt?: Date;
      };

      type Event = WithDates<EventBase>;

      expectTypeOf<Event>().toExtend<{
        id: string;
        title: string;
        scheduledAt: Date;
        expiresAt?: Date;
        createdAt: Date;
        updatedAt: Date;
      }>();

      // Verify it has all required fields
      expectTypeOf<Event>().toHaveProperty("id");
      expectTypeOf<Event>().toHaveProperty("title");
      expectTypeOf<Event>().toHaveProperty("scheduledAt");
      expectTypeOf<Event>().toHaveProperty("createdAt");
      expectTypeOf<Event>().toHaveProperty("updatedAt");
    });
  });

  describe("WithFirestoreTimestamps", () => {
    test("should convert Date fields to Timestamp", () => {
      type EventBase = {
        title: string;
        scheduledAt: Date;
        expiresAt?: Date;
      };

      type EventFirestore = WithFirestoreTimestamps<EventBase>;

      expectTypeOf<EventFirestore>().toExtend<{
        title: string;
        scheduledAt: Timestamp;
        expiresAt?: Timestamp;
        createdAt: Timestamp;
        updatedAt: Timestamp;
      }>();
    });

    test("should handle nested objects with Date fields", () => {
      type PostBase = {
        title: string;
        metadata: {
          publishedAt: Date;
          lastEditedAt?: Date;
        };
      };

      type PostFirestore = WithFirestoreTimestamps<PostBase>;

      expectTypeOf<PostFirestore>().toExtend<{
        title: string;
        metadata: {
          publishedAt: Timestamp;
          lastEditedAt?: Timestamp;
        };
        createdAt: Timestamp;
        updatedAt: Timestamp;
      }>();
    });
  });

  describe("CreateDto", () => {
    test("should convert Date fields to FieldValue", () => {
      type EventBase = {
        title: string;
        scheduledAt: Date;
        expiresAt?: Date;
      };

      type CreateEventDto = CreateDto<EventBase>;

      expectTypeOf<CreateEventDto>().toExtend<{
        title: string;
        scheduledAt: FieldValue;
        expiresAt?: FieldValue;
        createdAt: FieldValue;
        updatedAt: FieldValue;
      }>();
    });

    test("should handle complex types with nullable dates", () => {
      type SubscriptionBase = {
        userId: string;
        startsAt: Date;
        endsAt: Date | null;
        canceledAt?: Date | null;
      };

      type CreateSubscriptionDto = CreateDto<SubscriptionBase>;

      expectTypeOf<CreateSubscriptionDto>().toExtend<{
        userId: string;
        startsAt: FieldValue;
        endsAt: FieldValue | null;
        canceledAt?: FieldValue | null;
        createdAt: FieldValue;
        updatedAt: FieldValue;
      }>();
    });
  });

  describe("UpdateDto", () => {
    test("should make all fields optional and convert Dates to FieldValue", () => {
      type EventBase = {
        title: string;
        scheduledAt: Date;
        expiresAt?: Date;
      };

      type UpdateEventDto = UpdateDto<EventBase>;

      expectTypeOf<UpdateEventDto>().toExtend<{
        title?: string;
        scheduledAt?: FieldValue;
        expiresAt?: FieldValue;
      }>();
    });

    test("should handle nested objects", () => {
      type PostBase = {
        title: string;
        metadata: {
          publishedAt: Date;
          views: number;
        };
      };

      type UpdatePostDto = UpdateDto<PostBase>;

      expectTypeOf<UpdatePostDto>().toExtend<{
        title?: string;
        metadata?: {
          publishedAt: FieldValue;
          views: number;
        };
      }>();
    });
  });
});
