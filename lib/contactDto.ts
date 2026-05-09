import { ContactProjectType, ContactStatus } from "../prisma/generated/prisma/client";
import {
  type ContactApiStatus,
  type ContactProjectTypeApi,
  CONTACT_PROJECT_TYPE_LABELS,
} from "./contactShared";

/** Re-export for server routes that already import from contactDto */
export type { ContactApiStatus, ContactProjectTypeApi };
export { CONTACT_PROJECT_TYPE_LABELS };

export function contactToApi(row: {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string | null;
  projectType: ContactProjectType;
  projectDetails: string | null;
  message: string;
  status: ContactStatus;
  createdAt: Date;
}) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    company: row.company ?? undefined,
    projectType: contactProjectTypeToApi(row.projectType),
    projectDetails: row.projectDetails ?? undefined,
    message: row.message,
    status: contactStatusToApi(row.status),
    createdAt: row.createdAt.toISOString(),
  };
}

export function contactStatusToApi(s: ContactStatus): ContactApiStatus {
  if (s === ContactStatus.IN_PROGRESS) return "in_progress";
  if (s === ContactStatus.CLOSED) return "closed";
  return "new";
}

export function contactStatusFromApi(s: string): ContactStatus {
  if (s === "in_progress") return ContactStatus.IN_PROGRESS;
  if (s === "closed") return ContactStatus.CLOSED;
  return ContactStatus.NEW;
}

export function contactProjectTypeToApi(p: ContactProjectType): ContactProjectTypeApi {
  switch (p) {
    case ContactProjectType.WEB_APP:
      return "web_app";
    case ContactProjectType.MOBILE_APP:
      return "mobile_app";
    case ContactProjectType.BOTH:
      return "both";
    case ContactProjectType.OTHER_CONSULTING:
      return "other_consulting";
  }
}

export function contactProjectTypeFromApi(s: string): ContactProjectType | null {
  switch (s) {
    case "web_app":
      return ContactProjectType.WEB_APP;
    case "mobile_app":
      return ContactProjectType.MOBILE_APP;
    case "both":
      return ContactProjectType.BOTH;
    case "other_consulting":
      return ContactProjectType.OTHER_CONSULTING;
    default:
      return null;
  }
}
