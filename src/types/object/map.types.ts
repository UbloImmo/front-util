import type { Apply, Assume, HKT } from "../global";

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

/**
 * Replaces an source objects property with a target objects matching property's type.
 * If a fourth argument is provided, it will be used as the target object's key
 *
 * @template {object} TSource - The source object
 * @template {keyof TSource & string} TSourceKey - The source object's key
 * @template {object} TTarget - The target object
 * @template {keyof TTarget & string} TTargetKey - The target object's key
 */
export type Replace<
  TSource extends object,
  TSourceKey extends keyof TSource & string,
  TTarget extends object,
  TTargetKey extends (keyof TTarget & string) | TSourceKey = TSourceKey
> = Omit<TSource, TSourceKey> &
  (TTargetKey extends TSourceKey & keyof TTarget & string
    ? Pick<TTarget, TTargetKey>
    : {
        [Key in TSourceKey]: TTarget[TTargetKey & keyof TTarget & string];
      });

/**
 * Maps all first-level values of an object using a HKT
 *
 * @template TObject - The object
 * @template {HKT} TMapFn - The HKT
 *
 * @example
 * interface ToNullish extends HKT {
 *   new: (value: Assume<this["_1"], unknown>) => Nullish<typeof value>;
 * }
 * type Obj = {
 *   number: number;
 * };
 *
 * const nullishObj: Map<Obj, ToNullish> = {
 *   number: null,
 * };
 */
export type Map<TObject extends object, TMapFn extends HKT> = {
  [TKey in keyof TObject]: Apply<TMapFn, TKey>;
};

/**
 * Maps all (first-level and nested) values of an object using a HKT
 *
 * @template TObject - The object
 * @template {HKT} TMapFn - The HKT
 * @template {boolean} [TApplyToNestedObjects = false] - Whether to apply the map to nested objects, or only their values
 *
 * @example
 * interface ToNullable extends HKT {
 *   new: (value: Assume<this["_1"], unknown>) => Nullable<typeof value>;
 * }
 * type Obj = {
 *   number: number;
 *   obj: {
 *     string: string;
 *   }
 * };
 * // nested objects are not converted, only their properties
 * const a: DeepMap<Obj, ToNullable> = {
 *   number: null,
 *   obj: {
 *     string: null,
 *   }
 * }
 * // nested objects are also converted
 * const b: DeepMap<Obj, ToNullable, true> = {
 *   number: null,
 *   obj: null,
 * }
 */
export type DeepMap<
  TObject extends Record<string, unknown>,
  TMapFn extends HKT,
  TApplyToNestedObjects extends boolean = false
> = {
  [TKey in keyof TObject]: TObject[TKey] extends Record<string, unknown>
    ? TApplyToNestedObjects extends true
      ? Apply<
          TMapFn,
          DeepMap<TObject[TKey], TMapFn, TApplyToNestedObjects>,
          TKey
        >
      : DeepMap<TObject[TKey], TMapFn, TApplyToNestedObjects>
    : Apply<TMapFn, TObject[TKey], TKey>;
};

/**
 * Default HKT for transforming object values.
 * Please extend your own HKTs from this type.
 */
export interface ItemTransformerHKT extends HKT {
  new: (
    item: Assume<this["_1"], unknown>,
    key: Assume<this["_2"], string>
  ) => unknown;
}

/**
 * Default HKT for transforming object keys.
 * Please extend your own HKTs from this type.
 */
export interface KeyTransformerHKT extends HKT {
  new: (key: Assume<this["_1"], string>) => string;
}
