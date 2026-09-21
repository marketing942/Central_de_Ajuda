const hourFormat = new Intl.DateTimeFormat("pt-BR", { hour: "numeric", hourCycle: "h23", timeZone: "America/Sao_Paulo" });

/** Hora cheia atual em Brasília (0–23). */
export function brasiliaHour(now = new Date()): number {
  return Number(hourFormat.format(now));
}

/** Aberto em [open, close). */
export function isWithinHours(hours: { open: number; close: number }, now = new Date()): boolean {
  const hour = brasiliaHour(now);
  return hour >= hours.open && hour < hours.close;
}
