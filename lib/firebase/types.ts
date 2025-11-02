import { type FieldValue, type Timestamp } from "firebase-admin/firestore";

/**
 * Converts all Date fields in T to Timestamp (Firestore native type)
 */
type ConvertDatesToTimestamps<T> = {
  [K in keyof T]: T[K] extends Date
    ? Timestamp
    : T[K] extends Date | undefined
      ? Timestamp | undefined
      : T[K] extends Date | null
        ? Timestamp | null
        : T[K] extends Date | null | undefined
          ? Timestamp | null | undefined
          : T[K] extends object
            ? ConvertDatesToTimestamps<T[K]>
            : T[K];
};

/**
 * Converts all Date fields in T to FieldValue (for creating/updating documents)
 */
type ConvertDatesToFieldValues<T> = {
  [K in keyof T]: T[K] extends Date
    ? FieldValue
    : T[K] extends Date | undefined
      ? FieldValue | undefined
      : T[K] extends Date | null
        ? FieldValue | null
        : T[K] extends Date | null | undefined
          ? FieldValue | null | undefined
          : T[K] extends object
            ? ConvertDatesToFieldValues<T[K]>
            : T[K];
};

/**
 * Generic type for data with Firebase timestamps
 * Use this for data that comes directly from Firestore
 * All Date fields are automatically converted to Timestamp
 */
export type WithFirestoreTimestamps<T> = ConvertDatesToTimestamps<T> & {
  updatedAt: Timestamp;
  createdAt: Timestamp;
};

/**
 * Generic type for data with JavaScript Date objects (application layer)
 * Use this for data after transforming Firestore data
 */
export type WithDates<T> = T & {
  id: string;
  updatedAt: Date;
  createdAt: Date;
};

/**
 * Generic type for creating new documents
 * Uses FieldValue.serverTimestamp() for automatic timestamp generation
 * All Date fields are automatically converted to FieldValue
 */
export type CreateDto<T> = ConvertDatesToFieldValues<T> & {
  updatedAt: FieldValue;
  createdAt: FieldValue;
};

/**
 * Generic type for updating existing documents
 * Makes all fields optional, updatedAt is added automatically by update functions
 * All Date fields are automatically converted to FieldValue
 */
export type UpdateDto<T> = Partial<ConvertDatesToFieldValues<T>>;
