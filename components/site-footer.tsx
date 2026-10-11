import { CopyEmailButton } from "./copy-email-button";

const EMAIL = "marco@marcorios.me";

const SOCIAL = [
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

export function SiteFooter() {
  return (
    <>
      <div className="social-bar-none">
        <div className="grid grid-pad">
          <div className="col-1-1">
            <ul className="social-media-icons">
              {SOCIAL.map((s) => (
                <li key={s.icon}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
                    <i className={`fa ${s.icon}`} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="footer-contact">
        <div className="grid grid-pad">
          <div className="col-1-1">
            <h6>Contact Information</h6>
            <div className="contact-card">
              <span className="contact-icon" aria-hidden="true">
                <i className="fa fa-envelope-o" />
              </span>
              <p className="contact-lede">For bookings, collaborations and project enquiries.</p>
              <a className="contact-email" href={`mailto:${EMAIL}`}>
                {EMAIL}
              </a>
              <div className="contact-actions">
                <a className="contact-btn is-primary" href={`mailto:${EMAIL}`}>
                  <i className="fa fa-paper-plane" aria-hidden="true" />
                  Send an email
                </a>
                <CopyEmailButton email={EMAIL} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer id="colophon" className="site-footer" role="contentinfo">
        <div className="grid grid-pad">
          <div className="site-info col-1-1">
            Copyright © 2022 Marco Rios -{" "}
            <a href="https://marcorios.me/" rel="designer">
              marcorios.me
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
