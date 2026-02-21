"use client";

import { useEffect } from "react";
import { useLayoutStore, getStoredTheme } from "@/store/layoutStore";
import { themeConfig, defaultThemeId } from "@/constants/themeConfig";

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const accentTheme = useLayoutStore((s) => s.accentTheme);
  const colorMode = useLayoutStore((s) => s.colorMode);
  const setAccentTheme = useLayoutStore((s) => s.setAccentTheme);
  const setColorMode = useLayoutStore((s) => s.setColorMode);

  useEffect(() => {
    const { accentTheme: storedAccent, colorMode: storedMode } =
      getStoredTheme();
    setAccentTheme(storedAccent);
    setColorMode(storedMode);
  }, [setAccentTheme, setColorMode]);

  useEffect(() => {
    const root = document.documentElement;
    if (colorMode === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [colorMode]);

  useEffect(() => {
    const root = document.documentElement;
    const theme = themeConfig[accentTheme] ?? themeConfig[defaultThemeId];
    const variant = colorMode === "dark" ? theme.dark : theme.light;
    root.style.setProperty("--primary", variant.primary);
    root.style.setProperty("--primary-foreground", variant.primaryForeground);
  }, [accentTheme, colorMode]);

  return <>{children}</>;
}
