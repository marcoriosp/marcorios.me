import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryLinks } from "@/components/archive-list";
import { Markdown } from "@/components/markdown";
import { ContentFull, PageHeader, SiteShell } from "@/components/site-shell";
import { adjacentPosts, formatDate, getPost, posts, truncateWords } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

async function resolve(params: Props["params"]) {
  const post = getPost((await params).slug);
  if (!post) notFound();
  return post;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await resolve(params);
  const description = truncateWords(post.excerpt, 30);
  return {
    title: post.title,
    description,
    alternates: { canonical: `/${post.slug}/` },
    openGraph: {
      type: "article",
      title: post.title,
      description,
      url: `/${post.slug}/`,
      publishedTime: post.date,
      modifiedTime: post.updated,
      images: post.image ? [post.image] : undefined,
    },
  };
}

export default async function PostPage({ params }: Props) {
  const post = await resolve(params);
  const { older, newer } = adjacentPosts(post.slug);

  return (
    <SiteShell>
      <PageHeader title={post.title} image={post.image} />
      <header className="single-blog-entry-header">
        <div className="entry-meta">
          Posted by, {post.author.name}
          <img
            alt=""
            src={post.author.avatar}
            className="avatar avatar-96 photo"
            width={96}
            height={96}
            decoding="async"
          />{" "}
          on <time dateTime={post.date}>{formatDate(post.date)}</time>
        </div>
      </header>
      <ContentFull>
        <article className="post type-post status-publish hentry">
          <div className="entry-content">
            <Markdown source={post.body} />
          </div>
          <footer className="entry-footer">
            <CategoryLinks post={post} />
          </footer>
        </article>
        <nav className="navigation post-navigation" aria-label="Post navigation">
          <h1 className="screen-reader-text">Post navigation</h1>
          <div className="nav-links">
            {older && (
              <div className="nav-previous">
                <a href={`/${older.slug}/`} rel="prev">
                  <span className="meta-nav">&larr;</span>&nbsp;{older.title}
                </a>
              </div>
            )}
            {newer && (
              <div className="nav-next">
                <a href={`/${newer.slug}/`} rel="next">
                  {newer.title}&nbsp;<span className="meta-nav">&rarr;</span>
                </a>
              </div>
            )}
          </div>
        </nav>
      </ContentFull>
    </SiteShell>
  );
}
