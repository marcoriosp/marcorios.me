import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { ContentFull, PageHeader, SiteShell } from "@/components/site-shell";
import { EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  alternates: { canonical: "/contact/" },
};

export default function ContactPage() {
  return (
    <SiteShell current="/contact/">
      <PageHeader title="Contact" />
      <ContentFull>
        <article className="page type-page status-publish hentry">
          <div className="entry-content">
            <ContactForm email={EMAIL} />
          </div>
          <footer className="entry-footer" />
        </article>
      </ContentFull>
    </SiteShell>
  );
}
