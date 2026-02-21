"use client";

import Link from "next/link";
import { ChevronRight, Search, Users, UserSearch } from "lucide-react";
import { EmptyState } from "./EmptyState";
import type { TopPatientBySessions } from "../types";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

interface ActiveStarsProps {
  patients: TopPatientBySessions[];
}

export function ActiveStars({ patients }: ActiveStarsProps) {
  return (
    <div>
      <div className="bg-card rounded-[40px] border border-slate-200/50 shadow-sm overflow-hidden flex flex-col">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-black text-foreground tracking-tight">
              Top Patients
            </h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              By session count
            </p>
          </div>
        </div>

        <div className="divide-y divide-slate-50">
          {patients.length > 0 ? (
            patients.map((p) => (
              <div
                key={p.id}
                className="group p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm border border-slate-100 shrink-0 group-hover:scale-105 transition-transform">
                    {getInitials(p.name)}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-black text-slate-800 text-sm truncate">
                      {p.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="w-1.5 h-1.5 rounded-full" />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                        {p.age} years old
                      </span>
                      <span className="text-[10px] text-slate-300 text-xs px-1">
                        •
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <button className="p-2 text-slate-200 hover:text-slate-900 transition-colors">
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12">
              <EmptyState
                icon={<UserSearch size={24} className="text-slate-400" />}
                title="No Patients Found"
                description="You don't have any patients yet. Start by creating a new patient."
                actionLabel="Create new Patients"
                actionHref="/patients?new"
              />
            </div>
          )}
        </div>

        {patients.length > 0 && (
          <div className="p-6 bg-slate-50/30 flex justify-center border-t border-slate-50">
            <Link
              href="/patients"
              className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-indigo-600 transition-all group flex items-center gap-2"
            >
              View All Patients
              <ChevronRight
                size={12}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
