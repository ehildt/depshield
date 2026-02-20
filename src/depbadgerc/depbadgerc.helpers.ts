// ! depbadgerc should be agnostic in function and typ from any manifest file
// one solution could be to pass a callback function and require a return type
import crypto from "crypto";
import fs from "fs";
import yaml from "js-yaml";
import { Store } from "src/store/create-store";

import { BadgeArtifact, BadgeArtifactSource, DependenciesArtifacts } from "../depbadgerc/depbadgerc.type";
import { BadgeDependencyMap } from "../manifests/package-json/dependencies-to-badge-map";
import { ManifestMethods } from "../manifests/package-json/manifest.store";
import { DepbadgeManifest } from "../manifests/package-json/manifest.type";
import { README_MD } from "../shared/constants";
import { findFile } from "../shared/find-file";
import { hashStringToHsl } from "../shared/hash-string-to-hsl";

import { DepbadgeRCMethods } from "./depbadgerc.store";
import { BadgeStyle, BadgeVariant, DepbadgeRC, PackageDependency } from "./depbadgerc.type";
import { updateDepbadgeRCIntegrity } from "./depbadgerc.update";

export type BadgeVariantMap = Record<string, Record<string, BadgeVariant[]>>;
export type BadgeArtifactMap = Record<BadgeArtifactSource, BadgeArtifact[]>;

export function canGenerateHelper(args: string[] = [], v: string) {
  return args?.includes(v) ?? false;
}

export function stateIntegrityChangedHelper(arg: string | undefined, v: string) {
  return arg ? !v.includes(arg) : true;
}

export function getDependenciesHelper(darts: DependenciesArtifacts): PackageDependency[] {
  return darts.filter((d): d is PackageDependency => Array.isArray(d.packages));
}

export function getArtifactsHelper(darts: DependenciesArtifacts): BadgeArtifact[] {
  return darts.filter((d): d is BadgeArtifact => d.artifact !== undefined);
}

/**
 * Returns a deterministic SHA-256 integrity hash for the given payload and DepbadgeRC.
 *
 * The hash is computed from:
 * - The YAML serialization of `depbadgerc` with `integrity` set to null
 * - The JSON serialization of `payload`
 *
 * Both parts are concatenated using `" --- "` and hashed using UTF-8 encoding.
 *
 * @param rest - JSON-serializable data contributing to the integrity state.
 * @param depbadgerc - DepbadgeRC configuration; its `integrity` field is excluded.
 * @returns Hex-encoded SHA-256 digest.
 */
export function computeStateIntegrityHelper(depbadgerc: DepbadgeRC, ...rest: unknown[]) {
  const payloadStringified = JSON.stringify(rest);
  const hash = crypto.createHash("sha256");
  const yml = yaml.dump({ ...JSON.parse(JSON.stringify(depbadgerc)), integrity: null });
  hash.update(`${yml} --- ${payloadStringified}`, "utf8");
  return hash.digest("hex");
}

export function generateShieldIOEndpointBadgeMapHelper(
  depMap: BadgeDependencyMap,
  badgeStyle: BadgeStyle,
): BadgeVariantMap {
  const { style, cacheSeconds: defaultCache, variants = {} } = badgeStyle;

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
}

const REGEX = /[^a-zA-Z0-9]/g;
const encodeMessage = (s: string) => encodeURIComponent(s.replace(/^\^/, "v"));
const encodeLabel = (s: string) => encodeURIComponent(s?.replace(REGEX, "_"));

export function renderBadgeMarkdownMapHelper(
  badgeMap: BadgeVariantMap,
  badgeStyle: BadgeStyle,
): Record<string, string[]> {
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
            ...(variant.style ?? badgeStyle.style ? { style: variant.style ?? badgeStyle.style } : {}),
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
}

export function generateShieldIOEndpointArtifactMapHelper(artifacts: BadgeArtifact[]): BadgeArtifactMap {
  return artifacts.reduce<BadgeArtifactMap>(
    (acc, { source, label, artifact }) => ({
      ...acc,
      [source]: [...(acc[source] ?? []), { source, label, artifact }],
    }),
    {} as BadgeArtifactMap,
  );
}

export function generateGithubArtifactBadge(
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

export function generateDockerHubArtifactBadge(
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

export function generateCodecovArtifactBadge(
  item: Extract<BadgeArtifact, { source: "codecov" }>,
  badgeStyle: BadgeStyle,
): string {
  // [![Codecov Coverage](https://img.shields.io/codecov/c/github/ehildt/depbadge?labelColor=%23000000&logo=codecov&logoColor=white&logoWidth=40&style=for-the-badge&cacheSeconds=3600&color=%234CAF50)](https://codecov.io/gh/ehildt/depbadge)
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

export function renderArtifactMarkdownMapHelper(
  artifactMap: BadgeArtifactMap,
  badgeStyle: BadgeStyle,
): Record<string, string[]> {
  return {
    artifacts: Object.values(artifactMap).flatMap((artifacts) =>
      artifacts
        .map((item) => {
          if (item.source === "github") return generateGithubArtifactBadge(item, badgeStyle);
          if (item.source === "docker") return generateDockerHubArtifactBadge(item, badgeStyle);
          if (item.source === "codecov") return generateCodecovArtifactBadge(item, badgeStyle);
        })
        .filter((x): x is string => Boolean(x)),
    ),
  };
}

export function outputMarkdownPreviewHelper(
  type: "BADGE" | "ARTIFACT",
  badgeMarkdownMap: Record<string, string[]>,
  badgeStyle: BadgeStyle,
  dir = ".depbadge",
): void {
  const md = Object.entries(badgeMarkdownMap)
    .map(([section, badges]) => `${badgeStyle.sectionHeader ? `\n\n# ${section}` : ""}\n\n${badges.join("\n")}`)
    .join("")
    .trim();
  const content = badgeStyle.center ? `<div align="center">\n\n${md}\n\n</div>` : md;
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(`${dir}/${type}_PREVIEW.md`, content);
}

export function outputShieldIODynamicBadgesHelper(badgeMap: BadgeVariantMap, dir = ".depbadge"): void {
  Object.entries(badgeMap).forEach(([section, files]) => {
    fs.mkdirSync(`${dir}/${section}`, { recursive: true });
    Object.entries(files).forEach(([fileName, badges]) =>
      badges.forEach((badge) => fs.writeFileSync(`${dir}/${section}/${fileName}.json`, JSON.stringify(badge, null, 2))),
    );
  });
}

export function injectMarkdownIntoTarget(markdown: string, target = README_MD) {
  const fileAbsPath = findFile(target);
  if (!fileAbsPath) return;
  const fileContent = fs
    .readFileSync(fileAbsPath, "utf8")
    .replace(
      /<!-- DEPBADGE:START -->[\s\S]*?<!-- DEPBADGE:END -->/,
      `<!-- DEPBADGE:START -->\n${markdown}\n<!-- DEPBADGE:END -->`,
    );

  fs.writeFileSync(target, fileContent, "utf8");
}

export function materializeHelper(
  mf: Store<DepbadgeManifest, ManifestMethods>,
  rc: Store<DepbadgeRC, DepbadgeRCMethods>,
) {
  const deps = rc.getDependencies();
  const depMap = mf.dependenciesToBadgeMap(deps);
  const integrity = rc.computeStateIntegrity(deps, mf.version);
  const badgeMap = rc.generateShieldIOEndpointBadgeMap(depMap);
  const artifacts = rc.getArtifacts();
  const artifactMap = rc.generateShieldIOEndpointArtifactMap(artifacts);
  const badgesMarkdown = rc.renderBadgeMarkdownMap(badgeMap);
  const artifactsMarkdown = rc.renderArtifactMarkdownMap(artifactMap);

  if (rc.canGenerate("badges")) rc.outputShieldIODynamicBadges(badgeMap);
  if (rc.canGenerate("preview")) {
    rc.outputMarkdownPreview("BADGE", badgesMarkdown);
    rc.outputMarkdownPreview("ARTIFACT", artifactsMarkdown);
  }

  // ! clean the helpers file
  if (rc.stateIntegrityChanged(integrity)) updateDepbadgeRCIntegrity(integrity);

  const mdBadges = Object.entries(badgesMarkdown)
    .map(([section, badges]) => `${rc.badgeStyle.sectionHeader ? `\n\n# ${section}` : ""}\n\n${badges.join("\n")}`)
    .join("")
    .trim();

  const mdArtifacts = Object.entries(artifactsMarkdown)
    .map(([section, badges]) => `${rc.badgeStyle.sectionHeader ? `\n\n# ${section}` : ""}\n\n${badges.join("\n")}`)
    .join("")
    .trim();

  injectMarkdownIntoTarget(`<div align="center">\n\n${mdArtifacts}\n\n${mdBadges}\n\n</div>`);

  process.exit(0);
}
