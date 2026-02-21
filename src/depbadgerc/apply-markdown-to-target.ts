import fs from "fs";

import { findFile } from "../shared/find-file";
import { CtxStore, useCtxCallback } from "../store/ctx-store";

import { Methods } from "./depbadgerc.store";
import { DepbadgeRC } from "./depbadgerc.type";

function formatBadgesArtifactsMarkdown(markdowns: Record<string, string[]>[], renderHeader: boolean = false) {
  return markdowns.reduce(
    (acc, md) =>
      `${acc}\n${Object.entries(md)
        .map(([section, badges]) => `${renderHeader ? `\n\n# ${section}` : ""}\n\n${badges.join("\n")}`)
        .join("")
        .trim()}`,
    "",
  );
}

export const applyMarkdownToTarget = useCtxCallback<CtxStore<DepbadgeRC, Methods>>(
  (store, ...markdowns: Record<string, string[]>[]) => {
    const fileAbsPath = findFile(store.target);
    if (!fileAbsPath) return;

    const fmMarkdown = formatBadgesArtifactsMarkdown(markdowns, store.badgeStyle.sectionHeader);
    const psMarkdown = store.badgeStyle.center
      ? `<div align="center">\n\n${fmMarkdown}\n\n</div>`
      : `<div>\n\n${fmMarkdown}\n\n</div>`;

    const fileContent = fs
      .readFileSync(fileAbsPath, "utf8")
      .replace(
        /<!-- DEPBADGE:START -->[\s\S]*?<!-- DEPBADGE:END -->/,
        `<!-- DEPBADGE:START -->\n${psMarkdown}\n<!-- DEPBADGE:END -->`,
      );

    fs.writeFileSync(store.target, fileContent, "utf8");
  },
);
