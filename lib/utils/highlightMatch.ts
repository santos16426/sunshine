export type HighlightSegment =
  | { type: "text"; value: string }
  | { type: "match"; value: string };

/**
 * Splits text by case-insensitive matches of query. Use with map: match segments get <mark>, text stays as-is.
 */
export function highlightMatch(text: string, query: string): HighlightSegment[] {
  if (!query.trim()) return [{ type: "text", value: text }];
  const lower = text.toLowerCase();
  const q = query.toLowerCase().trim();
  const segments: HighlightSegment[] = [];
  let start = 0;
  let idx = lower.indexOf(q, start);
  while (idx !== -1) {
    if (idx > start) {
      segments.push({ type: "text", value: text.slice(start, idx) });
    }
    segments.push({ type: "match", value: text.slice(idx, idx + q.length) });
    start = idx + q.length;
    idx = lower.indexOf(q, start);
  }
  if (start < text.length) {
    segments.push({ type: "text", value: text.slice(start) });
  }
  return segments.length ? segments : [{ type: "text", value: text }];
}
