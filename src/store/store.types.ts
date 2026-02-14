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
