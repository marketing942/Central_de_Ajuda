import { describe, expect, it } from "vitest";
import { brasiliaHour, isHoliday, isWithinHours, nextOpeningLabel, type Schedule } from "@/lib/hours";

const team: Schedule = { open: 12, close: 22, weekdays: [1, 2, 3, 4, 5], closedOnHolidays: true };
// Horário de Brasília (UTC-3) → instante UTC
const br = (y: number, m: number, d: number, hour: number, minute = 0) => new Date(Date.UTC(y, m - 1, d, hour + 3, minute));

describe("fuso de Brasília", () => {
  it("converte UTC para Brasília", () => {
    expect(brasiliaHour(new Date(Date.UTC(2026, 8, 21, 15)))).toBe(12);
    expect(brasiliaHour(new Date(Date.UTC(2026, 8, 22, 2)))).toBe(23);
  });
});

describe("feriados", () => {
  it("reconhece feriados fixos e a Sexta-feira Santa", () => {
    expect(isHoliday(2026, 12, 25)).toBe(true);
    expect(isHoliday(2026, 11, 20)).toBe(true);
    expect(isHoliday(2026, 4, 3)).toBe(true); // Páscoa 2026 = 5/abr
    expect(isHoliday(2027, 3, 26)).toBe(true); // Páscoa 2027 = 28/mar
    expect(isHoliday(2026, 9, 22)).toBe(false);
  });
});

describe("suporte ao aluno: seg. a sex., 12h–22h, sem feriados", () => {
  it("abre em dia útil dentro do horário", () => {
    expect(isWithinHours(team, br(2026, 9, 21, 11, 59))).toBe(false); // segunda 11:59
    expect(isWithinHours(team, br(2026, 9, 21, 12))).toBe(true); // segunda 12:00
    expect(isWithinHours(team, br(2026, 9, 21, 21, 59))).toBe(true); // segunda 21:59
    expect(isWithinHours(team, br(2026, 9, 21, 22))).toBe(false); // segunda 22:00
  });

  it("não abre sábado, domingo nem feriado", () => {
    expect(isWithinHours(team, br(2026, 9, 26, 15))).toBe(false); // sábado
    expect(isWithinHours(team, br(2026, 9, 27, 15))).toBe(false); // domingo
    expect(isWithinHours(team, br(2026, 11, 20, 15))).toBe(false); // sexta, Consciência Negra
  });

  it("informa quando volta", () => {
    expect(nextOpeningLabel(team, br(2026, 9, 23, 9))).toBe("hoje"); // quarta de manhã
    expect(nextOpeningLabel(team, br(2026, 9, 23, 23))).toBe("amanhã"); // quarta à noite
    expect(nextOpeningLabel(team, br(2026, 9, 25, 23))).toBe("segunda"); // sexta à noite
    expect(nextOpeningLabel(team, br(2026, 9, 26, 15))).toBe("segunda"); // sábado
    expect(nextOpeningLabel(team, br(2026, 11, 19, 23))).toBe("segunda"); // quinta antes do feriado de sexta
    expect(nextOpeningLabel(team, br(2026, 12, 24, 23))).toBe("segunda"); // quinta 24/12 → sexta é Natal
  });
});
