"use client";

import { createContext, useContext, useCallback, useSyncExternalStore } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  mounted: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
  mounted: false,
});

// Store for theme state
let themeListeners: Array<() => void> = [];

function subscribeToTheme(listener: () => void) {
  themeListeners.push(listener);
  return () => {
    themeListeners = themeListeners.filter(l => l !== listener);
  };
}

function getThemeSnapshot(): Theme {
  if (typeof window === "undefined") return "light";
  const savedTheme = localStorage.getItem("theme") as Theme | null;
  if (savedTheme) return savedTheme;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getServerSnapshot(): Theme {
  return "light";
}

function notifyThemeListeners() {
  themeListeners.forEach(listener => listener());
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const theme = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    getServerSnapshot
  );

  // Apply theme class on mount
  if (mounted && typeof document !== "undefined") {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }

  const toggleTheme = useCallback(() => {
    const currentTheme = getThemeSnapshot();
    const newTheme = currentTheme === "light" ? "dark" : "light";
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    notifyThemeListeners();
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
