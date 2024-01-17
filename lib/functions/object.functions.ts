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
  itemTransformer: (item: TObj[keyof TObj & string]) => TTransformedItem,
  keyTransformer?: (key: keyof TObj & string) => TTransformedKey
): typeof keyTransformer extends undefined
  ? {
    [k in keyof TObj]: TTransformedItem;
  }
  : {
    [Key in TTransformedKey]: TTransformedItem;
  } => {
  const objectEntries = Object.entries(object) as [
      keyof TObj & string,
    TObj[keyof TObj & string]
  ][];
  const transformedEntries = objectEntries.map(([key, value]) => [
    keyTransformer ? keyTransformer(key) : key,
    itemTransformer(value),
  ]);
  if (keyTransformer) {
    return Object.fromEntries(transformedEntries);
  }
  return Object.fromEntries(transformedEntries);
};