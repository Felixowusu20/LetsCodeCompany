import { LegalDocumentView } from "@/components/legal/LegalDocumentView";
import { legalPageMetadata, privacyDocument } from "@/lib/legal";

export const metadata = legalPageMetadata(privacyDocument);

export default function PrivacyPage() {
  return <LegalDocumentView doc={privacyDocument} />;
}
