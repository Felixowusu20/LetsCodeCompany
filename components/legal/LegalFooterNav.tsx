import Link from "next/link";
import { legalFooterNavItems } from "@/lib/legal";

const linkClass =
  "font-medium text-primary underline-offset-4 hover:underline text-foreground/80 hover:text-foreground";

type LegalFooterNavProps = {
  currentPath: string;
};

export function LegalFooterNav({ currentPath }: LegalFooterNavProps) {
  return (
    <nav
      aria-label="Legal and contact links"
      className="mt-16 border-t border-accent pt-10"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
        Related
      </p>
      <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
        {legalFooterNavItems.map((item) => {
          const isCurrent = item.href === currentPath;
          return (
            <li key={item.href}>
              {isCurrent ? (
                <span className="text-foreground/50" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link href={item.href} className={linkClass}>
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
