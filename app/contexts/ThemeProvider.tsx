"use client"

import * as React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { setThemeCookie } from "./theme"

type ThemeContextType = {
  theme: "light" | "dark"
  setTheme: (theme: "light" | "dark") => void
}

const ThemeContext = createContext<ThemeContextType | null>(null)

function ThemeProvider({
  children,
  initialTheme,
}: {
  children: React.ReactNode
  initialTheme: "light" | "dark"
}) {
  const [theme, setThemeState] = useState(initialTheme)

  useEffect(() => {
    const root = document.documentElement
    root.classList.remove("light", "dark")
    root.classList.add(theme)
  }, [theme])

  const setTheme = (next: "light" | "dark") => {
    setThemeState(next)
    void setThemeCookie(next)
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <ThemeHotkey />
      {children}
    </ThemeContext.Provider>
  )
}

function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false
  }

  return (
    target.isContentEditable ||
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.tagName === "SELECT"
  )
}

function ThemeHotkey() {
  const { theme, setTheme } = useTheme()

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented || event.repeat) {
        return
      }

      if (event.metaKey || event.ctrlKey || event.altKey) {
        return
      }

      if (event.key.toLowerCase() !== "d") {
        return
      }

      if (isTypingTarget(event.target)) {
        return
      }

      setTheme(theme === "dark" ? "light" : "dark")
    }

    window.addEventListener("keydown", onKeyDown)

    return () => {
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [theme, setTheme])

  return null
}

export { ThemeProvider, useTheme }