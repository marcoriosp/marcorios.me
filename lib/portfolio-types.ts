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
}
