"use client";

import React, { useMemo } from "react";
import {
  Check,
  Sun,
  Moon,
  Palette,
  Monitor,
  Command,
  MousePointer2,
  LayoutDashboard,
  Box,
} from "lucide-react";
import { useLayoutStore } from "@/store/layoutStore";

export default function Settings() {
  const accentTheme = useLayoutStore((s) => s.accentTheme);
  const colorMode = useLayoutStore((s) => s.colorMode);
  const setAccentTheme = useLayoutStore((s) => s.setAccentTheme);
  const setColorMode = useLayoutStore((s) => s.setColorMode);

  const themes = useMemo(
    () => [
      { id: "indigo", name: "Indigo", color: "#6366f1", bg: "bg-indigo-600" },
      { id: "blue", name: "Blue", color: "#2563eb", bg: "bg-blue-600" },
      { id: "sky", name: "Sky", color: "#0ea5e9", bg: "bg-sky-600" },
      { id: "cyan", name: "Cyan", color: "#06b6d4", bg: "bg-cyan-600" },
      {
        id: "teal",
        name: "Teal",
        color: "#14b8a6",
        bg: "bg-teal-600",
      },
      {
        id: "emerald",
        name: "Emerald",
        color: "#10b981",
        bg: "bg-emerald-600",
      },
      { id: "green", name: "Green", color: "#22c55e", bg: "bg-green-600" },
      { id: "lime", name: "Lime", color: "#84cc16", bg: "bg-lime-600" },
      { id: "amber", name: "Amber", color: "#d97706", bg: "bg-amber-600" },
      { id: "gold", name: "Gold", color: "#ca8a04", bg: "bg-yellow-600" },
      { id: "orange", name: "Orange", color: "#f97316", bg: "bg-orange-600" },
      { id: "rose", name: "Rose", color: "#e11d48", bg: "bg-rose-600" },
      { id: "pink", name: "Pink", color: "#db2777", bg: "bg-pink-600" },
      {
        id: "fuchsia",
        name: "Fuchsia",
        color: "#d946ef",
        bg: "bg-fuchsia-600",
      },
      { id: "violet", name: "Violet", color: "#8b5cf6", bg: "bg-violet-600" },
      { id: "slate", name: "Slate", color: "#475569", bg: "bg-slate-700" },
      { id: "stone", name: "Stone", color: "#57534e", bg: "bg-stone-600" },
    ],
    [],
  );

  const currentTheme = themes.find((t) => t.id === accentTheme) || themes[0];

  return (
    <div className="h-full min-h-screen transition-colors duration-500 bg-background text-foreground">
      <div className="max-w-6xl mx-auto p-6 md:p-12">
        {/* Header - Enterprise Clean */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Command className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest">
                Workspace Settings
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Appearance</h1>
            <p className="text-muted-foreground text-sm max-w-sm">
              Customise the visual identity of your dashboard and system
              components.
            </p>
          </div>

          {/* Tactile Environment Switcher */}
          <div className="relative flex bg-muted/50 p-1.5 rounded-2xl border border-border shadow-inner w-full md:w-auto">
            <button
              onClick={() => setColorMode("light")}
              className={`relative z-10 flex flex-1 md:flex-none items-center justify-center gap-3 px-8 py-3 rounded-xl text-xs font-bold transition-all duration-300 ${colorMode === "light" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              <Sun
                className={`w-4 h-4 transition-transform duration-500 ${colorMode === "light" ? "rotate-45" : ""}`}
              />
              Light
            </button>
            <button
              onClick={() => setColorMode("dark")}
              className={`relative z-10 flex flex-1 md:flex-none items-center justify-center gap-3 px-8 py-3 rounded-xl text-xs font-bold transition-all duration-300 ${colorMode === "dark" ? "text-foreground" : "text-foreground hover:text-foreground"}`}
            >
              <Moon
                className={`w-4 h-4 transition-transform duration-500 ${colorMode === "dark" ? "-rotate-12" : ""}`}
              />
              Dark
            </button>
            <div
              className={`absolute top-1.5 bottom-1.5 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] bg-card rounded-xl shadow-sm border border-border ${colorMode === "light" ? "left-1.5 w-[calc(50%-6px)] md:w-[108px]" : "left-[calc(50%-2px)] md:left-[118px] w-[calc(50%-6px)] md:w-[108px]"}`}
            />
          </div>
        </header>

        <div className="grid lg:grid-cols-12 gap-12">
          {/* Accent Selection Column */}
          <div className="lg:col-span-4 space-y-8">
            <div className="space-y-6">
              <div className="flex items-center justify-between px-1">
                <div className="space-y-1">
                  <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Accent Theme
                  </h2>
                  <p className="text-[11px] text-muted-foreground font-medium">
                    {currentTheme.name} Selected
                  </p>
                </div>
                <div className="p-2 bg-card rounded-lg border border-border shadow-sm">
                  <Palette className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3">
                {themes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setAccentTheme(t.id)}
                    title={t.name}
                    className={`group relative aspect-square rounded-xl transition-all duration-300 flex items-center justify-center ${
                      accentTheme === t.id
                        ? "ring-2 ring-foreground ring-offset-4 ring-offset-background scale-110"
                        : "hover:scale-105 active:scale-95"
                    }`}
                  >
                    <div
                      className={`absolute inset-0 rounded-xl ${t.bg} shadow-sm shadow-black/10 transition-opacity ${accentTheme === t.id ? "opacity-100" : "opacity-80 group-hover:opacity-100"}`}
                    />
                    {accentTheme === t.id && (
                      <Check className="relative z-10 w-4 h-4 text-white drop-shadow-sm" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Preview - High Fidelity Dashboard */}
          <div className="lg:col-span-8">
            <div className="bg-card rounded-[2.5rem] border border-border shadow-xl overflow-hidden min-h-[500px] flex flex-col">
              {/* Mock Toolbar */}
              <div className="h-14 border-b border-border px-6 flex items-center justify-between bg-muted/50 backdrop-blur-md">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-muted" />
                  <div className="w-2.5 h-2.5 rounded-full bg-muted" />
                  <div className="w-2.5 h-2.5 rounded-full bg-muted" />
                </div>
                <div className="h-6 w-32 rounded-lg bg-muted" />
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-muted" />
                </div>
              </div>

              {/* Mock Dashboard Body */}
              <div className="flex-1 flex p-8 gap-8">
                {/* Mini Sidebar */}
                <div className="w-12 h-full flex flex-col items-center gap-6">
                  <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-xl shadow-primary/30 transition-all duration-500">
                    <Box className="w-5 h-5" />
                  </div>
                  <LayoutDashboard className="w-5 h-5 text-muted-foreground" />
                  <Palette
                    className="w-5 h-5 transition-colors duration-500"
                    style={{ color: currentTheme.color }}
                  />
                  <Monitor className="w-5 h-5 text-muted-foreground" />
                </div>

                {/* Main Content Area */}
                <div className="flex-1 space-y-8">
                  <div className="flex justify-between items-end">
                    <div className="space-y-2">
                      <div className="h-2 w-24 rounded-full bg-muted" />
                      <div className="h-6 w-48 rounded-lg bg-muted/50" />
                    </div>
                    <div className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-primary/20 transition-all duration-500">
                      Create New
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-5 rounded-2xl bg-muted/30 border border-border space-y-4">
                      <div
                        className="h-2 w-16 rounded-full transition-colors duration-500"
                        style={{
                          backgroundColor: currentTheme.color,
                          opacity: 0.3,
                        }}
                      />
                      <div className="h-8 w-full rounded-xl bg-card border border-border" />
                    </div>
                    <div className="p-5 rounded-2xl bg-muted/30 border border-border space-y-4">
                      <div
                        className="h-2 w-16 rounded-full transition-colors duration-500"
                        style={{
                          backgroundColor: currentTheme.color,
                          opacity: 0.3,
                        }}
                      />
                      <div className="h-8 w-full rounded-xl bg-card border border-border" />
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-muted/30 border border-border">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center">
                        <MousePointer2 className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="h-2 w-3/4 rounded-full bg-muted" />
                        <div className="h-2 w-1/2 rounded-full bg-muted/50" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
