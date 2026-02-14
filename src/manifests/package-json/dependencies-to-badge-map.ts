import { PackageDependency } from "../../depbadgerc/depbadgerc.type";

import { DepbadgeManifest } from "./manifest.type";

/**
 * Represents the raw dependency sections from a manifest file.
 *
 * Each key is a section name (e.g., "dependencies", "devDependencies"), \
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
 * Each key is a custom label (used in badges), \
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
 * Combines the depbadgerc configuration (`rcDeps`) and the depbadge manifest (`mf`) to produce a nested map \
 * of package names to their resolved versions. Only packages listed in the depbadgerc configuration are included, \
 * and versions are sourced from the manifest.
 *
 * Behavior:
 * 1. Converts the depbadge manifest into an easy-to-query map of dependencies.
 * 2. Iterates over each depbadgerc entry:
 *    - Skips entries with no packages.
 *    - Determines the label to use: `label` if provided, otherwise falls back to `source`.
 *    - Includes only packages that exist in the manifest.
 *    - Maps each included package to its version from the manifest under the resolved label.
 *
 * @param rcDeps RC dependencies from depbadgerc configuration, with `artifact` omitted (`PackageDependency[]`).
 * @param mf Depbadge manifest containing actual dependency versions (`DepbadgeManifest`) as `Record<string, string>`.
 * @returns A nested object (`BadgeDependencyMap`) mapping each label/source to the packages listed in `rcDeps` \
 *          with their resolved versions from the manifest.
 *
 * @example
 * const rcDeps: PackageDependency[] = [
 *   { source: "dependencies", label: "optional", packages: ["chalk", "js-yaml"] },
 *   { source: "devDependencies", packages: ["jest", "typescript"] }
 * ];
 *
 * const mf: DepbadgeManifest = {
 *   dependencies: {
 *     "chalk": "5.2.0",
 *     "js-yaml": "4.1.0"
 *   },
 *   devDependencies: {
 *     "jest": "29.5.0",
 *     "typescript": "5.1.6"
 *   }
 * };
 *
 * const result: BadgeDependencyMap = {
 *   "optional": { "chalk": "5.2.0", "js-yaml": "4.1.0" },
 *   "devDependencies": { "jest": "29.5.0", "typescript": "5.1.6" }
 * };
 */
export function dependenciesToBadgeMapHelper(rcDeps: PackageDependency[], mf: DepbadgeManifest) {
  const mfDepsMap = {
    dependencies: mf.dependencies ?? {},
    devDependencies: mf.devDependencies ?? {},
    peerDependencies: mf.peerDependencies ?? {},
  } as ManifestSectionMap;

  return rcDeps.reduce<BadgeDependencyMap>((acc, { label, source, packages }) => {
    if (!packages?.length) return acc;

    const resolvedLabel = label ?? source;

    const entries = packages
      .map((pkg) => [pkg, mfDepsMap[source]?.[pkg]] as const)
      .filter(([, version]) => version !== undefined);

    if (entries.length) {
      acc[resolvedLabel] = {
        ...(acc[resolvedLabel] ?? {}),
        ...Object.fromEntries(
          packages.map((pkg) => [pkg, mfDepsMap[source]?.[pkg]]).filter(([, version]) => version !== undefined),
        ),
      };
    }

    return acc;
  }, {});
}
