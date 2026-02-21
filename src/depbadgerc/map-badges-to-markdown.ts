import { hashStringToHsl } from "../shared/hash-string-to-hsl";
import { CtxStore, useCtxCallback } from "../store/ctx-store";

import { Methods } from "./depbadgerc.store";
import { BadgeVariantMap, DepbadgeRC } from "./depbadgerc.type";

const REGEX = /[^a-zA-Z0-9]/g;
const encodeMessage = (s: string) => encodeURIComponent(s.replace(/^\^/, "v"));
const encodeLabel = (s: string) => encodeURIComponent(s?.replace(REGEX, "_"));

export const mapBadgesToMarkdown = useCtxCallback<CtxStore<DepbadgeRC, Methods>>(
  (store, badgeMap: BadgeVariantMap): Record<string, string[]> => {
    return Object.fromEntries(
      Object.entries(badgeMap).map(([section, badges]) => [
        section,
        Object.entries(badges).flatMap(([pkgName, variants]) =>
          variants.map((variant) => {
            const urlSearchParams = new URLSearchParams({
              ...(variant.labelColor && { labelColor: variant.labelColor }),
              ...(variant.isError && { isError: "true" }),
              ...(variant.namedLogo && { logo: variant.namedLogo }),
              ...(variant.logoColor && { logoColor: variant.logoColor }),
              ...(variant.logoWidth && { logoWidth: variant.logoWidth.toString() }),
              ...(variant.style ?? store.badgeStyle.style ? { style: variant.style ?? store.badgeStyle.style } : {}),
              ...(variant.cacheSeconds && { cacheSeconds: variant.cacheSeconds.toString() }),
              ...(variant.logoSvg && { logo: `data:image/svg+xml;utf8,${encodeURIComponent(variant.logoSvg)}` }),
            }).toString();

            const dependency = encodeLabel(pkgName);
            const message = encodeMessage(variant.message);
            const color = encodeURIComponent(variant.color ?? hashStringToHsl(pkgName));
            const url = `https://img.shields.io/badge/${dependency}-${message}-${color}.svg?${urlSearchParams}`;
            return variant.link ? `[![${pkgName}](${url})](${variant.link})` : `![${pkgName}](${url})`;
          }),
        ),
      ]),
    );
  },
);
