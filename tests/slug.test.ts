import { describe, expect, it } from "vitest";
import { slugify, uniqueSlug } from "@/lib/slug";

describe("slugify", () => {
  it("remove acentos, pontuação e caixa", () => {
    expect(slugify("Como usar a Central de Ajuda do CPPEM?")).toBe("como-usar-a-central-de-ajuda-do-cppem");
    expect(slugify("Materiais Físicos")).toBe("materiais-fisicos");
    expect(slugify("Dúvidas Gerais")).toBe("duvidas-gerais");
  });
});

describe("uniqueSlug", () => {
  it("numera repetidos", () => {
    const taken = new Set<string>();
    expect(uniqueSlug("acesso", taken)).toBe("acesso");
    expect(uniqueSlug("acesso", taken)).toBe("acesso-2");
    expect(uniqueSlug("", taken)).toBe("artigo");
  });
});
