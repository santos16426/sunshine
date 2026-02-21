"use client";

import { Sun } from "lucide-react";

const LOGO_LETTERS = [
  { text: "S", color: "text-sky-400" },
  { text: "u", color: "text-orange-400" },
  { text: "n", color: "text-rose-400" },
  { text: "s", color: "text-emerald-500" },
  { text: "h", color: "text-blue-500" },
  { text: "i", color: "text-orange-500" },
  { text: "n", color: "text-pink-500" },
  { text: "e", color: "text-green-500" },
] as const;

export interface LogoProps {
  /** Show "Hub" badge (e.g. landing nav). */
  showBadge?: boolean;
  /** Size variant. */
  variant?: "default" | "compact";
  className?: string;
}

export function Logo({ showBadge = false, variant = "default", className = "" }: LogoProps) {
  const isCompact = variant === "compact";
  const textSize = isCompact ? "text-xl" : "text-2xl md:text-3xl";
  const sunSize = isCompact ? "w-5 h-5" : "w-6 h-6 md:w-8 md:h-8";
  const sunPosition = isCompact ? "-top-2 -right-2" : "-top-3 -right-3";

  return (
    <div className={`flex items-center ${className}`}>
      <div
        className={`flex ${textSize} font-black tracking-tight drop-shadow-[2px_2px_0px_rgba(15,23,42,1)]`}
      >
        {LOGO_LETTERS.map((char, i) => (
          <span key={i} className={char.color}>
            {char.text}
          </span>
        ))}
        <div className="relative ml-1">
          <Sun
            className={`${sunSize} text-yellow-400 absolute ${sunPosition} animate-spin-slow drop-shadow-[2px_2px_0px_rgba(15,23,42,1)]`}
            strokeWidth={3}
          />
        </div>
      </div>
      {showBadge && (
        <span className="hidden md:inline-block ml-4 bg-slate-900 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-widest">
          Hub
        </span>
      )}
    </div>
  );
}
