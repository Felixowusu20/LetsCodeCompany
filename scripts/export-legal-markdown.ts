import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  legalDocuments,
  legalDocumentToMarkdown,
} from "../lib/legal/index";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = join(__dirname, "..");
const outDir = join(root, "content", "legal");
mkdirSync(outDir, { recursive: true });

const map: Record<string, string> = {
  "/terms": "TERMS_AND_CONDITIONS.md",
  "/privacy": "PRIVACY_POLICY.md",
  "/acceptable-use": "ACCEPTABLE_USE_POLICY.md",
  "/cookies": "COOKIE_POLICY.md",
};

const banner =
  "<!-- Source of truth: `lib/legal/*.ts`. Regenerate: `npm run legal:export` -->\n\n";

for (const doc of legalDocuments) {
  const file = map[doc.path];
  if (!file) throw new Error(`Missing markdown filename for ${doc.path}`);
  writeFileSync(join(outDir, file), banner + legalDocumentToMarkdown(doc));
}

console.log(
  `Exported ${legalDocuments.length} files to ${join("content", "legal")}`,
);
