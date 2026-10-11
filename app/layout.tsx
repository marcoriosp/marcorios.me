import type { Metadata } from "next";
import "./globals.css";

const GA_ID = "G-48GZZY1H8P";

const THEME_STYLES = [
  "/wp-content/themes/sensible-wp/style.css",
  "https://fonts.googleapis.com/css?family=PT+Sans:400,700,400italic,700italic|Open+Sans:400italic,700italic,400,700&display=swap",
  "/wp-content/themes/sensible-wp/fonts/css/all.css",
  "/wp-content/themes/sensible-wp/fonts/font-awesome.css",
  "/wp-content/themes/sensible-wp/css/jPushMenu.css",
];

export const metadata: Metadata = {
  metadataBase: new URL("https://marcorios.me"),
  title: { default: "Marco Rios Site", template: "%s – Marco Rios Site" },
  description:
    "Marco Rios – live entertainment, touring and brand experience producer. Concerts, tours, festivals and brand launches since 2008.",
  robots: { index: true, follow: true, "max-image-preview": "large" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-US">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {THEME_STYLES.map((href) => (
          <link key={href} rel="stylesheet" href={href} />
        ))}
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag("js",new Date());gtag("config","${GA_ID}",{anonymize_ip:true});`,
          }}
        />
      </head>
      <body className="page-template-default page group-blog cbp-spmenu-push">{children}</body>
    </html>
  );
}
