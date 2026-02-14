import fs from "fs";

import { PackageJson } from "../package-json.types";

export function readPackageJson(path = "package.json"): PackageJson {
  const content = fs.readFileSync(path, "utf8");
  return JSON.parse(content);
}
