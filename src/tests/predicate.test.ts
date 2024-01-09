import * as predicates from "../functions/predicate.functions";
import { describe, expect, test } from "bun:test";
import { Predicate } from "@/types";
import { defaultTestValues, TestValueKey } from "@/tests/test.defaults";

/**
 * Generates a test suite for a given predicate function.
 *
 * @param {keyof typeof predicates} name - The name of the predicate function to test.
 * @param {TestValueKey | TestValueKey[]} truthy - The key(s) of the test values that should return true.
 */
const testPredicate = (name: keyof typeof predicates, truthy: TestValueKey | TestValueKey[]) => {
  const fn = predicates[name] as Predicate<unknown>;
  const truthyKeys = Array.isArray(truthy) ? truthy : [truthy];
  const falsyKeys = Object.keys(defaultTestValues).filter((key: TestValueKey) => !truthyKeys.includes(key));
  describe(name, () => {
    truthyKeys.forEach((falsy) => {
      test(`returns true for ${falsy}`, () => {
        expect(fn(defaultTestValues[falsy])).toBeTrue();
      })
    })

    falsyKeys.forEach((falsy) => {
      test(`returns false for ${falsy}`, () => {
        expect(fn(defaultTestValues[falsy])).toBeFalse();
      })
    })
  })
}

describe("predicates", () => {
  testPredicate("isNumber", "number")
  testPredicate("isString", "string")
  testPredicate("isBoolean", ["true", "false"])
  testPredicate("isObject", ["object", "array"])
  testPredicate("isArray", "array");
  testPredicate("isNull", "null")
  testPredicate("isUndefined", "undefined")
  testPredicate("isNullish", ["null", "undefined"])
})