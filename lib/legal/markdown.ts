import { LEGAL_LAST_UPDATED } from "./constants";
import type { LegalDocument, LegalSection } from "./types";

function sectionToMarkdown(section: LegalSection): string {
  let out = `## ${section.title}\n\n`;
  if (section.paragraphs?.length) {
    for (const p of section.paragraphs) {
      out += `${p}\n\n`;
    }
  }
  if (section.subsections?.length) {
    for (const sub of section.subsections) {
      out += `### ${sub.title}\n\n`;
      for (const p of sub.paragraphs) {
        out += `${p}\n\n`;
      }
    }
  }
  return out;
}

export function legalDocumentToMarkdown(doc: LegalDocument): string {
  const header = [
    `# ${doc.heading}`,
    "",
    `**Last updated:** ${LEGAL_LAST_UPDATED}`,
    "",
    `*${doc.metaDescription}*`,
    "",
  ].join("\n");

  const intro = doc.intro.map((p) => `${p}\n`).join("\n") + "\n";

  const body = doc.sections.map(sectionToMarkdown).join("\n");

  return `${header}${intro}\n${body}`.trimEnd() + "\n";
}
