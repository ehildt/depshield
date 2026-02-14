/* eslint-disable no-console */
import chalk from "chalk";
import fs from "fs";

import { BADGES_JSON, BADGES_MD, DEPBADGE } from "./constants";
import { injectBadgesIntoTarget } from "./inject-badges-into-target";
import { Badgesrc, Data } from "./types";

export function handleBadgesrc<T = any, U = any>(
  badgesrc: Badgesrc<T>,
  data: Data<U>,
) {
  if (badgesrc.generateBadgesPreview) {
    fs.writeFileSync(BADGES_MD, data.badgesMD);
    console.log(
      `${chalk.bold.yellowBright(DEPBADGE)} ${chalk.blueBright(
        BADGES_MD,
      )}: created.`,
    );
  }

  if (badgesrc.generateBadgesJson) {
    fs.writeFileSync(BADGES_JSON, JSON.stringify(data.badgesJson, null, 2));
    console.log(
      `${chalk.bold.yellowBright(DEPBADGE)} ${chalk.blueBright(
        BADGES_JSON,
      )}: created.`,
    );
  }

  if (badgesrc.integrity !== data.integrity) {
    injectBadgesIntoTarget(
      badgesrc.target,
      badgesrc,
      data.badgesMD,
      data.integrity,
    );
  } else {
    console.log(
      `${chalk.bold.yellowBright(DEPBADGE)} ${chalk.blueBright(
        badgesrc.manifest,
      )}: skip — dependencies unchanged.`,
    );
    process.exit(0);
  }
}
