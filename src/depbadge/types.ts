export type ManifestFile =
  | "package.json"
  | "pyproject.toml"
  | "Cargo.toml"
  | "pom.xml";

export type BadgeStyle =
  | "flat"
  | "flat-square"
  | "plastic"
  | "for-the-badge"
  | "social";

export type SectionName =
  | "dependencies"
  | "devDependencies"
  | "peerDependencies"
  | "otherDependencies";

export type ShieldIOEndpointBadge = {
  schemaVersion: number;
  label: string;
  message: string;
  color: string;
  labelColor?: string;
  isError?: boolean;
  namedLogo?: string;
  logoSvg?: string;
  logoColor?: string;
  logoWidth?: string;
  style?: BadgeStyle;
  cacheSeconds?: number;
};

export type BadgeOverride = ShieldIOEndpointBadge & {
  link?: string;
};

export type ShieldIOEndpointBadgeKVPair = [string, ShieldIOEndpointBadge];

export type Section = {
  name: SectionName;
  label?: string;
};

export type Badges = {
  style?: BadgeStyle;
  center: boolean;
  overrides?: Record<string, BadgeOverride>;
};

export type Badgesrc<T = unknown> = T & {
  target?: string;
  integrity?: string;
  manifest: ManifestFile;
  readmePath: string;
  generateBadgesPreview: boolean;
  generateBadgesJson: boolean;
  sections?: Array<Section>;
  badges?: Badges;
};

export type ShieldIOEndpointBadgeMap = Record<string, ShieldIOEndpointBadge>;

export type Data<T = any> = {
  badgesJson: ShieldIOEndpointBadgeMap;
  badgesMD: string;
  integrity: string;
  manifest: T;
};

export type ManifestHandlers = Map<string, Data<any>>;
