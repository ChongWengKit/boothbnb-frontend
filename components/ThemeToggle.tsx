"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/app/contexts/ThemeProvider";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      aria-label="Toggle theme"
      className="fixed right-4 bottom-16 z-[999] inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-card-foreground shadow-lg transition hover:bg-muted"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      type="button"
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
}
