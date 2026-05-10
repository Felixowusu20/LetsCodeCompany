import Image from "next/image";
import { ExternalLink } from "lucide-react";
import type { FooterSocialLinkItem } from "../../lib/footerSocial";

const iconShell =
  "flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-slate-200 transition hover:border-white/25 hover:bg-white/10 hover:text-white";

export default function FooterSocialIcons({
  title,
  links,
}: {
  title: string;
  links: FooterSocialLinkItem[];
}) {
  if (!links.length) return null;

  return (
    <div className="mt-8 border-t border-white/10 pt-8">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-300">
        {title}
      </p>
      <ul className="mt-4 flex flex-wrap gap-3">
        {links.map((link) => (
          <li key={`${link.platform}-${link.href}`}>
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
              className={iconShell}
            >
              {link.platform === "other" ? (
                <ExternalLink className="h-5 w-5" aria-hidden />
              ) : (
                <Image
                  src={`https://cdn.simpleicons.org/${link.platform}/cbd5e1`}
                  alt=""
                  width={22}
                  height={22}
                  className="opacity-95"
                  unoptimized
                />
              )}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
