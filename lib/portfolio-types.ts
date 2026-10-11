export type PortfolioCategory = "brand" | "tour" | "festival" | "concert";

export interface PortfolioItem {
  title: string;
  /** Label shown in the caption, e.g. "Concert" or "Brand Experience". */
  kind: string;
  /** Caption date, e.g. "May 2026". */
  date: string;
  year: number;
  categories: PortfolioCategory[];
  /** Full-size image opened in the lightbox. */
  image: string;
  /** Image shown in the grid tile. */
  thumb: string;
  width: number;
  height: number;
  /** Placed before the other tiles in its row. */
  lead?: boolean;
  /** Items sharing this key are placed together in one row on wide screens (three with a lead: lead large, others stacked). */
  row?: string;
  /** Individual shows of a tour, each listed as its own tile under Concerts. */
  shows?: PortfolioShow[];
}

/** A single show; image fields fall back to the tour's own. */
export interface PortfolioShow {
  title: string;
  image?: string;
  thumb?: string;
  width?: number;
  height?: number;
  /** Row group under Concerts; see `PortfolioItem.row`. */
  row?: string;
}
