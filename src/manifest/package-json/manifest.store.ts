import { DepbadgeRCManifestTemplateContract, PackageDependency } from "../../depbadgerc/depbadgerc.type";
import { useCtxStore } from "../../store/ctx-store";

import { BadgeDependencyMap, dependenciesToBadgeMap } from "./dependencies-to-badge-map";
import { getVersionFromManifest } from "./get-version-from-manifest";
import { readManifest } from "./manifest.read";
import { DepbadgeManifest } from "./manifest.type";

export type ManifestMethods = {
  getVersionFromManifest(): string;
  /**
   * Generates a badge map from RC dependencies.
   * @param v - Array of PackageDependency objects
   * @returns BadgeDependencyMap keyed by dependency labels
   */
  dependenciesToBadgeMap(v: PackageDependency[]): BadgeDependencyMap;
} & DepbadgeRCManifestTemplateContract;

export const PackageJsonCtx = useCtxStore<DepbadgeManifest, ManifestMethods>(readManifest(), {
  getVersionFromManifest,
  dependenciesToBadgeMap,
});
