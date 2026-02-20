import { BadgeDependencyMap } from "../manifests/package-json/dependencies-to-badge-map";
import { hashStringToHsl } from "../shared/hash-string-to-hsl";
import { CtxStore, useCtxCallback } from "../store/ctx-store";

import { Methods } from "./depbadgerc.store";
import { DepbadgeRC } from "./depbadgerc.type";
import { BadgeVariantMap } from "./materialize";

export const mapShieldIOEndpointBadges = useCtxCallback<CtxStore<DepbadgeRC, Methods>>(
  (store, depMap: BadgeDependencyMap): BadgeVariantMap => {
    const { style, cacheSeconds: defaultCache, variants = {} } = store.badgeStyle;
    return Object.fromEntries(
      Object.entries(depMap).map(([section, packages]) => [
        section,
        Object.fromEntries(
          Object.entries(packages).map(([pkgName, version]) => {
            const variant = variants[pkgName] || {};
            return [
              pkgName,
              [
                {
                  color: variant.color || hashStringToHsl(pkgName),
                  labelColor: variant.labelColor || "ghostwhite",
                  isError: variant.isError,
                  message: version,
                  style: variant.style || style,
                  cacheSeconds: variant.cacheSeconds ?? defaultCache,
                  link: variant.link,
                  namedLogo: variant.namedLogo,
                  logoColor: variant.logoColor,
                  logoSvg: variant.logoSvg,
                  logoWidth: variant.logoWidth,
                },
              ],
            ];
          }),
        ),
      ]),
    );
  },
);
