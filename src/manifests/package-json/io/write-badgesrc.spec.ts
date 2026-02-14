import fs from "fs";

import * as findFileModule from "../../../depbadge/find-file";

import { writeBadgesrc } from "./write-badgesrc";

import { Badgesrc } from "@/depbadge/types";

jest.mock("fs");

describe("writeBadgesrc", () => {
  const mockFindFile = jest.spyOn(findFileModule, "findFile");

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should add the integrity to badgesrc object", () => {
    const badgesrc: Badgesrc = {
      manifest: "package.json",
      readmePath: "README.md",
      generateBadgesPreview: true,
      generateBadgesJson: true,
      target: "node",
    };
    const integrity = "abc123";

    mockFindFile.mockReturnValue("mocked-path.yml");

    writeBadgesrc(badgesrc, integrity);

    expect(badgesrc.integrity).toBe(integrity);
  });

  it("should call findFile with the given path", () => {
    const badgesrc: Badgesrc = {
      manifest: "package.json",
      readmePath: "README.md",
      generateBadgesPreview: true,
      generateBadgesJson: true,
    };
    const path = "custom.yml";
    const integrity = "sig";

    mockFindFile.mockReturnValue("mocked-path.yml");

    writeBadgesrc(badgesrc, integrity, path);

    expect(mockFindFile).toHaveBeenCalledWith(path);
  });

  it("should write YAML to the file with each top-level section separated", () => {
    const badgesrc: Badgesrc = {
      manifest: "package.json",
      readmePath: "README.md",
      generateBadgesPreview: true,
      generateBadgesJson: true,
      target: "node",
    };
    const integrity = "sig";

    mockFindFile.mockReturnValue("/fake/path.yml");

    writeBadgesrc(badgesrc, integrity);

    const writeCall = (fs.writeFileSync as jest.Mock).mock.calls[0];
    const [filePath, content, encoding] = writeCall;

    expect(filePath).toBe("/fake/path.yml");
    expect(encoding).toBe("utf8");
    expect(content).toContain("integrity: sig");
  });

  it("should not write if findFile returns null", () => {
    const badgesrc: Badgesrc = {
      manifest: "package.json",
      readmePath: "README.md",
      generateBadgesPreview: true,
      generateBadgesJson: true,
    };
    const integrity = "sig";

    mockFindFile.mockReturnValue(null);

    writeBadgesrc(badgesrc, integrity);

    expect(fs.writeFileSync).not.toHaveBeenCalled();
  });
});
