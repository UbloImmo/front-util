import { Predicate, GenericFn } from "../types";

/**
 * Predicate typescript function that checks whether the value corresponds to a number
 * @param {unknown} value unknown value to check
 * @returns {boolean} true if the value corresponds to a number
 */
export const isNumber = ((value: unknown) =>
  typeof value === "number" && !isNaN(value)) as Predicate<number>;

/**
 * Predicate typescript function that checks whether the value corresponds to an integer
 * @param {unknown} value unknown value to check
 * @returns {boolean} true if the value corresponds to an integer
 */
export const isInt = ((value: unknown) =>
  isNumber(value) && value % 1 === 0) as Predicate<number>;

/**
 * Predicate typescript function that checks whether the value corresponds to a float
 * @param {unknown} value unknown value to check
 * @returns {boolean} true if the value corresponds to a float
 */
export const isFloat = ((value: unknown) =>
  isNumber(value) && !isInt(value)) as Predicate<number>;

/**
 * Predicate typescript function that checks whether the value corresponds to a string
 * @param {unknown} value unknown value to check
 * @returns {boolean} true if the value corresponds to a string
 */
export const isString = ((value: unknown) =>
  typeof value === "string") as Predicate<string>;

/**
 * Predicate typescript function that checks whether the value corresponds to a boolean
 * @param {unknown} value unknown value to check
 * @returns {boolean} true if the value corresponds to a boolean
 */
export const isBoolean = ((value: unknown) =>
  typeof value === "boolean") as Predicate<boolean>;

/**
 * Predicate typescript function that checks whether the value corresponds to an object
 * @param {unknown} value unknown value to check
 * @returns {boolean} true if the value corresponds to an object
 * @remarks null check is needed since typeof null === "object"
 */
export const isObject = ((value: unknown) =>
  !isFunction(value) &&
  !isNull(value) &&
  typeof value === "object") as Predicate<object>;

/**
 * Predicate typescript function that checks whether the value corresponds to an array
 * @param {unknown} value unknown value to check
 * @returns {boolean} true if the value corresponds to an array
 */
export const isArray = ((value: unknown) =>
  isObject(value) && Array.isArray(value)) as Predicate<Array<unknown>>;

/**
 * Predicate typescript function that checks whether the value corresponds to a string object
 * @param {unknown} value unknown value to check
 * @returns {boolean} true if the value corresponds to a string object
 */
export const isStringObject = ((value: unknown) =>
  isObject(value) && !isArray(value)) as Predicate<Record<string, unknown>>;

/**
 * Predicate typescript function that checks whether the value is null
 * @param {unknown} value unknown value to check
 * @returns {boolean} true if the value is null
 */
export const isNull = ((value: unknown) => value === null) as Predicate<null>;

/**
 * Predicate typescript function that checks whether the value is undefined
 * @param {unknown} value unknown value to check
 * @returns {boolean} true if the value is undefined
 */
export const isUndefined = ((value: unknown) =>
  value === undefined) as Predicate<undefined>;

/**
 * Predicate typescript function that checks whether the value is null or undefined
 * @param {unknown} value unknown value to check
 * @returns {boolean} true if the value is null or undefined
 */
export const isNullish = ((value: unknown) =>
  isNull(value) || isUndefined(value)) as Predicate<null | undefined>;

/**
 * Predicate typescript function that checks whether the value is a function
 * @param {unknown} value unknown value to check
 * @returns {boolean} true if the value is a function;
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export const isFunction = <TFn extends Function = GenericFn>(
  value: GenericFn | unknown
): value is TFn => typeof value === "function";
