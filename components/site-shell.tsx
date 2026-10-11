import type { ReactNode } from "react";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

/** Page chrome shared by every route: skip link, header, push menu, content area and footer. */
export function SiteShell({ current, children }: { current?: string; children: ReactNode }) {
  return (
    <div id="page" className="hfeed site">
      <a className="skip-link screen-reader-text" href="#content">
        Skip to content
      </a>
      <SiteHeader current={current} />
      <section id="content" className="site-content">
        {children}
      </section>
      <SiteFooter />
    </div>
  );
}

/** Red title band, or a full-bleed photo header when `image` is set. */
export function PageHeader({ title, image }: { title: ReactNode; image?: string | null }) {
  return (
    <header
      className={image ? "featured-img-header" : "entry-header"}
      style={image ? { background: `url(${image}) 50% 0 no-repeat fixed` } : undefined}
    >
      <div className="grid grid-pad">
        <div className="col-1-1">
          <h1 className="entry-title">{title}</h1>
        </div>
      </div>
    </header>
  );
}

/** Main column across the full grid width. */
export function ContentFull({ children, archive = false }: { children: ReactNode; archive?: boolean }) {
  return (
    <div className="grid grid-pad">
      <div id="primary" className={`content-area col-1-1${archive ? " blog-archive" : ""}`}>
        <main id="main" className="site-main" role="main">
          {children}
        </main>
      </div>
    </div>
  );
}
