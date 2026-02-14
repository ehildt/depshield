import { WithPackageJsonArgs } from "../package-json.types";

import { renderBadgeWithOverride } from "./render-badge-with-override";

import {
  Badgesrc,
  SectionName,
  ShieldIOEndpointBadgeMap,
} from "@/depbadge/types";

export function renderBadgesMarkdown(
  badgesrc: Badgesrc<WithPackageJsonArgs>,
  badges: ShieldIOEndpointBadgeMap,
): string {
  const args: WithPackageJsonArgs = {
    dependencies: badgesrc.dependencies,
    devDependencies: badgesrc.devDependencies,
    peerDependencies: badgesrc.peerDependencies,
    otherDependencies: badgesrc.otherDependencies,
  };

  const sectionMap = new Map(badgesrc.sections?.map((s) => [s.name, s]) ?? []);

  const content = Object.entries(args)
    .map(([section, deps]) => {
      const badgeLines =
        deps
          ?.map((dep) => badges[dep])
          .filter(Boolean)
          .map((badge) => {
            return renderBadgeWithOverride({
              ...badge,
              style: badge.style ?? badgesrc.badges?.style ?? "flat-square",
            });
          }) ?? [];

      if (!badgeLines.length) return "";

      const sectionConfig = sectionMap.get(section as SectionName);
      const header =
        badgesrc.sections && sectionConfig
          ? `## ${sectionConfig.label ?? sectionConfig.name}`
          : "";

      return badgesrc.sections
        ? [header, ...badgeLines].filter(Boolean).join("\n")
        : badgeLines.filter(Boolean).join("\n");
    })
    .filter(Boolean)
    .join("\n\n");

  return badgesrc.badges?.center
    ? `<div align="center">\n\n${content}\n\n</div>`
    : content;
}
