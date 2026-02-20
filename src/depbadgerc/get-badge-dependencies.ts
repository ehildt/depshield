import { CtxStore, useCtxCallback } from "../store/ctx-store";

import { Methods } from "./depbadgerc.store";
import { DepbadgeRC, PackageDependency } from "./depbadgerc.type";

export const getBadgeDependencies = useCtxCallback<CtxStore<DepbadgeRC, Methods>>((store): PackageDependency[] => {
  return store.dependencies.filter((d): d is PackageDependency => Array.isArray(d.packages));
});
