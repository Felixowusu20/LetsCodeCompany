import { LEGAL_ENTITY, LEGAL_LAST_UPDATED } from "./constants";
import type { LegalDocument } from "./types";

export const cookiesDocument: LegalDocument = {
  path: "/cookies",
  pageTitle: `Cookie Policy | ${LEGAL_ENTITY}`,
  metaDescription: `How ${LEGAL_ENTITY} uses cookies and similar technologies, and how you can control them.`,
  heading: "Cookie Policy",
  categoryLabel: "Legal",
  intro: [
    `This Cookie Policy explains how ${LEGAL_ENTITY} ("we," "us," or "our") uses cookies and similar technologies on our websites and web applications, how you can control them, and how this relates to major privacy frameworks.`,
    `Last updated: ${LEGAL_LAST_UPDATED}.`,
  ],
  sections: [
    {
      title: "1. What are cookies?",
      paragraphs: [
        "Cookies are small text files stored on your device when you visit a site. Similar technologies include local storage, session storage, pixels, and software development kits (SDKs) in mobile apps. Together we refer to these as \"cookies\" unless a distinction matters.",
      ],
    },
    {
      title: "2. Categories we use",
      subsections: [
        {
          title: "2.1 Strictly necessary (essential)",
          paragraphs: [
            "These cookies are required for core functionality such as authentication, session continuity, load balancing, fraud prevention, and security. They cannot be disabled via our cookie banner without breaking sign-in or checkout flows.",
          ],
        },
        {
          title: "2.2 Performance and analytics (optional)",
          paragraphs: [
            "These cookies help us understand how visitors use our sites (for example, page views, funnels, and errors). They are used only with your consent where required by law. We prefer aggregated reporting that minimizes identification.",
          ],
        },
        {
          title: "2.3 Marketing (opt-in)",
          paragraphs: [
            "These cookies support advertising, remarketing, conversion measurement, and partner attribution. They are deployed only after you opt in where legally required. You may withdraw consent at any time through our preference center or browser controls.",
          ],
        },
      ],
    },
    {
      title: "3. Third-party cookies",
      paragraphs: [
        "Some cookies are set by partners that provide analytics, advertising, content delivery, embedded media, or support widgets. Those providers have their own privacy notices governing their processing.",
      ],
    },
    {
      title: "4. Consent, controls, and banner behavior",
      paragraphs: [
        "Where required, we present a cookie banner on first visit (or after clearing storage) with clear choices: accept essential only, accept selected categories, or accept all, as permitted by local law.",
        "The banner should record consent preferences with a versioned policy identifier, timestamp, and categories selected; avoid pre-toggled non-essential categories where unlawful; and provide a persistent \"Manage cookies\" link in the footer or settings.",
        "You can also block or delete cookies through your browser. Note that blocking essential cookies may prevent you from using parts of our services.",
      ],
    },
    {
      title: "5. Retention",
      paragraphs: [
        "Session cookies expire when you close your browser. Persistent cookies expire according to their individual max-age values, typically between a few days and twelve months unless a longer period is strictly necessary for security or fraud prevention.",
      ],
    },
    {
      title: "6. GDPR and ePrivacy (EEA/UK)",
      paragraphs: [
        "For visitors in the European Economic Area and United Kingdom, we align with the General Data Protection Regulation and applicable ePrivacy rules: non-essential cookies and similar storage/access require prior consent unless a narrow exemption applies.",
      ],
    },
    {
      title: "7. CCPA/CPRA (California)",
      paragraphs: [
        "California residents may have rights to notice, opt-out of sale or sharing (including certain advertising cookies), and limit use of sensitive personal information. We do not sell personal information for money; where advertising technology constitutes \"sharing\" under California law, we honor opt-out signals and preference choices as required.",
      ],
    },
    {
      title: "8. Ghana",
      paragraphs: [
        "We apply transparent notice and meaningful choice consistent with the Data Protection Act, 2012 (Act 843) and related guidance, including lawful basis for processing and security of personal data collected via cookies.",
      ],
    },
    {
      title: "9. Changes",
      paragraphs: [
        "We may update this Cookie Policy to reflect new technologies or legal requirements. Check the \"Last updated\" date and review your preferences after material changes.",
      ],
    },
    {
      title: "10. Contact",
      paragraphs: [
        `Questions about cookies or this Policy may be directed via our contact page.`,
      ],
    },
  ],
};
