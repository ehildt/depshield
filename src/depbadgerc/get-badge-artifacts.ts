import { CtxStore, useCtxCallback } from "../store/ctx-store";

import { Methods } from "./depbadgerc.store";
import { BadgeArtifact, DepbadgeRC } from "./depbadgerc.type";

export const getBadgeArtifacts = useCtxCallback<CtxStore<DepbadgeRC, Methods>>((store): BadgeArtifact[] => {
  return store.dependencies.filter((d): d is BadgeArtifact => d.artifact !== undefined);
});
