import { WithPackageJsonArgs } from "../package-json.types";

import { renderBadgesMarkdown } from "./render-badges-markdown";

import { ShieldIOEndpointBadgeMap } from "@/depbadge/types";

describe("renderBadgesMarkdown", () => {
  it("renders badges only for dependencies that have a version", () => {
    const sections: WithPackageJsonArgs = {
      dependencies: ["react", "vue"],
      devDependencies: ["jest"],
      peerDependencies: ["react-dom"],
      otherDependencies: ["my-lib"],
    };

    const badges: ShieldIOEndpointBadgeMap = {
      react: {
        schemaVersion: 1,
        label: "react",
        message: "18.2.0",
        color: "hsl(91,62%,49%)",
      },
      jest: {
        schemaVersion: 1,
        label: "jest",
        message: "30.2.0",
        color: "hsl(210,70%,50%)",
      },
      "react-dom": {
        schemaVersion: 1,
        label: "react-dom",
        message: "18.2.0",
        color: "hsl(91,62%,49%)",
      },
      // "vue" and "my-lib" missing → should be skipped
    };

    const md = renderBadgesMarkdown(sections, badges);

    const expected = [
      "## Dependencies",
      "![react](https://img.shields.io/badge/react-18.2.0-hsl(91%2C62%25%2C49%25).svg?style=for-the-badge)",
      "",
      "## DevDependencies",
      "![jest](https://img.shields.io/badge/jest-30.2.0-hsl(210%2C70%25%2C50%25).svg?style=for-the-badge)",
      "",
      "## PeerDependencies",
      "![react-dom](https://img.shields.io/badge/react_dom-18.2.0-hsl(91%2C62%25%2C49%25).svg?style=for-the-badge)",
      "",
    ].join("\n");

    expect(md).toBe(expected);
  });

  it("skips sections with no badges", () => {
    const sections: WithPackageJsonArgs = {
      dependencies: [],
      devDependencies: [],
      peerDependencies: ["unknown"],
      otherDependencies: [],
    };
    const badges: ShieldIOEndpointBadgeMap = {}; // no badges

    const md = renderBadgesMarkdown(sections, badges);
    expect(md).toBe(""); // completely empty
  });
});
