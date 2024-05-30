/**
 * An object that must contain all keys in TKeys,
 * where all keys in TKeys must match TValue's types
 *
 * @template {string} TKeys - The object's keys. A string union
 * @template {unknown} TValues - The object's values for every key in {@link TKeys}.
 *
 */
export type ValueMap<TKeys extends string, TValue> = {
  [TKey in TKeys]: TValue;
};
