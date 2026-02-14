import { WithPackageJsonArgs } from "../package-json.types";

import { hashStringToHsl } from "./hash-string-to-hsl";

import {
  Badgesrc,
  ShieldIOEndpointBadge,
  ShieldIOEndpointBadgeKVPair,
  ShieldIOEndpointBadgeMap,
} from "@/depbadge/types";

function createShieldIOEndpointBadgeKVPair(
  label: string,
  version: string,
  overrideBadge?: ShieldIOEndpointBadge,
): ShieldIOEndpointBadgeKVPair {
  return overrideBadge
    ? [
        label,
        {
          ...overrideBadge,
          label,
          schemaVersion: 1,
          message: version,
          color: overrideBadge.color ?? hashStringToHsl(label),
        },
      ]
    : [
        label,
        {
          message: version,
          color: hashStringToHsl(label),
          label,
          schemaVersion: 1,
        },
      ];
}

export function generateShieldIOEndpointBadgeMap(
  badgesrc: Badgesrc<WithPackageJsonArgs>,
  versions: Record<string, string>,
): ShieldIOEndpointBadgeMap {
  const entries = [
    badgesrc.dependencies,
    badgesrc.devDependencies,
    badgesrc.peerDependencies,
    badgesrc.otherDependencies,
  ]
    .filter(Boolean)
    .flat()
    .flatMap((dep) =>
      dep && versions[dep]
        ? [
            createShieldIOEndpointBadgeKVPair(
              dep,
              versions[dep],
              badgesrc.badges?.overrides?.[dep],
            ),
          ]
        : [],
    );

  return Object.fromEntries(entries);
}
