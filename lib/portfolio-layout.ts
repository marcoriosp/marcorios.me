import type { PortfolioItem } from "./portfolio-types";

export const GAP = 6;
const HORIZONTAL = 1.25;
const VERTICAL = 0.8;
const MOBILE = 600;
/** How far down the date-ordered list a phone tile may look for its partner. */
const MOBILE_LOOKAHEAD = 10;
/** Max months between a horizontal and the verticals placed beside it. */
const PAIR_WINDOW = 12;
/** Max tiles in a justified row. */
const MAX_ROW = 4;
/** Max tiles that may join a feature cluster to bring it down to row height. */
const MAX_CLUSTER_EXTRAS = 3;
/** Narrowest stack allowed once extra tiles share a cluster's row. */
const MIN_STACK = 140;
/** A lone vertical beside a horizontal must render at least this multiple of the row height. */
const MIN_PAIR_SCALE = 1.4;
/** Max height of a desktop row, as a multiple of the target row height; shorter rows are centered. */
const MAX_ROW_SCALE = 2.6;
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
  | {
      kind: "cluster";
      feature: Tile;
      stackWidth: number;
      stack: [Tile, Tile];
      stackFirst?: boolean;
      /** Tiles after the feature and stack, sharing the feature's height. */
      extra?: Tile[];
    };

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

/**
 * Feature tile beside two stacked verticals. When that would be taller than `maxHeight`, up
 * to `extras.length` more tiles join the row (in order) until it fits. Null when the stack
 * would be too narrow or the row can't be brought under `maxHeight`.
 */
function cluster(
  feature: Node,
  v1: Node,
  v2: Node,
  extras: Node[],
  container: number,
  maxHeight: number,
): { row: LayoutRow; extras: Node[] } | null {
  const k = 1 / v1.ar + 1 / v2.ar;
  for (let n = 0; n <= extras.length; n++) {
    const side = extras.slice(0, n);
    const height =
      (container - GAP * (1 + n) + GAP / k) / (feature.ar + 1 / k + side.reduce((sum, e) => sum + e.ar, 0));
    const ws = (height - GAP) / k;
    if (ws < (n ? MIN_STACK : minStackWidth(container))) return null;
    if (height > maxHeight) continue;
    const h = Math.round(height);
    const stackWidth = Math.round(ws);
    const h1 = Math.round(ws / v1.ar);
    const extra = side.map((e) => ({ index: e.index, width: Math.floor(e.ar * height), height: h }));
    const featureWidth = container - GAP * (1 + n) - stackWidth - extra.reduce((sum, t) => sum + t.width, 0);
    return {
      row: {
        kind: "cluster",
        feature: { index: feature.index, width: featureWidth, height: h },
        stackWidth,
        stack: [
          { index: v1.index, width: stackWidth, height: h1 },
          { index: v2.index, width: stackWidth, height: h - GAP - h1 },
        ],
        extra: extra.length ? extra : undefined,
      },
      extras: side,
    };
  }
  return null;
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
 * 1. The first tile is large, with its two nearest-dated verticals stacked beside it when
 *    there are two; otherwise it is placed like any other tile. A cluster taller than
 *    `MAX_ROW_SCALE` row heights takes up to `MAX_CLUSTER_EXTRAS` nearby tiles beside it.
 * 2. Each horizontal tile takes its two nearest-dated verticals (within `PAIR_WINDOW` months)
 *    as a stack, or a single vertical beside it when the stack would be too narrow and the
 *    pair stays tall enough (`MIN_PAIR_SCALE`).
 * 3. Remaining tiles fill justified rows of at most `MAX_ROW` tiles, horizontals with
 *    horizontals and verticals with verticals.
 * No row holds a single tile: a lone leftover joins the nearest justified row, or else the
 * nearest stack is split into two rows of two; only a single visible item renders alone,
 * capped at twice the row height. Rows taller than `MAX_ROW_SCALE` row heights shrink to fit.
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

  /** Rows built below, kept as nodes so a lone leftover tile can join one. */
  const loose = new Map<LayoutRow, Node[]>();
  const stacks = new Map<LayoutRow, Node[]>();
  const pushRow = (nodes: Node[]) => {
    const row = justify(nodes, container);
    loose.set(row, nodes);
    rows.push(row);
  };
  const th = targetHeight(container);
  const cap = th * MAX_ROW_SCALE;
  /** Cluster `feature` with the two stacked `side` tiles plus nearby extras; false if it can't fit. */
  const placeCluster = (feature: number, side: number[]) => {
    if (side.length !== 2) return false;
    const taken = new Set([...used, feature, ...side]);
    const extras = nearestVerticals(pool, feature, MAX_CLUSTER_EXTRAS, taken).map((i) => pool[i]);
    const built = cluster(pool[feature], pool[side[0]], pool[side[1]], extras, container, cap);
    if (!built) return false;
    const nodes = [pool[feature], pool[side[0]], pool[side[1]], ...built.extras];
    nodes.forEach((n) => used.add(n.index));
    stacks.set(built.row, nodes);
    rows.push(built.row);
    return true;
  };

  if (!used.has(0)) placeCluster(0, nearestVerticals(pool, 0, 2, used));

  for (let i = 0; i < pool.length; i++) {
    if (used.has(i) || pool[i].ar <= HORIZONTAL) continue;
    const side = nearestVerticals(pool, i, 2, used);
    if (placeCluster(i, side)) continue;
    if (
      side.length &&
      (container - GAP) / (pool[i].ar + pool[side[0]].ar) >= targetHeight(container) * MIN_PAIR_SCALE
    ) {
      [i, side[0]].forEach((k) => used.add(k));
      pushRow([pool[i], pool[side[0]]]);
    }
  }

  const fits = (row: Node[], node: Node) =>
    row.length < 2 ||
    (row.length < MAX_ROW && (row.reduce((sum, n) => sum + n.ar, 0) + node.ar) * th + GAP * row.length <= container);
  const open: Record<"wide" | "tall", Node[]> = { wide: [], tall: [] };
  for (let i = 0; i < pool.length; i++) {
    if (used.has(i)) continue;
    const node = pool[i];
    const key = node.ar > HORIZONTAL ? "wide" : "tall";
    if (open[key].length && !fits(open[key], node)) {
      pushRow(open[key]);
      open[key] = [];
    }
    open[key].push(node);
  }
  const rest = [...open.wide, ...open.tall];
  if (rest.length > 1) {
    pushRow(rest);
  } else if (rest.length === 1) {
    const lone = rest[0];
    const nearestOf = (rowsByNodes: Map<LayoutRow, Node[]>) =>
      [...rowsByNodes.entries()].sort(
        ([, a], [, b]) =>
          Math.min(...a.map((n) => Math.abs(n.index - lone.index))) -
          Math.min(...b.map((n) => Math.abs(n.index - lone.index))),
      )[0];
    const row = nearestOf(loose);
    const stack = row ? undefined : nearestOf(stacks);
    if (row) {
      rows[rows.indexOf(row[0])] = justify([...row[1], lone].sort((a, b) => a.index - b.index), container);
    } else if (stack) {
      const nodes = [...stack[1], lone].sort((a, b) => a.index - b.index);
      rows.splice(rows.indexOf(stack[0]), 1, justify(nodes.slice(0, 2), container), justify(nodes.slice(2), container));
    } else {
      const height = Math.min(container / lone.ar, th * 2);
      rows.push({ kind: "row", tiles: [{ index: lone.index, width: Math.round(lone.ar * height), height: Math.round(height) }] });
    }
  }

  const capped = rows.map((row): LayoutRow => {
    if (row.kind !== "row" || row.tiles[0].height <= cap) return row;
    const scale = cap / row.tiles[0].height;
    return { kind: "row", tiles: row.tiles.map((t) => ({ ...t, width: Math.floor(t.width * scale), height: Math.round(cap) })) };
  });
  const newest = (row: LayoutRow) => Math.min(...rowIndices(row));
  return capped.sort((a, b) => newest(a) - newest(b));
}

function rowIndices(row: LayoutRow): number[] {
  if (row.kind === "row") return row.tiles.map((t) => t.index);
  const stack = row.stack.map((t) => t.index);
  const extra = (row.extra ?? []).map((t) => t.index);
  return [...(row.stackFirst ? [...stack, row.feature.index] : [row.feature.index, ...stack]), ...extra];
}

/** Visible items in the order the layout displays them (used for lightbox navigation). */
export function displayOrder(rows: LayoutRow[]): number[] {
  return rows.flatMap(rowIndices);
}
