import { Predicate } from "../types";

/**
 * Predicate typescript function that checks whether the value corresponds to a number
 * @param {unknown} value unknown value to check
 * @returns {boolean} true if the value corresponds to a number
 */
export const isNumber = ((value: unknown) =>
  typeof value === "number") as Predicate<number>;

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
  !isNull(value) && typeof value === "object") as Predicate<object>;

/**
 * Predicate typescript function that checks whether the value corresponds to an array
 * @param {unknown} value unknown value to check
 * @returns {boolean} true if the value corresponds to an array
 */
export const isArray = ((value: unknown) =>
  isObject(value) && Array.isArray(value)) as Predicate<Array<unknown>>;

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
