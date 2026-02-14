import { getStableConfigHash } from "./get-stable-config-hash";

describe("getStableConfigHash", () => {
  const baseBadgesrc = {
    manifest: "package.json" as const,
    readmePath: "README.md",
    generateBadgesPreview: true,
    generateBadgesJson: true,
    target: "node",
    integrity: "abc123",
  };

  const baseManifest = {
    name: "my-package",
    version: "1.0.0",
    dependencies: { lodash: "^4.17.21" },
    devDependencies: { typescript: "^5.0.0" },
    peerDependencies: {},
  };

  it("should produce a hash as a hex string", () => {
    const hash = getStableConfigHash(baseBadgesrc, baseManifest);
    expect(typeof hash).toBe("string");
    expect(hash).toMatch(/^[a-f0-9]{64}$/);
  });

  it("should ignore the integrity field when generating hash", () => {
    const modifiedBadgesrc = { ...baseBadgesrc, integrity: "different" };
    const hash1 = getStableConfigHash(baseBadgesrc, baseManifest);
    const hash2 = getStableConfigHash(modifiedBadgesrc, baseManifest);
    expect(hash1).toBe(hash2);
  });

  it("should change hash if dependencies change", () => {
    const modifiedManifest = {
      ...baseManifest,
      dependencies: { lodash: "^4.17.22" },
    };
    const hash1 = getStableConfigHash(baseBadgesrc, baseManifest);
    const hash2 = getStableConfigHash(baseBadgesrc, modifiedManifest);
    expect(hash1).not.toBe(hash2);
  });

  it("should change hash if devDependencies change", () => {
    const modifiedManifest = {
      ...baseManifest,
      devDependencies: { typescript: "^5.1.0" },
    };
    const hash1 = getStableConfigHash(baseBadgesrc, baseManifest);
    const hash2 = getStableConfigHash(baseBadgesrc, modifiedManifest);
    expect(hash1).not.toBe(hash2);
  });

  it("should change hash if peerDependencies change", () => {
    const modifiedManifest = {
      ...baseManifest,
      peerDependencies: { react: "^18.0.0" },
    };
    const hash1 = getStableConfigHash(baseBadgesrc, baseManifest);
    const hash2 = getStableConfigHash(baseBadgesrc, modifiedManifest);
    expect(hash1).not.toBe(hash2);
  });
});
