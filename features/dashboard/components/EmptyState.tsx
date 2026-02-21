"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel: string;
  actionHref: string;
  className?: string;
}
export const EmptyState = ({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
}: EmptyStateProps) => (
  <div className="flex flex-col items-center text-center p-4">
    <div className="w-16 h-16 rounded-2xl bg-muted border border-border flex items-center justify-center mb-6 text-muted-foreground">
      <div className="opacity-50 group-hover:scale-110 transition-transform duration-500">
        {icon}
      </div>
    </div>
    <h3 className="text-base font-black text-foreground tracking-tight mb-2">
      {title}
    </h3>
    <p className="text-xs font-medium text-slate-400 leading-relaxed max-w-[240px] mb-8">
      {description}
    </p>
    <Link
      href={actionHref}
      className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-slate-900 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-100 transition-all active:scale-[0.98]"
    >
      {actionLabel}
      <ChevronRight size={14} />
    </Link>
  </div>
);
