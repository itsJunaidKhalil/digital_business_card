export const themes = {
  default: {
    bg: "white",
    text: "black",
    primary: "#3b82f6",
  },
  dark: {
    bg: "#111",
    text: "white",
    primary: "#60a5fa",
  },
  blue: {
    bg: "#eff6ff",
    text: "#1e3a8a",
    primary: "#2563eb",
  },
  green: {
    bg: "#f0fdf4",
    text: "#166534",
    primary: "#22c55e",
  },
} as const;

export type ThemeName = keyof typeof themes;

