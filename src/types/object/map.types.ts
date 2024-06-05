/**
 * An object that must contain all keys in TKeys,
 * where all keys in TKeys must match TValue's types
 *
 * @template {string} TKeys - The object's keys. A string union
 * @template {unknown} TValues - The object's values for every key in {@link TKeys}.
 *
 */
export type ValueMap<TKeys extends string, TValue> = {
  [TKey in TKeys]: TValue;
};

/**
 * Replaces an source objects property with a target objects matching property's type.
 * If a fourth argument is provided, it will be used as the target object's key
 *
 * @template {object} TSource - The source object
 * @template {keyof TSource & string} TSourceKey - The source object's key
 * @template {object} TTarget - The target object
 * @template {keyof TTarget & string} TTargetKey - The target object's key
 */
export type Replace<
  TSource extends object,
  TSourceKey extends keyof TSource & string,
  TTarget extends object,
  TTargetKey extends (keyof TTarget & string) | TSourceKey = TSourceKey
> = Omit<TSource, TSourceKey> &
  (TTargetKey extends TSourceKey & keyof TTarget & string
    ? Pick<TTarget, TTargetKey>
    : {
        [Key in TSourceKey]: TTarget[TTargetKey & keyof TTarget & string];
      });
