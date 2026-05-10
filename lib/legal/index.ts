export { LEGAL_ENTITY, LEGAL_LAST_UPDATED } from "./constants";
export { legalDocumentToMarkdown } from "./markdown";
export { legalPageMetadata } from "./pageMetadata";
export type { LegalDocument, LegalSection, LegalSubsection } from "./types";

import { acceptableUseDocument } from "./acceptableUse";
import { cookiesDocument } from "./cookies";
import { privacyDocument } from "./privacy";
import { termsDocument } from "./terms";

export { acceptableUseDocument } from "./acceptableUse";
export { cookiesDocument } from "./cookies";
export { privacyDocument } from "./privacy";
export { termsDocument } from "./terms";

/** All published legal documents (single source for pages + Markdown export). */
export const legalDocuments = [
  termsDocument,
  privacyDocument,
  acceptableUseDocument,
  cookiesDocument,
] as const;

export type LegalNavItem = { href: string; label: string };

/** Cross-links row: legal pages + contact (current path shown as plain text). */
export const legalFooterNavItems: LegalNavItem[] = [
  { href: "/terms", label: "Terms" },
  { href: "/privacy", label: "Privacy" },
  { href: "/acceptable-use", label: "Acceptable Use" },
  { href: "/cookies", label: "Cookies" },
  { href: "/contact", label: "Contact" },
];
