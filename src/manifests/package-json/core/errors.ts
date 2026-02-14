import chalk from "chalk";

export function unsupportedManifestFile(file: string) {
  console.error(`${chalk.bold.yellowBright("DEPBADGES")} ${chalk.redBright(file)}: manifest file not supported`);
  process.exit(1);
}
