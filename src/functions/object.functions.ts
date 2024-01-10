/**
 * Transforms every value of a given object and returns it
 * @param object - The source object to transform
 * @param itemTransformer - Callback function that transforms a single object value based on its value & key
 * @return A new object all its values transformes through the itemTransformer
 */
export const transformObject = <
  TObjectKey extends string | number,
  TBaseItem,
  TTransformedItem
>(
  object: Record<TObjectKey, TBaseItem>,
  itemTransformer: (item: TBaseItem, key: TObjectKey) => TTransformedItem
): Record<TObjectKey, TTransformedItem> => {
  return Object.fromEntries(
    Object.entries(object).map(([key, value]) => [
      key,
      itemTransformer(value as TBaseItem, key as TObjectKey),
    ])
  ) as Record<TObjectKey, TTransformedItem>;
};
