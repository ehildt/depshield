// ------------------ Badge Types ------------------
export type BadgeVariant = {
  color?: string;
  labelColor?: string;
  isError?: boolean;
  namedLogo?: string;
  message: string;
  logoSvg?: string;
  logoColor?: string;
  logoWidth?: string;
  style?: string;
  cacheSeconds?: number;
  link?: string;
};

export type BadgeStyle = {
  theme: "dark" | "white";
  center?: boolean;
  sectionHeader?: boolean;
  style?: string;
  cacheSeconds?: number;
  variants?: Record<string, BadgeVariant>;
};

// ------------------ Artifact Types ------------------
export type GitHubArtifact = {
  metric: "stars" | "license";
  user: string;
  repo: string;
  branch?: string | null;
};

export type DockerHubArtifact = {
  metric: "pulls" | "stars" | "v";
  user: string;
  image: string;
  tag?: string | null;
};

export type CodecovArtifact = {
  user: string;
  repo: string;
  branch?: string;
  provider: string;
  flag?: string | null;
};

// ------------------ Dependency Types ------------------

// Base XOR type: either packages or artifact, never both
export type PackageDependency = {
  source: string;
  label?: string;
  packages: string[];
  artifact?: never;
};

export type BadgeArtifactSource = "github" | "docker" | "codecov";

export type ArtifactDependency<TSource extends BadgeArtifactSource, TArtifact> = {
  source: TSource;
  label?: string;
  artifact: TArtifact;
  packages?: never;
};

// Concrete dependency types
export type GithubDependency = ArtifactDependency<"github", GitHubArtifact>;
export type DockerHubDependency = ArtifactDependency<"docker", DockerHubArtifact>;
export type CodecovDependency = ArtifactDependency<"codecov", CodecovArtifact>;

// Union of all valid dependencies
export type DependencyItem = PackageDependency | GithubDependency | DockerHubDependency | CodecovDependency;
export type BadgeArtifact = Exclude<DependencyItem, PackageDependency>;

export type DependenciesArtifacts = DependencyItem[];

// ------------------ RC Type ------------------
export type DepbadgeRC = {
  integrity?: string;
  target: string;
  provider: string;
  manifest: string;
  output?: string[];
  badgeStyle: BadgeStyle;
  dependencies: DependenciesArtifacts;
};

// ------------------ Variant/Artifact Maps -----------
export type BadgeVariantMap = Record<string, Record<string, BadgeVariant[]>>;
export type BadgeArtifactMap = Record<BadgeArtifactSource, BadgeArtifact[]>;

// ------------------ Manifest Contract ---------------
export type DepbadgeRCManifestTemplateContract = {
  getVersionFromManifest(): string;
  dependenciesToBadgeMap(deps: PackageDependency[]): Record<string, Record<string, string>>;
};
