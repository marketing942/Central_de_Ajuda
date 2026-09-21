import { describe, expect, it } from "vitest";
import { brasiliaHour, isWithinHours } from "@/lib/hours";

const team = { open: 12, close: 22 };
// Brasília = UTC-3
const at = (utcHour: number, minute = 0) => new Date(Date.UTC(2026, 8, 21, utcHour, minute));

describe("horário de atendimento (Brasília)", () => {
  it("converte UTC para Brasília", () => {
    expect(brasiliaHour(at(15))).toBe(12);
    expect(brasiliaHour(at(2))).toBe(23);
  });

  it("equipe atende das 12h às 22h", () => {
    expect(isWithinHours(team, at(14, 59))).toBe(false); // 11:59
    expect(isWithinHours(team, at(15))).toBe(true); // 12:00
    expect(isWithinHours(team, at(0, 59))).toBe(true); // 21:59
    expect(isWithinHours(team, at(1))).toBe(false); // 22:00
  });
});
