"use client";

import { useEffect, useState } from "react";
import { MENU } from "@/lib/site";

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

  useEffect(() => {
    document.body.classList.add("cbp-spmenu-push");
    document.body.classList.toggle("cbp-spmenu-push-toleft", open);
    if (!open) return;
    const closeMenu = () => setOpen(false);
    document.addEventListener("click", closeMenu);
    return () => document.removeEventListener("click", closeMenu);
  }, [open]);

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
                type="button"
                className={`menu-toggle toggle-menu menu-right push-body${open ? " menu-active" : ""}`}
                aria-expanded={open}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen((v) => !v);
                }}
              >
                <i className="fa fa-bars" /> Menu
              </button>
              <div className="menu-main-menu-container">
                <MenuItems current={current} />
              </div>
            </nav>
          </div>
        </div>
      </header>
      <nav
        className={`cbp-spmenu cbp-spmenu-vertical cbp-spmenu-right${open ? " cbp-spmenu-open" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <h3>Menu</h3>
        <div className="menu-main-menu-container">
          <MenuItems current={current} />
        </div>
      </nav>
    </>
  );
}
