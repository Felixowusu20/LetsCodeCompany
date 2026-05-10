import { LegalDocumentView } from "@/components/legal/LegalDocumentView";
import { cookiesDocument, legalPageMetadata } from "@/lib/legal";

export const metadata = legalPageMetadata(cookiesDocument);

export default function CookiesPage() {
  return <LegalDocumentView doc={cookiesDocument} />;
}
