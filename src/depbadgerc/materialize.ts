// ! depbadgerc should be agnostic in function and typ from any manifest file
// one solution could be to pass a callback function and require a return type
import { ManifestMethods } from "../manifests/package-json/manifest.store";
import { DepbadgeManifest } from "../manifests/package-json/manifest.type";
import { CtxStore, useCtxCallback } from "../store/ctx-store";

import { Methods } from "./depbadgerc.store";
import { BadgeArtifact, BadgeArtifactSource, DepbadgeRC } from "./depbadgerc.type";
import { BadgeVariant } from "./depbadgerc.type";
import { updateDepbadgeRCIntegrity } from "./depbadgerc.update";

export type BadgeVariantMap = Record<string, Record<string, BadgeVariant[]>>;
export type BadgeArtifactMap = Record<BadgeArtifactSource, BadgeArtifact[]>;

export function canGenerate(x: string[] = [], y: string) {
  return x?.includes(y) ?? false;
}

export function stateIntegrityChanged(x: string | undefined, y: string) {
  return x ? !y.includes(x) : true;
}

export const materialize = useCtxCallback<CtxStore<DepbadgeRC, Methods>>(
  (store, mf: CtxStore<DepbadgeManifest, ManifestMethods>): void => {
    const deps = store.getBadgeDependencies();
    const depMap = mf.dependenciesToBadgeMap(deps); // move to rcStore
    const integrity = store.computeStateIntegrity(deps, mf.version);
    const badgeMap = store.mapShieldIOEndpointBadges(depMap);
    const artifacts = store.getBadgeArtifacts();
    const artifactMap = store.mapShieldIOEndpointArtifacts(artifacts);
    const badgesMarkdown = store.mapBadgesToMarkdown(badgeMap);
    const artifactsMarkdown = store.mapArtifactsToMarkdown(artifactMap);

    if (canGenerate(store.output, "badges")) store.outputShieldioBadgesJson(badgeMap);
    if (canGenerate(store.output, "preview")) {
      store.outputMarkdownPreview("BADGE", badgesMarkdown);
      store.outputMarkdownPreview("ARTIFACT", artifactsMarkdown);
    }

    if (stateIntegrityChanged(store.integrity, integrity)) updateDepbadgeRCIntegrity(integrity);

    const mdBadges = Object.entries(badgesMarkdown)
      .map(([section, badges]) => `${store.badgeStyle.sectionHeader ? `\n\n# ${section}` : ""}\n\n${badges.join("\n")}`)
      .join("")
      .trim();

    const mdArtifacts = Object.entries(artifactsMarkdown)
      .map(([section, badges]) => `${store.badgeStyle.sectionHeader ? `\n\n# ${section}` : ""}\n\n${badges.join("\n")}`)
      .join("")
      .trim();

    store.applyMarkdownToTarget(`<div align="center">\n\n${mdArtifacts}\n\n${mdBadges}\n\n</div>`);

    process.exit(0);
  },
);
