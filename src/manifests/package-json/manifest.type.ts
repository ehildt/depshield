/**
 * An opinionated, Depbadge-specific subset of a manifest file.
 *
 * Named `DepbadgeManifest` to distinguish it from a full `package.json`. \
 * Includes only the fields needed for Depbadge workflows such as badge \
 * generation, integrity checks, and dependency tracking.
 *
 * Scoping it explicitly to Depbadge:
 * - Avoids confusion with standard manifests.
 * - Signals its intended use in Depbadge-specific operations.
 * - Makes APIs like rcStore methods intention-revealing.
 */
export type DepbadgeManifest = {
  name: string;
  version: string;
  license?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
};
