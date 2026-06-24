#!/usr/bin/env node
import { fmtable } from "../index.js";
import type { StyleName, Align } from "../index.js";
import { createReadStream } from "node:fs";
import { Readable } from "node:stream";

const STYLES = ["plain", "simple", "grid", "rounded", "pipe", "minimal"] as const;

function usage(): void {
  console.log(`
fmtable — ASCII/Unicode table formatter

USAGE
  fmtable [options] < data.json
  echo '[[1,"Alice"],[2,"Bob"]]' | fmtable --headers ID,Name

OPTIONS
  --style <name>     Border style: plain|simple|grid|rounded|pipe|minimal  (default: rounded)
  --headers <h,...>  Comma-separated header labels
  --align <a,...>    Per-column alignment: left|right|center  (default: left)
  --padding <n>      Cell padding spaces  (default: 1)
  --row-sep          Add separator between every data row
  --help             Show this help

INPUT
  JSON array of row arrays, read from stdin.
  e.g.  [[1, "Alice", true], [2, "Bob", false]]
`.trim());
}

function parseArgs(argv: string[]): {
  style: StyleName;
  headers?: string[];
  align?: Align[];
  padding: number;
  rowSep: boolean;
  help: boolean;
} {
  let style: StyleName = "rounded";
  let headers: string[] | undefined;
  let align: Align[] | undefined;
  let padding = 1;
  let rowSep = false;
  let help = false;
  const args = argv.slice(2);

  for (let i = 0; i < args.length; i++) {
    const a = args[i]!;
    switch (a) {
      case "--help": case "-h": help = true; break;
      case "--row-sep": rowSep = true; break;
      case "--style": {
        const v = args[++i];
        if (!v || !(STYLES as readonly string[]).includes(v)) {
          console.error(`fmtable: unknown style "${v}". Valid: ${STYLES.join(", ")}`);
          process.exit(1);
        }
        style = v as StyleName;
        break;
      }
      case "--headers": {
        const v = args[++i];
        if (!v) { console.error("fmtable: --headers requires a value"); process.exit(1); }
        headers = v.split(",");
        break;
      }
      case "--align": {
        const v = args[++i];
        if (!v) { console.error("fmtable: --align requires a value"); process.exit(1); }
        align = v.split(",") as Align[];
        break;
      }
      case "--padding": {
        const v = Number(args[++i]);
        if (isNaN(v) || v < 0) { console.error("fmtable: --padding requires a non-negative integer"); process.exit(1); }
        padding = v;
        break;
      }
      default:
        console.error(`fmtable: unknown option "${a}". Run fmtable --help`);
        process.exit(1);
    }
  }
  return { style, headers, align, padding, rowSep, help };
}

async function readStdin(): Promise<string> {
  const src = process.stdin.isTTY ? Readable.from([]) : process.stdin;
  const chunks: Buffer[] = [];
  for await (const chunk of src) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  return Buffer.concat(chunks).toString("utf8");
}

async function main(): Promise<void> {
  const opts = parseArgs(process.argv);
  if (opts.help) { usage(); process.exit(0); }

  const raw = await readStdin();
  if (!raw.trim()) { usage(); process.exit(0); }

  let rows: unknown;
  try {
    rows = JSON.parse(raw);
  } catch {
    console.error("fmtable: stdin must be valid JSON (array of row arrays)");
    process.exit(1);
  }

  if (!Array.isArray(rows)) {
    console.error("fmtable: JSON must be an array of row arrays");
    process.exit(1);
  }

  console.log(fmtable(rows as never[][], {
    style: opts.style,
    headers: opts.headers,
    align: opts.align,
    padding: opts.padding,
    rowSeparators: opts.rowSep,
  }));
}

main().catch((err: unknown) => {
  console.error("fmtable:", err instanceof Error ? err.message : String(err));
  process.exit(1);
});
