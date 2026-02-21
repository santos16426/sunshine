interface StatBoxProps {
  label: string;
  value: string | number;
  trend?: string;
  icon: React.ReactNode;
  /** Theme-based accent: primary, chart-1, chart-2, chart-3 */
  accent?: "primary" | "chart-1" | "chart-2" | "chart-3";
  className?: string;
}

const ACCENT_CLASSES = {
  primary: "text-primary bg-primary/10 border-primary/20",
  "chart-1": "text-chart-1 bg-chart-1/20 border-chart-1/30",
  "chart-2": "text-chart-2 bg-chart-2/20 border-chart-2/30",
  "chart-3": "text-chart-3 bg-chart-3/20 border-chart-3/30",
} as const;

const TREND_ON_TRACK = "text-chart-3 bg-chart-3/20 border-chart-3/30";
const TREND_POSITIVE = "text-primary bg-primary/10 border-primary/20";

export function StatBox({
  label,
  value,
  trend,
  icon,
  accent = "primary",
  className = "",
}: StatBoxProps) {
  const trendClass =
    trend === "On Track" ? TREND_ON_TRACK : trend ? TREND_POSITIVE : "";

  return (
    <div
      className={`flex flex-col gap-4 rounded-[32px] border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-muted/50 group ${className}`}
    >
      <div className="flex items-center justify-between">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border transition-transform duration-300 group-hover:scale-110 ${ACCENT_CLASSES[accent]}`}
        >
          {icon}
        </div>
        {trend != null && trend !== "" && (
          <span
            className={`text-[9px] font-bold px-2 py-0.5 rounded-full border tracking-tight ${trendClass}`}
          >
            {trend}
          </span>
        )}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
          {label}
        </p>
        <h4 className="text-xl font-bold tracking-tight text-foreground truncate leading-none">
          {value}
        </h4>
      </div>
    </div>
  );
}
