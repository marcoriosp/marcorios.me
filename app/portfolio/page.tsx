import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { portfolioItems } from "@/lib/portfolio-data";
import { PortfolioGallery } from "./portfolio-gallery";

export const metadata: Metadata = {
  title: "Portfolio",
  alternates: { canonical: "/portfolio/" },
};

const HERO_IMAGE = "https://file.marcorios.me/wp-content/uploads/2016/07/04141931/3.jpg";

export default function PortfolioPage() {
  return (
    <div id="page" className="hfeed site">
      <a className="skip-link screen-reader-text" href="#content">
        Skip to content
      </a>
      <SiteHeader current="/portfolio/" />
      <section id="content" className="site-content">
        <header
          className="featured-img-header"
          style={{ background: `url(${HERO_IMAGE}) 50% 0 no-repeat fixed` }}
        >
          <div className="grid grid-pad">
            <div className="col-1-1">
              <h1 className="entry-title">Portfolio</h1>
            </div>
          </div>
        </header>
        <div className="grid grid-pad">
          <div id="primary" className="content-area col-9-12">
            <main id="main" className="site-main" role="main">
              <article className="page type-page status-publish has-post-thumbnail hentry">
                <div className="entry-content">
                  <PortfolioGallery items={portfolioItems} />
                </div>
                <footer className="entry-footer" />
              </article>
            </main>
          </div>
          <div id="secondary" className="widget-area col-3-12" role="complementary">
            <aside className="widget widget_text">
              <div className="textwidget">
                <a
                  className="twitter-timeline"
                  data-width="220"
                  data-height="570"
                  data-theme="light"
                  href="https://twitter.com/marcoriosp"
                >
                  Tweets by marcoriosp
                </a>
              </div>
            </aside>
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
