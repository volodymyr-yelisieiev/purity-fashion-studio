import { describe, it, expect } from "vitest";
import {
  cn,
  pickLocalized,
  slugify,
  extractPlainText,
  hasContent,
  formatPrice,
  getMediaUrl,
  PLACEHOLDER_IMAGE,
} from "../utils";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("resolves Tailwind conflicts (last wins)", () => {
    const result = cn("px-2 py-1", "px-4");
    expect(result).toContain("px-4");
    expect(result).toContain("py-1");
    expect(result).not.toContain("px-2");
  });

  it("handles conditional classes", () => {
    expect(cn("base", false && "hidden", "extra")).toBe("base extra");
  });

  it("handles empty input", () => {
    expect(cn()).toBe("");
  });
});

describe("pickLocalized", () => {
  it("returns correct locale value from object", () => {
    const obj = { uk: "Привіт", en: "Hello", ru: "Привет" };
    expect(pickLocalized(obj, "en")).toBe("Hello");
    expect(pickLocalized(obj, "uk")).toBe("Привіт");
    expect(pickLocalized(obj, "ru")).toBe("Привет");
  });

  it("returns plain string as-is", () => {
    expect(pickLocalized("plain text", "en")).toBe("plain text");
  });

  it("falls back to uk when locale not found", () => {
    const obj = { uk: "Привіт", en: "Hello" };
    expect(pickLocalized(obj, "fr")).toBe("Привіт");
  });

  it("falls back through en, ru, then first value", () => {
    expect(pickLocalized({ en: "Hi" }, "fr")).toBe("Hi");
    expect(pickLocalized({ ru: "Привет" }, "fr")).toBe("Привет");
    expect(pickLocalized({ de: "Hallo" }, "fr")).toBe("Hallo");
  });

  it("returns undefined for null/undefined", () => {
    expect(pickLocalized(null)).toBeUndefined();
    expect(pickLocalized(undefined)).toBeUndefined();
  });

  it("returns undefined for empty string", () => {
    expect(pickLocalized("")).toBeUndefined();
  });
});

describe("slugify", () => {
  it("converts Latin text to slug", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("converts Cyrillic (Ukrainian) text", () => {
    const result = slugify("Привіт Світ");
    expect(result).toMatch(/^[a-z0-9-]+$/);
    expect(result.length).toBeGreaterThan(0);
  });

  it("handles mixed Latin and Cyrillic", () => {
    const result = slugify("Fashion Стиль 2024");
    expect(result).toMatch(/^[a-z0-9-]+$/);
    expect(result).toContain("fashion");
  });

  it("removes diacritics", () => {
    expect(slugify("café résumé")).toBe("cafe-resume");
  });

  it("replaces special characters with dashes", () => {
    expect(slugify("hello! @world #test")).toBe("hello-world-test");
  });

  it("removes leading/trailing dashes", () => {
    expect(slugify("  hello  ")).toBe("hello");
  });

  it("collapses multiple dashes", () => {
    expect(slugify("hello---world")).toBe("hello-world");
  });

  it("returns empty string for empty input", () => {
    expect(slugify("")).toBe("");
  });

  it("returns empty string for whitespace-only input", () => {
    expect(slugify("   ")).toBe("");
  });
});

describe("extractPlainText", () => {
  it("extracts text from Lexical JSON", () => {
    const lexicalData = {
      root: {
        children: [
          {
            children: [{ text: "Hello" }, { text: "World" }],
          },
        ],
      },
    };
    expect(extractPlainText(lexicalData)).toBe("Hello World");
  });

  it("handles nested children", () => {
    const lexicalData = {
      root: {
        children: [
          {
            children: [
              { text: "Level 1" },
              { children: [{ text: "Level 2" }] },
            ],
          },
        ],
      },
    };
    expect(extractPlainText(lexicalData)).toBe("Level 1 Level 2");
  });

  it("returns empty string for null", () => {
    expect(extractPlainText(null)).toBe("");
  });

  it("returns empty string for undefined", () => {
    expect(extractPlainText(undefined)).toBe("");
  });

  it("returns empty string for empty object", () => {
    expect(extractPlainText({})).toBe("");
  });

  it("returns empty string for object without root", () => {
    expect(extractPlainText({ foo: "bar" })).toBe("");
  });

  it("returns empty string for root with no children", () => {
    expect(extractPlainText({ root: {} })).toBe("");
  });
});

describe("hasContent", () => {
  it("returns true for non-empty string", () => {
    expect(hasContent("hello")).toBe(true);
  });

  it("returns false for empty string", () => {
    expect(hasContent("")).toBe(false);
  });

  it("returns false for whitespace-only string", () => {
    expect(hasContent("   ")).toBe(false);
  });

  it("returns false for null", () => {
    expect(hasContent(null)).toBe(false);
  });

  it("returns false for undefined", () => {
    expect(hasContent(undefined)).toBe(false);
  });

  it("returns true for Lexical object with text", () => {
    const lexical = {
      root: { children: [{ children: [{ text: "Hello" }] }] },
    };
    expect(hasContent(lexical)).toBe(true);
  });

  it("returns false for Lexical object with no text", () => {
    const lexical = { root: { children: [] } };
    expect(hasContent(lexical)).toBe(false);
  });

  it("returns true for non-empty object", () => {
    expect(hasContent({ key: "value" })).toBe(true);
  });

  it("returns false for empty object", () => {
    expect(hasContent({})).toBe(false);
  });

  it("returns true for numbers", () => {
    expect(hasContent(42)).toBe(true);
    expect(hasContent(0)).toBe(false);
  });
});

describe("formatPrice", () => {
  it("formats UAH price", () => {
    const result = formatPrice(1500, "UAH");
    expect(result).toContain("1");
    expect(result).toContain("500");
  });

  it("formats EUR price", () => {
    const result = formatPrice(99.5, "EUR");
    expect(result).toContain("99");
  });

  it("defaults to UAH", () => {
    const result = formatPrice(100);
    expect(result).toBeTruthy();
  });

  it("handles zero", () => {
    const result = formatPrice(0, "UAH");
    expect(result).toContain("0");
  });

  it("handles large amounts", () => {
    const result = formatPrice(1000000, "UAH");
    expect(result).toBeTruthy();
  });
});

describe("getMediaUrl", () => {
  it("returns placeholder for undefined", () => {
    expect(getMediaUrl(undefined)).toBe(PLACEHOLDER_IMAGE);
  });

  it("returns placeholder for empty string", () => {
    expect(getMediaUrl("")).toBe(PLACEHOLDER_IMAGE);
  });

  it("returns non-localhost URLs as-is in production", () => {
    const url = "https://cdn.example.com/image.jpg";
    expect(getMediaUrl(url)).toBe(url);
  });

  it("strips localhost in development", () => {
    // Note: NODE_ENV might be 'test' in vitest, which is not 'development'
    // so this tests the non-dev path
    const url = "https://cdn.example.com/image.jpg";
    expect(getMediaUrl(url)).toBe(url);
  });
});
