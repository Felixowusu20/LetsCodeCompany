import Link from "next/link";
import { getFooterContent } from "../../lib/serverContent";

const linkClass = "transition hover:text-white";

function FooterHref({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  const external =
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("//");
  if (external || href === "#" || href.startsWith("#")) {
    return (
      <a
        href={href}
        className={className}
        rel={external ? "noopener noreferrer" : undefined}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export default async function Footer() {
  const c = await getFooterContent();

  return (
    <footer className="bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <h3 className="text-2xl font-bold text-white">{c.companyName}</h3>
            <p className="mt-4 text-slate-400">{c.tagline}</p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-300">
              {c.exploreColumnTitle}
            </h4>
            <ul className="mt-5 space-y-3 text-slate-400">
              {c.exploreLinks.map((item) => (
                <li key={`${item.href}-${item.label}`}>
                  <FooterHref href={item.href} className={linkClass}>
                    {item.label}
                  </FooterHref>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-300">
              {c.companyColumnTitle}
            </h4>
            <ul className="mt-5 space-y-3 text-slate-400">
              {c.companyLinks.map((item) => (
                <li key={`${item.href}-${item.label}`}>
                  <FooterHref href={item.href} className={linkClass}>
                    {item.label}
                  </FooterHref>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg border border-white/10 bg-slate-900/80 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-300">
              {c.ctaTitle}
            </p>
            <p className="mt-4 text-slate-300">{c.ctaBody}</p>
            <FooterHref
              href={c.ctaButtonHref}
              className="mt-6 inline-flex rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
            >
              {c.ctaButtonLabel}
            </FooterHref>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8 text-center text-slate-500">
          <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
            <span>{c.copyrightText}</span>
            <span aria-hidden className="text-slate-600">
              ·
            </span>
            <FooterHref href={c.termsHref} className={`${linkClass} underline-offset-4 hover:underline`}>
              {c.termsLabel}
            </FooterHref>
          </p>
        </div>
      </div>
    </footer>
  );
}
