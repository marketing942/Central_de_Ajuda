// Horário de atendimento no fuso de Brasília, com dias úteis e feriados.

export type Schedule = {
  open: number; // hora cheia, inclusiva
  close: number; // hora cheia, exclusiva
  weekdays: number[]; // 0 = domingo … 6 = sábado
  closedOnHolidays: boolean;
};

type CalendarDay = { year: number; month: number; day: number; weekday: number; hour: number };

const WEEKDAYS: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
const WEEKDAY_NAMES = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];

const partsFormat = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Sao_Paulo",
  year: "numeric",
  month: "numeric",
  day: "numeric",
  weekday: "short",
  hour: "numeric",
  hourCycle: "h23",
});

export function brasiliaNow(now = new Date()): CalendarDay {
  const parts = Object.fromEntries(partsFormat.formatToParts(now).map((part) => [part.type, part.value]));
  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    weekday: WEEKDAYS[parts.weekday],
    hour: Number(parts.hour),
  };
}

/** Hora cheia atual em Brasília (0–23). */
export function brasiliaHour(now = new Date()): number {
  return brasiliaNow(now).hour;
}

// Feriados nacionais de data fixa (MM-DD).
const FIXED_HOLIDAYS = [
  "01-01", // Confraternização Universal
  "04-21", // Tiradentes
  "05-01", // Dia do Trabalho
  "09-07", // Independência
  "10-12", // Nossa Senhora Aparecida
  "11-02", // Finados
  "11-15", // Proclamação da República
  "11-20", // Consciência Negra
  "12-25", // Natal
];

// Feriados que dependem da Páscoa: dias de diferença em relação ao domingo de Páscoa.
const EASTER_HOLIDAYS = [
  -2, // Sexta-feira Santa
  // Pontos facultativos: descomente os que o CPPEM também não atende.
  // -48, // Carnaval (segunda)
  // -47, // Carnaval (terça)
  // 60, // Corpus Christi
];

// Feriados estaduais/municipais ou recessos do CPPEM (MM-DD), se houver.
// Ex.: "03-06" (Data Magna de PE), "06-24" (São João).
const EXTRA_CLOSED_DAYS: string[] = [];

/** Domingo de Páscoa (algoritmo de Meeus/Jones/Butcher), como dia UTC. */
function easterSunday(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(Date.UTC(year, month - 1, day));
}

const DAY_MS = 86_400_000;

export function isHoliday(year: number, month: number, day: number): boolean {
  const key = `${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  if (FIXED_HOLIDAYS.includes(key) || EXTRA_CLOSED_DAYS.includes(key)) return true;
  const offset = Math.round((Date.UTC(year, month - 1, day) - easterSunday(year).getTime()) / DAY_MS);
  return EASTER_HOLIDAYS.includes(offset);
}

function isWorkingDay(schedule: Schedule, date: Date): boolean {
  if (!schedule.weekdays.includes(date.getUTCDay())) return false;
  return !(schedule.closedOnHolidays && isHoliday(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate()));
}

function today(now: Date) {
  const { year, month, day, hour } = brasiliaNow(now);
  return { date: new Date(Date.UTC(year, month - 1, day)), hour };
}

/** Aberto agora: dia útil, fora de feriado e dentro de [open, close). */
export function isWithinHours(schedule: Schedule, now = new Date()): boolean {
  const { date, hour } = today(now);
  return isWorkingDay(schedule, date) && hour >= schedule.open && hour < schedule.close;
}

/** Quando abre de novo: "hoje", "amanhã" ou o dia da semana ("segunda"). */
export function nextOpeningLabel(schedule: Schedule, now = new Date()): string {
  const { date, hour } = today(now);
  for (let ahead = 0; ahead <= 14; ahead++) {
    const candidate = new Date(date.getTime() + ahead * DAY_MS);
    if (!isWorkingDay(schedule, candidate)) continue;
    if (ahead === 0 && hour >= schedule.open) continue; // já abriu/fechou hoje
    if (ahead === 0) return "hoje";
    if (ahead === 1) return "amanhã";
    return WEEKDAY_NAMES[candidate.getUTCDay()];
  }
  return "em breve";
}
