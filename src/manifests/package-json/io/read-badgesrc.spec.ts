import fs from "fs";

import * as findFileModule from "../../../depbadge/find-file";
import { WithPackageJsonArgs } from "../package-json.types";

import { readBadgesrc } from "./read-badgesrc";

import { Badgesrc } from "@/depbadge/types";

jest.mock("fs");

describe("readBadgesrc", () => {
  const mockFindFile = jest.spyOn(findFileModule, "findFile");

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should throw an error if file is not found", () => {
    mockFindFile.mockReturnValue(null);
    expect(() => readBadgesrc("missing.yml")).toThrow("missing.yml not found");
  });

  it("should call findFile with the given path", () => {
    mockFindFile.mockReturnValue("/fake/path.yml");
    (fs.readFileSync as jest.Mock).mockReturnValue("integrity: abc123");

    readBadgesrc("custom.yml");
    expect(mockFindFile).toHaveBeenCalledWith("custom.yml");
  });

  it("should read and parse the YAML file", () => {
    const yamlContent = `
manifest: package.json
readmePath: README.md
generateBadgesPreview: true
generateBadgesJson: true
integrity: abc123
`;
    mockFindFile.mockReturnValue("/fake/path.yml");
    (fs.readFileSync as jest.Mock).mockReturnValue(yamlContent);

    const badgesrc = readBadgesrc(
      "/fake/path.yml",
    ) as Badgesrc<WithPackageJsonArgs>;

    expect(badgesrc.manifest).toBe("package.json");
    expect(badgesrc.readmePath).toBe("README.md");
    expect(badgesrc.generateBadgesPreview).toBe(true);
    expect(badgesrc.generateBadgesJson).toBe(true);
    expect(badgesrc.integrity).toBe("abc123");
  });

  it("should return an empty object if YAML is empty", () => {
    mockFindFile.mockReturnValue("/fake/path.yml");
    (fs.readFileSync as jest.Mock).mockReturnValue("");

    const badgesrc = readBadgesrc("/fake/path.yml");
    expect(badgesrc).toEqual({});
  });
});
