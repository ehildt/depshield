import crypto from "crypto";
import yaml from "js-yaml";

import { PackageJson } from "../package-json.types";

import { Badgesrc } from "@/depbadge/types";

export function getStableConfigHash(
  badgesrc: Badgesrc,
  manifest: PackageJson,
): string {
  const hash = crypto.createHash("sha256");
  const brc = { ...badgesrc, integrity: null };
  const { dependencies, devDependencies, peerDependencies } = manifest;
  const payload = `${yaml.dump(brc)} --- ${JSON.stringify({
    dependencies,
    devDependencies,
    peerDependencies,
  })}`;
  hash.update(payload, "utf8");
  return hash.digest("hex");
}
