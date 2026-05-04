"use client";

import { usePathname } from "next/navigation";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import AOS from "aos";

type Theme = "light" | "dark";

interface ProvidersProps {
  children: React.ReactNode;
}

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getInitialTheme(): Theme {
  if (typeof window === "undefined") {
    return "light";
  }

  const savedTheme = window.localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  return savedTheme === "dark" || (!savedTheme && prefersDark) ? "dark" : "light";
}

export default function Providers({ children }: ProvidersProps) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const pathname = usePathname();

  useEffect(() => {
    AOS.init({
      duration: 700,
      delay: 40,
      easing: "ease-out-cubic",
      once: false,
      mirror: true,
      offset: 24,
    });
  }, []);

  useEffect(() => {
    const root = document.documentElement;

    root.dataset.theme = theme;
    root.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    AOS.refreshHard();
  }, [pathname, theme]);

  const value = useMemo(
    () => ({
      theme,
      toggleTheme: () =>
        setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark")),
    }),
    [theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used inside Providers");
  }

  return context;
}
