/**
 * Extracts the values contained in a string array as union type.
 *
 * @example
 * const myEnumValues = ["a", "b", "c"] as const;
 * type MyEnum = Enum<typeof myEnumValues>;
 */
export type Enum<T extends string[] | readonly string[]> = T[number];

/**
 * Takes a string enum or a string array and extends it with another enum.
 *
 * @template {string | string[] | readonly string[]} TEnum - The base string enum or string array
 * @template {string | string[] | readonly string[]} TExtension - The extension string enum or string array
 */
export type EnumExtension<
  TEnum extends string | string[] | readonly string[],
  TExtension extends string | string[] | readonly string[]
> =
  | (TEnum extends string[] | readonly string[] ? Enum<TEnum> : TEnum)
  | (TExtension extends string[] | readonly string[]
      ? Enum<TExtension>
      : TExtension);

/**
 * Converts a tuple to a union of its elements
 * @template {unknown[] | [unknown, ...unknown[]]} TTuple
 * @param {TTuple} TTuple - Tuple to convert to union
 * @returns {TTuple[number]}
 * @example
 * type A = TupleToUnion<[1, 2, 3]>; // 1 | 2 | 3
 * const a: A = 1;
 */
export type TupleToUnion<TTuple extends [unknown, ...unknown[]] | unknown[]> = TTuple extends [
  infer TStart,
  ...infer TRest
]
  ? TStart | TupleToUnion<TRest>
  : TTuple extends unknown[]
  ? TTuple[number]
  : never;
     