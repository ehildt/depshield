import fs from "fs";
import yaml from "js-yaml";

import { findFile } from "../shared/find-file";

import { DepbadgeRC } from "./depbadgerc.type";

/**
 * Reads the `depbadgerc.yml` configuration file and returns its contents
 * as a `DepbadgeRC` object.
 *
 * @returns {DepbadgeRC} The parsed configuration.
 */
export function readDepbadgeRC(path = "depbadgerc.yml"): DepbadgeRC {
  const filePath = findFile(path);
  if (!filePath) throw new Error(`${path} not found`);
  return yaml.load(fs.readFileSync(filePath, "utf8")) as any;
}
