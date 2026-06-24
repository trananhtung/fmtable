import { STYLES, type StyleName } from "./styles.js";
import { visibleWidth, padEnd, padStart, center } from "./measure.js";

export type Align = "left" | "right" | "center";
export type CellValue = string | number | boolean | null | undefined;

export interface FormatOptions {
  /** Column header labels. When provided, a header row is rendered. */
  headers?: string[];
  /** Border / box-drawing style (default: "rounded"). */
  style?: StyleName;
  /** Per-column alignment or a single value applied to all columns. */
  align?: Align | Align[];
  /** Minimum column widths (overridden upward by content). */
  minWidths?: number[];
  /** Maximum column widths — content is truncated with "…" if exceeded. */
  maxWidths?: number[];
  /** Padding spaces on each side of cell content (default: 1). */
  padding?: number;
  /** Render a separator row between every data row (default: false). */
  rowSeparators?: boolean;
}

function stringify(v: CellValue): string {
  if (v === null || v === undefined) return "";
  return String(v);
}

function truncate(s: string, max: number): string {
  if (visibleWidth(s) <= max) return s;
  let w = 0;
  let out = "";
  for (const ch of s) {
    const cp = ch.codePointAt(0) ?? 0;
    const cw = cp >= 0x1100 ? 2 : 1;
    if (w + cw + 1 > max) break;
    out += ch;
    w += cw;
  }
  return out + "…";
}

function resolveAlign(align: Align | Align[] | undefined, colCount: number): Align[] {
  if (!align) return Array(colCount).fill("left");
  if (typeof align === "string") return Array(colCount).fill(align);
  const result: Align[] = [];
  for (let i = 0; i < colCount; i++) result.push(align[i] ?? "left");
  return result;
}

export function fmtable(rows: CellValue[][], options: FormatOptions = {}): string {
  const {
    headers,
    style = "rounded",
    align,
    minWidths = [],
    maxWidths = [],
    padding = 1,
    rowSeparators = false,
  } = options;

  const border = STYLES[style];
  const pad = " ".repeat(padding);

  const dataRows: string[][] = rows.map((r) => r.map(stringify));

  const colCount = Math.max(
    headers?.length ?? 0,
    ...dataRows.map((r) => r.length),
    0,
  );
  if (colCount === 0) return "";

  const filled = dataRows.map((r) => {
    const out = [...r];
    while (out.length < colCount) out.push("");
    return out;
  });

  const widths: number[] = Array(colCount).fill(0);
  if (headers) {
    for (let c = 0; c < colCount; c++) {
      widths[c] = Math.max(widths[c], visibleWidth(headers[c] ?? ""));
    }
  }
  for (const row of filled) {
    for (let c = 0; c < colCount; c++) {
      widths[c] = Math.max(widths[c]!, visibleWidth(row[c]!));
    }
  }
  for (let c = 0; c < colCount; c++) {
    if (minWidths[c] !== undefined) widths[c] = Math.max(widths[c]!, minWidths[c]!);
    if (maxWidths[c] !== undefined) widths[c] = Math.min(widths[c]!, maxWidths[c]!);
  }

  const aligns = resolveAlign(align, colCount);

  function applyAlign(s: string, col: number): string {
    const w = widths[col]!;
    const trunc = maxWidths[col] !== undefined ? truncate(s, maxWidths[col]!) : s;
    switch (aligns[col]) {
      case "right":  return padStart(trunc, w);
      case "center": return center(trunc, w);
      default:       return padEnd(trunc, w);
    }
  }

  function hRule(left: string, fill: string, mid: string, right: string): string {
    if (!fill) return "";
    const inner = widths.map((w) => fill.repeat(w + padding * 2));
    return left + inner.join(mid) + right;
  }

  function renderRow(cells: string[], sep: string, l: string, r: string): string {
    const inner = cells.map((c, i) => pad + applyAlign(c, i) + pad).join(sep);
    return l + inner + r;
  }

  const lines: string[] = [];

  function pushRule(left: string, fill: string, mid: string, right: string): void {
    const rule = hRule(left, fill, mid, right);
    if (rule) lines.push(rule);
  }

  // Top border
  pushRule(border.topLeft, border.top, border.topMid, border.topRight);

  if (headers) {
    lines.push(renderRow(headers, border.middle, border.left, border.right));
    pushRule(border.headerMidLeft, border.headerMid, border.headerMidMid, border.headerMidRight);
  }

  for (let r = 0; r < filled.length; r++) {
    lines.push(renderRow(filled[r]!, border.middle, border.left, border.right));
    if (rowSeparators && r < filled.length - 1) {
      pushRule(border.midLeft, border.mid, border.midMid, border.midRight);
    }
  }

  // Bottom border
  pushRule(border.bottomLeft, border.bottom, border.bottomMid, border.bottomRight);

  return lines.join("\n");
}
