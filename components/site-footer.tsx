import { EMAIL, SOCIAL } from "@/lib/site";
import { CopyEmailButton } from "./copy-email-button";

export function SocialBar() {
  return (
    <div className="social-bar-none">
      <div className="grid grid-pad">
        <div className="col-1-1">
          <div className="reveal" data-reveal="fadeIn">
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
    </div>
  );
}

export function SiteFooter() {
  return (
    <>
      <SocialBar />
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
