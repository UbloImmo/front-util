/**
 * Returns given type or null
 * @template {unknown} T
 * @param {T} T - Base type to convert to nullable
 * @returns {T | null}
 * @example
 * type Primitive = string | number | boolean;
 * type NullablePrimitive = Nullable<Primitive>;
 * const a: NullablePrimitive = "my string";
 * const b: NullablePrimitive = 486;
 * const c: NullablePrimitive = true;
 * const d: NullablePrimitive = null;
 */
export type Nullable<T> = T | null;

/**
 * Returns given type or undefined
 * @template {unknown} T
 * @param {T} T - Base type to convert to nullish
 * @returns {T | undefined}
 * @example
 * type Primitive = string | number | boolean;
 * type OptionalPrimitive = Optional<Primitive>;
 * const a: OptionalPrimitive = "my string";
 * const b: OptionalPrimitive = 486;
 * const c: OptionalPrimitive = true;
 * const d: OptionalPrimitive = undefined;
 */
export type Optional<T> = T | undefined;

/**
 * Returns given type or null or undefined
 * @template {unknown} T
 * @param {T} T - Base type to convert to nullish
 * @returns {T | null | undefined}
 * @example
 * type Primitive = string | number | boolean;
 * type NullishPrimitive = Nullish<Primitive>;
 * const a: NullishPrimitive = "my string";
 * const b: NullishPrimitive = 486;
 * const c: NullishPrimitive = true;
 * const d: NullishPrimitive = null;
 * const e: NullishPrimitive = undefined;
 */
export type Nullish<T> = Optional<Nullable<T>>;

/**
 * Removes null from given type
 * @template {unknown} T
 * @param {T} T - Base type to convert to non-nullish
 * @returns {Exclude<T, null>}
 * @example
 * type StringOrNull = string | null ;
 * const a: NonNullable<StringOrNull> = "my string";
 */
export type NonNullable<T> = Exclude<T, null>;

/**
 * Removes undefined from given type
 * @template {unknown} T
 * @param {T} T - Base type to convert to non-nullish
 * @returns {Exclude<T, null>}
 * @example
 * type StringOrUndefined = string | undefined ;
 * const a: NonOptional<StringOrNull> = "my string";
 */
export type NonOptional<T> = Exclude<T, undefined>;

/**
 * Removes null and undefined from given type
 * @template {unknown} T
 * @param {T} T - Base type to convert to non-nullish
 * @returns {Exclude<T, null | undefined>}
 * @example
 * type StringOrNull = string | null ;
 * const a: NonNullish<StringOrNull> = "my string";
 */
export type NonNullish<T> = NonNullable<NonOptional<T>>;

/**
 * Represents the set of primitive types in TypeScript.
 * These include string, number, boolean, and object.
 */
export type Primitives = string | number | boolean | object;

export type NullishPrimitives = Nullish<Primitives>;

export type DeepRequired<T> = T extends object
  ? {
      [TKey in keyof T]-?: T[TKey];
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
