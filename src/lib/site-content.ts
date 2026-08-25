import { absoluteUrl } from "./seo";

export const homeFaqs = [
  {
    question: "What makes Zermind different from other AI chat tools?",
    answer:
      "Zermind displays conversations as interactive trees. You can branch from an earlier message, compare responses from different AI models, and return to any point in the conversation.",
  },
  {
    question: "How does Mind Mode work?",
    answer:
      "Mind Mode displays each message as a node in a visual tree. New questions and model responses create connected branches, and selecting a node lets you continue that conversation thread.",
  },
  {
    question: "Can I use my own API keys?",
    answer:
      "Yes. Zermind supports bring-your-own-key access through OpenRouter and direct provider integrations. The available models depend on the provider and keys you configure.",
  },
  {
    question: "Is Zermind free to use?",
    answer:
      "The Zermind source code is available under the MIT License. AI providers may charge for model usage, and self-hosting may have infrastructure costs.",
  },
  {
    question: "Can I collaborate with others on mind maps?",
    answer:
      "Yes. Zermind supports collaborative conversation trees with shared updates and participant presence. Collaboration is currently marked as a beta feature.",
  },
  {
    question: "How do I share my conversation trees?",
    answer:
      "You can create a public link for a conversation tree. Anyone with that link can open and explore the shared conversation until you revoke the link or delete the chat.",
  },
  {
    question: "How does Zermind handle my data?",
    answer:
      "Zermind stores account and conversation data needed to run the service. Messages are sent to the AI provider you select. You can review the source code and read the privacy policy for the full data-handling details.",
  },
  {
    question: "Which AI models are supported?",
    answer:
      "Zermind supports models from OpenAI, Anthropic, Google, Meta, and other providers available through OpenRouter. The exact model list depends on provider availability and your configuration.",
  },
] as const;

export function buildSiteJsonLd() {
  const organizationId = absoluteUrl("/#organization");
  const websiteId = absoluteUrl("/#website");

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organizationId,
        name: "okike Solutions e.U.",
        legalName: "okike Solutions e.U.",
        url: absoluteUrl("/"),
        email: "info@okike-solutions.com",
        logo: {
          "@type": "ImageObject",
          url: absoluteUrl("/apple-touch-icon.png"),
          width: 180,
          height: 180,
        },
        founder: { "@type": "Person", name: "Ugochukwu Uwakwe" },
        address: {
          "@type": "PostalAddress",
          streetAddress: "Wiener Straße 2/23",
          postalCode: "3002",
          addressLocality: "Purkersdorf",
          addressCountry: "AT",
        },
        sameAs: ["https://github.com/okikeSolutions", "https://x.com/NickelanddimeO"],
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        name: "Zermind",
        url: absoluteUrl("/"),
        description:
          "An open-source AI conversation application for branching chats and interactive mind maps.",
        inLanguage: "en",
        publisher: { "@id": organizationId },
      },
    ],
  };
}

export function buildHomeJsonLd() {
  const organizationId = absoluteUrl("/#organization");
  const websiteId = absoluteUrl("/#website");

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": absoluteUrl("/#application"),
        name: "Zermind",
        url: absoluteUrl("/"),
        applicationCategory: "ProductivityApplication",
        operatingSystem: "Web",
        inLanguage: "en",
        description:
          "An open-source AI conversation application for branching chats and interactive mind maps.",
        isPartOf: { "@id": websiteId },
        publisher: { "@id": organizationId },
      },
      {
        "@type": "FAQPage",
        "@id": absoluteUrl("/#faq"),
        url: absoluteUrl("/#frequently-asked-questions"),
        isPartOf: { "@id": websiteId },
        mainEntity: homeFaqs.map(({ question, answer }) => ({
          "@type": "Question",
          name: question,
          acceptedAnswer: { "@type": "Answer", text: answer },
        })),
      },
    ],
  };
}
