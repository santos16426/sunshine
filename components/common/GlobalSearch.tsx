"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Loader2,
  Search,
  User,
  X,
  Stethoscope,
  FolderOpen,
} from "lucide-react";
import {
  useDashboardSearch,
  type SearchPatient,
  type SearchDoctor,
  type SearchTherapist,
} from "@/lib/hooks/useDashboardSearch";
import { highlightMatch } from "@/lib/utils/highlightMatch";
import { formatBirthdate } from "@/lib/hooks/useFormattedBirthdate";

function Highlighted({ text, query }: { text: string; query: string }) {
  const segments = highlightMatch(text, query);
  return (
    <>
      {segments.map((seg, i) =>
        seg.type === "match" ? (
          <mark
            key={i}
            className="bg-primary/20 text-foreground rounded px-0.5 font-semibold"
          >
            {seg.value}
          </mark>
        ) : (
          <span key={i}>{seg.value}</span>
        ),
      )}
    </>
  );
}

export default function GlobalSearch() {
  const {
    isSearchOpen,
    setIsSearchOpen,
    searchQuery,
    setSearchQuery,
    filteredResults,
    isLoading,
  } = useDashboardSearch();

  const hasResults =
    filteredResults.patients.length > 0 ||
    filteredResults.doctors.length > 0 ||
    filteredResults.therapists.length > 0;

  // Avoid hydration mismatch: server and initial client render show "Ctrl", then update to ⌘ on Mac after mount
  const [modKey, setModKey] = useState<"⌘" | "Ctrl">("Ctrl");
  useEffect(() => {
    setModKey(
      typeof navigator !== "undefined" && navigator.platform.includes("Mac")
        ? "⌘"
        : "Ctrl"
    );
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === "Escape" && isSearchOpen) {
        setIsSearchOpen(false);
        setSearchQuery("");
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isSearchOpen, setIsSearchOpen, setSearchQuery]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsSearchOpen(true)}
        className="group relative flex items-center gap-3 pl-3 pr-2 py-1.5 rounded-full bg-muted/50 hover:bg-muted border border-transparent hover:border-border transition-all duration-200 ease-in-out active:scale-95"
      >
        <div className="flex items-center gap-2.5">
          <Search className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
          <span className="hidden md:inline text-sm font-semibold text-muted-foreground group-hover:text-foreground">
            Search records...
          </span>
          <span className="md:hidden text-sm font-semibold text-muted-foreground">
            Search
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-1 pl-2 ml-1 border-l border-border">
          <kbd className="flex items-center justify-center min-w-[20px] h-5 px-1.5 font-sans text-[10px] font-bold text-muted-foreground bg-background border border-border rounded-md shadow-[0_1px_0_0_rgba(0,0,0,0.05)]">
            {modKey}
          </kbd>
          <kbd className="flex items-center justify-center min-w-[20px] h-5 px-1.5 font-sans text-[10px] font-bold text-muted-foreground bg-background border border-border rounded-md shadow-[0_1px_0_0_rgba(0,0,0,0.05)]">
            K
          </kbd>
        </div>
      </button>

      {isSearchOpen && (
        <div className="fixed inset-0 z-100 flex items-start justify-center pt-20 px-4">
          <div
            className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
            onClick={() => {
              setIsSearchOpen(false);
              setSearchQuery("");
            }}
            aria-hidden
          />
          <div className="bg-card w-full max-w-2xl rounded-3xl shadow-2xl z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-border flex items-center gap-3">
              <Search className="w-5 h-5 text-muted-foreground shrink-0" />
              <input
                type="search"
                autoFocus
                aria-label="Search patients, doctors, or therapists"
                className="flex-1 bg-transparent border-none outline-none text-lg text-foreground placeholder:text-muted-foreground py-2"
                placeholder="Search patients, doctors, therapists..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="button"
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchQuery("");
                }}
                className="p-2 hover:bg-muted rounded-xl"
                aria-label="Close search"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-2">
              {!searchQuery ? (
                <div className="p-8 text-center space-y-2">
                  <div className="w-12 h-12 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Search className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-bold text-foreground">
                    Search records
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Search by name across patients, doctors, and therapists.
                  </p>
                </div>
              ) : isLoading ? (
                <div className="p-12 flex flex-col items-center justify-center gap-4">
                  <Loader2 className="w-10 h-10 text-primary animate-spin" />
                  <p className="text-sm font-medium text-muted-foreground">
                    Searching…
                  </p>
                </div>
              ) : !hasResults ? (
                <div className="p-8 text-center text-muted-foreground text-sm">
                  No results for &quot;{searchQuery}&quot;
                </div>
              ) : (
                <div className="space-y-4 p-2">
                  {filteredResults.patients.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="px-3 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                        Patients
                      </h4>
                      {filteredResults.patients.map((p: SearchPatient) => (
                        <Link
                          href={`/patients?edit=${p.id}`}
                          key={p.id}
                          onClick={() => {
                            setIsSearchOpen(false);
                            setSearchQuery("");
                          }}
                          className="w-full text-left p-3 hover:bg-primary/10 rounded-2xl flex items-center gap-4 transition-colors group"
                        >
                          <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-card group-hover:text-primary">
                            <User className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-foreground">
                              <Highlighted text={p.name} query={searchQuery} />
                            </p>
                            <p className="text-[10px] text-muted-foreground font-medium">
                              Born {formatBirthdate(p.date_of_birth)}
                              {p.guardian_name ? ` · ${p.guardian_name}` : ""}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}

                  {filteredResults.doctors.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="px-3 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                        Doctors
                      </h4>
                      {filteredResults.doctors.map((d: SearchDoctor) => (
                        <Link
                          href={`/doctors/${d.id}`}
                          key={d.id}
                          onClick={() => {
                            setIsSearchOpen(false);
                            setSearchQuery("");
                          }}
                          className="w-full text-left p-3 hover:bg-primary/10 rounded-2xl flex items-center gap-4 transition-colors group"
                        >
                          <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-card group-hover:text-primary">
                            <FolderOpen className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-foreground">
                              <Highlighted text={d.name} query={searchQuery} />
                            </p>
                            <p className="text-[10px] text-muted-foreground font-medium">
                              {d.hospital_affiliation || "—"}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}

                  {filteredResults.therapists.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="px-3 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                        Therapists
                      </h4>
                      {filteredResults.therapists.map((t: SearchTherapist) => (
                        <Link
                          href={`/therapists/${t.id}`}
                          key={t.id}
                          onClick={() => {
                            setIsSearchOpen(false);
                            setSearchQuery("");
                          }}
                          className="w-full text-left p-3 hover:bg-primary/10 rounded-2xl flex items-center gap-4 transition-colors group"
                        >
                          <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-card group-hover:text-primary">
                            <Stethoscope className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-foreground">
                              <Highlighted text={t.name} query={searchQuery} />
                            </p>
                            <p className="text-[10px] text-muted-foreground font-medium">
                              {t.therapist_type || "—"}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="p-4 bg-muted border-t border-border flex items-center justify-between">
              <div className="flex gap-4">
                <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-background border border-border rounded text-[9px] shadow-sm">
                    Enter
                  </kbd>{" "}
                  to select
                </span>
                <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-background border border-border rounded text-[9px] shadow-sm">
                    Esc
                  </kbd>{" "}
                  to close
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
