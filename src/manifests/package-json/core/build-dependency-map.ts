import { PackageJson } from "../package-json.types";

/**
 * Builds a flat map of package dependencies.
 * Only includes dependencies that actually exist in the package JSON.
 * Internal dependencies not listed in pkg are skipped.
 */
export function buildDependencyMap(
  pkg: PackageJson,
  internal?: string[],
): Record<string, string> {
  const map: Record<string, string> = {
    ...(pkg.dependencies ?? {}),
    ...(pkg.devDependencies ?? {}),
    ...(pkg.peerDependencies ?? {}),
  };

  const internalDeps: Record<string, string> = {};
  for (const dep of internal ?? [])
    if (map[dep] !== undefined) internalDeps[dep] = map[dep];

  return { ...map, ...internalDeps };
}
