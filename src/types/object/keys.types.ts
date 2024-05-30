import type { Primitives } from "..";

/**
 * Extracts any top-level key of an object according to a key restriction
 *
 * @remarks Returns never if T is not an object
 *
 * @template T - The object
 * @template {Primitives} [TRestriction = string] - The key restriction
 */
export type KeyOf<
  TObject,
  TRestriction extends Primitives = string
> = keyof TObject & TRestriction;

/**
 * Extracts any top-level and/or deep key of an object
 *
 * @remarks Returns never if T is not an object
 *
 * @template T - The object
 * @template {Primitives} [TKeyRestriction = string | number] - The key restriction
 */
export type DeepKeyOf<
  TObject,
  TKeyRestriction extends Primitives = string | number
> = TObject extends object
  ? {
      [K in KeyOf<TObject, TKeyRestriction>]: TObject[K] extends object
        ? `${K}.${DeepKeyOf<TObject[K]>}` | K
        : K;
    }[KeyOf<TObject, TKeyRestriction>]
  : never;

/**
 * An object that must contain at least one or more keys and values in TChoices
 *
 * @template {Record<string, unknown>} TChoices - The object's values
 * @template {keyof TChoices} TKeys - The object's keys
 */
export type RequireAtLeastOne<
  TChoices extends Record<string, unknown>,
  TKeys extends keyof TChoices = keyof TChoices
> = Pick<TChoices, Exclude<keyof TChoices, TKeys>> &
  {
    [K in TKeys]-?: Required<Pick<TChoices, K>> &
      Partial<Pick<TChoices, Exclude<TKeys, K>>>;
  }[TKeys];
