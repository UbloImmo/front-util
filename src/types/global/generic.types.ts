/**
 * Higher Kinded Type generic building block
 *
 * Permits the construction of genereric types that take generics themselves
 *
 * @example
 *
 * interface HTKSnakeCaseToCamelCase extends HKT {
 *    new: (key: Assume<this["_1"], string>) => SnakeCaseToCamelCase<typeof key>;
 * }
 */
export interface HKT {
  readonly _1?: unknown;
  readonly _2?: unknown;
  readonly _3?: unknown;
  readonly _4?: unknown;
  readonly _5?: unknown;
  readonly _6?: unknown;
  readonly _7?: unknown;
  readonly _8?: unknown;
  new: (...x: never[]) => unknown;
}

/**
 * Assumes that a type is of another type if it extends it
 * @template {unknown} T
 * @template {unknown} U
 * @returns {T}
 * @example
 * type A = Assume<string, string | number>;
 * const a: A = "my string";
 */
export type Assume<T, U> = T extends U ? T : U;

/**
 * Applies a HKT to a type
 * @template {HKT} F
 * @template {unknown} _1
 * @returns {ReturType<F["new"]>}
 * @example
 * // Define a HKT
 * interface HKTSnakeCaseToCamelCase extends HKT {
 *   new: (key: Assume<this["_1"], string>) => SnakeCaseToCamelCase<typeof key>;
 * }
 * type A = Apply<HTKSnakeCaseToCamelCase, "hello_world">;
 * const a: A = "HelloWorld";
 */
export type Apply<
  F extends HKT,
  _1,
  _2 = never,
  _3 = never,
  _4 = never,
  _5 = never,
  _6 = never,
  _7 = never,
  _8 = never
> = ReturnType<
  (F & {
    readonly _1: _1;
    readonly _2: _2;
    readonly _3: _3;
    readonly _4: _4;
    readonly _5: _5;
    readonly _6: _6;
    readonly _7: _7;
    readonly _8: _8;
  })["new"]
>;
