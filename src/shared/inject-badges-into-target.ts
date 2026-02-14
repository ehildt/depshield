// import chalk from "chalk";
// import fs from "fs";
//
// import { DepbadgeRC } from "../depbadgerc/types";
// import { writeDepbadgeRC } from "../manifests/package-json/io/write-depbadgerc";
// import { WithPackageJsonArgs } from "../manifests/package-json/package-json.types";
//
// import { DEPBADGE, README_MD } from "./constants";
// import { findFile } from "./find-file";
//
// export function injectBadgesIntoTarget(
//   target = README_MD,
//   depbadgerc: DepbadgeRC<WithPackageJsonArgs>,
//   renderedBadges: string,
//   integrity: string,
// ) {
//   let fileContent;
//   const fileAbsPath = findFile(target);
//   if (fileAbsPath && !depbadgerc.generateBadgesPreview) {
//     fileContent = fs.readFileSync(fileAbsPath, "utf8");
//     fileContent = fileContent.replace(
//       /<!-- DEPBADGE:START -->[\s\S]*?<!-- DEPBADGE:END -->/,
//       `<!-- DEPBADGE:START -->\n${renderedBadges}\n<!-- DEPBADGE:END -->`,
//     );
//
//     fs.writeFileSync(target, fileContent, "utf8");
//     writeDepbadgeRC(depbadgerc, integrity);
//     console.log(
//       `${chalk.bold.yellowBright(DEPBADGE)} ${chalk.blueBright(target)}: updated - depbadgerc/dependencies changed.`,
//     );
//   } else if (depbadgerc.generateBadgesPreview)
//     console.warn(`${chalk.bold.yellowBright(DEPBADGE)} ${chalk.redBright(target)}: skipped — disable badge preview.`);
//   else console.warn(`${chalk.bold.yellowBright(DEPBADGE)} ${chalk.redBright(target)}: skipped — file not found.`);
// }
