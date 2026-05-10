import { LEGAL_ENTITY, LEGAL_LAST_UPDATED } from "./constants";
import type { LegalDocument } from "./types";

export const acceptableUseDocument: LegalDocument = {
  path: "/acceptable-use",
  pageTitle: `Acceptable Use Policy | ${LEGAL_ENTITY}`,
  metaDescription: `Rules for acceptable use of ${LEGAL_ENTITY} services, networks, and platforms.`,
  heading: "Acceptable Use Policy",
  categoryLabel: "Legal",
  intro: [
    `This Acceptable Use Policy ("AUP") sets rules for using ${LEGAL_ENTITY}'s websites, software (including VentraPOS.com), APIs, networks, and related services (collectively, the "Services"). By using the Services, you agree to this AUP in addition to our Terms & Conditions.`,
    "We may investigate suspected violations and cooperate with law enforcement where permitted.",
    `Last updated: ${LEGAL_LAST_UPDATED}.`,
  ],
  sections: [
    {
      title: "1. Lawful use only",
      paragraphs: [
        "You may not use the Services to violate any applicable local, national, or international law or regulation, including export control, sanctions, anti-bribery, child safety, or financial crime laws.",
      ],
    },
    {
      title: "2. Intellectual property",
      paragraphs: [
        "You may not infringe, misappropriate, or violate third-party intellectual property, publicity, or privacy rights. Do not upload, share, or distribute pirated software, stolen credentials, or content you do not have rights to use.",
      ],
    },
    {
      title: "3. Malware, attacks, and abuse of systems",
      paragraphs: [
        "You may not transmit malware, ransomware, spyware, or other harmful code; probe, scan, or test the vulnerability of our systems without written authorization; interfere with or disrupt servers, networks, or third-party services; or attempt unauthorized access to accounts, data, or environments.",
      ],
    },
    {
      title: "4. Fraud and deceptive practices",
      paragraphs: [
        "You may not use the Services for phishing, impersonation, pyramid schemes, counterfeit goods, payment fraud, chargeback abuse, or any deceptive commercial practice.",
      ],
    },
    {
      title: "5. Harassment, hate, and harmful content",
      paragraphs: [
        "You may not use the Services to harass, threaten, stalk, or incite violence against any person or group. Content that promotes hate, terrorism, self-harm, or sexual exploitation is strictly prohibited.",
      ],
    },
    {
      title: "6. Privacy violations",
      paragraphs: [
        "You may not collect, process, or disclose personal information about others without a lawful basis and appropriate notice or consent, including harvesting data from our Services by scraping personal profiles without authorization.",
      ],
    },
    {
      title: "7. Spam and unsolicited communications",
      paragraphs: [
        "You may not send unsolicited bulk messages, pyramid promotions, or misleading headers. Commercial messaging must comply with applicable anti-spam laws and any consent you obtained from recipients.",
      ],
    },
    {
      title: "8. Resource abuse",
      paragraphs: [
        "You may not consume excessive shared resources, circumvent technical limits, run cryptocurrency mining on our infrastructure without permission, or use the Services to operate open proxies or anonymization services that facilitate abuse.",
      ],
    },
    {
      title: "9. Account security",
      paragraphs: [
        "You must maintain the confidentiality of credentials, rotate compromised secrets promptly, and configure least-privilege access for your team. You may not share accounts in a way that prevents attribution of actions to a specific user where individual accounts are required.",
      ],
    },
    {
      title: "10. Monitoring and enforcement",
      paragraphs: [
        "We may, but are not obligated to, monitor content or traffic for compliance, security, and quality purposes. We may remove content, throttle traffic, suspend or terminate access, and report illegal activity to authorities where appropriate.",
        "Nothing in this AUP obligates us to monitor all use; you remain responsible for your conduct and that of your authorized users.",
      ],
    },
    {
      title: "11. Appeals",
      paragraphs: [
        "If you believe enforcement action was taken in error, contact us with relevant details. We will review good-faith appeals in a reasonable timeframe, subject to legal, safety, or confidentiality constraints.",
      ],
    },
    {
      title: "12. Updates",
      paragraphs: [
        "We may modify this AUP to address new risks or legal requirements. Continued use after the effective date constitutes acceptance of the revised AUP unless prohibited by law.",
      ],
    },
    {
      title: "13. Contact",
      paragraphs: [
        `Report abuse or questions about this AUP through our contact page, including relevant URLs, timestamps, and logs where available.`,
      ],
    },
  ],
};
