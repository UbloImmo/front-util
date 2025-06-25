export type SnakeCaseToCamelCase<TStr extends string> =
  TStr extends `${infer TPrefix}_${infer TRest}`
    ? `${TPrefix}${Capitalize<SnakeCaseToCamelCase<TRest>>}`
    : TStr;

export type CamelCaseToSnakeCase<TStr extends string> =
  TStr extends `${infer T}${infer U}`
    ? `${T extends Capitalize<T>
        ? "_"
        : ""}${Lowercase<T>}${CamelCaseToSnakeCase<U>}`
    : TStr;

export type SnakeCaseToPascalCase<TStr extends string> = SnakeCaseToCamelCase<
  Capitalize<TStr>
>;

export type PascalCaseToSnakeCase<TStr extends string> = CamelCaseToSnakeCase<
  Uncapitalize<TStr>
>;

export type PascalCaseToCamelCase<TStr extends string> = Uncapitalize<TStr>;

export type CamelCaseToPascalCase<TStr extends string> = Capitalize<TStr>;

export type SnakeCaseToKebabCase<TStr extends string> =
  TStr extends `${infer TPrefix}_${infer TRest}`
    ? `${TPrefix}-${SnakeCaseToKebabCase<TRest>}`
    : TStr;

export type KebabCaseToSnakeCase<TStr extends string> =
  TStr extends `${infer TPrefix}-${infer TRest}`
    ? `${TPrefix}_${KebabCaseToSnakeCase<TRest>}`
    : TStr;
