import fs from "fs";

import { useCtxCallback } from "../store/ctx-store";

import { BadgeVariantMap } from "./depbadgerc.type";

export const outputShieldioBadgesJson = useCtxCallback((_, badgeMap: BadgeVariantMap, dir = ".depbadge"): void => {
  Object.entries(badgeMap).forEach(([section, files]) => {
    fs.mkdirSync(`${dir}/${section}`, { recursive: true });
    Object.entries(files).forEach(([fileName, badges]) =>
      badges.forEach((badge) => fs.writeFileSync(`${dir}/${section}/${fileName}.json`, JSON.stringify(badge, null, 2))),
    );
  });
});
