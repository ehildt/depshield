import { WithPackageJsonArgs } from "../package-json.types";

import { generateShieldIOEndpointBadgeMap } from "./generate-shieldio-badges-json";

import type { Badgesrc } from "@/depbadge/types";

jest.mock("./hash-string-to-hsl", () => ({
  hashStringToHsl: jest.fn((str: string) => `color-for-${str}`),
}));

describe("generateShieldIOEndpointBadgeMap", () => {
  const depName = "dep1";
  const devName = "dev1";
  const peerName = "peer1";
  const otherName = "other1";

  const baseBadgesrc: Badgesrc<WithPackageJsonArgs> = {
    manifest: "package.json",
    readmePath: "./README.md",
    generateBadgesPreview: true,
    generateBadgesJson: true,
  };

  it("creates badges for dependencies only", () => {
    const badgesrc: Badgesrc<WithPackageJsonArgs> = {
      ...baseBadgesrc,
      dependencies: [depName],
    };
    const versions = { [depName]: "1.0.0" };
    const map = generateShieldIOEndpointBadgeMap(badgesrc, versions);

    expect(map).toEqual({
      [depName]: {
        label: depName,
        message: "1.0.0",
        color: `color-for-${depName}`,
        schemaVersion: 1,
      },
    });
  });

  it("handles all dependency sections", () => {
    const badgesrc: Badgesrc<WithPackageJsonArgs> = {
      ...baseBadgesrc,
      dependencies: [depName],
      devDependencies: [devName],
      peerDependencies: [peerName],
      otherDependencies: [otherName],
    };
    const versions = {
      [depName]: "1.0.0",
      [devName]: "0.1.0",
      [peerName]: "2.0.0",
      [otherName]: "3.0.0",
    };
    const map = generateShieldIOEndpointBadgeMap(badgesrc, versions);

    expect(Object.keys(map)).toHaveLength(4);
    expect(map[depName].message).toBe("1.0.0");
    expect(map[devName].message).toBe("0.1.0");
    expect(map[peerName].message).toBe("2.0.0");
    expect(map[otherName].message).toBe("3.0.0");
  });

  it("skips dependencies without versions", () => {
    const badgesrc: Badgesrc<WithPackageJsonArgs> = {
      ...baseBadgesrc,
      dependencies: ["missingDep"],
    };
    const map = generateShieldIOEndpointBadgeMap(badgesrc, {}); // no versions
    expect(map).toEqual({});
  });

  it("applies badge overrides", () => {
    const badgesrc: Badgesrc<WithPackageJsonArgs> = {
      ...baseBadgesrc,
      dependencies: [depName],
      badges: {
        overrides: {
          [depName]: {
            schemaVersion: 99,
            label: "old-label",
            message: "old-message",
            color: "blue",
          },
        },
      },
    };
    const versions = { [depName]: "1.2.3" };
    const map = generateShieldIOEndpointBadgeMap(badgesrc, versions);

    expect(map[depName]).toEqual({
      schemaVersion: 1, // always reset to 1
      label: depName, // always replaced with dep name
      message: "1.2.3",
      color: "blue", // preserved from override
    });
  });

  it("returns empty map if no dependencies in any section", () => {
    const badgesrc: Badgesrc<WithPackageJsonArgs> = { ...baseBadgesrc };
    const map = generateShieldIOEndpointBadgeMap(badgesrc, {});
    expect(map).toEqual({});
  });
});
