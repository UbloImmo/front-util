import * as predicates from "../functions/predicate.functions";
import { describe, expect, test } from "bun:test";
import { defaultTestValues, TestValueKey } from "./test.defaults";
import { NullishPrimitives, Predicate } from "../types";

/**
 * Generates a test suite for a given predicate function.
 *
 * @param {keyof typeof predicates} name - The name of the predicate function to test.
 * @param {TestValueKey | TestValueKey[]} truthy - The key(s) of the test values that should return true.
 */
const testPredicate = (
  name: keyof typeof predicates,
  truthy: TestValueKey | TestValueKey[]
) => {
  const fn = predicates[name] as Predicate<NullishPrimitives>;
  const truthyKeys = Array.isArray(truthy) ? truthy : [truthy];
  const falsyKeys = Object.keys(defaultTestValues).filter(
    (key) => !truthyKeys.includes(key as TestValueKey)
  ) as TestValueKey[];
  describe(name, () => {
    truthyKeys.forEach((key: TestValueKey) => {
      test(`returns true for ${key}`, () => {
        expect(fn(defaultTestValues[key])).toBeTrue();
      });
    });

    falsyKeys.forEach((key: TestValueKey) => {
      test(`returns false for ${key}`, () => {
        expect(fn(defaultTestValues[key])).toBeFalse();
      });
    });
  });
};

describe("predicates", () => {
  testPredicate("isNumber", "number");
  testPredicate("isString", "string");
  testPredicate("isBoolean", ["true", "false"]);
  testPredicate("isObject", ["object", "array"]);
  testPredicate("isArray", "array");
  testPredicate("isNull", "null");
  testPredicate("isUndefined", "undefined");
  testPredicate("isNullish", ["null", "undefined"]);
});
