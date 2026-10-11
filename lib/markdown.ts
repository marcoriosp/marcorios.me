import { Marked, type Token, type Tokens, type TokenizerExtension } from "marked";

export interface DirectiveToken {
  type: "directive";
  raw: string;
  name: string;
  attrs: Record<string, string>;
}

export interface ContainerToken {
  type: "container";
  raw: string;
  name: string;
  title: string;
  tokens: Token[];
}

export interface HighlightToken {
  type: "highlight";
  raw: string;
  tokens: Token[];
}

/** `::name{key="value" ...}` on its own line, e.g. `::youtube{id="abc"}`. */
const directive: TokenizerExtension = {
  name: "directive",
  level: "block",
  start: (src) => src.match(/^::[a-z]/m)?.index,
  tokenizer(src) {
    const match = /^::([a-z]+)\{([^\n]*)\}(?:\n+|$)/.exec(src);
    if (!match) return;
    const attrs: Record<string, string> = {};
    for (const [, key, value] of match[2].matchAll(/([a-z]+)="([^"]*)"/g)) attrs[key] = value;
    return { type: "directive", raw: match[0], name: match[1], attrs };
  },
};

/** `:::name Optional title` … `:::` block wrapping regular Markdown. */
const container: TokenizerExtension = {
  name: "container",
  level: "block",
  start: (src) => src.match(/^:::[a-z]/m)?.index,
  tokenizer(src) {
    const match = /^:::([a-z]+)(?: ([^\n]*))?\n([\s\S]*?)\n:::(?:\n+|$)/.exec(src);
    if (!match) return;
    const token = { type: "container", raw: match[0], name: match[1], title: match[2] ?? "", tokens: [] as Token[] };
    this.lexer.blockTokens(match[3], token.tokens);
    return token;
  },
};

/** `==highlighted text==` */
const highlight: TokenizerExtension = {
  name: "highlight",
  level: "inline",
  start: (src) => {
    const i = src.indexOf("==");
    return i < 0 ? undefined : i;
  },
  tokenizer(src) {
    const match = /^==(?=\S)([\s\S]*?\S)==/.exec(src);
    if (!match) return;
    return { type: "highlight", raw: match[0], tokens: this.lexer.inlineTokens(match[1]) };
  },
};

const marked = new Marked({ gfm: true, extensions: [directive, container, highlight] });

export function lexMarkdown(source: string): Token[] {
  return marked.lexer(source);
}

/** Plain text of a Markdown document, used for feed descriptions. */
export function markdownToText(source: string): string {
  const parts: string[] = [];
  const walk = (tokens: Token[]) => {
    for (const token of tokens) {
      if (token.type === "directive" || token.type === "image") continue;
      if (token.type === "list") {
        for (const item of (token as Tokens.List).items) {
          walk(item.tokens);
          parts.push(" ");
        }
      } else if ("tokens" in token && token.tokens) {
        walk(token.tokens);
      } else if ("text" in token && typeof token.text === "string") {
        parts.push(token.text);
      }
      if (token.type === "paragraph" || token.type === "heading") parts.push(" ");
    }
  };
  walk(lexMarkdown(source));
  return parts.join("").replace(/\s+/g, " ").trim();
}
