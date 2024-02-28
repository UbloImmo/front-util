import { NullishPrimitives } from "../global";

export type Predicate<T extends NullishPrimitives> = (
  value: unknown,
) => value is T;
