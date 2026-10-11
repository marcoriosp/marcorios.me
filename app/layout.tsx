import type { Metadata } from "next";
import { ScrollReveal } from "@/components/scroll-reveal";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import "./styles/theme.css";
import "./styles/font-awesome.css";
import "./styles/push-menu.css";
import "./globals.css";

const GA_ID = "G-48GZZY1H8P";

const FONTS =
  "https://fonts.googleapis.com/css?family=PT+Sans:400,700,400italic,700italic|Open+Sans:400italic,700italic,400,700&display=swap";

/**
 * Hides scroll-reveal targets before first paint. If the client bundle never boots,
 * the fallback timer shows everything again so content cannot stay hidden.
 */
const REVEAL_BOOT = `document.documentElement.classList.add("js-reveal");setTimeout(function(){if(!window.__revealReady)document.documentElement.classList.remove("js-reveal")},3000);`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_NAME, template: `%s – ${SITE_NAME}` },
  description:
    "Marco Rios – live entertainment, touring and brand experience producer. Concerts, tours, festivals and brand launches since 2008.",
  robots: { index: true, follow: true, "max-image-preview": "large" },
  alternates: { types: { "application/rss+xml": "/feed/" } },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-US">
      <head>
        <script dangerouslySetInnerHTML={{ __html: REVEAL_BOOT }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href={FONTS} />
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag("js",new Date());gtag("config","${GA_ID}",{anonymize_ip:true});`,
          }}
        />
      </head>
      <body className="group-blog cbp-spmenu-push">
        {children}
        <ScrollReveal />
      </body>
    </html>
  );
}
