import { type Archive, formatDate, pageCount, pageHref, pagePosts, type Post } from "@/lib/content";

export function PostMeta({ post }: { post: Post }) {
  return (
    <div className="entry-meta">
      <i className="fa fa-clock-o" aria-hidden="true" />
      <span className="posted-on">
        Posted on{" "}
        <a href={`/${post.slug}/`} rel="bookmark">
          <time className="entry-date published" dateTime={post.date}>
            {formatDate(post.date)}
          </time>
        </a>
      </span>
      <span className="byline">
        {" "}
        by{" "}
        <span className="author vcard">
          <a className="url fn n" href={`/author/${post.author.slug}/`}>
            {post.author.name}
          </a>
        </span>
      </span>
    </div>
  );
}

export function CategoryLinks({ post }: { post: Post }) {
  if (post.categories.length === 0) return null;
  return (
    <span className="cat-links">
      Posted in{" "}
      {post.categories.map((c, i) => (
        <span key={c.slug}>
          {i > 0 && ", "}
          <a href={`/category/${c.slug}/`} rel="category tag">
            {c.name}
          </a>
        </span>
      ))}
    </span>
  );
}

function ArchiveEntry({ post }: { post: Post }) {
  return (
    <article className="post type-post hentry">
      <a href={`/${post.slug}/`}>
        {post.image ? (
          <header className="blog-featured-img-header" style={{ backgroundImage: `url(${post.image})` }}>
            <h1 className="entry-title">{post.title}</h1>
          </header>
        ) : (
          <header className="blog-entry-header">
            <h1 className="entry-title">{post.title}</h1>
          </header>
        )}
      </a>
      <div className="entry-content">
        <p>{post.excerpt}</p>
      </div>
      <footer className="entry-footer">
        <PostMeta post={post} />
        <CategoryLinks post={post} />
      </footer>
    </article>
  );
}

export function ArchiveList({ archive, page }: { archive: Archive; page: number }) {
  const total = pageCount(archive);
  return (
    <>
      {pagePosts(archive, page).map((post) => (
        <ArchiveEntry key={post.slug} post={post} />
      ))}
      {total > 1 && (
        <nav className="navigation paging-navigation" aria-label="Posts navigation">
          <h1 className="screen-reader-text">Posts navigation</h1>
          <div className="nav-links">
            {page < total && (
              <div className="nav-previous">
                <a href={pageHref(archive, page + 1)}>
                  <span className="meta-nav">&larr;</span> Older posts
                </a>
              </div>
            )}
            {page > 1 && (
              <div className="nav-next">
                <a href={pageHref(archive, page - 1)}>
                  Newer posts <span className="meta-nav">&rarr;</span>
                </a>
              </div>
            )}
          </div>
        </nav>
      )}
    </>
  );
}
