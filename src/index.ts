import { unsupportedManifestFile } from "./depbadge/errors";
import { handleBadgesrc } from "./depbadge/handle-badgesrc";
import { ManifestHandlers } from "./depbadge/types";
import { processPackageJson } from "./manifests/package-json/handle-package-json";
import { readBadgesrc } from "./manifests/package-json/io/read-badgesrc";

const badgesrc = readBadgesrc();

const handlers: ManifestHandlers = new Map([
  ["package.json", processPackageJson(badgesrc)],
  // ADD MORE HANDLERS AS NEEDED
]);

const handler = handlers.get(badgesrc.manifest);
if (handler) handleBadgesrc(badgesrc, handler);
else unsupportedManifestFile(badgesrc.manifest);
