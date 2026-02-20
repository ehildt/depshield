import fs from "fs";

import { findFile } from "../shared/find-file";
import { CtxStore, useCtxCallback } from "../store/ctx-store";

import { Methods } from "./depbadgerc.store";
import { DepbadgeRC } from "./depbadgerc.type";

export const applyMarkdownToTarget = useCtxCallback<CtxStore<DepbadgeRC, Methods>>((store, markdown: string) => {
  const fileAbsPath = findFile(store.target);
  if (!fileAbsPath) return;
  const fileContent = fs
    .readFileSync(fileAbsPath, "utf8")
    .replace(
      /<!-- DEPBADGE:START -->[\s\S]*?<!-- DEPBADGE:END -->/,
      `<!-- DEPBADGE:START -->\n${markdown}\n<!-- DEPBADGE:END -->`,
    );

  fs.writeFileSync(store.target, fileContent, "utf8");
});
