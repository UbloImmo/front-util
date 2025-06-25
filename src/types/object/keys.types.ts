import type { Primitives, Apply, HKT } from "../global";

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

/**
 * Transforms the keys of an object using a HKT
 * @template {object} TObj - The object
 * @template {HKT} TKeyReplacement - The HKT
 *
 * @example
 * // Define a HKT
 * interface HKTSnakeCaseToCamelCase extends HKT {
 *   new: (key: Assume<this["_1"], string>) => SnakeCaseToCamelCase<typeof key>;
 * }
 * type Obj = { hello_world: string, hello_world_2: string };
 * type TransformedObj = TransformKeys<Obj, HKTSnakeCaseToCamelCase>;
 * const transformedObj: TransformedObj = { helloWorld: string, helloWorld2: string };
 */
export type TransformKeys<TObj extends object, TKeyReplacement extends HKT> = {
  [TKey in keyof TObj as Apply<TKeyReplacement, TKey> & string]: TObj[TKey];
};

/**
 * Deeply transforms the keys of an object using a HKT
 *
 * @template TObj - The object
 * @template TKeyReplacement - The HKT
 *
 * @example
 * interface MyHKT extends HKT {
 *   new: (key: Assume<this["_1"], string>) => SnakeCaseToCamelCase<typeof key>;
 * }
 *
 * type Obj = {
 *   hello_world: {
 *     hello_world_2: string;
 *   };
 * };
 * type TransformedObj = DeepTransformKeys<Obj, MyHKT>;
 * const a: TransformedObj = {
 *  helloWorld: {
 *    helloWorld2: ""
 *  }
 * }
 */
export type DeepTransformKeys<
  TObj extends Record<string, unknown>,
  TKeyReplacement extends HKT
> = {
  [TKey in keyof TObj as TObj[TKey] extends (...x: never[]) => unknown
    ? TKey
    : Apply<TKeyReplacement, TKey> & string]: TObj[TKey] extends Record<
    string,
    unknown
  >
    ? DeepTransformKeys<TObj[TKey], TKeyReplacement>
    : TObj[TKey];
};
