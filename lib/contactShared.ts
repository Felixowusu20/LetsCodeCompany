/**
 * Contact form types and labels — safe to import from Client Components.
 * Do not import Prisma here (pulls Node/runtime into the browser bundle).
 */

export type ContactApiStatus = "new" | "in_progress" | "closed";

export type ContactProjectTypeApi = "web_app" | "mobile_app" | "both" | "other_consulting";

export const CONTACT_PROJECT_TYPE_LABELS: Record<ContactProjectTypeApi, string> = {
  web_app: "Web application",
  mobile_app: "Mobile application",
  both: "Both web & mobile",
  other_consulting: "Other / consulting",
};
