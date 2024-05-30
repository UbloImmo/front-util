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
