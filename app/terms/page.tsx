import { LegalDocumentView } from "@/components/legal/LegalDocumentView";
import { legalPageMetadata, termsDocument } from "@/lib/legal";

export const metadata = legalPageMetadata(termsDocument);

export default function TermsPage() {
  return <LegalDocumentView doc={termsDocument} />;
}
