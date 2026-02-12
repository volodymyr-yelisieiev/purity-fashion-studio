import { describe, it, expect } from "vitest";

describe("BlockRenderer module", () => {
  it("imports without circular-initialization errors", async () => {
    await expect(import("../BlockRenderer")).resolves.toHaveProperty(
      "BlockRenderer",
    );
  });
});
