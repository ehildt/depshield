import { Store, StoreMethods } from "./store.types";

/**
 * Creates an immutable store by merging a base configuration object
 * with optional extension methods.
 *
 * The resulting object:
 * - contains all properties from `base`
 * - contains all provided `methods`
 * - is shallow-frozen via `Object.freeze`
 * - exposes a composite type {@link Store<B, M>}
 *
 * Extension methods may optionally override properties from `base`
 * (because `methods` is typed as `M & Partial<B>`).
 *
 * @template B - Base configuration type
 * @template M - Extension methods type
 *
 * @param base - The base configuration object
 * @param methods - Optional extension methods or partial overrides
 *
 * @returns A frozen object combining `base` and `methods`, typed as {@link Store<B, M>}
 *
 * @remarks
 * Freezing is shallow. Nested objects inside `base` are not recursively frozen.
 *
 * @example
 * const store = composeStaticStore(baseConfig, {
 *   foo() { return this.someProp; },
 *   bar() { return this.otherProp; },
 * });
 *
 * store.foo();
 * store.bar();
 * // store.<some_property_in_baseConfig>
 */
export function composeStaticStore<B, M extends StoreMethods>(base: B, methods?: M & Partial<B>): Store<B, M> {
  return Object.freeze({
    ...base,
    ...methods,
  }) as Store<B, M>;
}
