import {
  CompanySize,
  PartnerApplicationStatus,
  PartnerTimeline,
  PartnershipType,
} from "../prisma/generated/prisma/client";
import {
  type CompanySizeApi,
  type PartnerApplicationApi,
  type PartnerApplicationApiStatus,
  type PartnerTimelineApi,
  type PartnershipTypeApi,
} from "./partnerApplicationShared";

export type {
  CompanySizeApi,
  PartnerApplicationApi,
  PartnerApplicationApiStatus,
  PartnerTimelineApi,
  PartnershipTypeApi,
};

export function partnerApplicationToApi(row: {
  id: string;
  companyName: string;
  website: string | null;
  industry: string | null;
  companySize: CompanySize;
  headquarters: string | null;
  contactName: string;
  contactRole: string | null;
  contactEmail: string;
  contactPhone: string | null;
  partnershipType: PartnershipType;
  goals: string;
  audienceFit: string | null;
  expertise: string | null;
  timeline: PartnerTimeline;
  budgetRange: string | null;
  referralSource: string | null;
  status: PartnerApplicationStatus;
  notes: string | null;
  createdAt: Date;
}): PartnerApplicationApi {
  return {
    id: row.id,
    companyName: row.companyName,
    website: row.website ?? undefined,
    industry: row.industry ?? undefined,
    companySize: companySizeToApi(row.companySize),
    headquarters: row.headquarters ?? undefined,
    contactName: row.contactName,
    contactRole: row.contactRole ?? undefined,
    contactEmail: row.contactEmail,
    contactPhone: row.contactPhone ?? undefined,
    partnershipType: partnershipTypeToApi(row.partnershipType),
    goals: row.goals,
    audienceFit: row.audienceFit ?? undefined,
    expertise: row.expertise ?? undefined,
    timeline: partnerTimelineToApi(row.timeline),
    budgetRange: row.budgetRange ?? undefined,
    referralSource: row.referralSource ?? undefined,
    status: partnerApplicationStatusToApi(row.status),
    notes: row.notes ?? undefined,
    createdAt: row.createdAt.toISOString(),
  };
}

/* ---------- enum <-> api ---------- */

export function partnerApplicationStatusToApi(
  s: PartnerApplicationStatus,
): PartnerApplicationApiStatus {
  switch (s) {
    case PartnerApplicationStatus.NEW:
      return "new";
    case PartnerApplicationStatus.IN_REVIEW:
      return "in_review";
    case PartnerApplicationStatus.APPROVED:
      return "approved";
    case PartnerApplicationStatus.REJECTED:
      return "rejected";
  }
}

export function partnerApplicationStatusFromApi(
  s: string,
): PartnerApplicationStatus {
  switch (s) {
    case "in_review":
      return PartnerApplicationStatus.IN_REVIEW;
    case "approved":
      return PartnerApplicationStatus.APPROVED;
    case "rejected":
      return PartnerApplicationStatus.REJECTED;
    default:
      return PartnerApplicationStatus.NEW;
  }
}

export function partnershipTypeToApi(p: PartnershipType): PartnershipTypeApi {
  switch (p) {
    case PartnershipType.TECHNOLOGY:
      return "technology";
    case PartnershipType.RESELLER:
      return "reseller";
    case PartnershipType.AGENCY:
      return "agency";
    case PartnershipType.REFERRAL:
      return "referral";
    case PartnershipType.AFFILIATE:
      return "affiliate";
    case PartnershipType.STRATEGIC:
      return "strategic";
    case PartnershipType.OTHER:
      return "other";
  }
}

export function partnershipTypeFromApi(s: string): PartnershipType | null {
  switch (s) {
    case "technology":
      return PartnershipType.TECHNOLOGY;
    case "reseller":
      return PartnershipType.RESELLER;
    case "agency":
      return PartnershipType.AGENCY;
    case "referral":
      return PartnershipType.REFERRAL;
    case "affiliate":
      return PartnershipType.AFFILIATE;
    case "strategic":
      return PartnershipType.STRATEGIC;
    case "other":
      return PartnershipType.OTHER;
    default:
      return null;
  }
}

export function companySizeToApi(s: CompanySize): CompanySizeApi {
  switch (s) {
    case CompanySize.SOLO:
      return "solo";
    case CompanySize.SIZE_2_10:
      return "size_2_10";
    case CompanySize.SIZE_11_50:
      return "size_11_50";
    case CompanySize.SIZE_51_200:
      return "size_51_200";
    case CompanySize.SIZE_201_1000:
      return "size_201_1000";
    case CompanySize.SIZE_1000_PLUS:
      return "size_1000_plus";
  }
}

export function companySizeFromApi(s: string): CompanySize | null {
  switch (s) {
    case "solo":
      return CompanySize.SOLO;
    case "size_2_10":
      return CompanySize.SIZE_2_10;
    case "size_11_50":
      return CompanySize.SIZE_11_50;
    case "size_51_200":
      return CompanySize.SIZE_51_200;
    case "size_201_1000":
      return CompanySize.SIZE_201_1000;
    case "size_1000_plus":
      return CompanySize.SIZE_1000_PLUS;
    default:
      return null;
  }
}

export function partnerTimelineToApi(t: PartnerTimeline): PartnerTimelineApi {
  switch (t) {
    case PartnerTimeline.IMMEDIATELY:
      return "immediately";
    case PartnerTimeline.WITHIN_30_DAYS:
      return "within_30_days";
    case PartnerTimeline.WITHIN_90_DAYS:
      return "within_90_days";
    case PartnerTimeline.EXPLORING:
      return "exploring";
  }
}

export function partnerTimelineFromApi(s: string): PartnerTimeline | null {
  switch (s) {
    case "immediately":
      return PartnerTimeline.IMMEDIATELY;
    case "within_30_days":
      return PartnerTimeline.WITHIN_30_DAYS;
    case "within_90_days":
      return PartnerTimeline.WITHIN_90_DAYS;
    case "exploring":
      return PartnerTimeline.EXPLORING;
    default:
      return null;
  }
}
