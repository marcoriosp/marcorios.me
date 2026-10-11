export const SITE_NAME = "Marco Rios Site";
export const SITE_TAGLINE = "Marco Rios";
export const SITE_URL = "https://marcorios.me";
export const EMAIL = "marco@marcorios.me";
export const TWITTER_HANDLE = "marcoriosp";

export const MENU = [
  { href: "/", label: "Home" },
  { href: "/portfolio/", label: "Portfolio" },
  { href: "/publications/", label: "Publications" },
  { href: "/blog/", label: "Blog" },
  { href: "/contact/", label: "Contact" },
];

export const SOCIAL = [
  { href: "https://www.facebook.com/mrios82", icon: "fa-facebook", label: "Facebook" },
  { href: "https://twitter.com/marcoriosp", icon: "fa-twitter", label: "Twitter" },
  { href: "https://www.linkedin.com/in/marcorp", icon: "fa-linkedin", label: "LinkedIn" },
  { href: "https://www.instagram.com/tempusperegrinans", icon: "fa-instagram", label: "Instagram" },
  { href: "https://www.youtube.com/channel/UCRo-YXRDsG1g8YG9v17WuYg", icon: "fa-youtube", label: "YouTube" },
  { href: "skype:marcoriosp", icon: "fa-skype", label: "Skype" },
  { href: "https://github.com/marcoriosp", icon: "fa-github", label: "GitHub" },
  { href: "https://open.spotify.com/user/117865297", icon: "fa-spotify", label: "Spotify" },
  { href: `mailto:${EMAIL}`, icon: "fa-envelope", label: "E-mail" },
];

export interface Author {
  slug: string;
  name: string;
  avatar: string;
}

export const AUTHORS: Record<string, Author> = {
  "zerovriu-admin": {
    slug: "zerovriu-admin",
    name: "Marco Rios",
    avatar: "https://secure.gravatar.com/avatar/e8539ff88348276f2b018170705ed9d0?s=96&d=mm&r=g",
  },
  marco: {
    slug: "marco",
    name: "Marco",
    avatar: "https://secure.gravatar.com/avatar/?s=96&d=mm&r=g",
  },
};

export const CATEGORIES: Record<string, string> = {
  blog: "Blog",
  news: "News",
  publications: "Publications",
};

export const TAGS: Record<string, string> = {
  top: "Top",
};

export const POSTS_PER_PAGE = 10;
