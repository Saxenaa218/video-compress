"use client";

import { useState, useEffect, useLayoutEffect } from "react";

// Use useLayoutEffect on client to avoid flash
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    // Initialize from localStorage if available (client-side only)
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
      if (savedTheme) return savedTheme;
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return "light";
  });

  useIsomorphicLayoutEffect(() => {
    // Sync DOM with state
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return { theme, toggleTheme };
}
