import { rcStore } from "./depbadgerc/depbadgerc.store";
import { unsupportedManifestFile } from "./manifests/package-json/core/errors";
import { mfStore } from "./manifests/package-json/manifest.store";

if (rcStore.manifest === "package.json") rcStore.materialize(mfStore);
else unsupportedManifestFile(rcStore.manifest);
