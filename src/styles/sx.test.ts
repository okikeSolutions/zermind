import { describe, expect, it } from "vitest";
import { isSafeStyleXUtility } from "./stylex-utility-policy";

const supportedUtilities = new Set(["flex", "sm:px-6", "space-y-4", "sm:space-y-8", "-space-x-2"]);

describe("StyleX utility compatibility", () => {
  it("keeps child-spacing selectors out of parent StyleX declarations", () => {
    expect(isSafeStyleXUtility("space-y-4", supportedUtilities)).toBe(false);
    expect(isSafeStyleXUtility("sm:space-y-8", supportedUtilities)).toBe(false);
    expect(isSafeStyleXUtility("-space-x-2", supportedUtilities)).toBe(false);
  });

  it("continues to send element-local utilities through StyleX", () => {
    expect(isSafeStyleXUtility("flex", supportedUtilities)).toBe(true);
    expect(isSafeStyleXUtility("sm:px-6", supportedUtilities)).toBe(true);
  });
});
