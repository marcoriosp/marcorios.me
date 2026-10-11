import type { PortfolioItem } from "./portfolio-types";

export const GAP = 6;
const HORIZONTAL = 1.25;
const VERTICAL = 0.8;
const MOBILE = 600;
/** How far down the date-ordered list a phone tile may look for its partner. */
const MOBILE_LOOKAHEAD = 10;
/** Max months between a horizontal and the verticals placed beside it. */
const PAIR_WINDOW = 12;
/** Max tiles in a justified row, so runs of posters stay large. */
const MAX_ROW = 3;
/** A lone vertical beside a horizontal must render at least this multiple of the row height. */
const MIN_PAIR_SCALE = 1.4;
/** Width share of the lead tile in a grouped row with two stacked tiles; the stack crops to fit. */
const GROUP_FEATURE_SHARE = 0.5;

const MONTHS: Record<string, number> = {
  jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
  jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12,
};

export interface Tile {
  /** Index into the list of visible items passed to `layoutPortfolio`. */
  index: number;
  width: number;
  height: number;
}

export type LayoutRow =
  | { kind: "row"; tiles: Tile[] }
  | { kind: "cluster"; feature: Tile; stackWidth: number; stack: [Tile, Tile]; stackFirst?: boolean };

interface Node {
  index: number;
  ar: number;
  date: number;
  lead: boolean;
}

function aspect(item: PortfolioItem): number {
  return Math.max(item.width / item.height, 0.2);
}

function dateKey(item: PortfolioItem): number {
  const month = MONTHS[item.date.slice(0, 3).toLowerCase()] ?? 0;
  return item.year * 12 + month;
}

function targetHeight(container: number): number {
  if (container < 520) return 160;
  if (container < 768) return 190;
  if (container < 1100) return 220;
  return 240;
}

function minStackWidth(container: number): number {
  return Math.max(200, container * 0.28);
}

function nearestVerticals(pool: Node[], from: number, count: number, used: Set<number>): number[] {
  return pool
    .map((node, i) => ({ i, node }))
    .filter(
      ({ i, node }) =>
        i !== from &&
        !used.has(i) &&
        node.ar <= HORIZONTAL &&
        Math.abs(node.date - pool[from].date) <= PAIR_WINDOW,
    )
    .sort(
      (a, b) =>
        Math.abs(a.node.date - pool[from].date) - Math.abs(b.node.date - pool[from].date) ||
        Math.abs(a.i - from) - Math.abs(b.i - from) ||
        a.i - b.i,
    )
    .slice(0, count)
    .map(({ i }) => i);
}

/** Feature tile beside two stacked verticals; null when the stack would be too narrow. */
function cluster(feature: Node, v1: Node, v2: Node, container: number): LayoutRow | null {
  const ws = (container - GAP * (feature.ar + 1)) / (feature.ar * (1 / v1.ar + 1 / v2.ar) + 1);
  if (ws < minStackWidth(container)) return null;
  const h1 = ws / v1.ar;
  const h2 = ws / v2.ar;
  const height = h1 + GAP + h2;
  if (height > container * 1.35) return null;
  const stackWidth = Math.round(ws);
  return {
    kind: "cluster",
    feature: { index: feature.index, width: container - GAP - stackWidth, height: Math.round(height) },
    stackWidth,
    stack: [
      { index: v1.index, width: stackWidth, height: Math.round(h1) },
      { index: v2.index, width: stackWidth, height: Math.round(h2) },
    ],
  };
}

/** Feature at a fixed width share beside two stacked tiles splitting its height evenly. */
function groupCluster(feature: Node, v1: Node, v2: Node, container: number, stackFirst: boolean): LayoutRow {
  const width = Math.round((container - GAP) * GROUP_FEATURE_SHARE);
  const height = Math.round(width / feature.ar);
  const stackWidth = container - GAP - width;
  const h1 = Math.round((height - GAP) / 2);
  return {
    kind: "cluster",
    feature: { index: feature.index, width, height },
    stackWidth,
    stack: [
      { index: v1.index, width: stackWidth, height: h1 },
      { index: v2.index, width: stackWidth, height: height - GAP - h1 },
    ],
    stackFirst,
  };
}

/** Stretch a set of tiles to one shared height that fills the container width. */
function justify(row: Node[], container: number): LayoutRow {
  const nodes = [...row.filter((n) => n.lead), ...row.filter((n) => !n.lead)];
  const gaps = GAP * (nodes.length - 1);
  const height = (container - gaps) / nodes.reduce((sum, n) => sum + n.ar, 0);
  let used = 0;
  const tiles = nodes.map((node, j) => {
    const width = j === nodes.length - 1 ? container - gaps - used : Math.floor(node.ar * height);
    used += width;
    return { index: node.index, width, height: Math.round(height) };
  });
  return { kind: "row", tiles };
}

function shape(ar: number): "horizontal" | "vertical" | "square" {
  if (ar > HORIZONTAL) return "horizontal";
  if (ar < VERTICAL) return "vertical";
  return "square";
}

/**
 * Phone layout: horizontals take a full row; verticals pair with the next vertical and squares
 * with the next square. A tile with no same-shape partner nearby pairs with the next nearby
 * vertical or square, and only stands alone when none is close.
 */
function layoutMobile(pool: Node[], container: number): LayoutRow[] {
  const used = new Set<number>();
  const rows: LayoutRow[] = [];
  const nextUnused = (from: number, match: (n: Node) => boolean) => {
    const end = Math.min(pool.length, from + 1 + MOBILE_LOOKAHEAD);
    for (let j = from + 1; j < end; j++) if (!used.has(j) && match(pool[j])) return j;
    return -1;
  };

  for (let i = 0; i < pool.length; i++) {
    if (used.has(i)) continue;
    used.add(i);
    const kind = shape(pool[i].ar);
    if (kind === "horizontal") {
      rows.push(justify([pool[i]], container));
      continue;
    }
    let partner = nextUnused(i, (n) => shape(n.ar) === kind);
    if (partner < 0) partner = nextUnused(i, (n) => shape(n.ar) !== "horizontal");
    if (partner < 0) {
      rows.push(justify([pool[i]], container));
      continue;
    }
    used.add(partner);
    rows.push(justify([pool[i], pool[partner]], container));
  }
  return rows;
}

/**
 * Packs tiles so every row fills the container with no gaps while keeping each image's
 * aspect ratio. Below the phone breakpoint, `layoutMobile` is used instead. On wider screens:
 * 0. Items sharing a `row` key form one row; a group of three with a `lead` item shows it
 *    at `GROUP_FEATURE_SHARE` of the width beside the other two stacked, the stack on the
 *    left when it holds the group's newest item.
 * 1. The first tile is large, with its two nearest-dated verticals stacked beside it.
 * 2. Each horizontal tile takes its two nearest-dated verticals (within `PAIR_WINDOW` months)
 *    as a stack, or a single vertical beside it when the stack would be too narrow and the
 *    pair stays tall enough (`MIN_PAIR_SCALE`).
 * 3. Remaining tiles fill justified rows of at most `MAX_ROW` tiles, horizontals with
 *    horizontals and verticals with verticals.
 * Rows are then ordered by their newest tile.
 */
export function layoutPortfolio(items: PortfolioItem[], container: number): LayoutRow[] {
  if (!items.length || container <= 0) return [];
  const pool: Node[] = items.map((item, index) => ({
    index,
    ar: aspect(item),
    date: dateKey(item),
    lead: Boolean(item.lead),
  }));
  if (container < MOBILE) return layoutMobile(pool, container);
  const used = new Set<number>();
  const rows: LayoutRow[] = [];

  const groups = new Map<string, Node[]>();
  items.forEach((item, i) => {
    if (item.row) groups.set(item.row, [...(groups.get(item.row) ?? []), pool[i]]);
  });
  for (const group of groups.values()) {
    if (group.length < 2) continue;
    group.forEach((n) => used.add(n.index));
    const feature = group.find((n) => n.lead);
    const stack = group.filter((n) => n !== feature);
    rows.push(
      feature && stack.length === 2
        ? groupCluster(feature, stack[0], stack[1], container, group[0] !== feature)
        : justify(group, container),
    );
  }

  if (!used.has(0)) {
    used.add(0);
    const heroSide = nearestVerticals(pool, 0, 2, used);
    const hero =
      heroSide.length === 2 ? cluster(pool[0], pool[heroSide[0]], pool[heroSide[1]], container) : null;
    if (hero) {
      heroSide.forEach((i) => used.add(i));
      rows.push(hero);
    } else {
      rows.push(justify([pool[0]], container));
    }
  }

  for (let i = 1; i < pool.length; i++) {
    if (used.has(i) || pool[i].ar <= HORIZONTAL) continue;
    const side = nearestVerticals(pool, i, 2, used);
    const stacked = side.length === 2 ? cluster(pool[i], pool[side[0]], pool[side[1]], container) : null;
    if (stacked) {
      [i, ...side].forEach((k) => used.add(k));
      rows.push(stacked);
    } else if (
      side.length &&
      (container - GAP) / (pool[i].ar + pool[side[0]].ar) >= targetHeight(container) * MIN_PAIR_SCALE
    ) {
      [i, side[0]].forEach((k) => used.add(k));
      rows.push(justify([pool[i], pool[side[0]]], container));
    }
  }

  const th = targetHeight(container);
  const fits = (row: Node[], node: Node) =>
    row.length < 2 ||
    (row.length < MAX_ROW && (row.reduce((sum, n) => sum + n.ar, 0) + node.ar) * th + GAP * row.length <= container);
  const open: Record<"wide" | "tall", Node[]> = { wide: [], tall: [] };
  for (let i = 1; i < pool.length; i++) {
    if (used.has(i)) continue;
    const node = pool[i];
    const key = node.ar > HORIZONTAL ? "wide" : "tall";
    if (open[key].length && !fits(open[key], node)) {
      rows.push(justify(open[key], container));
      open[key] = [];
    }
    open[key].push(node);
  }
  const rest = [...open.wide, ...open.tall];
  if (rest.length) rows.push(justify(rest, container));

  const newest = (row: LayoutRow) => Math.min(...rowIndices(row));
  return rows.sort((a, b) => newest(a) - newest(b));
}

function rowIndices(row: LayoutRow): number[] {
  if (row.kind === "row") return row.tiles.map((t) => t.index);
  const stack = row.stack.map((t) => t.index);
  return row.stackFirst ? [...stack, row.feature.index] : [row.feature.index, ...stack];
}

/** Visible items in the order the layout displays them (used for lightbox navigation). */
export function displayOrder(rows: LayoutRow[]): number[] {
  return rows.flatMap(rowIndices);
}
