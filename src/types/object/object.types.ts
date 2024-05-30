import type { UnionToIntersection } from "..";
import type { Nullish, NonOptional, NonNullish } from "../global/global.types";
import type { DeepKeyOf } from "./keys.types";

export type DeepRequired<T> = T extends object
  ? {
      [TKey in keyof T]-?: T[TKey];
    }
  : T;

export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
    }
  : T;

export type DeepNullish<T> = T extends object
  ? {
      [TKey in keyof T]: DeepNullish<T[TKey]>;
    }
  : Nullish<T>;

export type DeepNonNullable<T> = T extends object
  ? {
      [TKey in keyof T]: DeepNonNullable<T[TKey]>;
    }
  : NonNullable<T>;

export type DeepNonOptional<T> = T extends object
  ? {
      [TKey in keyof T]: DeepNonOptional<T[TKey]>;
    }
  : NonOptional<T>;

export type DeepNonNullish<T> = T extends object
  ? DeepRequired<{
      [TKey in keyof T]: DeepNonNullish<T[TKey]>;
    }>
  : NonNullish<T>;

/**
 * Picks a deep slice of an object
 *
 * @remarks Does not have autocomplete. use {@link DeepPick}
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
 */
export type DeepPick<
  TObject extends object,
  TKey extends DeepKeyOf<TObject>
> = DeepPickLax<TObject, TKey>;
