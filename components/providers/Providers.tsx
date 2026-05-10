"use client";

import { usePathname } from "next/navigation";
import {
  createContext,
  startTransition,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";

type Theme = "light" | "dark";

interface ProvidersProps {
  children: React.ReactNode;
}

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

/* ---------------------------------------------------------------------------
 *  Theme store
 *  --------------------------------------------------------------------------
 *  The DOM (`<html class="dark">` / `<html data-theme="…">`) is treated as the
 *  single source of truth. The inline script in `app/layout.tsx` applies the
 *  persisted theme before React hydrates, so this store can simply read the
 *  current value and notify subscribers when `applyTheme` is called from a
 *  user gesture. This avoids the lint warning about setState-in-effect and
 *  removes a redundant render after hydration.
 * ------------------------------------------------------------------------- */

const themeListeners = new Set<() => void>();

function subscribeTheme(listener: () => void) {
  themeListeners.add(listener);
  return () => {
    themeListeners.delete(listener);
  };
}

function getThemeSnapshot(): Theme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function getServerThemeSnapshot(): Theme {
  return "light";
}

function applyTheme(next: Theme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.dataset.theme = next;
  root.classList.toggle("dark", next === "dark");
  try {
    window.localStorage.setItem("theme", next);
  } catch {
    /* ignore quota / private-mode errors */
  }
  themeListeners.forEach((listener) => listener());
}

/* ---------------------------------------------------------------------------
 *  AOS (lazy)
 *  --------------------------------------------------------------------------
 *  AOS is loaded *after* the browser is idle and configured with
 *  `once: true, mirror: false` so it never re-runs animations during scroll —
 *  a major INP win compared to the previous mirror-on-scroll setup.
 * ------------------------------------------------------------------------- */

type IdleCallback = (cb: () => void) => number;

const requestIdle: IdleCallback =
  typeof window !== "undefined" &&
  typeof (window as unknown as { requestIdleCallback?: IdleCallback })
    .requestIdleCallback === "function"
    ? (cb) =>
        (
          window as unknown as { requestIdleCallback: IdleCallback }
        ).requestIdleCallback(cb)
    : (cb) => window.setTimeout(cb, 1) as unknown as number;

type AosLike = {
  init: (opts?: Record<string, unknown>) => void;
  refresh: () => void;
};

let aosPromise: Promise<AosLike | null> | null = null;
let aosReady = false;

function ensureAos(): Promise<AosLike | null> {
  if (typeof window === "undefined") return Promise.resolve(null);
  if (!aosPromise) {
    aosPromise = import("aos").then((mod) => {
      const aos = (mod.default ?? mod) as AosLike;
      aos.init({
        duration: 600,
        delay: 0,
        easing: "ease-out-cubic",
        once: true,
        mirror: false,
        offset: 24,
        disable: "phone",
      });
      aosReady = true;
      return aos;
    });
  }
  return aosPromise;
}

export default function Providers({ children }: ProvidersProps) {
  const theme = useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    getServerThemeSnapshot,
  );

  const pathname = usePathname();

  // Lazy-init AOS once, after the browser is idle.
  useEffect(() => {
    const id = requestIdle(() => {
      void ensureAos();
    });
    return () => {
      if (typeof window !== "undefined") {
        window.clearTimeout(id);
      }
    };
  }, []);

  // After client-side navigation, refresh AOS so newly mounted nodes can
  // animate. Use the cheap `refresh()` (NOT `refreshHard`) and skip if AOS
  // hasn't loaded yet. Wrapped in idle so it doesn't contend with route work.
  useEffect(() => {
    if (!aosReady) return;
    const id = requestIdle(() => {
      void ensureAos().then((aos) => aos?.refresh());
    });
    return () => {
      if (typeof window !== "undefined") {
        window.clearTimeout(id);
      }
    };
  }, [pathname]);

  // The click commits immediately; React schedules the re-render of any
  // theme-dependent subtrees as a non-blocking transition.
  const toggleTheme = useCallback(() => {
    const next: Theme = getThemeSnapshot() === "dark" ? "light" : "dark";
    startTransition(() => {
      applyTheme(next);
    });
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, toggleTheme }),
    [theme, toggleTheme],
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
