import { PackageDependency } from "../../depbadgerc/depbadgerc.type";
import { composeStaticStore, Store } from "../../store/create-store";

import { BadgeDependencyMap, dependenciesToBadgeMapHelper } from "./dependencies-to-badge-map";
import { readManifest } from "./manifest.read";
import { DepbadgeManifest } from "./manifest.type";

export type ManifestMethods = {
  dependenciesToBadgeMap(v: PackageDependency[]): BadgeDependencyMap;
};

// here we create closures for the arrow functions to capture rcStore,
// otherwise use function declaration foo() {} to capture this.
export const mfStore: Store<DepbadgeManifest, ManifestMethods> = composeStaticStore(readManifest(), {
  dependenciesToBadgeMap: (v) => dependenciesToBadgeMapHelper(v, mfStore),
});
