"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { EMAIL, MENU, SOCIAL } from "@/lib/site";

const DRAWER_SOCIAL = ["LinkedIn", "Instagram", "Facebook", "Twitter", "YouTube"];
const FOCUSABLE = "a[href], button:not([disabled])";

function MenuItems({ current }: { current?: string }) {
  return (
    <ul className="menu">
      {MENU.map((item) => {
        const active = item.href === current;
        return (
          <li
            key={item.href}
            className={`menu-item${active ? " current-menu-item current_page_item" : ""}`}
          >
            <a href={item.href} aria-current={active ? "page" : undefined}>
              {item.label}
            </a>
          </li>
        );
      })}
    </ul>
  );
}

export function SiteHeader({ current }: { current?: string }) {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;
    const toggle = toggleRef.current;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return setOpen(false);
      if (e.key !== "Tab" || !drawerRef.current) return;
      const items = [...drawerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)];
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    const desktop = window.matchMedia("(min-width: 901px)");
    const onResize = () => desktop.matches && setOpen(false);

    document.addEventListener("keydown", onKey);
    desktop.addEventListener("change", onResize);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onResize);
      // The drawer turns inert on close, which drops focus; restore it after that settles.
      requestAnimationFrame(() => toggle?.focus());
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <header id="masthead" className="site-header" role="banner">
        <div className="grid grid-pad head-overflow">
          <div className="site-branding">
            <div className="site-logo">
              <a href="/" title="Marco Rios Site" rel="home">
                <img
                  src="https://file.marcorios.me/wp-content/uploads/2016/07/04141927/logo-marco.png"
                  width={200}
                  alt="Marco Rios Site"
                />
              </a>
            </div>
          </div>
          <div className="navigation-container">
            <nav id="site-navigation" className="main-navigation" role="navigation">
              <button
                ref={toggleRef}
                type="button"
                className="menu-toggle"
                aria-expanded={open}
                aria-controls="mobile-menu"
                onClick={() => setOpen(true)}
              >
                <i className="fa fa-bars" aria-hidden="true" /> Menu
              </button>
              <div className="menu-main-menu-container">
                <MenuItems current={current} />
              </div>
            </nav>
          </div>
        </div>
      </header>

      <div className={`mnav-scrim${open ? " is-open" : ""}`} onClick={close} aria-hidden="true" />
      <aside
        ref={drawerRef}
        id="mobile-menu"
        className={`mnav${open ? " is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        inert={!open}
      >
        <div className="mnav-head">
          <span className="mnav-title">Menu</span>
          <button ref={closeRef} type="button" className="mnav-close" aria-label="Close menu" onClick={close}>
            <i className="fa fa-times" aria-hidden="true" />
          </button>
        </div>

        <nav className="mnav-body" aria-label="Main">
          <ul className="mnav-list">
            {MENU.map((item, i) => {
              const active = item.href === current;
              return (
                <li key={item.href} style={{ "--i": i } as CSSProperties}>
                  <a className="mnav-link" href={item.href} aria-current={active ? "page" : undefined}>
                    <span>{item.label}</span>
                    <i className="fa fa-angle-right" aria-hidden="true" />
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="mnav-foot">
          <a className="mnav-cta" href={`mailto:${EMAIL}`}>
            <i className="fa fa-envelope" aria-hidden="true" /> Email me
          </a>
          <ul className="mnav-social">
            {SOCIAL.filter((s) => DRAWER_SOCIAL.includes(s.label)).map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
                  <i className={`fa ${s.icon}`} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </>
  );
}
