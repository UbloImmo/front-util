import type {
  UnionToIntersection,
  Nullish,
  NonOptional,
  NonNullish,
  Nullable,
  Optional,
} from "..";
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
