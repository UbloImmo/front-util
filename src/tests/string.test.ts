import { describe, it, expect } from "bun:test";
import {
  camelCaseToSnakeCase,
  capitalize,
  kebabCaseToSnakeCase,
  pascalCaseToSnakeCase,
  uncapitalize,
} from "../functions";

describe("string functions", () => {
  it("should capitalize a string", () => {
    expect(capitalize("hello")).toBe("Hello");
    expect(capitalize("")).toBe("");
    expect(capitalize("Hello")).toBe("Hello");
    expect(capitalize("hello WORLD")).toBe("Hello WORLD");
    expect(capitalize(" hello")).toBe(" hello");
  });

  it("should uncapitalize a string", () => {
    expect(uncapitalize("Hello")).toBe("hello");
    expect(uncapitalize("Hello WORLD")).toBe("hello WORLD");
    expect(uncapitalize(" hello")).toBe(" hello");
    expect(uncapitalize("")).toBe("");
    expect(uncapitalize("hello")).toBe("hello");
  });

  it("should convert a string to snake case", () => {
    expect(camelCaseToSnakeCase("loremIpsumSitAmet46DolorSitAmet")).toBe(
      "lorem_ipsum_sit_amet_46_dolor_sit_amet"
    );
    expect(pascalCaseToSnakeCase("LoremIpsumSitAmet46DolorSitAmet")).toBe(
      "lorem_ipsum_sit_amet_46_dolor_sit_amet"
    );
    expect(kebabCaseToSnakeCase("hello-world")).toBe("hello_world");
    expect(kebabCaseToSnakeCase("hello-world-test")).toBe("hello_world_test");
  });
});
