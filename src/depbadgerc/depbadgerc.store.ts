import { BadgeDependencyMap } from "../manifests/package-json/dependencies-to-badge-map";
import { ManifestMethods } from "../manifests/package-json/manifest.store";
import { DepbadgeManifest } from "../manifests/package-json/manifest.type";
import { composeStaticStore, Store } from "../store/create-store";

import {
  BadgeArtifactMap,
  BadgeVariantMap,
  canGenerateHelper,
  computeStateIntegrityHelper,
  generateShieldIOEndpointArtifactMapHelper,
  generateShieldIOEndpointBadgeMapHelper,
  getArtifactsHelper,
  getDependenciesHelper,
  materializeHelper,
  outputMarkdownPreviewHelper,
  outputShieldIODynamicBadgesHelper,
  renderArtifactMarkdownMapHelper,
  renderBadgeMarkdownMapHelper,
  stateIntegrityChangedHelper,
} from "./depbadgerc.helpers";
import { readDepbadgeRC } from "./depbadgerc.read";
import { BadgeArtifact, DepbadgeRC, PackageDependency } from "./depbadgerc.type";

export type DepbadgeRCMethods = {
  outputMarkdownPreview(t: "BADGE" | "ARTIFACT", v: Record<string, string[]>): void;
  outputShieldIODynamicBadges(v: BadgeVariantMap): void;
  getDependencies(): PackageDependency[];
  getArtifacts(): BadgeArtifact[];
  materialize(mf: Store<DepbadgeManifest, ManifestMethods>): void;
  canGenerate(v: string): boolean;
  stateIntegrityChanged(v?: string): boolean;
  computeStateIntegrity(...args: unknown[]): string;
  generateShieldIOEndpointBadgeMap(depMap: BadgeDependencyMap): BadgeVariantMap;
  generateShieldIOEndpointArtifactMap(artifacts: BadgeArtifact[]): BadgeArtifactMap;
  renderBadgeMarkdownMap(badgeMap: BadgeVariantMap): Record<string, string[]>;
  renderArtifactMarkdownMap(artifactMap: BadgeArtifactMap): Record<string, string[]>;
};

// here we create closures for the arrow functions to capture rcStore,
// otherwise use function declaration foo() {} to capture this.
export const rcStore: Store<DepbadgeRC, DepbadgeRCMethods> = composeStaticStore(readDepbadgeRC(), {
  generateShieldIOEndpointArtifactMap: (v) => generateShieldIOEndpointArtifactMapHelper(v),
  renderArtifactMarkdownMap: (v) => renderArtifactMarkdownMapHelper(v, rcStore.badgeStyle),
  outputMarkdownPreview: (t, v) => outputMarkdownPreviewHelper(t, v, rcStore.badgeStyle),
  outputShieldIODynamicBadges: (v) => outputShieldIODynamicBadgesHelper(v),
  renderBadgeMarkdownMap: (v) => renderBadgeMarkdownMapHelper(v, rcStore.badgeStyle),
  generateShieldIOEndpointBadgeMap: (v) => generateShieldIOEndpointBadgeMapHelper(v, rcStore.badgeStyle),
  getDependencies: () => getDependenciesHelper(rcStore.dependencies),
  getArtifacts: () => getArtifactsHelper(rcStore.dependencies),
  materialize: (mf) => materializeHelper(mf, rcStore),
  canGenerate: (v) => canGenerateHelper(rcStore.output, v),
  computeStateIntegrity: (v) => computeStateIntegrityHelper(rcStore, v),
  stateIntegrityChanged: (v) => stateIntegrityChangedHelper(rcStore.integrity, v),
});
