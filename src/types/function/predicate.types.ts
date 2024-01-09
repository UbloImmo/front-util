import { NullishPrimitives } from "@/types/global/global.types";

export type Predicate<T extends NullishPrimitives> = (value: unknown) => value is T;
