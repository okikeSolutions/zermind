import { describe, expect, it } from "vitest";
import { deLocalizeUrl, localizeHref } from "@/paraglide/runtime.js";
import englishMessages from "../../messages/en.json";
import germanMessages from "../../messages/de.json";

describe("localized routing", () => {
  it("localizes public links and restores internal route paths", () => {
    expect(localizeHref("/privacy", { locale: "en" })).toBe("/en/privacy");
    expect(localizeHref("/privacy", { locale: "de" })).toBe("/de/privacy");
    expect(deLocalizeUrl(new URL("https://zermind.ai/de/demo")).pathname).toBe("/demo/");
  });

  it("does not localize API routes", () => {
    expect(localizeHref("/api/auth/session", { locale: "de" })).toBe("/api/auth/session");
  });
});

describe("translation catalogs", () => {
  it("contains the same message keys in English and German", () => {
    expect(Object.keys(germanMessages).sort()).toEqual(Object.keys(englishMessages).sort());
  });

  it("keeps message placeholders aligned between locales", () => {
    const placeholders = (message: string) =>
      [...message.matchAll(/\{([A-Za-z0-9_]+)\}/g)].map((match) => match[1]).sort();

    for (const [key, english] of Object.entries(englishMessages)) {
      if (key === "$schema") continue;
      expect(placeholders(germanMessages[key as keyof typeof germanMessages]), key).toEqual(
        placeholders(english),
      );
    }
  });
});
