import { describe, expect, test } from "bun:test";
import {
  defaultTestValues,
  TestValueKey,
  TestValue,
} from "@/tests/test.defaults";
import { transformObject } from "@/functions";

const testObjectTransformer = (
  label: string,
  itemTransformer: (value: TestValue, key: TestValueKey) => unknown
) => {
  test(label, () => {
    const transformed = transformObject(defaultTestValues, itemTransformer);
    for (const key in defaultTestValues) {
      // makes ts happy, not sure why
      const defaultKey = key as TestValueKey;
      const transformedKey = key as keyof typeof transformed;
      expect(transformed[transformedKey]).toBe(
        itemTransformer(defaultTestValues[key as TestValueKey], defaultKey)
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
