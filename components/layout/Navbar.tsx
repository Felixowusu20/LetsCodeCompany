"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useTheme } from "../providers/Providers";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Products", href: "/products" },
  { name: "Blog", href: "/blog" },
  { name: "Team", href: "/team" },
  { name: "Contact", href: "/contact" },
];

function BrandLogo({ mobile = false }: { mobile?: boolean }) {
  return (
    <div
      className={`inline-flex items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm ring-1 ring-black/5 transition dark:border-white/10 dark:bg-slate-900 dark:ring-white/10 ${
        mobile ? "h-10 w-[140px]" : "h-10 w-[140px] sm:h-12 sm:w-[170px]"
      }`}
    >
      <Image
        src="/logo.jpeg" // ✅ SAME LOGO FOR ALL MODES
        alt="LetsCode Logo"
        width={170}
        height={48}
        priority
        sizes="170px"
        className="h-full w-full object-contain"
      />
    </div>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { toggleTheme } = useTheme();

  // ✅ Lock scroll when menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === href : pathname.startsWith(href);

  return (
    <header className="fixed top-0 left-0 z-50 w-full border-b border-slate-200 bg-white/90 shadow-sm backdrop-blur-xl transition-colors dark:border-white/10 dark:bg-slate-950/90">
      {/* NAV */}
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:h-20 lg:px-10">
        {/* LOGO */}
        <Link href="/" className="flex items-center" aria-label="LetsCode home">
          <BrandLogo />
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden items-center gap-5 lg:flex xl:gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`relative inline-flex items-center px-2.5 py-1 text-sm font-semibold transition ${
                isActive(link.href)
                  ? "text-blue-600 after:scale-x-100 dark:text-blue-300"
                  : "text-slate-700 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-300"
              } after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-full after:origin-left after:rounded-full after:bg-blue-600 after:scale-x-0 after:transition-transform after:duration-300 after:content-[''] dark:after:bg-blue-300`}
            >
              {link.name}
            </Link>
          ))}

          {/* THEME BUTTON */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle color theme"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-100 focus:outline-none focus:ring-4 focus:ring-blue-100 dark:border-white/10 dark:bg-white/5 dark:text-blue-200 dark:hover:bg-white/10 dark:focus:ring-blue-400/20"
          >
            <Moon className="h-[19px] w-[19px] dark:hidden" />
            <Sun className="hidden h-[19px] w-[19px] dark:block" />
          </button>

          {/* CTA */}
          <Link
            href="/contact"
            className="rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-700"
          >
            Get Started
          </Link>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          aria-expanded={open}
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-blue-600 shadow-sm transition hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-blue-200 lg:hidden"
        >
          <Menu size={26} />
        </button>
      </nav>

      {/* MOBILE DRAWER */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-300 ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        {/* BACKDROP */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />

        {/* SIDEBAR */}
        <aside
          className={`absolute right-0 top-0 h-full w-[85%] max-w-sm border-l border-slate-200 bg-white p-6 text-slate-900 shadow-2xl transition-transform duration-300 dark:border-white/10 dark:bg-slate-950 dark:text-white ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* HEADER */}
          <div className="mb-8 flex items-center justify-between">
            <BrandLogo mobile />
            <button
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="rounded-xl border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/10"
            >
              <X size={22} />
            </button>
          </div>

          {/* THEME SWITCH */}
          <button
            type="button"
            onClick={toggleTheme}
            className="mb-8 inline-flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
          >
            <span className="dark:hidden">Switch to night mode</span>
            <span className="hidden dark:inline">Switch to day mode</span>
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-blue-600 shadow-sm dark:bg-slate-900 dark:text-blue-200">
              <Moon className="h-[18px] w-[18px] dark:hidden" />
              <Sun className="hidden h-[18px] w-[18px] dark:block" />
            </span>
          </button>

          {/* LINKS */}
          <div className="mt-2 rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-slate-950">
            {navLinks.map((link, idx) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`group flex items-center justify-between px-5 py-4 text-lg font-medium tracking-tight transition ${
                  isActive(link.href)
                    ? "text-slate-950 dark:text-white"
                    : "text-slate-700 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
                }`}
              >
                <span className="relative">
                  {link.name}
                  <span
                    className={`pointer-events-none absolute -bottom-2 left-0 h-0.5 w-8 rounded-full transition ${
                      isActive(link.href)
                        ? "bg-blue-600 dark:bg-blue-300"
                        : "bg-transparent group-hover:bg-slate-200 dark:group-hover:bg-white/10"
                    }`}
                    aria-hidden="true"
                  />
                </span>
                <span
                  className={`text-xs font-semibold tracking-wide transition ${
                    isActive(link.href)
                      ? "text-blue-600/80 dark:text-blue-200/80"
                      : "text-slate-400 group-hover:text-slate-500 dark:text-slate-500 dark:group-hover:text-slate-400"
                  }`}
                  aria-hidden="true"
                >
                  →
                </span>
                {idx !== navLinks.length - 1 && (
                  <span
                    className="pointer-events-none absolute left-5 right-5 mt-[3.75rem] border-b border-slate-100 dark:border-white/5"
                    aria-hidden="true"
                  />
                )}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-10">
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="inline-flex w-full items-center justify-center rounded-2xl bg-slate-950 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:bg-slate-900 dark:bg-white dark:text-slate-950 dark:hover:bg-white/90"
            >
              Get Started
            </Link>
          </div>
        </aside>
      </div>
    </header>
  );
}