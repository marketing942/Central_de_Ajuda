import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { findOfficialPhone, formatBrazilianPhone, normalizeBrazilianPhone } from "@/lib/phone-registry";

describe("normalizeBrazilianPhone", () => {
  it("aceita DDD + número, com ou sem +55 e com pontuação", () => {
    expect(normalizeBrazilianPhone("(81) 99445-8120")).toBe("5581994458120");
    expect(normalizeBrazilianPhone("81994458120")).toBe("5581994458120");
    expect(normalizeBrazilianPhone("+55 81 99445-8120")).toBe("5581994458120");
    expect(normalizeBrazilianPhone("5581994458120")).toBe("5581994458120");
    expect(normalizeBrazilianPhone("(81) 3333-4444")).toBe("558133334444");
  });

  it("recusa número incompleto ou de outro país", () => {
    expect(normalizeBrazilianPhone("")).toBeNull();
    expect(normalizeBrazilianPhone("99445-8120")).toBeNull();
    expect(normalizeBrazilianPhone("+44 20 7946 0958")).toBeNull();
    expect(normalizeBrazilianPhone("1234567890123456")).toBeNull();
  });
});

describe("formatBrazilianPhone", () => {
  it("formata celular e fixo", () => {
    expect(formatBrazilianPhone("5581994458120")).toBe("+55 (81) 99445-8120");
    expect(formatBrazilianPhone("558133334444")).toBe("+55 (81) 3333-4444");
  });
});

describe("findOfficialPhone", () => {
  const env = { ...process.env };

  beforeEach(() => {
    delete process.env.NOTION_TOKEN;
    delete process.env.NOTION_PHONE_TOKEN;
    delete process.env.NOTION_PHONE_DATABASE_ID;
    delete process.env.PHONE_REGISTRY_SOURCE;
    vi.spyOn(console, "error").mockImplementation(() => undefined);
  });

  afterEach(() => {
    process.env = { ...env };
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("sem Notion configurado, usa a lista inicial de números oficiais", async () => {
    expect(await findOfficialPhone("558194458120")).toEqual({ numberE164: "558194458120", label: "CPPEM Marketing" });
    expect(await findOfficialPhone("558195460966")).toMatchObject({ label: "Pedagógico CPPEM" });
    expect(await findOfficialPhone("558195881908")).toMatchObject({ label: "Emilly CPPEM" });
    expect(await findOfficialPhone("5581999999999")).toBeNull();
  });

  function mockNotion(results: unknown[]) {
    const fetchMock = vi.fn(async (url: string | URL, init?: RequestInit) => {
      void init;
      const href = String(url);
      if (href.includes("/databases/")) return Response.json({ data_sources: [{ id: "ds-1" }] });
      return Response.json({ results });
    });
    vi.stubGlobal("fetch", fetchMock);
    return fetchMock;
  }

  it("com Notion, o cadastro ativo é a única autoridade", async () => {
    process.env.NOTION_TOKEN = "token-teste";
    const fetchMock = mockNotion([{ properties: { Nome: { title: [{ plain_text: "Comercial CPPEM" }] } } }]);

    expect(await findOfficialPhone("5581988887777")).toEqual({ numberE164: "5581988887777", label: "Comercial CPPEM" });

    const query = fetchMock.mock.calls.find(([url]) => String(url).includes("/query"))!;
    const body = JSON.parse(String(query[1]?.body));
    expect(body.filter.and).toEqual([
      { property: "Número E.164", rich_text: { equals: "5581988887777" } },
      { property: "Ativo", checkbox: { equals: true } },
    ]);
  });

  it("número da lista inicial desativado no Notion deixa de ser confirmado", async () => {
    process.env.NOTION_TOKEN = "token-teste";
    mockNotion([]);
    expect(await findOfficialPhone("558194458120")).toBeNull();
  });

  it("falha do Notion não confirma número nenhum (nem os da lista inicial)", async () => {
    process.env.NOTION_TOKEN = "token-teste";
    vi.stubGlobal("fetch", vi.fn(async () => new Response("{}", { status: 404 })));
    expect(await findOfficialPhone("558194458120")).toBeNull();
  });

  it("NOTION_PHONE_TOKEN tem prioridade e variável vazia (compose) não quebra o padrão", async () => {
    process.env.NOTION_TOKEN = "token-central";
    process.env.NOTION_PHONE_TOKEN = "token-numeros";
    process.env.NOTION_PHONE_DATABASE_ID = "";
    process.env.PHONE_REGISTRY_SOURCE = "";
    const fetchMock = mockNotion([]);

    await findOfficialPhone("5581988887777");

    const [firstUrl, firstInit] = fetchMock.mock.calls[0];
    expect(String(firstUrl)).toContain("/databases/3f543717-1061-47ee-8bec-fc6116a01287");
    expect((firstInit?.headers as Record<string, string>).Authorization).toBe("Bearer token-numeros");
  });
});
