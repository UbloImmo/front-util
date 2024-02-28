import { describe, it, expect, mock } from "bun:test";
import {
  isFunction,
  objectEntries,
  objectKeys,
  transformObject,
} from "../functions";
import { Logger, LoggerFn } from "../utils";

// mock global console object to list to calls
// eslint-disable-next-line no-console
global.console = transformObject({ ...console }, (method) => mock(method));

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
    it("should not throw when calling methods", () => {
      const logger = Logger();
      objectEntries(logger).forEach(([methodName, method]) => {
        if (!isFunction<LoggerFn>(method)) return;
        it(methodName, () => {
          expect(method).toBeDefined();
          expect(method).toBeFunction();
          expect(method).not.toThrow();
        });
      });
    });

    it("should bind its methods to console calls", () => {
      const logger = Logger({ mode: "simple" });
      objectKeys(logger).forEach((methodName) => {
        if (methodName === "config") return;
        it(methodName, () => {
          expect(logger[methodName]).toBeDefined();
          expect(logger[methodName]).toBeFunction();
          expect(() => logger[methodName]("test message")).not.toThrow();
          expect(global.console[methodName]).toHaveBeenCalled();
        });
      });
    });
  });
});
