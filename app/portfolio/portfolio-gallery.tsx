"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { displayOrder, layoutPortfolio, type Tile } from "@/lib/portfolio-layout";
import type { PortfolioCategory, PortfolioItem } from "@/lib/portfolio-types";

type Filter = "all" | PortfolioCategory;

const TABS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "concert", label: "Concerts" },
  { id: "festival", label: "Festivals" },
  { id: "tour", label: "Tours" },
  { id: "brand", label: "Brand Launch" },
];

/** Content width of the 9/12 column on desktop; used until the real width is measured. */
const DEFAULT_WIDTH = 878;
/** Tiles revealed initially and on each infinite-scroll step. */
const PAGE_SIZE = 20;

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

export function PortfolioGallery({ items }: { items: PortfolioItem[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [year, setYear] = useState<string>("all");
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const [measured, setMeasured] = useState(false);
  const [open, setOpen] = useState<number | null>(null);
  const [limit, setLimit] = useState(PAGE_SIZE);
  const gridRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const counts = useMemo(() => {
    const c: Record<Filter, number> = { all: items.length, brand: 0, tour: 0, festival: 0, concert: 0 };
    for (const item of items)
      for (const cat of item.categories) c[cat] += cat === "concert" ? (item.shows?.length ?? 1) : 1;
    return c;
  }, [items]);

  const years = useMemo(
    () => [...new Set(items.map((i) => i.year))].sort((a, b) => b - a),
    [items],
  );

  const visible = useMemo(() => {
    const matches = items.filter(
      (i) =>
        (filter === "all" || i.categories.includes(filter)) &&
        (year === "all" || String(i.year) === year),
    );
    if (filter !== "concert") return matches;
    return matches.flatMap((item) =>
      item.shows
        ? item.shows.map((show) => ({ ...item, ...show, shows: undefined, lead: undefined, row: undefined }))
        : [item],
    );
  }, [items, filter, year]);

  const rows = useMemo(() => layoutPortfolio(visible, width), [visible, width]);
  const order = useMemo(() => displayOrder(rows), [rows]);

  // Rows are laid out over every visible item and revealed whole, so loading more never
  // reshuffles rows that are already on screen.
  const shownRows = useMemo(() => {
    let tiles = 0;
    let count = 0;
    while (count < rows.length && tiles < limit) {
      const row = rows[count++];
      tiles += row.kind === "row" ? row.tiles.length : 1 + row.stack.length;
    }
    return count;
  }, [rows, limit]);
  const hasMore = shownRows < rows.length;

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore) return;
    // Re-observing after each step fires again if the sentinel is still in view.
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) setLimit((l) => l + PAGE_SIZE);
      },
      { rootMargin: "400px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [hasMore, shownRows]);

  const changeFilter = (next: Filter) => {
    setFilter(next);
    setLimit(PAGE_SIZE);
  };
  const changeYear = (next: string) => {
    setYear(next);
    setLimit(PAGE_SIZE);
  };

  useIsoLayoutEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const measure = () => setWidth(Math.floor(el.clientWidth) || DEFAULT_WIDTH);
    measure();
    setMeasured(true);
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const close = useCallback(() => setOpen(null), []);
  const step = useCallback(
    (dir: 1 | -1) =>
      setOpen((cur) => {
        if (cur === null) return cur;
        const pos = order.indexOf(cur);
        return order[(pos + dir + order.length) % order.length];
      }),
    [order],
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close, step]);

  const renderTile = (tile: Tile, eager: boolean) => {
    const item = visible[tile.index];
    return (
      <figure
        key={tile.index}
        className="pf-item"
        style={{ width: tile.width, height: tile.height }}
      >
        <a
          className="pf-link"
          href={item.image}
          title={item.title}
          onClick={(e) => {
            e.preventDefault();
            setOpen(tile.index);
          }}
        >
          <img
            src={item.thumb}
            width={item.width}
            height={item.height}
            alt={item.title}
            loading={eager ? "eager" : "lazy"}
            decoding="async"
          />
          <figcaption>
            <span className="pf-meta">
              {item.kind} · {item.date}
            </span>
            <span className="pf-title">{item.title}</span>
          </figcaption>
        </a>
      </figure>
    );
  };

  const current = open === null ? null : visible[open];

  return (
    <div className="pf" id="portfolio">
      <div className="pf-toolbar">
        <div className="pf-tabs" role="group" aria-label="Filter by type">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`pf-tab${filter === tab.id ? " is-active" : ""}`}
              aria-pressed={filter === tab.id}
              onClick={() => changeFilter(tab.id)}
            >
              {tab.label} <span className="pf-count">{counts[tab.id]}</span>
            </button>
          ))}
        </div>
        <label className="pf-year">
          <span className="screen-reader-text">Filter by year</span>
          <select id="pf-year" value={year} onChange={(e) => changeYear(e.target.value)}>
            <option value="all">All years</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </label>
      </div>

      {visible.length === 0 && <p className="pf-empty">No projects match this filter.</p>}

      <div className="pf-grid" ref={gridRef} data-measured={measured || undefined}>
        {rows.slice(0, shownRows).map((row, r) =>
          row.kind === "cluster" ? (
            <div key={r} className="pf-row pf-cluster">
              {!row.stackFirst && renderTile(row.feature, r === 0)}
              <div className="pf-stack" style={{ width: row.stackWidth }}>
                {row.stack.map((t) => renderTile(t, r === 0))}
              </div>
              {row.stackFirst && renderTile(row.feature, r === 0)}
            </div>
          ) : (
            <div key={r} className={`pf-row${row.tiles.length === 2 ? " pf-pair" : ""}`}>
              {row.tiles.map((t) => renderTile(t, r === 0))}
            </div>
          ),
        )}
      </div>

      {hasMore && (
        <div className="pf-loading" ref={sentinelRef} role="status">
          <span className="pf-spinner" aria-hidden="true" />
          Loading…
        </div>
      )}

      {current && (
        <div className="pf-lightbox" role="dialog" aria-modal="true" aria-label={current.title} onClick={close}>
          <figure className="pf-lightbox-figure" onClick={(e) => e.stopPropagation()}>
            <img src={current.image} alt={current.title} />
            <figcaption>
              <span className="pf-meta">
                {current.kind} · {current.date}
              </span>
              <span className="pf-title">{current.title}</span>
            </figcaption>
          </figure>
          <button type="button" className="pf-lightbox-close" aria-label="Close" onClick={close}>
            &#10005;
          </button>
          {order.length > 1 && (
            <>
              <button
                type="button"
                className="pf-lightbox-nav is-prev"
                aria-label="Previous"
                onClick={(e) => {
                  e.stopPropagation();
                  step(-1);
                }}
              >
                &#10094;
              </button>
              <button
                type="button"
                className="pf-lightbox-nav is-next"
                aria-label="Next"
                onClick={(e) => {
                  e.stopPropagation();
                  step(1);
                }}
              >
                &#10095;
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
