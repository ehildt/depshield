import { buildDependencyMap } from "./core/build-dependency-map";
import { generateShieldIOEndpointBadgeMap } from "./core/generate-shieldio-badges-json";
import { getStableConfigHash } from "./core/get-stable-config-hash";
import { readPackageJson } from "./core/read-package-json";
import { renderBadgesMarkdown } from "./core/render-badges-markdown";
import { PackageJson, WithPackageJsonArgs } from "./package-json.types";

import { Badgesrc, Data } from "@/depbadge/types";

export function processPackageJson(
  badgesrc: Badgesrc<WithPackageJsonArgs>,
): Data<PackageJson> {
  const manifest = readPackageJson();
  const integrity = getStableConfigHash(badgesrc, manifest);
  const versions = buildDependencyMap(manifest, badgesrc.otherDependencies);
  const badgesJson = generateShieldIOEndpointBadgeMap(badgesrc, versions);
  const badgesMD = renderBadgesMarkdown(badgesrc, badgesJson).trim();
  return {
    badgesJson,
    badgesMD,
    integrity,
    manifest,
  } satisfies Data<PackageJson>;
}
