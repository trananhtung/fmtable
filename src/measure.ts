// Strip ANSI escape codes before measuring width
const ANSI_RE = /\x1b\[[0-9;]*m/g;

export function visibleWidth(s: string): number {
  const stripped = s.replace(ANSI_RE, "");
  let w = 0;
  for (const cp of stripped) {
    const code = cp.codePointAt(0) ?? 0;
    // CJK wide characters occupy two columns
    if (isWide(code)) w += 2;
    else w += 1;
  }
  return w;
}

function isWide(cp: number): boolean {
  return (
    (cp >= 0x1100 && cp <= 0x115f) ||
    cp === 0x2329 || cp === 0x232a ||
    (cp >= 0x2e80 && cp <= 0x303e) ||
    (cp >= 0x3040 && cp <= 0xa4cf) ||
    (cp >= 0xa960 && cp <= 0xa97f) ||
    (cp >= 0xac00 && cp <= 0xd7a3) ||
    (cp >= 0xf900 && cp <= 0xfaff) ||
    (cp >= 0xfe10 && cp <= 0xfe19) ||
    (cp >= 0xfe30 && cp <= 0xfe6f) ||
    (cp >= 0xff01 && cp <= 0xff60) ||
    (cp >= 0xffe0 && cp <= 0xffe6) ||
    (cp >= 0x1b000 && cp <= 0x1b0ff) ||
    (cp >= 0x1f004 && cp <= 0x1f0cf) ||
    (cp >= 0x1f300 && cp <= 0x1f9ff) ||
    (cp >= 0x20000 && cp <= 0x2fffd) ||
    (cp >= 0x30000 && cp <= 0x3fffd)
  );
}

export function padEnd(s: string, targetWidth: number, fill = " "): string {
  const w = visibleWidth(s);
  const pad = Math.max(0, targetWidth - w);
  return s + fill.repeat(pad);
}

export function padStart(s: string, targetWidth: number, fill = " "): string {
  const w = visibleWidth(s);
  const pad = Math.max(0, targetWidth - w);
  return fill.repeat(pad) + s;
}

export function center(s: string, targetWidth: number, fill = " "): string {
  const w = visibleWidth(s);
  const total = Math.max(0, targetWidth - w);
  const left = Math.floor(total / 2);
  const right = total - left;
  return fill.repeat(left) + s + fill.repeat(right);
}
