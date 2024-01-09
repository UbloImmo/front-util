type FnArguments = unknown[];
type FnReturn = unknown | void;

/**
 * Utility type to construct functions.
 *
 * @template {FnArguments} TArguments
 * @template {FnReturn} TReturn
 *
 * @param {TArguments} [TArguments = []] - Array or tuple of function arguments. Provide {never} for no-argument functions
 * @param {TReturn} [TReturn = void] - Function's return type.
 * @returns {((...args: TArguments) => TReturn)}
 *
 * @example
 * const add: GenericFn<[number, number], number> = (a, b) => a + b;
 * const getUser: GenericFn<[], User> = () => (
 *   JSON.parse(localStorage.getItem("user"))
 * );
 */
export type GenericFn<
  TArguments extends FnArguments = [],
  TReturn extends FnReturn = void
> = TArguments extends [] ? () => TReturn : (...args: TArguments) => TReturn;

/**
 * Utility type to construct functions that returns void.
 * Based on {@link GenericFn}.
 *
 * @template {FnArguments} TArguments
 *
 * @param {TArguments} [TArguments = []] - Array or tuple of function arguments. Provide {never} for no-argument functions
 * @returns {((...args: TArguments) => void)}
 *
 * @example
 * const dispatchEvent: VoidFn<[string]> = (eventType) => {
 *   // ...body
 * };
 * const doNothing: VoidFn = () => {};
 */
export type VoidFn<TArguments extends FnArguments = []> = GenericFn<TArguments, void>;

/**
 * Utility type to construct async functions have to return promises.
 * Based on {@link GenericFn}.
 *
 * @template {FnArguments} TArguments
 * @template {Exclude<FnReturn, void>} TReturn
 *
 * @param {TArguments} [TArguments = []] - Array or tuple of function arguments. Provide {never} for no-argument functions
 * @param {TReturn} [TReturn = unknown] - Function's return type
 * @returns {((...args: TArguments) => Promise<TReturn>)}
 *
 * @example
 * type getDataAsync: AsyncFn<, string> = async () => "async data";
 */
export type AsyncFn<
  TArguments extends FnArguments = [],
  TReturn extends FnReturn = void
> = GenericFn<TArguments, Promise<TReturn>>;

/**
 * Utility type to construct functions that may or may not return promises.
 * Based on {@link GenericFn}.
 *
 * @template {FnArguments} TArguments
 * @template {Exclude<FnReturn, void>} TReturn
 *
 * @param {TArguments} [TArguments = []] array or tuple of function arguments. Provide {never} for no-argument functions
 * @param {TReturn} [TReturn = unknown] - Function's return type
 * @returns {((...args: TArguments) => TReturn | Promise<TReturn>)}
 *
 * @example
 *  type MaybeStringFn = MaybeAsyncFn<[], string>;
 *  const getData: MaybeStringFn = () => "sync data";
 *  const getDataAsync: MaybeStringFn = async () => "async data";
 */
export type MaybeAsyncFn<
  TArguments extends FnArguments = [],
  TReturn extends FnReturn = void
> = GenericFn<TArguments, TReturn | Promise<TReturn>>;
