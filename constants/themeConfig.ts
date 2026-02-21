/**
 * Theme color sets in oklch format for CSS variables.
 * Each theme has light and dark variants for --primary and --primary-foreground.
 */
export interface ThemeColors {
  light: {
    primary: string;
    primaryForeground: string;
  };
  dark: {
    primary: string;
    primaryForeground: string;
  };
}

export const themeConfig: Record<string, ThemeColors> = {
  indigo: {
    light: {
      primary: "oklch(0.55 0.22 285)",
      primaryForeground: "oklch(0.985 0 0)",
    },
    dark: {
      primary: "oklch(0.65 0.18 285)",
      primaryForeground: "oklch(0.985 0 0)",
    },
  },
  blue: {
    light: {
      primary: "oklch(0.49 0.2 264)",
      primaryForeground: "oklch(0.985 0 0)",
    },
    dark: {
      primary: "oklch(0.62 0.18 264)",
      primaryForeground: "oklch(0.985 0 0)",
    },
  },
  emerald: {
    light: {
      primary: "oklch(0.55 0.17 166)",
      primaryForeground: "oklch(0.985 0 0)",
    },
    dark: {
      primary: "oklch(0.65 0.15 166)",
      primaryForeground: "oklch(0.985 0 0)",
    },
  },
  slate: {
    light: {
      primary: "oklch(0.45 0.02 255)",
      primaryForeground: "oklch(0.985 0 0)",
    },
    dark: {
      primary: "oklch(0.62 0.02 255)",
      primaryForeground: "oklch(0.985 0 0)",
    },
  },
  rose: {
    light: {
      primary: "oklch(0.55 0.22 12)",
      primaryForeground: "oklch(0.985 0 0)",
    },
    dark: {
      primary: "oklch(0.65 0.2 12)",
      primaryForeground: "oklch(0.985 0 0)",
    },
  },
  amber: {
    light: {
      primary: "oklch(0.65 0.18 55)",
      primaryForeground: "oklch(0.145 0 0)",
    },
    dark: {
      primary: "oklch(0.75 0.15 55)",
      primaryForeground: "oklch(0.145 0 0)",
    },
  },
  violet: {
    light: {
      primary: "oklch(0.55 0.25 293)",
      primaryForeground: "oklch(0.985 0 0)",
    },
    dark: {
      primary: "oklch(0.65 0.22 293)",
      primaryForeground: "oklch(0.985 0 0)",
    },
  },
  cyan: {
    light: {
      primary: "oklch(0.58 0.15 195)",
      primaryForeground: "oklch(0.985 0 0)",
    },
    dark: {
      primary: "oklch(0.68 0.14 195)",
      primaryForeground: "oklch(0.145 0 0)",
    },
  },
  teal: {
    light: {
      primary: "oklch(0.52 0.14 180)",
      primaryForeground: "oklch(0.985 0 0)",
    },
    dark: {
      primary: "oklch(0.62 0.12 180)",
      primaryForeground: "oklch(0.985 0 0)",
    },
  },
  sky: {
    light: {
      primary: "oklch(0.55 0.16 235)",
      primaryForeground: "oklch(0.985 0 0)",
    },
    dark: {
      primary: "oklch(0.65 0.14 235)",
      primaryForeground: "oklch(0.985 0 0)",
    },
  },
  fuchsia: {
    light: {
      primary: "oklch(0.58 0.25 320)",
      primaryForeground: "oklch(0.985 0 0)",
    },
    dark: {
      primary: "oklch(0.68 0.22 320)",
      primaryForeground: "oklch(0.985 0 0)",
    },
  },
  orange: {
    light: {
      primary: "oklch(0.65 0.19 45)",
      primaryForeground: "oklch(0.985 0 0)",
    },
    dark: {
      primary: "oklch(0.72 0.17 45)",
      primaryForeground: "oklch(0.145 0 0)",
    },
  },
  lime: {
    light: {
      primary: "oklch(0.62 0.2 130)",
      primaryForeground: "oklch(0.145 0 0)",
    },
    dark: {
      primary: "oklch(0.72 0.18 130)",
      primaryForeground: "oklch(0.145 0 0)",
    },
  },
  stone: {
    light: {
      primary: "oklch(0.42 0.02 80)",
      primaryForeground: "oklch(0.985 0 0)",
    },
    dark: {
      primary: "oklch(0.58 0.02 80)",
      primaryForeground: "oklch(0.985 0 0)",
    },
  },
  green: {
    light: {
      primary: "oklch(0.52 0.16 145)",
      primaryForeground: "oklch(0.985 0 0)",
    },
    dark: {
      primary: "oklch(0.62 0.14 145)",
      primaryForeground: "oklch(0.985 0 0)",
    },
  },
  gold: {
    light: {
      primary: "oklch(0.72 0.16 85)",
      primaryForeground: "oklch(0.2 0 0)",
    },
    dark: {
      primary: "oklch(0.78 0.14 85)",
      primaryForeground: "oklch(0.2 0 0)",
    },
  },
  pink: {
    light: {
      primary: "oklch(0.58 0.2 350)",
      primaryForeground: "oklch(0.985 0 0)",
    },
    dark: {
      primary: "oklch(0.68 0.18 350)",
      primaryForeground: "oklch(0.985 0 0)",
    },
  },
};

export const defaultThemeId = "indigo";
