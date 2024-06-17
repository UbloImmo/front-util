import type {
  UnionToIntersection,
  Nullish,
  NonOptional,
  NonNullish,
  Nullable,
  Optional,
} from "..";
import type { DeepKeyOf, KeyOfObject, StringKeyOf } from "./keys.types";

export type DeepRequired<T> = T extends object
  ? {
      [TKey in keyof T]-?: DeepRequired<T[TKey]>;
    }
  : T;

export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

export type DeepNullish<T> = T extends object
  ? {
      [TKey in keyof T]: DeepNullish<T[TKey]>;
    }
  : Nullish<T>;

export type DeepNonNullish<T> = T extends object
  ? DeepRequired<{
      [TKey in keyof T]: DeepNonNullish<T[TKey]>;
    }>
  : NonNullish<T>;

export type DeepNullable<T> = T extends object
  ? {
      [TKey in keyof T]: DeepNullable<T[TKey]>;
    }
  : Nullable<T>;

export type DeepNonNullable<T> = T extends object
  ? {
      [TKey in keyof T]: DeepNonNullable<T[TKey]>;
    }
  : NonNullable<T>;

export type DeepOptional<T> = T extends object
  ? {
      [TKey in keyof T]: DeepOptional<T[TKey]>;
    }
  : Optional<T>;

export type DeepNonOptional<T> = T extends object
  ? {
      [TKey in keyof T]: DeepNonOptional<T[TKey]>;
    }
  : NonOptional<T>;

/**
 * Picks a deep slice of an object
 *
 * @remarks Does not have autocomplete. Use {@link DeepPick}.
 *
 * @template TObject - The object
 * @template {string | number} TKey - The key
 */
export type DeepPickLax<
  TObject,
  TKey extends string | number
> = UnionToIntersection<
  TObject extends object
    ? TKey extends `${infer THead}.${infer TTail}`
      ? {
          [P in THead & keyof TObject]: TTail extends DeepKeyOf<TObject[P]>
            ? DeepPickLax<TObject[P], TTail>
            : never;
        }
      : TKey extends keyof TObject
      ? Pick<TObject, TKey>
      : never
    : TObject
>;

/**
 * Superset of {@link DeepPickLax} with stricter TKey type argument
 *
 * @remarks Use this instead of {@link DeepPickLax}
 *
 * @template {object} TObject - The object
 * @template {DeepKeyOf<TObject>} TKey - The key
 *
 * @example
 * type MyObject = {
 *   foo: {
 *     bar: {
 *       baz: number
 *     }
 *     foo: {
 *       foobar: string
 *     }
 *   }
 * }
 *
 * type MyPick = DeepPick<MyObject, 'foo.bar.baz'> // { foo : { bar: { baz: number } } }
 *
 */
export type DeepPick<
  TObject extends object,
  TKey extends DeepKeyOf<TObject>
> = DeepPickLax<TObject, TKey>;

/**
 * Yields an object's nested value based on the provided deep key.
 *
 * @remarks Yields `never` if TObject is not an object
 * @remarks Uses {@link DeepKeyOf}
 *
 * @template TObject - The object
 * @template {DeepKeyOf<TObject>} TKey - The deep key
 */
export type DeepValueOfLax<
  TObject,
  TKey extends DeepKeyOf<TObject>
> = TObject extends object
  ? TKey extends StringKeyOf<TObject>
    ? TObject[KeyOfObject<TObject, TKey>]
    : TKey extends `${infer THead}.${infer TTail}`
    ? THead extends StringKeyOf<TObject>
      ? TTail extends DeepKeyOf<TObject[KeyOfObject<TObject, THead>]>
        ? DeepValueOfLax<TObject[KeyOfObject<TObject, THead>], TTail>
        : never
      : never
    : never
  : never;

/**
 * Superset of {@link DeepValueOfLax} with stricter TObject type argument
 *
 * @remarks Use this instead of {@link DeepValueOfLax}
 *
 * @template TObject - The object
 * @template {DeepKeyOf<TObject>} TKey - The deep key
 *
 * @example
 * type MyObject = {
 *   foo: {
 *     bar: {
 *       baz: number;
 *     };
 *     foobar: string[];
 *     baz: {
 *      foobar: boolean;
 *     }[];
 *   };
 * };
 * type NestedNumber = DeepValueOf<MyObject, "foo.bar.baz">; // number
 * type NestedArray = DeepValueOf<MyObject, "foo.foobar">; // string[]
 * type NestedString = DeepValueOf<MyObject, "foo.foobar.123">; // string
 * type NestedBoolean = DeepValueOf<MyObject, "foo.baz.0.foobar">; // boolean
 */
export type DeepValueOf<
  TObject extends object,
  TKey extends DeepKeyOf<TObject>
> = DeepValueOfLax<TObject, TKey>;

export type DeepKeyOfType<TObject, TType> = TObject extends object
  ? DeepKeyOf<TObject> extends infer TDeepKey
    ? TDeepKey extends DeepKeyOf<TObject>
      ? DeepValueOf<TObject, TDeepKey> extends TType
        ? TDeepKey
        : never
      : never
    : never
  : never;
