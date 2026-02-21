import fs from "fs";

import { CtxStore, useCtxCallback } from "../store/ctx-store";

import { Methods } from "./depbadgerc.store";
import { DepbadgeRC } from "./depbadgerc.type";

export const outputMarkdownPreview = useCtxCallback<CtxStore<DepbadgeRC, Methods>>(
  (store, type: "BADGES" | "ARTIFACTS", badgeMarkdownMap: Record<string, string[]>, dir = ".depbadge"): void => {
    const md = Object.entries(badgeMarkdownMap)
      .map(([section, badges]) => `${store.badgeStyle.sectionHeader ? `\n\n# ${section}` : ""}\n\n${badges.join("\n")}`)
      .join("")
      .trim();
    const content = store.badgeStyle.center ? `<div align="center">\n\n${md}\n\n</div>` : md;
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(`${dir}/${type}.md`, content);
  },
);
