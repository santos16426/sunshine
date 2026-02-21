/**
 * Format a date string (YYYY-MM-DD) or Date for display.
 */
export function formatBirthdate(value: string | Date | null | undefined): string {
  if (value == null) return "—";
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
