/**
 * Represents a callable method for a store.
 *
 * The method is intentionally untyped at the argument and return level
 * to allow arbitrary extensions while preserving structural compatibility.
 */
export type StoreMethod = (...args: any[]) => any;

/**
 * A dictionary of extension methods that can be merged into a store.
 *
 * Each key maps to a callable function.
 */
export type StoreMethods = Record<string, StoreMethod>;

/**
 * Generic immutable store type composed of:
 * - the base configuration `B`
 * - additional extension methods `M`
 *
 * The resulting type is shallow-readonly via `Readonly<M & B>`,
 * and is frozen at runtime via `Object.freeze`.
 *
 * @template B - Base configuration type
 * @template M - Extension methods augmenting the base configuration
 */
export type Store<B, M> = Readonly<M & B>;

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
