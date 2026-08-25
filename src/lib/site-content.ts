import * as m from "@/paraglide/messages.js";
import { getLocale } from "@/paraglide/runtime.js";
import { absoluteUrl, localizedAbsoluteUrl } from "./seo";

export function getHomeFaqs() {
  return [
    { question: m.faq_difference_question(), answer: m.faq_difference_answer() },
    { question: m.faq_mind_mode_question(), answer: m.faq_mind_mode_answer() },
    { question: m.faq_api_keys_question(), answer: m.faq_api_keys_answer() },
    { question: m.faq_free_question(), answer: m.faq_free_answer() },
    { question: m.faq_collaboration_question(), answer: m.faq_collaboration_answer() },
    { question: m.faq_sharing_question(), answer: m.faq_sharing_answer() },
    { question: m.faq_data_question(), answer: m.faq_data_answer() },
    { question: m.faq_models_question(), answer: m.faq_models_answer() },
  ];
}

export function buildSiteJsonLd() {
  const locale = getLocale();
  const organizationId = localizedAbsoluteUrl("/#organization");
  const websiteId = localizedAbsoluteUrl("/#website");

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organizationId,
        name: "okike Solutions e.U.",
        legalName: "okike Solutions e.U.",
        url: localizedAbsoluteUrl("/"),
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
        url: localizedAbsoluteUrl("/"),
        description: m.home_meta_description(),
        inLanguage: locale,
        publisher: { "@id": organizationId },
      },
    ],
  };
}

export function buildHomeJsonLd() {
  const locale = getLocale();
  const organizationId = localizedAbsoluteUrl("/#organization");
  const websiteId = localizedAbsoluteUrl("/#website");
  const homeFaqs = getHomeFaqs();

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": localizedAbsoluteUrl("/#application"),
        name: "Zermind",
        url: localizedAbsoluteUrl("/"),
        applicationCategory: "ProductivityApplication",
        operatingSystem: "Web",
        inLanguage: locale,
        description: m.home_meta_description(),
        isPartOf: { "@id": websiteId },
        publisher: { "@id": organizationId },
      },
      {
        "@type": "FAQPage",
        "@id": localizedAbsoluteUrl("/#faq"),
        url: localizedAbsoluteUrl("/#frequently-asked-questions"),
        inLanguage: locale,
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
