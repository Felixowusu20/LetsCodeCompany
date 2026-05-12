"use client";

import Image from "next/image";
import Link from "next/link";
import { memo, useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, Moon, Sun, X, ChevronRight } from "lucide-react";
import { useTheme } from "../providers/Providers";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Work", href: "/work" },
  { name: "Products", href: "/products" },
  { name: "Blog", href: "/blog" },
  { name: "Team", href: "/team" },
  { name: "Contact", href: "/contact" },
] as const;

function isLinkActive(pathname: string | null, href: string) {
  if (!pathname) return false;
  return href === "/" ? pathname === href : pathname.startsWith(href);
}

const BrandLogo = memo(function BrandLogo({
  mobile = false,
  lightSrc,
  darkSrc,
}: {
  mobile?: boolean;
  lightSrc: string;
  darkSrc: string;
}) {
  const width = mobile ? 220 : 360;
  const height = mobile ? 52 : 60;

  return (
    <div
      className={`inline-flex items-center justify-center overflow-hidden ${
        mobile
          ? "h-12 w-[220px]"
          : "h-12 w-[240px] sm:h-14 sm:w-[300px] lg:h-14 lg:w-[360px]"
      }`}
    >
      <Image
        src={lightSrc}
        alt="Site logo"
        width={width}
        height={height}
        priority
        sizes={
          mobile
            ? "220px"
            : "(min-width: 1024px) 360px, (min-width: 640px) 300px, 240px"
        }
        className="h-full w-full object-contain object-left dark:hidden"
      />
      <Image
        src={darkSrc}
        alt="Site logo"
        width={width}
        height={height}
        priority
        sizes={
          mobile
            ? "220px"
            : "(min-width: 1024px) 360px, (min-width: 640px) 300px, 240px"
        }
        className="hidden h-full w-full scale-[1.06] object-contain object-left dark:block"
      />
    </div>
  );
});

const DesktopLinks = memo(function DesktopLinks({
  pathname,
}: {
  pathname: string | null;
}) {
  return (
    <>
      {navLinks.map((link) => {
        const active = isLinkActive(pathname, link.href);
        return (
          <Link
            key={link.name}
            href={link.href}
            className={`relative rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              active
                ? "bg-blue-600/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-300"
                : "text-slate-700 hover:bg-white/40 hover:text-blue-600 dark:text-slate-200 dark:hover:bg-white/5 dark:hover:text-blue-300"
            }`}
          >
            {link.name}
          </Link>
        );
      })}
    </>
  );
});

const MobileDrawer = memo(function MobileDrawer({
  open,
  onClose,
  pathname,
  onToggleTheme,
  logoLightSrc,
  logoDarkSrc,
}: {
  open: boolean;
  onClose: () => void;
  pathname: string | null;
  onToggleTheme: () => void;
  logoLightSrc: string;
  logoDarkSrc: string;
}) {
  return (
    <div
      className={`fixed inset-0 -top-4 left-1/2 h-screen w-screen -translate-x-1/2 transition-opacity duration-300 ${
        open ? "visible opacity-100" : "invisible opacity-0"
      }`}
      aria-hidden={!open}
    >
      <div
        className="absolute inset-0 bg-slate-900/20 backdrop-blur-2xl dark:bg-black/40"
        onClick={onClose}
      />

      <aside
        className={`absolute right-4 top-4 bottom-4 w-[90%] max-w-[380px] rounded-3xl border border-white/30 bg-white/70 p-6 shadow-2xl transition-transform duration-300 dark:border-white/10 dark:bg-slate-900/80 ${
          open ? "translate-x-0" : "translate-x-[110%]"
        }`}
      >
        {open ? (
          <div className="flex flex-col h-full">
            <div className="mb-8 flex items-center justify-between">
              <BrandLogo mobile lightSrc={logoLightSrc} darkSrc={logoDarkSrc} />
              <button
                type="button"
                onClick={onClose}
                className="rounded-full bg-slate-200/50 p-2 text-slate-800 dark:bg-white/10 dark:text-white"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {navLinks.map((link) => {
                const active = isLinkActive(pathname, link.href);
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={onClose}
                    className={`flex items-center justify-between rounded-2xl px-5 py-4 text-lg font-bold transition-colors ${
                      active
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                        : "bg-white/40 text-slate-700 hover:bg-white/80 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10"
                    }`}
                  >
                    {link.name}
                    <ChevronRight
                      size={18}
                      className={active ? "opacity-100" : "opacity-40"}
                    />
                  </Link>
                );
              })}
            </div>

            <div className="mt-auto pt-6">
              <button
                type="button"
                onClick={onToggleTheme}
                className="mb-4 flex w-full items-center justify-between rounded-2xl bg-white/40 px-5 py-4 font-semibold text-slate-700 dark:bg-white/5 dark:text-slate-300"
              >
                <span>Switch Mode</span>
                <div className="flex items-center gap-2">
                  <Sun className="h-5 w-5 dark:text-blue-300" />
                  <Moon className="h-5 w-5 text-blue-600" />
                </div>
              </button>
              <Link
                href="/contact"
                onClick={onClose}
                className="flex w-full items-center justify-center rounded-2xl bg-slate-950 py-4 text-lg font-bold text-white shadow-xl dark:bg-white dark:text-slate-950"
              >
                Get Started
              </Link>
            </div>
          </div>
        ) : null}
      </aside>
    </div>
  );
});

const DEFAULT_NAV_LOGO_LIGHT = "/whitelog.jpeg";
const DEFAULT_NAV_LOGO_DARK = "/logo.jpeg";

export default function Navbar({
  logoWhenUiLightUrl = DEFAULT_NAV_LOGO_LIGHT,
  logoWhenUiDarkUrl = DEFAULT_NAV_LOGO_DARK,
}: {
  logoWhenUiLightUrl?: string;
  logoWhenUiDarkUrl?: string;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { toggleTheme } = useTheme();

  const logoLight = logoWhenUiLightUrl?.trim() || DEFAULT_NAV_LOGO_LIGHT;
  const logoDark = logoWhenUiDarkUrl?.trim() || DEFAULT_NAV_LOGO_DARK;

  const openMenu = useCallback(() => setOpen(true), []);
  const closeMenu = useCallback(() => setOpen(false), []);

  // Lock body scroll while the drawer is open and restore the previous value
  // (instead of forcing it back to "auto" which clobbers user/global styles).
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <header className="fixed top-4 left-1/2 z-50 w-[95%] max-w-7xl -translate-x-1/2">
      <nav className="relative flex h-16 items-center justify-between rounded-2xl border border-white/20 bg-white/40 px-4 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/40 lg:h-20 lg:px-8">
        <Link href="/" className="flex items-center">
          <BrandLogo lightSrc={logoLight} darkSrc={logoDark} />
        </Link>

        <div className="hidden items-center gap-2 lg:flex">
          <DesktopLinks pathname={pathname} />

          <div className="mx-2 h-6 w-px bg-slate-200/50 dark:bg-white/10" />

          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-white/20 text-slate-700 shadow-sm transition-colors hover:bg-white/60 dark:border-white/10 dark:bg-white/5 dark:text-blue-200 dark:hover:bg-white/10"
          >
            <Moon className="h-5 w-5 dark:hidden" />
            <Sun className="hidden h-5 w-5 dark:block" />
          </button>

          <Link
            href="/contact"
            className="ml-2 rounded-full bg-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-500/30 transition-colors hover:bg-blue-700 active:scale-95"
          >
            Get Started
          </Link>
        </div>

        <button
          type="button"
          onClick={openMenu}
          aria-label="Open menu"
          aria-expanded={open}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/40 bg-white/20 text-blue-600 dark:border-white/10 dark:bg-white/5 dark:text-blue-300 lg:hidden"
        >
          <Menu size={24} />
        </button>
      </nav>

      <MobileDrawer
        open={open}
        onClose={closeMenu}
        pathname={pathname}
        onToggleTheme={toggleTheme}
        logoLightSrc={logoLight}
        logoDarkSrc={logoDark}
      />
    </header>
  );
}
