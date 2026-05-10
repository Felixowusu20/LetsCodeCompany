import { LegalDocumentView } from "@/components/legal/LegalDocumentView";
import { acceptableUseDocument, legalPageMetadata } from "@/lib/legal";

export const metadata = legalPageMetadata(acceptableUseDocument);

export default function AcceptableUsePage() {
  return <LegalDocumentView doc={acceptableUseDocument} />;
}
