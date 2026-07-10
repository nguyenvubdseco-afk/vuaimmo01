import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import ContactSection from "@/components/ContactSection";
import { getSiteContent } from "@/lib/store";

export const metadata: Metadata = {
  title: "Liên hệ — AI System Creator",
  description: "Liên hệ với đội ngũ AI System Creator để được tư vấn giải pháp AI phù hợp.",
};

export default async function ContactPage() {
  const site = await getSiteContent();

  return (
    <>
      <PageHero
        eyebrow={site.contact.eyebrow}
        title={site.contact.headline}
        description={site.contact.description}
      />
      <ContactSection contact={site.contact} />
    </>
  );
}
