import { LEGAL_LAST_UPDATED } from "@/lib/legal/constants";
import type { LegalDocument, LegalSection } from "@/lib/legal/types";
import { LegalFooterNav } from "./LegalFooterNav";

function SectionBlock({ section }: { section: LegalSection }) {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
        {section.title}
      </h2>
      {section.paragraphs?.length ? (
        <div className="space-y-4 text-foreground/80">
          {section.paragraphs.map((p, i) => (
            <p key={`${section.title}-p-${i}`}>{p}</p>
          ))}
        </div>
      ) : null}
      {section.subsections?.length ? (
        <div className="space-y-8">
          {section.subsections.map((sub) => (
            <div key={sub.title} className="space-y-3">
              <h3 className="text-base font-semibold tracking-tight text-foreground sm:text-lg">
                {sub.title}
              </h3>
              <div className="space-y-4 text-foreground/80">
                {sub.paragraphs.map((p, i) => (
                  <p key={`${sub.title}-${i}`}>{p}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}

type LegalDocumentViewProps = {
  doc: LegalDocument;
};

export function LegalDocumentView({ doc }: LegalDocumentViewProps) {
  return (
    <main className="bg-background text-foreground">
      <article className="mx-auto max-w-3xl px-6 py-24 lg:px-8">
        <header className="mb-14 border-b border-accent pb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">
            {doc.categoryLabel}
          </p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            {doc.heading}
          </h1>
          <p className="mt-2 text-sm text-foreground/60">
            Last updated: {LEGAL_LAST_UPDATED}
          </p>
          <div className="mt-4 max-w-2xl space-y-4 text-base leading-relaxed text-foreground/75">
            {doc.intro.map((p, i) => (
              <p key={`intro-${i}`}>{p}</p>
            ))}
          </div>
        </header>

        <div className="space-y-12 text-sm leading-relaxed sm:text-base">
          {doc.sections.map((section) => (
            <SectionBlock key={section.title} section={section} />
          ))}
        </div>

        <LegalFooterNav currentPath={doc.path} />
      </article>
    </main>
  );
}
