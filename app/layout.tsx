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

/** Absolute URLs for og:image / twitter:image (required on Vercel). */
function siteMetadataBase(): URL {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) {
    try {
      return new URL(explicit);
    } catch {
      // fall through
    }
  }
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return new URL(`https://${vercel}`);
  return new URL("http://localhost:3000");
}

const defaultTitle = "ZeoFex - Modern Web Development";
const defaultDescription =
  "Building reliable websites, apps, AI tools, and digital platforms for modern teams.";

/** Request-time metadata so OG/Twitter tags use absolute URLs Vercel’s inspector expects. */
export async function generateMetadata(): Promise<Metadata> {
  const metadataBase = siteMetadataBase();
  const canonicalUrl = new URL("/", metadataBase).href;
  const ogImageUrl = new URL("/icon.jpeg", metadataBase).href;

  return {
    metadataBase,
    title: {
      default: defaultTitle,
      template: "%s | ZeoFex",
    },
    description: defaultDescription,
    alternates: {
      canonical: "/",
    },
    openGraph: {
      type: "website",
      locale: "en_GH",
      url: canonicalUrl,
      siteName: "ZeoFex",
      title: defaultTitle,
      description: defaultDescription,
      images: [
        {
          url: ogImageUrl,
          alt: "ZeoFex",
          type: "image/jpeg",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: defaultTitle,
      description: defaultDescription,
      images: [ogImageUrl],
    },
    icons: {
      icon: [
        { url: "/icon.jpeg", type: "image/jpeg" },
        { url: "/favicon.ico", type: "image/x-icon" },
      ],
      apple: [{ url: "/apple-icon.jpeg", type: "image/jpeg" }],
      shortcut: ["/favicon.ico"],
    },
  };
}

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
