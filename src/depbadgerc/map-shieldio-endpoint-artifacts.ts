import { CtxStore, useCtxCallback } from "../store/ctx-store";

import { Methods } from "./depbadgerc.store";
import { BadgeArtifact, DepbadgeRC } from "./depbadgerc.type";
import { BadgeArtifactMap } from "./materialize";

export const mapShieldIOEndpointArtifacts = useCtxCallback<CtxStore<DepbadgeRC, Methods>>(
  (_, artifacts: BadgeArtifact[]): BadgeArtifactMap => {
    return artifacts.reduce<BadgeArtifactMap>(
      (acc, { source, label, artifact }) => ({
        ...acc,
        [source]: [...(acc[source] ?? []), { source, label, artifact }],
      }),
      {} as BadgeArtifactMap,
    );
  },
);
