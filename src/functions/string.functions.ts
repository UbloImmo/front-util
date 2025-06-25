import {
  SnakeCaseToKebabCase,
  type CamelCaseToSnakeCase,
  type KebabCaseToSnakeCase,
  type PascalCaseToCamelCase,
  type PascalCaseToSnakeCase,
  type SnakeCaseToCamelCase,
  type SnakeCaseToPascalCase,
} from "../types";
/**
 * Capitalizes the first letter of a string
 *
 * @template {string} TStr - The string type
 * @param {TStr} str - The string to capitalize
 * @returns {Capitalize<TStr>} The capitalized string
 *
 * @example
 * capitalize("hello"); // "Hello"
 * capitalize(""); // ""
 */
export const capitalize = <TStr extends string>(
  str: TStr
): Capitalize<TStr> => {
  if (!str.length) return "" as Capitalize<TStr>;
  const [first, ...rest] = str;
  return [first.toUpperCase(), ...rest].join("") as Capitalize<TStr>;
};

export const uncapitalize = <TStr extends string>(
  str: TStr
): Uncapitalize<TStr> => {
  if (!str.length) return "" as Uncapitalize<TStr>;
  const [first, ...rest] = str;
  return [first.toLowerCase(), ...rest].join("") as Uncapitalize<TStr>;
};

export const snakeCaseToKebabCase = <TStr extends string>(
  str: TStr
): SnakeCaseToKebabCase<TStr> => {
  if (!str.length) return "" as SnakeCaseToKebabCase<TStr>;
  return str.replace(/_/g, "-").toLowerCase() as SnakeCaseToKebabCase<TStr>;
};

export const kebabCaseToSnakeCase = <TStr extends string>(
  str: TStr
): KebabCaseToSnakeCase<TStr> => {
  if (!str.length) return "" as KebabCaseToSnakeCase<TStr>;
  return str.replace(/-/g, "_").toLowerCase() as KebabCaseToSnakeCase<TStr>;
};

export const snakeCaseToCamelCase = <TStr extends string>(
  str: TStr
): SnakeCaseToCamelCase<TStr> => {
  if (!str.length) return "" as SnakeCaseToCamelCase<TStr>;
  return str.split("_").map(capitalize).join("") as SnakeCaseToCamelCase<TStr>;
};

export const snakeCaseToPascalCase = <TStr extends string>(
  str: TStr
): SnakeCaseToPascalCase<TStr> => {
  if (!str.length) return "" as SnakeCaseToPascalCase<TStr>;
  return capitalize(snakeCaseToCamelCase(str)) as SnakeCaseToPascalCase<TStr>;
};

export const camelCaseToSnakeCase = <TStr extends string>(
  str: TStr
): CamelCaseToSnakeCase<TStr> => {
  if (!str.length) return "" as CamelCaseToSnakeCase<TStr>;
  let result = "";
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    const upper = char.toUpperCase();
    const lower = char.toLowerCase();
    if (!i) {
      result += lower;
      continue;
    }
    const lastChar = str[i - 1];
    const isNumber = !isNaN(parseInt(char));
    const lastCharNotNumber = isNaN(parseInt(lastChar));

    const shouldSplit = isNumber ? lastCharNotNumber : char === upper;

    result += shouldSplit ? `_${lower}` : lower;
  }
  return result as CamelCaseToSnakeCase<TStr>;
};

export const pascalCaseToCamelCase = <TStr extends string>(
  str: TStr
): PascalCaseToCamelCase<TStr> => {
  return uncapitalize(str) as PascalCaseToCamelCase<TStr>;
};

export const pascalCaseToSnakeCase = <TStr extends string>(
  str: TStr
): PascalCaseToSnakeCase<TStr> => {
  return camelCaseToSnakeCase(
    pascalCaseToCamelCase(str)
  ) as PascalCaseToSnakeCase<TStr>;
};
