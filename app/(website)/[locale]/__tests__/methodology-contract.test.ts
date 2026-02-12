import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const workspaceRoot = resolve(__dirname, "../../../..");

function read(relativePath: string) {
  return readFileSync(resolve(workspaceRoot, relativePath), "utf8");
}

describe("methodology page contracts", () => {
  it("uses canonical animated hero on research page", () => {
    const source = read("app/(website)/[locale]/research/page.tsx");

    expect(source).toContain(
      'import { EditorialHero } from "@/components/blocks/EditorialHero"',
    );
    expect(source).toContain("<EditorialHero");
    expect(source).not.toContain("<HeroSection");
  });

  it("keeps intro paragraphs centered across methodology pages", () => {
    const research = read("app/(website)/[locale]/research/page.tsx");
    const imagine = read("app/(website)/[locale]/imagine/page.tsx");
    const create = read("app/(website)/[locale]/create/page.tsx");

    const centeredClass =
      "mx-auto max-w-3xl text-center text-lg leading-relaxed";

    expect(research).toContain(centeredClass);
    expect(imagine).toContain(centeredClass);
    expect(create).toContain(centeredClass);
  });
});
