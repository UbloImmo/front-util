import { describe, expect, test } from "bun:test";
import {
  defaultTestValues,
  TestValueKey,
  TestValues,
} from "@/tests/test.defaults";
import { transformObject } from "@/functions";

type ItemTransformer = Parameters<
  typeof transformObject<TestValueKey, TestValues[TestValueKey]>
>[1];

const testObjectTransformer = (
  label: string,
  itemTransformer: ItemTransformer
) => {
  test(label, () => {
    const transformed = transformObject(defaultTestValues, itemTransformer);
    for (const key in defaultTestValues) {
      expect(transformed[key]).toBe(
        itemTransformer(defaultTestValues[key], key)
      );
    }
  });
};

describe("object functions", () => {
  describe("transformObject", () => {
    testObjectTransformer("to string", String);
    testObjectTransformer("to json string", (value) => JSON.stringify(value));
  });
});
