import { describe, it, expect } from "vitest";
import {
  METHODOLOGY_PHASES,
  getPhaseById,
  getPhaseByNumber,
  PHASE_IDS,
  BRAND_NAME,
  STUDIO_NAME,
} from "../brand";

describe("lib/brand", () => {
  describe("METHODOLOGY_PHASES", () => {
    it("contains exactly 3 phases", () => {
      expect(METHODOLOGY_PHASES).toHaveLength(3);
    });

    it("has research as first phase", () => {
      expect(METHODOLOGY_PHASES[0]).toEqual({
        id: "research",
        number: "01",
        label: "@Research",
        tag: "@RESEARCH",
      });
    });

    it("has imagine as second phase", () => {
      expect(METHODOLOGY_PHASES[1]).toEqual({
        id: "imagine",
        number: "02",
        label: "@Imagine",
        tag: "@IMAGINE",
      });
    });

    it("has create as third phase", () => {
      expect(METHODOLOGY_PHASES[2]).toEqual({
        id: "create",
        number: "03",
        label: "@Create",
        tag: "@CREATE",
      });
    });
  });

  describe("getPhaseById", () => {
    it("returns phase for valid ID", () => {
      const phase = getPhaseById("imagine");
      expect(phase).toBeDefined();
      expect(phase!.id).toBe("imagine");
      expect(phase!.number).toBe("02");
      expect(phase!.label).toBe("@Imagine");
      expect(phase!.tag).toBe("@IMAGINE");
    });

    it("returns undefined for invalid ID", () => {
      expect(getPhaseById("realisation")).toBeUndefined();
      expect(getPhaseById("transformation")).toBeUndefined();
      expect(getPhaseById("")).toBeUndefined();
    });
  });

  describe("getPhaseByNumber", () => {
    it("returns phase for valid number", () => {
      const phase = getPhaseByNumber("01");
      expect(phase).toBeDefined();
      expect(phase!.id).toBe("research");
    });

    it("returns undefined for invalid number", () => {
      expect(getPhaseByNumber("04")).toBeUndefined();
      expect(getPhaseByNumber("1")).toBeUndefined();
    });
  });

  describe("PHASE_IDS", () => {
    it("contains all three canonical IDs", () => {
      expect(PHASE_IDS).toEqual(["research", "imagine", "create"]);
    });
  });

  describe("brand constants", () => {
    it("exports brand name", () => {
      expect(BRAND_NAME).toBe("PURITY");
    });

    it("exports full studio name", () => {
      expect(STUDIO_NAME).toBe("PURITY Fashion Studio");
    });
  });
});
