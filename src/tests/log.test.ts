import { describe, it, expect, mock } from "bun:test";
import { isObject, objectKeys } from "../functions";
import { Logger, LoggerConfig } from "../utils";

const methodNames = ["log", "info", "warn", "error", "debug"] as const;
type LogMethodName = (typeof methodNames)[number];
const testLoggerMethod = (
  methodName: LogMethodName,
  nativeMethodName?: LogMethodName,
  flags?: LoggerConfig
) => {
  // init logger
  const logger = Logger(flags);
  describe(`${methodName} method`, () => {
    const method = logger[methodName];
    it("shoud be a function", () => {
      expect(method).toBeDefined();
      expect(method).toBeFunction();
    });
    const noCall =
      (flags?.hideDebug && methodName === "debug") ||
      (flags?.hideLogs && methodName === "log");
    const throws = flags?.throwOnError && methodName === "error";
    const flagStr = isObject(flags)
      ? `with flags ${objectKeys(flags).join(" ")}`
      : "by default";
    it(`should ${!throws ? "not " : ""}throw with ${flagStr}`, () => {
      // mock global console object to list to calls
      global.console[nativeMethodName ?? methodName] = mock(() => {});
      if (throws) {
        expect(() => method(methodName)).toThrow();
      } else {
        expect(() => method(methodName)).not.toThrow();
      }
    });
    it(`should ${
      noCall ? "not " : ""
    }call console.${methodName} ${flagStr}`, () => {
      if (noCall) {
        expect(
          global.console[nativeMethodName ?? methodName]
        ).not.toHaveBeenCalled();
      } else {
        expect(
          global.console[nativeMethodName ?? methodName]
        ).toHaveBeenCalled();
      }
    });
  });
};

describe("logger", () => {
  describe("init", () => {
    it("should be a function", () => {
      expect(Logger).toBeDefined();
      expect(Logger).toBeFunction();
    });

    it("should not throw", () => {
      expect(() => Logger()).not.toThrow();
    });
  });

  describe("usage", () => {
    methodNames.forEach((methodName) => testLoggerMethod(methodName));
    testLoggerMethod("warn", "error", { warningsAsErrors: true });
    testLoggerMethod("error", "error", { throwOnError: true });
    testLoggerMethod("debug", "debug", { hideDebug: true });
    testLoggerMethod("log", "log", { hideLogs: true });
  });
});
