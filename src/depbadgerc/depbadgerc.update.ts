import fs from "fs";

import { findFile } from "../shared/find-file";

/**
 * Updates the `integrity` field in an existing depbadgerc YAML file.
 */
export function updateDepbadgeRCIntegrity(integrity: string, path = "depbadgerc.yml"): void {
  const absFilePath = findFile(path);
  if (!absFilePath) return;
  const content = fs.readFileSync(absFilePath, "utf8");
  const newContent = content.match(/^integrity: .*/m)
    ? content.replace(/^integrity: .*/m, `integrity: ${integrity}`)
    : `integrity: ${integrity}\n${content}`;
  fs.writeFileSync(absFilePath, newContent, "utf8");
}
