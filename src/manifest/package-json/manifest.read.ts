import fs from "fs";

import { findFile } from "../../shared/find-file";

import { DepbadgeManifest } from "./manifest.type";

export function readManifest(path = "package.json"): DepbadgeManifest {
  const filePath = findFile(path);
  if (!filePath) throw new Error(`${path} not found`);
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as DepbadgeManifest;
}
