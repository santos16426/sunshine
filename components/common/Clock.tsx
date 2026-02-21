import { useEffect, useState } from "react";
export default function ClockHeader() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(id);
  }, []);
  const formattedHeaderDate = now.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  const formattedHeaderTime = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div className="hidden lg:flex items-center gap-4">
      <div className="flex items-center gap-3">
        <div className="flex flex-col text-right">
          <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">
            {formattedHeaderDate}
          </span>
          <span className="text-sm font-black text-secondary-foreground leading-none tabular-nums">
            {formattedHeaderTime}
          </span>
        </div>
      </div>
    </div>
  );
}
