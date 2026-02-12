import { describe, it, expect } from "vitest";
import { resolveStageFromPathname } from "../MethodologyContext";

describe("resolveStageFromPathname", () => {
  it("maps /research to research stage", () => {
    expect(resolveStageFromPathname("/research")).toBe("research");
  });

  it("maps /uk/research to research stage", () => {
    expect(resolveStageFromPathname("/uk/research")).toBe("research");
  });

  it("maps /en/research to research stage", () => {
    expect(resolveStageFromPathname("/en/research")).toBe("research");
  });

  it("maps /imagine to imagine stage", () => {
    expect(resolveStageFromPathname("/imagine")).toBe("imagine");
  });

  it("maps /uk/imagine to imagine stage", () => {
    expect(resolveStageFromPathname("/uk/imagine")).toBe("imagine");
  });

  it("maps /create to create stage", () => {
    expect(resolveStageFromPathname("/create")).toBe("create");
  });

  it("maps /en/create to create stage", () => {
    expect(resolveStageFromPathname("/en/create")).toBe("create");
  });

  it("returns null for unrelated paths", () => {
    expect(resolveStageFromPathname("/about")).toBeNull();
    expect(resolveStageFromPathname("/uk/contact")).toBeNull();
    expect(resolveStageFromPathname("/en/services")).toBeNull();
  });

  it("returns null for root path", () => {
    expect(resolveStageFromPathname("/")).toBeNull();
  });

  it("returns null for empty string", () => {
    expect(resolveStageFromPathname("")).toBeNull();
  });
});
