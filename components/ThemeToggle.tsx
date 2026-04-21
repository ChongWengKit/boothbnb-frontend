"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  if (!mounted) {
    return null;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      aria-label="Toggle theme"
      className="fixed right-4 bottom-4 z-[999] inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-card-foreground shadow-lg transition hover:bg-muted"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      type="button"
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
}
