export function getTodayIso(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

export const TODAY_ISO = getTodayIso();
