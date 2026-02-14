export type WithPackageJsonArgs = {
  dependencies?: Array<string>;
  devDependencies?: Array<string>;
  peerDependencies?: Array<string>;
  otherDependencies?: Array<string>;
};

export type Author = {
  name: string;
  email?: string;
};

export type Bugs = {
  email?: string;
  url?: string;
};

export type PackageJson = {
  name: string;
  version: string;
  license?: string;
  description?: string;
  bugs?: Bugs;
  author?: Author;
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
};
