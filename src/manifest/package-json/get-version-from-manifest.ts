import { CtxStore, useCtxCallback } from "../../store/ctx-store";

import { ManifestMethods } from "./manifest.store";
import { DepbadgeManifest } from "./manifest.type";

export const getVersionFromManifest = useCtxCallback<CtxStore<DepbadgeManifest, ManifestMethods>>(
  (store): string => store.version,
);
