import type { Metadata } from "next";
import { LEGAL_LAST_UPDATED } from "./constants";
import type { LegalDocument } from "./types";

export function legalPageMetadata(doc: LegalDocument): Metadata {
  return {
    title: doc.pageTitle,
    description: doc.metaDescription,
    other: {
      "last-updated": LEGAL_LAST_UPDATED,
    },
  };
}
