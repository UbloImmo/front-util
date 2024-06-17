import type { Primitives } from "..";

/**
 * Extracts any top-level key of an object according to a key restriction
 *
 * @remarks Returns never if T is not an object
 *
 * @template TObject - The object
 * @template {Primitives} [TRestriction = string] - The key restriction
 */
export type KeyOf<
  TObject,
  TRestriction extends Primitives = string | number
> = keyof TObject & TRestriction;

/**
 * Superset of {@link KeyOf} that allows string indexes for arrays
 *
 * @template TObject - The object
 * @template {Primitives} [TRestriction = string] - The key restriction
 */
export type StringKeyOf<
  TObject,
  TRestriction extends Primitives = string | number
> = `${KeyOf<TObject, TRestriction>}` | KeyOf<TObject, TRestriction>;

/**
 * Used to index objects with {@link StringKeyOf} keys
 *
 * @template TObject - The object
 * @template {StringKeyOf<TObject>} TKey - The string key
 */
export type KeyOfObject<
  TObject,
  TKey extends StringKeyOf<TObject>
> = TKey extends `${number}` ? number & keyof TObject : TKey & keyof TObject;

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
      [K in StringKeyOf<TObject, TKeyRestriction>]: TObject[KeyOfObject<
        TObject,
        K
      >] extends object
        ?
            | `${K}.${DeepKeyOf<
                TObject[KeyOfObject<TObject, K>],
                TKeyRestriction
              >}`
            | K
            | `${K}`
        : K | `${K}`;
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
