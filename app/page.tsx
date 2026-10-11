import type { Metadata } from "next";
import { SocialBar } from "@/components/site-footer";
import { SiteShell } from "@/components/site-shell";
import { posts, truncateWords } from "@/lib/content";
import { EMAIL, SITE_NAME, SITE_TAGLINE } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: `${SITE_NAME} – ${SITE_TAGLINE}` },
  alternates: { canonical: "/" },
};

const HERO_IMAGE = "https://file.marcorios.me/wp-content/uploads/2021/11/02194204/concert-header2.jpeg";
const CTA_IMAGE = "https://file.marcorios.me/wp-content/uploads/2014/12/04141935/bg-2.jpg";
const PORTRAIT = "https://file.marcorios.me/wp-content/uploads/2022/04/11091538/Picture1.png";

const SERVICES = [
  {
    icon: "fa-briefcase",
    title: "Event Management",
    text: "More than 17 years of experience in the events industry. Specialized in live concerts & festivals, corporate events, marketing events (launch and brand awareness).",
  },
  {
    icon: "fa-calendar",
    title: "Marketing Specialist",
    text: "Solid experience and expertise in managing all types of marketing strategy and campaigns. With an impressive and a vast proven-successful track record of diverse campaigns.",
  },
  {
    icon: "fa-binoculars",
    title: "New Business Development",
    text: "Creation of long-term value for an organization from customers, markets, and relationships. Highlighting a very close and proven connections in all Asia, Europe and the Americas.",
  },
];

/** Latest posts that have a featured image, as on the original home page. */
const latest = posts.filter((p) => p.image).slice(0, 3);

export default function HomePage() {
  return (
    <SiteShell current="/">
      <section id="hero-header" style={{ background: `url(${HERO_IMAGE}) 50% 0 no-repeat fixed` }}>
        <div className="hero-content-container">
          <div className="hero-content">
            <span>
              <h1 className="animate-on-load fadeInDown">Marco Rios</h1>
              <a href="/blog/" className="featured-link">
                <span className="hero-button animate-on-load fadeInDown">Read my Blog</span>
              </a>
            </span>
          </div>
        </div>
      </section>

      <SocialBar />

      <div className="home-content">
        <div className="grid grid-pad">
          <div className="col-1-1">
            <h6 className="reveal" data-reveal="fadeInLeft">
              Welcome to my Site
            </h6>
            <p className="reveal" data-reveal="fadeInRight">
              At an early age I was fortunate to discover my passion for live events. Exploring my creativity through
              many different mediums, I focused &amp; honed my business strengths to the services I provide my clients
              today. I started my career as executive assistant for Mr Mario Aceval at Arcanhell Producciones, where I
              learned valuable fundamentals in the industry. During my start-up phase I participated in the Spanish
              Youth Business Foundation (Madrid, Spain), which supported my financing and mentoring by Marcelo Espina,
              BankT Investment.
              <br />
              <br />
              A strong technical and business qualifications with a proven skills in fields like strategic planning,
              business unit development, project and services management, logistics strategies, sales, management,
              communication, customer service, marketing strategy and software engineer.-
              <br />
              <br />
              Also having a vast experience in International Trading (Personal portfolio); F&amp;B (Personal Project,
              fast food restaurant); and Marketing/Branding, with an impeccable track record in implementing successful
              marketing strategies in different levels, with campaigns addressed to live events, massive concerts &amp;
              festivals, corporate events, brand launch events and brand awareness events (Grammy Festival, Coca Cola -
              Música Zero, F1 Rocks!, Samsung, Audi, BMW, among many others)
            </p>
          </div>
        </div>
      </div>

      <div className="home-services">
        <div className="grid grid-pad">
          <div className="col-1-1">
            <h6 className="reveal" data-reveal="fadeIn">
              Experience
            </h6>
          </div>
        </div>
        <div className="grid grid-pad no-top">
          {SERVICES.map((s, i) => (
            <div
              key={s.title}
              className="col-1-3 tri-clear reveal"
              data-reveal="fadeIn"
              style={{ animationDelay: "0.25s" }}
            >
              <div className={`service sbox-${i + 1}`}>
                <i className={`fa ${s.icon}`} aria-hidden="true" />
                <h5>{s.title}</h5>
                <p className="member-description">{s.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="home-news">
        <div className="grid grid-pad">
          <div className="col-1-1">
            <h6 className="reveal" data-reveal="fadeIn">
              Latest Blog Post
            </h6>
          </div>
        </div>
        <div className="grid grid-pad no-top">
          {latest.map((post) => (
            <div
              key={post.slug}
              className="col-1-3 tri-clear reveal"
              data-reveal="fadeInUp"
              style={{ animationDelay: "0.25s" }}
            >
              <a href={`/${post.slug}/`}>
                <img
                  className="home-news-thumb"
                  src={post.image!}
                  width={400}
                  height={250}
                  alt=""
                  loading="lazy"
                  decoding="async"
                />
              </a>
              <h5>{post.title}</h5>
              <p>
                {truncateWords(post.excerpt, 20)} <a href={`/${post.slug}/`}> Read More</a>
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="home-team">
        <div className="grid grid-pad">
          <div className="col-1-1">
            <h6 className="reveal" data-reveal="fadeInRight">
              About Me
            </h6>
          </div>
        </div>
        <div className="grid grid-pad no-top">
          <div className="col-1-1 tri-clear reveal" data-reveal="fadeInLeft" style={{ animationDelay: "0.15s" }}>
            <div className="member tbox-1">
              <img src={PORTRAIT} alt="Marco Rios" loading="lazy" decoding="async" />
              <h5>Marco Rios</h5>
              <p className="member-description">
                A highly experienced Operations and Executive, results-oriented, high-energy and hands-on professional,
                who has demonstrated the ability to lead diverse teams of professionals to new levels of success in a
                variety of highly competitive industries, cutting-edge markets, and fast-paced environments.
                <br />
                <br />
                Having an impressive and a vast proven-successful track record of accomplishments of more than 17 years
                of hands-on experience in the entertainment industry as a well-known concert, tour &amp; festival
                promoter. In my career I have been responsible for arranging some of the most significant live events
                around the world{" "}
                <strong>
                  (<a href="/portfolio/">See portfolio</a>)
                </strong>
                . I use my strong networking skills and my exceptional attention to details, to help create memorable
                and unique events.
              </p>
              <a href="https://twitter.com/marcoriosp" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <i className="fa fa-twitter" />
              </a>
              <a href="https://www.linkedin.com/in/marcorp" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <i className="fa fa-linkedin" />
              </a>
              <a href={`mailto:${EMAIL}`} aria-label="E-mail">
                <i className="fa fa-envelope-o" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="home-cta" style={{ background: `url(${CTA_IMAGE}) no-repeat center center fixed`, backgroundSize: "cover" }}>
        <div className="grid grid-pad">
          <div className="sensible-home-widget-area">
            <div className="col-1-1">
              <a href="/publications/" className="button outline white">
                Articles / Publications
              </a>
            </div>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
