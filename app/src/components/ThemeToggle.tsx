// components/ThemeToggle.tsx
"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Laptop } from "lucide-react";

enum Theme {
  Light = "light",
  Dark = "dark",
  System = "system",
}

const themes: Theme[] = [Theme.Light, Theme.Dark, Theme.System];

export default function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // After hydration, we can safely show the toggle
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  // Determine current effective theme icon
  const current = theme === "system" ? systemTheme : theme;
  const icon = current === "dark" ? <Moon /> : <Sun />;

  // On click, rotate through themes
  const handleClick = () => {
    const currentTheme: Theme = (theme as Theme) ?? Theme.System;
    const next = themes[(themes.indexOf(currentTheme) + 1) % themes.length];
    setTheme(next);
  };

  return (
    <Button onClick={handleClick} variant="ghost" size="icon" className="p-2">
      {theme === "system" ? <Laptop /> : icon}
    </Button>
  );
}
