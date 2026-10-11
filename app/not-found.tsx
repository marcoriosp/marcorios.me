import type { Metadata } from "next";
import { PageHeader, SiteShell } from "@/components/site-shell";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <SiteShell>
      <PageHeader title="Oops! That page can’t be found." />
      <div className="grid grid-pad">
        <div className="col-1-1 not-found-content">
          <p>It looks like nothing was found at this location. Try the blog or head back home.</p>
          <p>
            <a className="button" href="/">
              Back to Home
            </a>{" "}
            <a className="button outline" href="/blog/">
              Read the Blog
            </a>
          </p>
        </div>
      </div>
    </SiteShell>
  );
}
