import { BadgeDependencyMap } from "../manifest/package-json/dependencies-to-badge-map";
import { ManifestMethods } from "../manifest/package-json/manifest.store";
import { DepbadgeManifest } from "../manifest/package-json/manifest.type";
import { CtxStore, useCtxStore } from "../store/ctx-store";

import { applyMarkdownToTarget } from "./apply-markdown-to-target";
import { computeStateIntegrity } from "./compute-state-integrity";
import { readDepbadgeRC } from "./depbadgerc.read";
import { BadgeArtifact, BadgeArtifactMap, BadgeVariantMap, DepbadgeRC, PackageDependency } from "./depbadgerc.type";
import { getBadgeArtifacts } from "./get-badge-artifacts";
import { getBadgeDependencies } from "./get-badge-dependencies";
import { mapArtifactsToMarkdown } from "./map-artifacts-to-markdown";
import { mapBadgesToMarkdown } from "./map-badges-to-markdown";
import { mapShieldIOEndpointArtifacts } from "./map-shieldio-endpoint-artifacts";
import { mapShieldIOEndpointBadges } from "./map-shieldio-endpoint-badges";
import { outputMarkdownPreview } from "./output-markdown-preview.io";
import { outputShieldioBadgesJson } from "./output-shieldio-badges-json";
import { processManifest } from "./process-manifest";

export type Methods = {
  processManifest(mf: CtxStore<DepbadgeManifest, ManifestMethods>): void;
  getBadgeArtifacts(): BadgeArtifact[];
  getBadgeDependencies(): PackageDependency[];
  outputShieldioBadgesJson(variants: BadgeVariantMap): void;
  mapBadgesToMarkdown(badgeMap: BadgeVariantMap): Record<string, string[]>;
  applyMarkdownToTarget(...markdowns: Record<string, string[]>[]): void;
  mapArtifactsToMarkdown(artifacts: BadgeArtifactMap): Record<string, string[]>;
  mapShieldIOEndpointArtifacts(artifacts: BadgeArtifact[]): BadgeArtifactMap;
  mapShieldIOEndpointBadges(map: BadgeDependencyMap): BadgeVariantMap;
  computeStateIntegrity(...args: any[]): string;
  outputMarkdownPreview(type: "BADGES" | "ARTIFACTS", badgeMarkdownMap: Record<string, string[]>, dir?: string): void;
};

export const rcCtxStore = useCtxStore<DepbadgeRC, Methods>(readDepbadgeRC(), {
  processManifest,
  getBadgeArtifacts,
  getBadgeDependencies,
  outputShieldioBadgesJson,
  mapBadgesToMarkdown,
  applyMarkdownToTarget,
  mapArtifactsToMarkdown,
  computeStateIntegrity,
  mapShieldIOEndpointArtifacts,
  mapShieldIOEndpointBadges,
  outputMarkdownPreview,
});
