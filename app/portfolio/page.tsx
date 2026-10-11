import type { Metadata } from "next";
import { ContentFull, PageHeader, SiteShell } from "@/components/site-shell";
import { portfolioItems } from "@/lib/portfolio-data";
import { PortfolioGallery } from "./portfolio-gallery";

export const metadata: Metadata = {
  title: "Portfolio",
  alternates: { canonical: "/portfolio/" },
};

const HERO_IMAGE = "https://file.marcorios.me/wp-content/uploads/2016/07/04141931/3.jpg";

export default function PortfolioPage() {
  return (
    <SiteShell current="/portfolio/">
      <PageHeader title="Portfolio" image={HERO_IMAGE} />
      <ContentFull>
        <article className="page type-page status-publish has-post-thumbnail hentry">
          <div className="entry-content">
            <PortfolioGallery items={portfolioItems} />
          </div>
          <footer className="entry-footer" />
        </article>
      </ContentFull>
    </SiteShell>
  );
}
