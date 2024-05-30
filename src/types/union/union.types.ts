/**
 * Extracts the type of the value in TUnion that matches TSelection
 *
 * @remarks Not really needed, basically acts as a safeguard when using only a subset of an existing union
 *
 * @template TUnion - Base Union type
 * @template TSelection - Subset of TUnion
 */
export type Extract<TUnion, TSelection> = TSelection extends TUnion
  ? TSelection
  : never;

/**
 * Converts a union type to an intersection type
 *
 * @template U - Union type
 */
export type UnionToIntersection<U> = (
  U extends unknown ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;
