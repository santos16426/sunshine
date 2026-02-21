/** Format YYYY-MM-DD for input[type="date"] and API. */
export function toDateString(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Start of today (local). */
export function getTodayRange(): { from: string; to: string } {
  const today = new Date();
  return { from: toDateString(today), to: toDateString(today) };
}

/** This week: Monday–Sunday (local). */
export function getWeekRange(): { from: string; to: string } {
  const now = new Date();
  const day = now.getDay();
  const diff = day === 0 ? -6 : 1 - day; // Monday = 1
  const monday = new Date(now);
  monday.setDate(now.getDate() + diff);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return { from: toDateString(monday), to: toDateString(sunday) };
}

/** This month: first day to last day (local). */
export function getMonthRange(): { from: string; to: string } {
  const now = new Date();
  const first = new Date(now.getFullYear(), now.getMonth(), 1);
  const last = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return { from: toDateString(first), to: toDateString(last) };
}
