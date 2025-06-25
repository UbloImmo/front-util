import type {
  DeepValueOfLax,
  DeepKeyOf,
  KeyOf,
  DeepValueOf,
  Optional,
  Apply,
  DeepTransformKeys,
  DeepMap,
  ItemTransformerHKT,
  KeyTransformerHKT,
  Assume,
} from "../types";
import {
  isFunction,
  isObject,
  isString,
  isStringObject,
} from "./predicate.functions";

/**
 * Transforms an object by applying a given item transformer function to each value,
 * and an optional key transformer function to each key.
 *
 * @template {Record<string, unknown>} TObj
 * @param {TObj} object - The object to be transformed.
 * @param {function} itemTransformer - The function that transforms each item value.
 * @param {function} [keyTransformer] - The optional function that transforms each key.
 * @returns {object} - The transformed object.
 */
export const transformObject = <
  TObj extends Record<string, unknown>,
  TTransformedKey extends string = keyof TObj & string,
  TTransformedItem = TObj[keyof TObj & string]
>(
  object: TObj,
  itemTransformer: (
    item: TObj[keyof TObj & string],
    key: keyof TObj & string
  ) => TTransformedItem,
  keyTransformer?: (key: keyof TObj & string) => TTransformedKey
): typeof keyTransformer extends undefined
  ? {
      [Key in keyof TObj]: TTransformedItem;
    }
  : {
      [Key in TTransformedKey]: TTransformedItem;
    } => {
  if (keyTransformer) {
    return objectFromEntries(
      objectEntries(object).map(([key, value]) => [
        keyTransformer(key),
        itemTransformer(value, key),
      ])
    );
  }
  return objectFromEntries(
    objectEntries(object).map(([key, value]) => [
      key,
      itemTransformer(value, key),
    ])
  );
};

/**
 * Returns an array of key-value pairs for the given object.
 *
 * @template {Record<string, unknown>} TObj
 * @param {TObj & string} object - The object to get key-value pairs from.
 * @return {[keyof TObj, TObj[keyof TObj & string]][]} - An array of key-value pairs.
 */
export const objectEntries = <TObj extends Record<string, unknown>>(
  object: TObj
): [keyof TObj & string, TObj[keyof TObj & string]][] =>
  Object.entries(object) as [keyof TObj & string, TObj[keyof TObj & string]][];

/**
 * Creates an object from an array of key-value pairs.
 * @template TKey {string}
 * @template TValue {unknown}
 * @param {Array<[TKey, TValue]>} entries - The array of key-value pairs.
 * @return {{ [Key in TKey]: TValue }} - The resulting object.
 */
export const objectFromEntries = <TKey extends string, TValue>(
  entries: [TKey, TValue][]
): { [Key in TKey]: TValue } =>
  Object.fromEntries(entries) as { [Key in TKey]: TValue };

/**
 * Returns an array of all the keys in an object.
 *
 * @template {Record<string, unknown>} TObj
 * @param {TObj} object - The object from which to extract keys.
 * @return {(keyof TObj)[]} - An array of keys from the object.
 */
export const objectKeys = <TObj extends Record<string, unknown>>(
  object: TObj
): (keyof TObj)[] => Object.keys(object) as (keyof TObj)[];

/**
 * Returns an array containing the values of all enumerable properties of the given object.
 *
 * @template {Record<string, unknown>} TObj
 * @param {TObj} object - The object whose values will be returned.
 * @return {TObj[keyof TObj & string][]} - An array containing the values of the object's properties.
 */
export const objectValues = <TObj extends Record<string, unknown>>(
  object: TObj
): TObj[keyof TObj & string][] =>
  Object.values(object) as TObj[keyof TObj & string][];

/**
 * Filters an array based on a provided filter function.
 * @template {unknown[]} TArr
 * @param {TArr} array - The array to be filtered.
 * @param {function} filterFn - The filter function used to determine which elements to keep in the array.
 * @returns {Array} - The filtered array.
 */
export const arrayFilter = <TArr extends unknown[]>(
  array: TArr,
  filterFn: <TArrItem extends TArr[number]>(
    item: TArrItem,
    index: number,
    array: TArrItem[]
  ) => boolean
): {
  [Index in keyof TArr]: Index extends number
    ? ReturnType<typeof filterFn<TArr[Index]>> extends true
      ? TArr[Index]
      : never
    : TArr[Index];
} => {
  return [...array].filter(filterFn) as TArr as {
    [Index in keyof TArr]: Index extends number
      ? ReturnType<typeof filterFn<TArr[Index]>> extends true
        ? TArr[Index]
        : never
      : TArr[Index];
  };
};

function deepValueOfLax<TObject, TKey extends DeepKeyOf<TObject>>(
  object: TObject,
  key: TKey,
  safe?: boolean
): DeepValueOfLax<TObject, TKey>;

function deepValueOfLax<TObject, TKey extends DeepKeyOf<TObject>>(
  object: TObject,
  key: TKey,
  safe: true
): Optional<DeepValueOfLax<TObject, TKey>>;

/**
 * Retrieves the deep value of a nested property from an object or array.
 *
 * @remarks Use {@link deepValueOf} instead of this
 *
 * @template TObject - The type of the object.
 * @template TKey - The type of the key.
 * @param {TObject} object - The object to retrieve the deep value from.
 * @param {TKey} key - The key of the nested property.
 * @param {boolean} [safe=false] - Whether to return undefined if the key does not exist.
 * @returns {Optional<DeepValueOf<TObject, TKey>>} The deep value of the nested property, or undefined if the key does not exist and safe is true.
 *
 * @throws {TypeError} If the object is not an object or the nested key is not a string.
 * @throws {TypeError} If the nested key head does not exist in the object.
 */
function deepValueOfLax<TObject, TKey extends DeepKeyOf<TObject>>(
  object: TObject,
  key: TKey,
  safe?: boolean
) {
  // make sure object is an object
  if (!isObject(object)) {
    if (safe) return undefined;
    throw new TypeError("Object is not an object");
  }
  // handle direct indexes
  // Array["0"] works fine in js so it is also covered
  if (key in object)
    return object[key as KeyOf<TObject>] as DeepValueOfLax<TObject, TKey>;
  // abort if number indexes
  if (!isString(key)) {
    if (safe) return undefined;
    throw new TypeError(`Nested key (${key}) must be a string`);
  }
  // extract head and tail from dot notation
  const [head, ...tails] = key
    .trim()
    .split(".")
    .map((s) => s.trim());
  // abort if no head
  // make sure head is in object before proceeding
  if (!head || !(head in object)) {
    if (safe) return undefined;
    throw new TypeError(`Nested key head (${head}) does not exist in object`);
  }
  // return object[head] if no tails
  if (!tails.length) {
    return object[head as KeyOf<TObject>] as DeepValueOfLax<TObject, TKey>;
  }
  // get nested value
  const nestedOject = object[head as KeyOf<TObject>];
  // concatenate remaining tail parts
  const tail = tails.join(".") as DeepKeyOf<typeof nestedOject>;
  // both head and tail exist,
  // recursively get deeper value with tail as deep key of nested object
  return deepValueOfLax(nestedOject, tail, safe) as DeepValueOfLax<
    TObject,
    TKey
  >;
}

/**
 * Retrieves the deep value of a nested property from an object or array.
 *
 * @template TObject - The type of the object.
 * @template TKey - The type of the key.
 * @param {TObject} object - The object to retrieve the deep value from.
 * @param {TKey} key - The key of the nested property.
 * @param {boolean} [safe=false] - Whether to return undefined if the key does not exist.
 * @returns {Optional<DeepValueOf<TObject, TKey>>} The deep value of the nested property, or undefined if the key does not exist and safe is true.
 *
 */
export function deepValueOf<
  TObject extends object,
  TKey extends DeepKeyOf<TObject>
>(object: TObject, key: TKey, safe?: boolean): DeepValueOf<TObject, TKey>;

/**
 * Retrieves the deep value of a nested property from an object or array.
 *
 * @template TObject - The type of the object.
 * @template TKey - The type of the key.
 * @param {TObject} object - The object to retrieve the deep value from.
 * @param {TKey} key - The key of the nested property.
 * @param {boolean} [safe=false] - Whether to return undefined if the key does not exist.
 * @returns {Optional<DeepValueOf<TObject, TKey>>} The deep value of the nested property, or undefined if the key does not exist and safe is true.
 *
 */
export function deepValueOf<
  TObject extends object,
  TKey extends DeepKeyOf<TObject>
>(object: TObject, key: TKey, safe: true): Optional<DeepValueOf<TObject, TKey>>;

/**
 * Retrieves the deep value of a nested property from an object or array
 * by searching through it recursively using {@link deepValueOfLax}.
 *
 * @template TObject - The type of the object.
 * @template TKey - The type of the key.
 * @param {TObject} object - The object to retrieve the deep value from.
 * @param {TKey} key - The key of the nested property.
 * @param {boolean} [safe=false] - Whether to return undefined if the key does not exist.
 * @returns {Optional<DeepValueOf<TObject, TKey>>} The deep value of the nested property, or undefined if the key does not exist and safe is true.
 *
 * @throws if safe if false and key is not retrievable from object
 */
export function deepValueOf<
  TObject extends object,
  TKey extends DeepKeyOf<TObject>
>(object: TObject, key: TKey, safe?: boolean) {
  return deepValueOfLax(object, key, safe);
}

/**
 * A HKT that does not transform the item value
 */
export interface NoItemTransformer extends ItemTransformerHKT {
  new: (value: Assume<this["_1"], unknown>) => typeof value;
}

/**
 * A HKT that does not transform the key
 */
export interface NoKeyTransformer extends KeyTransformerHKT {
  new: (key: Assume<this["_1"], string>) => typeof key;
}

/**
 * Transforms an object by applying a given item transformer function to each value,
 * and an optional key transformer function to each key.
 *
 * @template TObj - The type of the object.
 * @template {ItemTransformerHKT} [TItemTransformer = NoItemTransformer] - The type of the item transformer function.
 * @template {KeyTransformerHKT} [TKeyTransformer = NoKeyTransformer] - The type of the key transformer function.
 * @param {TObj} object - The object to be transformed.
 * @param {TItemTransformer} itemTransformer - The function that transforms each item value.
 * @param {TKeyTransformer} keyTransformer - The optional function that transforms each key.
 * @param {boolean} [applyToNestedObjects=false] - Whether to apply the item transformation to nested objects. Key transformation always applies to nested objects.
 * @returns {DeepMap<DeepTransformKeys<TObj, TKeyTransformer>, TItemTransformer, TApplyToNestedObjects>} The transformed object.
 *
 * @example
 * const obj = {
 *   number: 2,
 *   string: "hello",
 *   obj: {
 *     array: [1, 2, 3],
 *   },
 * } as const;
 *
 * interface ItemTransformer extends ItemTransformerHKT {
 *   new: (value: Assume<this["_1"], unknown>) => {
 *     raw: typeof value;
 *     wrapped: [typeof value];
 *   };
 * }
 *
 * interface KeyTransformer extends KeyTransformerHKT {
 *   new: (key: Assume<this["_1"], string>) => `key${typeof key}`;
 * }
 *
 * const transformed = deepTransformObject<
 *   typeof obj,
 *   ItemTransformer,
 *   KeyTransformer
 * >(
 *   obj,
 *   (value) => ({ raw: value, wrapped: [value] }),
 *   (key) => `key${key}`,
 *   false
 * );
 * console.log(transformed.keyobj.keyarray) // { raw: [1, 2, 3], wrapped: [ [1, 2, 3] ] }
 */
export function deepTransformObject<
  TObj extends Record<string, unknown>,
  TItemTransformer extends ItemTransformerHKT = NoItemTransformer,
  TKeyTransformer extends KeyTransformerHKT = NoKeyTransformer,
  TApplyToNestedObjects extends boolean = false
>(
  object: TObj,
  itemTransformer: TItemTransformer["new"] = (value) => value,
  keyTransformer: TKeyTransformer["new"] = (key) => key,
  applyToNestedObjects?: TApplyToNestedObjects
): DeepMap<
  DeepTransformKeys<TObj, TKeyTransformer>,
  TItemTransformer,
  TApplyToNestedObjects
> {
  return objectFromEntries(
    objectEntries(object).map(([key, value]) => {
      const transformedKey = keyTransformer(key) as Apply<
        TKeyTransformer,
        typeof key
      >;
      if (isFunction(value))
        return [
          transformedKey,
          value as Apply<TItemTransformer, typeof value, typeof key>,
        ];
      const transformedValue = isStringObject(value)
        ? applyToNestedObjects
          ? itemTransformer(
              deepTransformObject(
                value,
                itemTransformer,
                keyTransformer,
                applyToNestedObjects
              ),
              key
            )
          : deepTransformObject(
              value,
              itemTransformer,
              keyTransformer,
              applyToNestedObjects
            )
        : (itemTransformer(value, key) as Apply<
            TItemTransformer,
            typeof value,
            typeof key
          >);

      return [transformedKey, transformedValue] as const;
    })
  ) as DeepMap<
    DeepTransformKeys<TObj, TKeyTransformer>,
    TItemTransformer,
    TApplyToNestedObjects
  >;
}
