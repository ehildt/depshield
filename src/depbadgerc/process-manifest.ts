import { CtxStore, useCtxCallback } from "../store/ctx-store";

import { Methods } from "./depbadgerc.store";
import { DepbadgeRC, DepbadgeRCManifestTemplateContract } from "./depbadgerc.type";
import { updateDepbadgeRCIntegrity } from "./depbadgerc.update";

function canOutput(x: string[] = [], y: string) {
  return x?.includes(y) ?? false;
}

function canUpdate(x: string | undefined, y: string) {
  return x ? !y.includes(x) : true;
}

export const processManifest = useCtxCallback<CtxStore<DepbadgeRC, Methods>>(
  (store, c: DepbadgeRCManifestTemplateContract): void => {
    const deps = store.getBadgeDependencies();
    const depMap = c.dependenciesToBadgeMap(deps);
    const integrity = store.computeStateIntegrity(deps, c.getVersionFromManifest());
    const badgeMap = store.mapShieldIOEndpointBadges(depMap);
    const artifacts = store.getBadgeArtifacts();
    const artifactMap = store.mapShieldIOEndpointArtifacts(artifacts);
    const badgesMarkdown = store.mapBadgesToMarkdown(badgeMap);
    const artifactsMarkdown = store.mapArtifactsToMarkdown(artifactMap);

    if (canOutput(store.output, "json")) store.outputShieldioBadgesJson(badgeMap);
    if (canOutput(store.output, "markdown")) {
      store.outputMarkdownPreview("BADGES", badgesMarkdown);
      store.outputMarkdownPreview("ARTIFACTS", artifactsMarkdown);
    }

    store.applyMarkdownToTarget(artifactsMarkdown, badgesMarkdown);
    if (canUpdate(store.integrity, integrity)) updateDepbadgeRCIntegrity(integrity);
    process.exit(0);
  },
);
