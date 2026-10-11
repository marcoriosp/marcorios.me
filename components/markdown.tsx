import { Fragment, type ReactNode } from "react";
import type { Token, Tokens } from "marked";
import { lexMarkdown, type ContainerToken, type DirectiveToken, type HighlightToken } from "@/lib/markdown";
import { TWITTER_HANDLE } from "@/lib/site";
import { PostSlider } from "./post-slider";

const ALIGNMENTS = new Set(["left", "right", "center"]);

function isExternal(href: string): boolean {
  return /^https?:\/\//.test(href) && !href.startsWith("https://marcorios.me/");
}

function Inline({ tokens }: { tokens: Token[] }): ReactNode {
  return tokens.map((token, i) => <Fragment key={i}>{renderInline(token)}</Fragment>);
}

function renderInline(token: Token): ReactNode {
  switch (token.type) {
    case "text":
      return "tokens" in token && token.tokens ? <Inline tokens={token.tokens} /> : token.text;
    case "escape":
    case "html":
      return token.text;
    case "strong":
      return (
        <strong>
          <Inline tokens={token.tokens ?? []} />
        </strong>
      );
    case "em":
      return (
        <em>
          <Inline tokens={token.tokens ?? []} />
        </em>
      );
    case "del":
      return (
        <del>
          <Inline tokens={token.tokens ?? []} />
        </del>
      );
    case "codespan":
      return <code>{token.text}</code>;
    case "br":
      return <br />;
    case "highlight":
      return (
        <span className="su-highlight">
          <Inline tokens={(token as unknown as HighlightToken).tokens} />
        </span>
      );
    case "image": {
      const { href, text, title } = token as Tokens.Image;
      const align = title && ALIGNMENTS.has(title) ? `align${title}` : undefined;
      return <img src={href} alt={text} className={align} loading="lazy" decoding="async" />;
    }
    case "link": {
      const { href, title, tokens } = token as Tokens.Link;
      const external = isExternal(href);
      return (
        <a
          href={href}
          title={title || undefined}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
        >
          <Inline tokens={tokens} />
        </a>
      );
    }
    default:
      return "raw" in token ? token.raw : null;
  }
}

function Blocks({ tokens }: { tokens: Token[] }): ReactNode {
  return tokens.map((token, i) => <Fragment key={i}>{renderBlock(token)}</Fragment>);
}

function renderBlock(token: Token): ReactNode {
  switch (token.type) {
    case "space":
      return null;
    case "paragraph":
      return (
        <p>
          <Inline tokens={token.tokens ?? []} />
        </p>
      );
    case "text":
      return "tokens" in token && token.tokens ? <Inline tokens={token.tokens} /> : token.text;
    case "heading": {
      const { depth, tokens } = token as Tokens.Heading;
      if (depth === 1) {
        return (
          <div className="su-heading su-heading-style-default su-heading-align-center">
            <div className="su-heading-inner">
              <b>
                <Inline tokens={tokens} />
              </b>
            </div>
          </div>
        );
      }
      const Tag = `h${depth}` as "h2";
      return (
        <Tag>
          <Inline tokens={tokens} />
        </Tag>
      );
    }
    case "blockquote":
      return (
        <blockquote>
          <Blocks tokens={token.tokens ?? []} />
        </blockquote>
      );
    case "list": {
      const { ordered, start, items, loose } = token as Tokens.List;
      const children = items.map((item, i) => (
        <li key={i}>
          {loose ? <Blocks tokens={item.tokens} /> : <TightItem tokens={item.tokens} />}
        </li>
      ));
      return ordered ? <ol start={start === 1 || start === "" ? undefined : Number(start)}>{children}</ol> : <ul>{children}</ul>;
    }
    case "code":
      return (
        <pre>
          <code>{token.text}</code>
        </pre>
      );
    case "hr":
      return <hr />;
    case "table": {
      const { header, rows } = token as Tokens.Table;
      return (
        <table>
          <thead>
            <tr>
              {header.map((cell, i) => (
                <th key={i}>
                  <Inline tokens={cell.tokens} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, r) => (
              <tr key={r}>
                {row.map((cell, i) => (
                  <td key={i}>
                    <Inline tokens={cell.tokens} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
    case "directive":
      return <Directive token={token as unknown as DirectiveToken} />;
    case "container":
      return <Container token={token as unknown as ContainerToken} />;
    case "html":
      return null;
    default:
      return null;
  }
}

/** Tight list items hold bare `text` tokens; render those inline and anything else as blocks. */
function TightItem({ tokens }: { tokens: Token[] }): ReactNode {
  return tokens.map((token, i) => (
    <Fragment key={i}>
      {token.type === "text" ? <Inline tokens={(token as Tokens.Text).tokens ?? [token]} /> : renderBlock(token)}
    </Fragment>
  ));
}

function Directive({ token }: { token: DirectiveToken }): ReactNode {
  const { name, attrs } = token;
  switch (name) {
    case "youtube": {
      const query = attrs.list ? `?list=${encodeURIComponent(attrs.list)}` : "";
      return (
        <div className="su-youtube su-u-responsive-media-yes">
          <iframe
            src={`https://www.youtube.com/embed/${encodeURIComponent(attrs.id)}${query}`}
            title="YouTube video"
            loading="lazy"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        </div>
      );
    }
    case "tweet": {
      const share = new URL("https://twitter.com/share");
      share.searchParams.set("text", attrs.text);
      share.searchParams.set("via", TWITTER_HANDLE);
      share.searchParams.set("related", TWITTER_HANDLE);
      if (attrs.url) share.searchParams.set("url", attrs.url);
      return (
        <div className="su-note tweet-note">
          <div className="su-note-inner">
            <div className="su-quote su-quote-style-default">
              <div className="su-quote-inner">
                <h2>
                  <a href={share.toString()} target="_blank" rel="noopener noreferrer">
                    {attrs.text}
                  </a>
                </h2>
                <p>
                  <a className="tm-ctt-btn" href={share.toString()} target="_blank" rel="noopener noreferrer">
                    Click To Tweet <i className="fa fa-twitter" aria-hidden="true" />
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }
    case "pdf":
      return (
        <a className="pdf-card" href={attrs.src} target="_blank" rel="noopener">
          <i className="fa fa-file-pdf-o" aria-hidden="true" />
          <span>
            <strong>Read the full paper</strong>
            <small>PDF document</small>
          </span>
        </a>
      );
    case "caption":
      return <p className="wp-caption-text">{attrs.text}</p>;
    default:
      return null;
  }
}

function Container({ token }: { token: ContainerToken }): ReactNode {
  switch (token.name) {
    case "gallery": {
      const images = token.tokens
        .flatMap((t) => ("tokens" in t && t.tokens ? t.tokens : []))
        .filter((t): t is Tokens.Image => t.type === "image")
        .map((img) => ({ src: img.href, alt: img.text }));
      return <PostSlider images={images} />;
    }
    case "spoiler":
      return (
        <details className="su-spoiler su-spoiler-style-fancy su-spoiler-icon-plus">
          <summary className="su-spoiler-title">
            <span className="su-spoiler-icon" aria-hidden="true" />
            {token.title}
          </summary>
          <div className="su-spoiler-content">
            <Blocks tokens={token.tokens} />
          </div>
        </details>
      );
    case "note":
      return (
        <div className="su-note">
          <div className="su-note-inner">
            <Blocks tokens={token.tokens} />
          </div>
        </div>
      );
    default:
      return <Blocks tokens={token.tokens} />;
  }
}

export function Markdown({ source }: { source: string }) {
  return <Blocks tokens={lexMarkdown(source)} />;
}
