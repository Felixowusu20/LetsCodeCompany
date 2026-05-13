/**
 * Types & labels for the public "Become a partner" form and the admin view.
 * Safe to import from Client Components — does not pull in Prisma/Node runtime.
 */

export type PartnerApplicationApiStatus =
  | "new"
  | "in_review"
  | "approved"
  | "rejected";

export type PartnershipTypeApi =
  | "technology"
  | "reseller"
  | "agency"
  | "referral"
  | "affiliate"
  | "strategic"
  | "other";

export type CompanySizeApi =
  | "solo"
  | "size_2_10"
  | "size_11_50"
  | "size_51_200"
  | "size_201_1000"
  | "size_1000_plus";

export type PartnerTimelineApi =
  | "immediately"
  | "within_30_days"
  | "within_90_days"
  | "exploring";

export const PARTNERSHIP_TYPE_LABELS: Record<PartnershipTypeApi, string> = {
  technology: "Technology / integration partner",
  reseller: "Reseller",
  agency: "Agency / implementation partner",
  referral: "Referral partner",
  affiliate: "Affiliate",
  strategic: "Strategic / co-marketing",
  other: "Something else",
};

export const COMPANY_SIZE_LABELS: Record<CompanySizeApi, string> = {
  solo: "Just me",
  size_2_10: "2 – 10",
  size_11_50: "11 – 50",
  size_51_200: "51 – 200",
  size_201_1000: "201 – 1,000",
  size_1000_plus: "1,000+",
};

export const PARTNER_TIMELINE_LABELS: Record<PartnerTimelineApi, string> = {
  immediately: "Ready to start now",
  within_30_days: "Within 30 days",
  within_90_days: "Within 90 days",
  exploring: "Just exploring",
};

export const PARTNER_APPLICATION_STATUS_LABELS: Record<
  PartnerApplicationApiStatus,
  string
> = {
  new: "new",
  in_review: "in review",
  approved: "approved",
  rejected: "rejected",
};

export type PartnerApplicationApi = {
  id: string;
  companyName: string;
  website?: string;
  industry?: string;
  companySize: CompanySizeApi;
  headquarters?: string;
  contactName: string;
  contactRole?: string;
  contactEmail: string;
  contactPhone?: string;
  partnershipType: PartnershipTypeApi;
  goals: string;
  audienceFit?: string;
  expertise?: string;
  timeline: PartnerTimelineApi;
  budgetRange?: string;
  referralSource?: string;
  status: PartnerApplicationApiStatus;
  notes?: string;
  createdAt: string;
};
