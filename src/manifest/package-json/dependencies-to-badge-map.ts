import { PackageDependency } from "../../depbadgerc/depbadgerc.type";
import { CtxStore, useCtxCallback } from "../../store/ctx-store";

import { ManifestMethods } from "./manifest.store";
import { DepbadgeManifest } from "./manifest.type";

/**
 * Represents the raw dependency sections from a manifest file.
 *
 * Each key is a section name (e.g., "dependencies", "devDependencies"),
 * and each value is a record mapping package names to their versions.
 *
 * Example:
 * ```json
 * {
 *   "dependencies": {
 *     "chalk": "5.2.0",
 *     "js-yaml": "4.1.0"
 *   },
 *   "devDependencies": {
 *     "typescript": "5.1.3"
 *   }
 * }
 * ```
 */
export type ManifestSectionMap = Record<string, Record<string, string>>;

/**
 * Represents a processed mapping of dependencies for badge generation.
 *
 * Each key is a custom label (used in badges),
 * and each value is a record mapping package names to their versions.
 *
 * Example:
 * ```json
 * {
 *   "myCustomLabel": {
 *     "chalk": "5.2.0",
 *     "js-yaml": "4.1.0"
 *   },
 *   "devLabel": {
 *     "typescript": "5.1.3"
 *   }
 * }
 * ```
 */
export type BadgeDependencyMap = ManifestSectionMap;

/**
 * Generates a structured mapping of dependencies for badge generation.
 *
 * This function is store-bound via `cortex` and `useCtxCallback`, so the store (`DepbadgeManifest` state) \
 * is automatically injected. You only need to provide the RC dependencies (`rcDeps`).
 *
 * Behavior:
 * 1. Converts the manifest store into an easy-to-query map of dependencies.
 * 2. Iterates over each depbadgerc entry:
 *    - Skips entries with no packages.
 *    - Determines the label to use: `label` if provided, otherwise falls back to `source`.
 *    - Includes only packages that exist in the manifest store.
 *    - Maps each included package to its version from the manifest under the resolved label.
 *
 * @param rcDeps RC dependencies from depbadgerc configuration (`PackageDependency[]`), with `artifact` omitted.
 * @returns A nested object (`BadgeDependencyMap`) mapping each label/source to the packages listed in `rcDeps` \
 *          with their resolved versions from the manifest store.
 *
 * @example
 * ```ts
 * const rcDeps: PackageDependency[] = [
 *   { source: "dependencies", label: "deps", packages: ["chalk", "js-yaml"] },
 *   { source: "devDependencies", packages: ["jest", "typescript"] }
 * ];
 *
 * const result: BadgeDependencyMap = dependenciesToBadgeMap(rcDeps);
 * // result (label as the new key for dependencies)
 * {
 *   "deps": { "chalk": "5.2.0", "js-yaml": "4.1.0" },
 *   "devDependencies": { "jest": "29.5.0", "typescript": "5.1.6" }
 * }
 * ```
 */
export const dependenciesToBadgeMap = useCtxCallback<CtxStore<DepbadgeManifest, ManifestMethods>>(
  (store, rcDeps: PackageDependency[]): BadgeDependencyMap => {
    const mfDepsMap: ManifestSectionMap = {
      dependencies: store.dependencies ?? {},
      devDependencies: store.devDependencies ?? {},
      peerDependencies: store.peerDependencies ?? {},
    };

    return rcDeps.reduce<BadgeDependencyMap>((acc, { label, source, packages }) => {
      if (!packages?.length) return acc;

      const resolvedLabel = label ?? source;

      const entries = packages
        .map((pkg) => [pkg, mfDepsMap[source]?.[pkg]] as const)
        .filter(([, v]) => v !== undefined);

      if (!entries.length) return acc;

      acc[resolvedLabel] = {
        ...(acc[resolvedLabel] ?? {}),
        ...Object.fromEntries(entries),
      };

      return acc;
    }, {});
  },
);
