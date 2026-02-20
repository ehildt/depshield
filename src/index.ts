import { rcStore } from "./depbadgerc/depbadgerc.store";
import { mfStore } from "./manifests/package-json/manifest.store";

if (rcStore.manifest === "package.json") rcStore.materialize(mfStore);
else {
  // console.error(`${chalk.bold.yellowBright("DEPBADGES")} ${chalk.redBright(file)}: manifest file not supported`);
  process.exit(1);
}
