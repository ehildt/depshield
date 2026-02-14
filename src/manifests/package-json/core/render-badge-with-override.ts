import { BadgeOverride } from "@/depbadge/types";

const REGEX = /[^a-zA-Z0-9]/g;
const encodeMessage = (s: string) => encodeURIComponent(s.replace(/^\^/, "v"));
const encodeLabel = (s: string) => encodeURIComponent(s?.replace(REGEX, "_"));

// we could use badge-make but I found it unpolished
export function renderBadgeWithOverride(badge: BadgeOverride): string {
  const params = new URLSearchParams();

  if (badge.labelColor) params.set("labelColor", badge.labelColor);
  if (badge.isError) params.set("isError", "true");
  if (badge.namedLogo) params.set("logo", badge.namedLogo);
  if (badge.logoColor) params.set("logoColor", badge.logoColor);
  if (badge.logoWidth) params.set("logoWidth", badge.logoWidth);
  if (badge.style) params.set("style", badge.style);
  if (badge.cacheSeconds)
    params.set("cacheSeconds", badge.cacheSeconds.toString());
  if (badge.logoSvg)
    params.set(
      "logo",
      `data:image/svg+xml;utf8,${encodeURIComponent(badge.logoSvg)}`,
    );

  const url = `https://img.shields.io/badge/${encodeLabel(
    badge.label,
  )}-${encodeMessage(badge.message)}-${encodeURIComponent(badge.color)}.svg${
    params.toString() ? `?${params.toString()}` : ""
  }`;

  return badge.link
    ? `[![${badge.label}](${url})](${badge.link})`
    : `![${badge.label}](${url})`;
}
