import { describe, expect, it } from "bun:test";
import {
  defaultTestValues,
  TestValueKey,
  TestValue,
  TestObject,
} from "./test.defaults";
import {
  arrayFilter,
  capitalize,
  deepTransformObject,
  isFunction,
  objectKeys,
  objectValues,
  transformObject,
  type NoItemTransformer,
} from "../functions";
import {
  GenericFn,
  type Assume,
  type ItemTransformerHKT,
  type KeyTransformerHKT,
} from "../types";

const testObjectTransformer = (
  label: string,
  itemTransformer: (value: TestValue) => unknown,
  keyTransformer?: (key: TestValueKey) => string
) => {
  it(label, () => {
    const transformed = transformObject(
      defaultTestValues,
      itemTransformer,
      keyTransformer
    );
    for (const key in defaultTestValues) {
      // makes ts happy, not sure why
      const transformedKey = (
        isFunction(keyTransformer) ? keyTransformer(key as TestValueKey) : key
      ) as keyof typeof transformed;
      expect(transformed[transformedKey]).toBe(
        itemTransformer(defaultTestValues[key as TestValueKey])
      );
    }
  });
};

describe("object functions", () => {
  describe("transformObject", () => {
    testObjectTransformer("to string", String);
    testObjectTransformer("to json string", (value) => JSON.stringify(value));
    testObjectTransformer("to boolean", (value) => !!value);
    testObjectTransformer(
      "change key",
      (value) => value,
      (key) => `${key}Key`
    );
  });

  describe("objectKeys", () => {
    it("should match Object.keys()", () => {
      expect(objectKeys(defaultTestValues)).toEqual(
        Object.keys(defaultTestValues)
      );
    });
  });

  describe("objectValues", () => {
    it("should match Object.values()", () => {
      expect(objectValues(defaultTestValues)).toEqual(
        Object.values(defaultTestValues)
      );
    });
  });

  describe("arrayFilter", () => {
    it("should match Array.filter()", () => {
      // create randomly sorted array for default test values and null
      const array = [
        ...new Array(50).fill({ ...defaultTestValues }),
        ...new Array(50).fill(null),
      ].sort(() => Math.round(Math.random() * 2) - 1);
      // define bullshit sort function
      const filterFn: GenericFn<[TestObject, number, TestObject[]], boolean> = (
        item,
        index,
        array
      ) => (!!item && index > 30) || index * array.length < 452;
      // compare arrayFilter against origin fn
      expect(arrayFilter(array, filterFn)).toEqual([...array].filter(filterFn));
    });
  });

  describe("deepTransformObject", () => {
    interface ItemTransformer extends ItemTransformerHKT {
      new: (value: Assume<this["_1"], unknown>) => null;
    }
    it("should transform an object's values to null", () => {
      const transformed = deepTransformObject<
        typeof defaultTestValues,
        ItemTransformer,
        KeyTransformerHKT,
        true
      >(
        defaultTestValues,
        () => null,
        (value) => value,
        true
      );
      expect(transformed).toEqual(
        transformObject(defaultTestValues, () => null)
      );
    });

    it("should preserve nested objects by default", () => {
      const transformed = deepTransformObject<
        typeof defaultTestValues,
        ItemTransformer
      >(defaultTestValues, () => null);

      expect(transformed).toEqual({
        ...transformObject(defaultTestValues, () => null),
        object: {
          key: null,
        },
      });
    });

    it("should transform an object's keys", () => {
      interface KeyTransformer extends KeyTransformerHKT {
        new: (
          key: Assume<this["_1"], string>
        ) => `key${Capitalize<typeof key>}`;
      }
      const transformed = deepTransformObject<
        typeof defaultTestValues,
        NoItemTransformer,
        KeyTransformer
      >(
        defaultTestValues,
        (value) => value,
        (key): `key${Capitalize<typeof key>}` => `key${capitalize(key)}`
      );
      expect(transformed).toEqual({
        keyString: defaultTestValues.string,
        keyNumber: defaultTestValues.number,
        keyInt: defaultTestValues.int,
        keyFloat: defaultTestValues.float,
        keyTrue: defaultTestValues.true,
        keyFalse: defaultTestValues.false,
        keyNull: defaultTestValues.null,
        keyUndefined: defaultTestValues.undefined,
        keyArray: defaultTestValues.array,
        keyObject: {
          keyKey: defaultTestValues.object.key,
        },
      });
    });
  });
});
