import type { Metadata } from "next";
import { Markdown } from "@/components/markdown";
import { ContentFull, PageHeader, SiteShell } from "@/components/site-shell";
import { getPost, publicationsPage } from "@/lib/content";

export const metadata: Metadata = {
  title: publicationsPage.title,
  alternates: { canonical: "/publications/" },
};

export default function PublicationsPage() {
  const { title, image, list, body } = publicationsPage;
  return (
    <SiteShell current="/publications/">
      <PageHeader title={title} image={image} />
      <ContentFull>
        <article className="page type-page status-publish has-post-thumbnail hentry">
          <div className="entry-content">
            <Markdown source={body} />
            <div className="su-divider su-divider-style-double">
              <a href="#page">Go to top</a>
            </div>
            <h2 className="publications-heading">Publications List</h2>
            <div className="publications-list">
              {list.map((item) => {
                const post = getPost(item.slug);
                if (!post) return null;
                const href = `/${post.slug}/`;
                return (
                  <div key={item.slug} className="publication">
                    <a className="publication-thumb" href={href} tabIndex={-1} aria-hidden="true">
                      <img src={item.image} alt="" loading="lazy" decoding="async" />
                    </a>
                    <div className="publication-body">
                      <a className="publication-title" href={href}>
                        {post.title}
                      </a>
                      <p>{item.excerpt}</p>
                      <p className="publication-more">
                        <a href={href}>Read More ...</a>
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <footer className="entry-footer" />
        </article>
      </ContentFull>
    </SiteShell>
  );
}
