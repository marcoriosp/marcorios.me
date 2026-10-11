import type { Metadata } from "next";
import { ScrollReveal } from "@/components/scroll-reveal";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import "./styles/theme.css";
import "./styles/font-awesome.css";
import "./styles/mobile-menu.css";
import "./globals.css";

const GTM_ID = "GTM-TP64CL";
const GA_ID = "G-JTHQ4GZLYQ";

const GTM_BOOT = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`;

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
        <script dangerouslySetInnerHTML={{ __html: GTM_BOOT }} />
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`,
          }}
        />
        <script dangerouslySetInnerHTML={{ __html: REVEAL_BOOT }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href={FONTS} />
      </head>
      <body className="group-blog">
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {children}
        <ScrollReveal />
      </body>
    </html>
  );
}
