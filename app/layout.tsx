import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "aos/dist/aos.css";
import Providers from "../components/providers/Providers";
import SiteChrome from "../components/layout/SiteChrome";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ZeoFex - Modern Web Development",
  description: "Building the future of web development",
  icons: {
    icon: [
      { url: "/icon.jpeg", type: "image/jpeg" },
      { url: "/favicon.ico", type: "image/x-icon" },
    ],
    apple: [{ url: "/apple-icon.jpeg", type: "image/jpeg" }],
    shortcut: ["/favicon.ico"],
  },
};

/**
 * Tiny script that runs before React hydrates to apply the persisted theme,
 * eliminating the flash-of-wrong-theme and avoiding a redundant DOM mutation
 * on the first paint after hydration.
 */
const themeBootScript = `(() => {
  try {
    var saved = localStorage.getItem('theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var theme = saved === 'dark' || (!saved && prefersDark) ? 'dark' : 'light';
    var root = document.documentElement;
    root.dataset.theme = theme;
    if (theme === 'dark') root.classList.add('dark');
  } catch (_) {}
})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <Script
          id="theme-boot"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeBootScript }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Providers>
          <SiteChrome>{children}</SiteChrome>
        </Providers>
      </body>
    </html>
  );
}
