export const DEFAULT_DROP_HOUR = 9;
export const START_HOUR = 7;
export const END_HOUR = 18;
export const HOUR_HEIGHT = 72;

export const HOURS = Array.from(
  { length: END_HOUR - START_HOUR + 1 },
  (_, index) => START_HOUR + index,
);

export const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const VIEW_MODES = ["Month", "Week", "Day"] as const;
export type CalendarViewMode = (typeof VIEW_MODES)[number];
