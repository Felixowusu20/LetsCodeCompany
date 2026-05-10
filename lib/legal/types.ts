export type LegalSubsection = {
  title: string;
  paragraphs: string[];
};

export type LegalSection = {
  title: string;
  paragraphs?: string[];
  subsections?: LegalSubsection[];
};

export type LegalDocument = {
  /** URL path, e.g. `/terms` */
  path: string;
  pageTitle: string;
  metaDescription: string;
  heading: string;
  categoryLabel: string;
  intro: string[];
  sections: LegalSection[];
};
