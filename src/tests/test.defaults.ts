import { NullishPrimitives } from "@/types";

/**
 * Primitive test values to use in test files
 */
export const defaultTestValues = {
  string: "hello world",
  number: 78946,
  true: true,
  false: false,
  null: null,
  undefined: undefined,
  array: [],
  object: {
    key: "object value"
  }
} as const;

export type TestValueKey = keyof typeof defaultTestValues;