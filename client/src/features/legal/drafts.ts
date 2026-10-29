export type LegalSection = {
  id: string;
  title: string;
  paragraphs: string[];
  confirm: string;
};

export type LegalDraft = {
  kind: 'privacy' | 'terms';
  title: string;
  subtitle: string;
  introduction: string;
  sections: LegalSection[];
};

export const privacyDraft: LegalDraft = {
  kind: 'privacy',
  title: 'Privacy Policy',
  subtitle: 'Your information. A clearer conversation.',
  introduction: 'This draft identifies the information that needs to be explained before a Privacy Policy is published. It does not establish verified production data practices or a statement of compliance.',
  sections: [
    {
      id: 'responsible-business', title: 'Who is responsible',
      paragraphs: ['Mustang Garage is the name displayed by this website. The legal entity responsible for operating it and handling personal information has not been confirmed.', 'Business name, registered address, and privacy contact: [To be confirmed by the business].'],
      confirm: 'Confirm the legal operator, relevant business locations, and an approved privacy contact. A brand name alone does not identify the responsible entity.',
    },
    {
      id: 'information', title: 'Information and interactions',
      paragraphs: ['The interface includes car browsing, saved selections, recently viewed cars, email inquiry links, and a newsletter form. Which information reaches the business or its providers must be confirmed against the live service.', 'The inspected newsletter form displays an on-screen message, but its handler does not submit a subscription request. Email collection, subscription records, and delivery arrangements therefore remain unverified.'],
      confirm: 'Inventory all information collected in production, its sources, and which forms or services actually receive it. Do not publish the prototype newsletter confirmation as proof of a completed subscription.',
    },
    {
      id: 'browser-storage', title: 'Browser storage and preferences',
      paragraphs: ['In the inspected client, recently viewed car IDs are kept in browser local storage, with an in-memory fallback when storage is unavailable. Saved-car IDs are currently held in application state.', 'These observations do not establish the full production cookie or tracking setup. Hosting, embedded content, analytics, and other services need a separate review.'],
      confirm: 'Confirm every cookie and storage item, its purpose and lifespan, and any applicable choice or consent requirements. Explain browser controls after the deployed configuration is verified.',
    },
    {
      id: 'uses-and-providers', title: 'Purposes, providers, and sharing',
      paragraphs: ['The current contact form prepares an email containing the entered name, reply email, topic, optional car selection, and message. It opens an email app and does not submit the form to a website server or confirm delivery. Direct inquiry links also open an email app. Any message the visitor then sends uses the email services involved; the business must identify its actual email arrangements.', 'Other purposes, legal grounds where applicable, service providers, recipients, and processing locations are not confirmed by this draft. No claim about selling, sharing, or not sharing information is made here.'],
      confirm: 'Confirm each purpose, the applicable legal grounds, recipients, vendors, processing locations, and any cross-border arrangements.',
    },
    {
      id: 'retention-and-security', title: 'Retention and security',
      paragraphs: ['Retention periods for inquiries, subscriptions, logs, and any other records have not been established. The handling of deletion, backups, and access permissions also requires confirmation.', 'This draft makes no guarantee about security measures or outcomes. The published notice should accurately describe the safeguards and record-management practices the business uses.'],
      confirm: 'Approve category-specific retention rules, deletion processes, actual safeguards, and any relevant incident-response disclosures.',
    },
    {
      id: 'choices-and-requests', title: 'Choices, requests, and questions',
      paragraphs: ['The rights, choices, complaint options, and request procedures relevant to visitors depend on the applicable law and the actual service. They have not been determined here.', 'Privacy request channel, identity-check procedure, and applicable response periods: [To be confirmed after legal review].'],
      confirm: 'Confirm the intended audience, applicable laws, treatment of children’s information, request handling, marketing preferences, and appropriate complaint contacts. Set an effective date only after approval.',
    },
  ],
};

export const termsDraft: LegalDraft = {
  kind: 'terms',
  title: 'Terms & Conditions',
  subtitle: 'The details behind the experience.',
  introduction: 'This is a structured draft for business and legal review. It is not a finalized agreement, a vehicle sale contract, or a statement that visitors have accepted terms.',
  sections: [
    {
      id: 'operator-and-scope', title: 'Operator and scope',
      paragraphs: ['Mustang Garage is the brand shown on this site. The legal operator, business address, territories served, and scope of the service require confirmation.', 'Contracting entity and approved business contact: [To be confirmed].'],
      confirm: 'Identify the correct operator, customer audience, service locations, and whether the website is for browsing, introductions, reservations, sales, or other services.',
    },
    {
      id: 'listings-and-editorial', title: 'Vehicle listings and editorial content',
      paragraphs: ['The current project includes sample inventory and explicitly labeled sample editorial content. A displayed photograph, label, or article should not be treated as independent verification of a vehicle’s history or condition.', 'The business must approve how live listings are prepared and how visitors are told about price changes, availability, errors, and vehicle-specific information. This draft does not create an accuracy warranty or exclude one.'],
      confirm: 'Confirm live data ownership, image rights, listing checks, pricing presentation, taxes and fees, availability updates, and the treatment of errors.',
    },
    {
      id: 'inquiries-and-transactions', title: 'Inquiries and transactions',
      paragraphs: ['The inspected car inquiry action opens an email link. The project does not establish the business process for accepting an order or completing a vehicle transaction.', 'Reservations, deposits, payment methods, delivery, collection, title transfer, cancellations, and refunds are not defined by this draft. They require approved terms appropriate to the actual transaction.'],
      confirm: 'Specify when an agreement is formed, who sells the vehicle, and the approved transaction documents, payment, delivery, cancellation, and refund rules.',
    },
    {
      id: 'site-features', title: 'Saved cars and site features',
      paragraphs: ['Saved selections currently use application state, while recent browsing history may use browser storage. These features help visitors revisit inventory; the current interface does not provide an account-based guarantee of synchronization or persistence.', 'Any account service, marketing subscription, availability notification, or other additional feature needs its own verified description and appropriate terms.'],
      confirm: 'Confirm intended feature behavior, support arrangements, subscription handling, and any accounts or paid services before describing obligations.',
    },
    {
      id: 'content-and-use', title: 'Content, links, and use of the site',
      paragraphs: ['Ownership and permitted use of the brand, photographs, articles, and other content must be checked. This draft does not grant a license or assert ownership of third-party material.', 'Rules for acceptable use, external links, user submissions, and content removal have not been approved. They should reflect the actual services rather than generic restrictions.'],
      confirm: 'Confirm intellectual-property rights, permissions, external services, submission practices, and any reasonable site-use rules with counsel.',
    },
    {
      id: 'legal-protections', title: 'Warranties, responsibility, and disputes',
      paragraphs: ['No warranty exclusions, liability limits, indemnities, dispute procedure, governing law, or court jurisdiction are selected in this draft.', 'These provisions depend on the business, transaction type, audience, and applicable mandatory protections. Approved language is required before publication.'],
      confirm: 'Obtain jurisdiction-specific review. Confirm applicable consumer protections and appropriate warranty, liability, and dispute provisions without assuming they can be waived.',
    },
    {
      id: 'approval-and-contact', title: 'Approval, updates, and contact',
      paragraphs: ['Effective date, version, change-notice process, and any acceptance mechanism: [Pending business approval and legal review].', 'An approved contact channel for contractual questions has not been designated. Existing site email links should be checked before they are named as a formal legal notice address.'],
      confirm: 'Approve the final text, effective date, notice and acceptance process, and responsible business contact. Keep the published version aligned with the live service.',
    },
  ],
};

