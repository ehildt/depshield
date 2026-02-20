import { hashStringToHsl } from "../shared/hash-string-to-hsl";
import { CtxStore, useCtxCallback } from "../store/ctx-store";

import { Methods } from "./depbadgerc.store";
import { BadgeArtifact, BadgeStyle, DepbadgeRC } from "./depbadgerc.type";
import { BadgeArtifactMap } from "./materialize";

const REGEX = /[^a-zA-Z0-9]/g;
const encodeLabel = (s: string) => encodeURIComponent(s?.replace(REGEX, "_"));

export function mapGithubArtifactToMarkdownBadge(
  item: Extract<BadgeArtifact, { source: "github" }>,
  badgeStyle: BadgeStyle,
): string {
  const variant = badgeStyle.variants?.[item.source];
  const urlSearchParams = new URLSearchParams({
    ...(variant?.labelColor && { labelColor: variant.labelColor }),
    ...(variant?.isError && { isError: "true" }),
    ...(variant?.namedLogo && { logo: variant.namedLogo }),
    ...(variant?.logoColor && { logoColor: variant.logoColor }),
    ...(variant?.logoWidth && { logoWidth: variant.logoWidth.toString() }),
    ...(variant?.style ?? badgeStyle.style ? { style: variant?.style ?? badgeStyle.style } : {}),
    ...(variant?.cacheSeconds && { cacheSeconds: variant.cacheSeconds.toString() }),
    ...(variant?.color && { color: variant.color ?? hashStringToHsl(item.source) }),
    ...(variant?.logoSvg && { logo: `data:image/svg+xml;utf8,${encodeURIComponent(variant.logoSvg)}` }),
    ...(item.artifact.branch && { branch: item.artifact.branch }),
  }).toString();

  const label = item.label ?? item.source;
  const src = encodeLabel(item.source);
  const user = encodeLabel(item.artifact.user);
  const metric = encodeLabel(item.artifact.metric);
  const repo = encodeLabel(item.artifact.repo);
  const url = `https://img.shields.io/${src}/${metric}/${user}/${repo}?${urlSearchParams}`;
  return variant?.link ? `[![${label}](${url})](${variant.link})` : `![${label}](${url})`;
}

export function mapDockerHubArtifactToMarkdownBadge(
  item: Extract<BadgeArtifact, { source: "docker" }>,
  badgeStyle: BadgeStyle,
): string {
  const variant = badgeStyle.variants?.[item.source];
  const urlSearchParams = new URLSearchParams({
    ...(variant?.labelColor && { labelColor: variant.labelColor }),
    ...(variant?.isError && { isError: "true" }),
    ...(variant?.namedLogo && { logo: variant.namedLogo }),
    ...(variant?.logoColor && { logoColor: variant.logoColor }),
    ...(variant?.logoWidth && { logoWidth: variant.logoWidth.toString() }),
    ...(variant?.style ?? badgeStyle.style ? { style: variant?.style ?? badgeStyle.style } : {}),
    ...(variant?.cacheSeconds && { cacheSeconds: variant.cacheSeconds.toString() }),
    ...(variant?.color && { color: variant.color ?? hashStringToHsl(item.source) }),
    ...(variant?.logoSvg && { logo: `data:image/svg+xml;utf8,${encodeURIComponent(variant.logoSvg)}` }),
    ...(item.artifact.tag && item.artifact.metric === "v" && { tag: item.artifact.tag }),
  }).toString();

  const label = item.label ?? item.source;
  const src = encodeLabel(item.source);
  const user = encodeLabel(item.artifact.user ?? "library");
  const metric = encodeLabel(item.artifact.metric ?? "v");
  const image = encodeLabel(item.artifact.image);
  const url = `https://img.shields.io/${src}/${metric}/${user}/${image}?${urlSearchParams}`;
  return variant?.link ? `[![${label}](${url})](${variant.link})` : `![${label}](${url})`;
}

export function mapCodecovArtifactToMarkdownBadge(
  item: Extract<BadgeArtifact, { source: "codecov" }>,
  badgeStyle: BadgeStyle,
): string {
  const variant = badgeStyle.variants?.[item.source];
  const urlSearchParams = new URLSearchParams({
    ...(variant?.labelColor && { labelColor: variant.labelColor }),
    ...(variant?.isError && { isError: "true" }),
    ...(variant?.namedLogo && { logo: variant.namedLogo }),
    ...(variant?.logoColor && { logoColor: variant.logoColor }),
    ...(variant?.logoWidth && { logoWidth: variant.logoWidth.toString() }),
    ...(variant?.style ?? badgeStyle.style ? { style: variant?.style ?? badgeStyle.style } : {}),
    ...(variant?.cacheSeconds && { cacheSeconds: variant.cacheSeconds.toString() }),
    ...(variant?.color && { color: variant.color ?? hashStringToHsl(item.source) }),
    ...(variant?.logoSvg && { logo: `data:image/svg+xml;utf8,${encodeURIComponent(variant.logoSvg)}` }),
    ...(item.artifact.branch && { branch: item.artifact.branch }),
  }).toString();

  const label = item.label ?? item.source;
  const user = encodeLabel(item.artifact.user ?? "library");
  const repo = encodeLabel(item.artifact.repo);
  const provider = encodeLabel(item.artifact.provider);
  const flag = encodeLabel(item.artifact.flag ?? "c");
  const url = `https://img.shields.io/codecov/${flag}/${provider}/${user}/${repo}?${urlSearchParams}`;
  return variant?.link ? `[![${label}](${url})](${variant.link})` : `![${label}](${url})`;
}

export const mapArtifactsToMarkdown = useCtxCallback<CtxStore<DepbadgeRC, Methods>>(
  (store, artifactMap: BadgeArtifactMap): Record<string, string[]> => {
    return {
      artifacts: Object.values(artifactMap).flatMap((artifacts) =>
        artifacts
          .map((item) => {
            if (item.source === "github") return mapGithubArtifactToMarkdownBadge(item, store.badgeStyle);
            if (item.source === "docker") return mapDockerHubArtifactToMarkdownBadge(item, store.badgeStyle);
            if (item.source === "codecov") return mapCodecovArtifactToMarkdownBadge(item, store.badgeStyle);
          })
          .filter((x): x is string => Boolean(x)),
      ),
    };
  },
);
