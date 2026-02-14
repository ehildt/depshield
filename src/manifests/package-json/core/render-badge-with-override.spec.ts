import { renderBadgeWithOverride } from "./render-badge-with-override";

import { BadgeOverride } from "@/depbadge/types";

describe("renderBadgeWithOverride", () => {
  const base: BadgeOverride = {
    schemaVersion: 1,
    label: "build",
    message: "passing",
    color: "green",
  };

  it("renders a basic badge with required fields only", () => {
    expect(renderBadgeWithOverride(base)).toBe(
      "![build](https://img.shields.io/badge/build-passing-green.svg)",
    );
  });

  it("wraps the badge in a markdown link when link is provided", () => {
    const badge: BadgeOverride = { ...base, link: "https://example.com" };

    expect(renderBadgeWithOverride(badge)).toBe(
      "[![build](https://img.shields.io/badge/build-passing-green.svg)](https://example.com)",
    );
  });

  it("includes all optional query parameters when provided", () => {
    const badge: BadgeOverride = {
      schemaVersion: 1,
      label: "coverage",
      message: "90%",
      color: "yellow",
      labelColor: "blue",
      isError: true,
      namedLogo: "github",
      logoColor: "white",
      logoWidth: "20",
      style: "flat-square",
      cacheSeconds: 300,
    };

    expect(renderBadgeWithOverride(badge)).toBe(
      "![coverage](https://img.shields.io/badge/coverage-90%25-yellow.svg?labelColor=blue&isError=true&logo=github&logoColor=white&logoWidth=20&style=flat-square&cacheSeconds=300)",
    );
  });

  it("renders a badge with an inline SVG logo (double-encoded via URLSearchParams)", () => {
    const badge: BadgeOverride = {
      schemaVersion: 1,
      label: "logo",
      message: "svg",
      color: "red",
      logoSvg: "<svg></svg>",
    };

    expect(renderBadgeWithOverride(badge)).toContain(
      "logo=data%3Aimage%2Fsvg%2Bxml%3Butf8%2C%253Csvg%253E%253C%252Fsvg%253E",
    );
  });

  it("encodes special characters in label and message correctly", () => {
    const badge: BadgeOverride = {
      schemaVersion: 1,
      label: "test#badge",
      message: "^pass!",
      color: "blue",
    };

    expect(renderBadgeWithOverride(badge)).toBe(
      "![test#badge](https://img.shields.io/badge/test_badge-vpass!-blue.svg)",
    );
  });

  it("does not include undefined optional fields", () => {
    const badge: BadgeOverride = {
      schemaVersion: 1,
      label: "simple",
      message: "ok",
      color: "green",
      labelColor: undefined,
      style: undefined,
    };

    expect(renderBadgeWithOverride(badge)).toBe(
      "![simple](https://img.shields.io/badge/simple-ok-green.svg)",
    );
  });

  it("logoSvg overrides namedLogo if both are provided", () => {
    const badge: BadgeOverride = {
      schemaVersion: 1,
      label: "logo",
      message: "test",
      color: "blue",
      namedLogo: "github",
      logoSvg: "<svg></svg>",
    };

    const result = renderBadgeWithOverride(badge);

    expect(result).toContain(
      "logo=data%3Aimage%2Fsvg%2Bxml%3Butf8%2C%253Csvg%253E%253C%252Fsvg%253E",
    );
    expect(result).not.toContain("logo=github");
  });
});
