import { hashStringToHsl } from "./hash-string-to-hsl";

describe("hashStringToHsl", () => {
  it("returns a valid HSL string", () => {
    const color = hashStringToHsl("example");
    expect(color).toMatch(/^hsl\(\d{1,3},\d{2}%,\d{2}%\)$/);
  });

  it("is deterministic for the same input", () => {
    expect(hashStringToHsl("foo")).toBe(hashStringToHsl("foo"));
  });

  it("produces different colors for different inputs", () => {
    expect(hashStringToHsl("foo")).not.toBe(hashStringToHsl("bar"));
  });

  it("keeps values within expected ranges", () => {
    const [, h, s, l] = hashStringToHsl("range-test")
      .match(/^hsl\((\d+),(\d+)%,(\d+)%\)$/)!
      .map(Number);

    expect(h).toBeGreaterThanOrEqual(0);
    expect(h).toBeLessThan(360);
    expect(s).toBeGreaterThanOrEqual(60);
    expect(s).toBeLessThan(80);
    expect(l).toBeGreaterThanOrEqual(40);
    expect(l).toBeLessThan(55);
  });

  it("handles empty strings", () => {
    expect(hashStringToHsl("")).toBe("hsl(0,60%,40%)");
  });
});
