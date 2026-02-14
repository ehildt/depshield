/* eslint-disable no-console */
import chalk from "chalk";
import fs from "fs";

import { writeBadgesrc } from "../manifests/package-json/io/write-badgesrc";
import { WithPackageJsonArgs } from "../manifests/package-json/package-json.types";

import { DEPBADGE, README_MD } from "./constants";
import { findFile } from "./find-file";
import { Badgesrc } from "./types";

export function injectBadgesIntoTarget(
  target = README_MD,
  badgesrc: Badgesrc<WithPackageJsonArgs>,
  renderedBadges: string,
  integrity: string,
) {
  let fileContent;
  const fileAbsPath = findFile(target);
  if (fileAbsPath && !badgesrc.generateBadgesPreview) {
    fileContent = fs.readFileSync(fileAbsPath, "utf8");
    fileContent = fileContent.replace(
      /<!-- DEPBADGE:START -->[\s\S]*?<!-- DEPBADGE:END -->/,
      `<!-- DEPBADGE:START -->\n${renderedBadges}\n<!-- DEPBADGE:END -->`,
    );

    fs.writeFileSync(target, fileContent, "utf8");
    writeBadgesrc(badgesrc, integrity);
    console.log(
      `${chalk.bold.yellowBright(DEPBADGE)} ${chalk.blueBright(
        target,
      )}: updated - badgesrc/dependencies changed.`,
    );
  } else if (badgesrc.generateBadgesPreview)
    console.warn(
      `${chalk.bold.yellowBright(DEPBADGE)} ${chalk.redBright(
        target,
      )}: skipped — disable badge preview.`,
    );
  else
    console.warn(
      `${chalk.bold.yellowBright(DEPBADGE)} ${chalk.redBright(
        target,
      )}: skipped — file not found.`,
    );
}
