import { LEGAL_ENTITY, LEGAL_LAST_UPDATED } from "./constants";
import type { LegalDocument } from "./types";

export const termsDocument: LegalDocument = {
  path: "/terms",
  pageTitle: `Terms & Conditions | ${LEGAL_ENTITY}`,
  metaDescription: `Terms governing ${LEGAL_ENTITY} services, subscriptions, payments, and use of VentraPOS.com and related offerings.`,
  heading: "Terms & Conditions",
  categoryLabel: "Legal",
  intro: [
    `These Terms & Conditions ("Terms") govern access to and use of websites, software, and professional services operated by ${LEGAL_ENTITY} ("we," "us," or "our"). By creating an account, subscribing, purchasing services, or otherwise using our offerings, you agree to these Terms.`,
    "These Terms are provided for transparency and operational clarity. They do not constitute legal advice. Where mandatory law provides you greater rights, those rights prevail.",
    `Last updated: ${LEGAL_LAST_UPDATED}.`,
  ],
  sections: [
    {
      title: "1. Services described",
      paragraphs: [
        `${LEGAL_ENTITY} provides digital products and professional services, which may include, without limitation:`,
      ],
      subsections: [
        {
          title: "1.1 VentraPOS.com",
          paragraphs: [
            "VentraPOS.com refers to our point-of-sale and related cloud software, including web and mobile interfaces, APIs, documentation, and any associated trial or production environments we make available.",
          ],
        },
        {
          title: "1.2 Custom development",
          paragraphs: [
            "Custom software engineering, integrations, automation, and tailored feature work are delivered under project scopes, statements of work, or order forms agreed in writing (including email where expressly accepted).",
          ],
        },
        {
          title: "1.3 Websites and digital properties",
          paragraphs: [
            "Design, build, deployment, hosting coordination, analytics configuration, and ongoing content or layout updates may be offered as discrete engagements or as part of a broader support agreement.",
          ],
        },
        {
          title: "1.4 System management and operations",
          paragraphs: [
            "Monitoring, backups, patching cadence, incident response, capacity planning, and related operational services are provided only where explicitly contracted. Unless otherwise stated, shared hosting and third-party platform SLAs apply to underlying infrastructure.",
          ],
        },
      ],
    },
    {
      title: "2. Eligibility and accounts",
      subsections: [
        {
          title: "2.1 Registration",
          paragraphs: [
            "You must provide accurate, current, and complete registration information and keep it updated. You may not impersonate any person or entity or misrepresent affiliation.",
            "You are responsible for safeguarding credentials, API keys, and devices used to access our services. Notify us promptly of any suspected compromise.",
          ],
        },
        {
          title: "2.2 Authorized users",
          paragraphs: [
            "If you register on behalf of an organization, you represent that you have authority to bind that organization. You may invite additional users only as permitted by your plan and are responsible for their compliance with these Terms.",
          ],
        },
      ],
    },
    {
      title: "3. Subscription plans",
      paragraphs: [
        "Commercial access to subscription software (including VentraPOS.com) is offered in tiered plans, typically designated as Starter, Growth, and Enterprise. Features, usage limits, seats, environments, and support entitlements differ by tier and are described at checkout, in your order summary, or in an enterprise agreement.",
        "We may modify plan composition or introduce new tiers with reasonable notice. Material adverse changes to your active subscription will be communicated in advance where practicable; your continued use after the effective date may constitute acceptance unless you cancel as permitted below.",
      ],
    },
    {
      title: "4. Fees, billing, and taxes",
      subsections: [
        {
          title: "4.1 Payment models",
          paragraphs: [
            "Fees may be billed monthly in advance, annually in advance, or under a milestone structure combining upfront deposits with completion or acceptance-based balances for custom work, as specified in your order.",
          ],
        },
        {
          title: "4.2 Payment processing",
          paragraphs: [
            "Payments are processed through our designated payment partners. You authorize us and our processors to charge your chosen payment method for all fees when due.",
          ],
        },
        {
          title: "4.3 Taxes",
          paragraphs: [
            "Fees are stated exclusive of applicable taxes unless otherwise noted. You are responsible for all sales, use, VAT, GST, withholding, or similar taxes imposed on transactions, other than taxes based on our net income.",
          ],
        },
      ],
    },
    {
      title: "5. Refunds, deposits, and cancellation",
      paragraphs: [
        "Unless mandatory law requires otherwise, project deposits, setup fees, and non-recurring professional services fees are generally non-refundable once work has commenced or resources have been allocated, as stated in your order.",
        "Subscription fees are non-refundable upon cancellation mid-term, including where you cease use before the end of a billing period. Cancellation stops future renewals but does not entitle you to a refund for the current period except where expressly stated in writing or required by law.",
        "If we terminate for material breach, no refund is owed unless contractually specified. If we terminate without cause unrelated to your breach, we will provide a pro-rata refund of prepaid subscription fees for the unused portion of the then-current term, if any.",
      ],
    },
    {
      title: "6. Service levels and uptime",
      paragraphs: [
        "For subscription services where an uptime commitment is published or attached to your order, we target the stated monthly uptime percentage excluding scheduled maintenance announced in advance, force majeure events, third-party outages outside our reasonable control, and suspension for non-payment or security concerns.",
        "Unless a separate SLA credits remedy is expressly agreed, your exclusive remedy for verified SLA shortfalls is service credits as described in the applicable SLA document, if any. SLAs do not apply to beta or trial services unless explicitly stated.",
      ],
    },
    {
      title: "7. Support and maintenance",
      paragraphs: [
        "Standard support channels, response targets, maintenance windows, and escalation paths depend on your plan or written agreement. Enterprise customers may receive dedicated support terms.",
        "Maintenance may include security patches, dependency updates, and platform upgrades. We may apply changes that do not materially reduce core functionality without prior notice; material changes will be communicated where reasonable.",
      ],
    },
    {
      title: "8. Suspension and termination",
      paragraphs: [
        "We may suspend access immediately if we reasonably believe there is fraud, abuse, illegal activity, security risk, or violation of our Acceptable Use Policy.",
        "We may terminate accounts that remain inactive (no successful login and no billable usage, as applicable) for a continuous period of at least two (2) months after email notice to your registered address, unless a written agreement provides otherwise or law prohibits termination.",
        "Upon termination, your right to access ends. We may delete data after a retention window consistent with our Privacy Policy and backups policy, subject to legal holds.",
      ],
    },
    {
      title: "9. Beta and preview features",
      paragraphs: [
        "We may offer experimental, beta, preview, or early-access functionality. Such features are provided \"as is,\" may be unstable, may change or be withdrawn without notice, and may not be covered by SLAs or support commitments unless expressly stated.",
      ],
    },
    {
      title: "10. User content and license to operate",
      paragraphs: [
        'You retain ownership of data, files, and materials you upload or generate through the services ("User Content"). You grant us a worldwide, non-exclusive license to host, process, transmit, display, and create technical copies of User Content solely to provide, secure, improve, and support the services and as described in our Privacy Policy.',
        "You represent that you have all rights necessary to grant the foregoing and that User Content does not violate law or third-party rights. We may remove or restrict User Content that violates these Terms or policies.",
      ],
    },
    {
      title: "11. Intellectual property",
      paragraphs: [
        `${LEGAL_ENTITY} and its licensors own all rights in the services, software, branding, documentation, and aggregate analytics that do not identify you. Except for the limited rights expressly granted, no rights are transferred to you.`,
        "Deliverables from custom engagements are owned as set out in the applicable statement of work. Until full payment, we may retain a lien on deliverables where contractually permitted.",
      ],
    },
    {
      title: "12. Warranty disclaimer",
      paragraphs: [
        "TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, THE SERVICES ARE PROVIDED \"AS IS\" AND \"AS AVAILABLE\" WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT.",
        "We do not warrant that the services will be uninterrupted, error-free, or free of harmful components, or that defects will be corrected within any particular timeframe.",
      ],
    },
    {
      title: "13. Limitation of liability",
      paragraphs: [
        "TO THE MAXIMUM EXTENT PERMITTED BY LAW, NEITHER PARTY WILL BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, REVENUE, GOODWILL, DATA, OR BUSINESS OPPORTUNITY, ARISING OUT OF OR RELATED TO THESE TERMS OR THE SERVICES, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.",
        "EXCEPT FOR YOUR PAYMENT OBLIGATIONS, EITHER PARTY'S AGGREGATE LIABILITY ARISING OUT OF OR RELATED TO THESE TERMS OR THE SERVICES DURING ANY TWELVE-MONTH PERIOD IS LIMITED TO THE GREATER OF (A) THE FEES YOU PAID US FOR THE SERVICES GIVING RISE TO THE CLAIM DURING THAT PERIOD, OR (B) ONE HUNDRED U.S. DOLLARS (USD $100) IF NO FEES WERE PAID IN THAT PERIOD.",
        "The limitations in this section do not apply to liability that cannot be excluded or limited under applicable law (for example, gross negligence, willful misconduct, or death or personal injury caused by negligence where such limitations are unlawful).",
      ],
    },
    {
      title: "14. Indemnity",
      paragraphs: [
        "You will defend and indemnify us and our affiliates, officers, and employees against third-party claims arising from your User Content, your breach of these Terms, or your violation of law, except to the extent caused by our willful misconduct.",
      ],
    },
    {
      title: "15. Governing law and disputes",
      paragraphs: [
        "These Terms are governed by the laws of the Republic of Ghana, without regard to conflict-of-law principles that would require application of another jurisdiction's laws.",
        "Courts located in Ghana have exclusive jurisdiction over disputes arising out of or relating to these Terms or the services, subject to any mandatory venue rules applicable to consumers in your place of residence.",
      ],
    },
    {
      title: "16. Changes and notices",
      paragraphs: [
        "We may update these Terms by posting a revised version and updating the \"Last updated\" date. Where changes are material, we will provide additional notice (for example, by email or in-product notification). Continued use after the effective date constitutes acceptance unless you terminate before the effective date where permitted.",
      ],
    },
    {
      title: "17. Contact",
      paragraphs: [
        `For contractual or compliance questions, contact ${LEGAL_ENTITY} using the details on our contact page.`,
      ],
    },
  ],
};
