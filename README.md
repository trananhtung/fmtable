# fmtable

<!-- ALL-CONTRIBUTORS-BADGE:START --><!-- ALL-CONTRIBUTORS-BADGE:END -->
[![npm version](https://img.shields.io/npm/v/fmtable.svg)](https://www.npmjs.com/package/fmtable)
[![npm downloads](https://img.shields.io/npm/dm/fmtable.svg)](https://www.npmjs.com/package/fmtable)
[![CI](https://img.shields.io/github/actions/workflow/status/trananhtung/fmtable/ci.yml?branch=main)](https://github.com/trananhtung/fmtable/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Zero-dependency ASCII/Unicode table formatter for Node.js, Deno, and browsers.**

Inspired by Python's [`tabulate`](https://github.com/astanin/python-tabulate) and Go's [`tablewriter`](https://github.com/olekukonko/tablewriter) — now in pure TypeScript with no runtime dependencies.

```
╭────┬────────────────────┬────────────╮
│ ID │ Name               │ Downloads  │
├────┼────────────────────┼────────────┤
│  1 │ fmtable            │  1,200,000 │
│  2 │ cli-table3         │    900,000 │
│  3 │ tabulate (Python)  │  3,000,000 │
╰────┴────────────────────┴────────────╯
```

## Features

- **6 border styles** — `plain`, `simple`, `grid`, `rounded`, `pipe` (GitHub Markdown), `minimal`
- **Per-column alignment** — `left`, `right`, `center`
- **Auto-width calculation** — fits content, respects `minWidths` / `maxWidths`
- **ANSI-aware** — strips escape codes before measuring width
- **CJK-aware** — correct double-width character handling
- **Row separators** — optional separator between every data row
- **Cell truncation** — truncates overflowed cells with `…`
- **CLI included** — pipe JSON arrays straight from the shell

## Install

```bash
npm install fmtable
```

## Usage

```ts
import { fmtable } from "fmtable";

const table = fmtable(
  [
    [1, "Alice",  "Engineering"],
    [2, "Bob",    "Design"],
    [3, "Carol",  "Marketing"],
  ],
  {
    headers: ["ID", "Name", "Department"],
    style:   "rounded",              // default
    align:   ["right", "left", "left"],
    padding: 1,                      // default
  },
);

console.log(table);
```

Output:

```
╭────┬───────┬─────────────╮
│ ID │ Name  │ Department  │
├────┼───────┼─────────────┤
│  1 │ Alice │ Engineering │
│  2 │ Bob   │ Design      │
│  3 │ Carol │ Marketing   │
╰────┴───────┴─────────────╯
```

## Styles

| Name | Example |
|------|---------|
| `plain` | whitespace-separated, no borders |
| `simple` | dashes as top/bottom/header separators |
| `grid` | `+--+--+` box-drawing |
| `rounded` | `╭──╮` Unicode rounded corners (default) |
| `pipe` | `\| --- \|` GitHub Markdown tables |
| `minimal` | `│` column separators only |

```ts
fmtable(rows, { style: "grid" });
// +---+-------+
// | 1 | Alice |
// +---+-------+
// | 2 | Bob   |
// +---+-------+

fmtable(rows, { style: "pipe", headers: ["ID", "Name"] });
// | ID | Name  |
// |----|-------|
// | 1  | Alice |
// | 2  | Bob   |
```

## API

### `fmtable(rows, options?)`

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `rows` | `CellValue[][]` | — | 2-D array of rows |
| `options.headers` | `string[]` | — | Column header labels |
| `options.style` | `StyleName` | `"rounded"` | Border style |
| `options.align` | `Align \| Align[]` | `"left"` | Per-column or global alignment |
| `options.padding` | `number` | `1` | Spaces on each side of content |
| `options.minWidths` | `number[]` | `[]` | Minimum column widths |
| `options.maxWidths` | `number[]` | `[]` | Maximum column widths (truncates with `…`) |
| `options.rowSeparators` | `boolean` | `false` | Add separator between every row |

`CellValue` is `string | number | boolean | null | undefined`.  
`Align` is `"left" | "right" | "center"`.  
`StyleName` is `"plain" | "simple" | "grid" | "rounded" | "pipe" | "minimal"`.

## CLI

```bash
# Pipe a JSON array of row arrays
echo '[[1,"Alice","Engineering"],[2,"Bob","Design"]]' \
  | fmtable --headers ID,Name,Department --style grid

# Or from a file
cat data.json | fmtable --style pipe --align right,left,left
```

Options: `--style`, `--headers`, `--align`, `--padding`, `--row-sep`, `--help`.

## vs. alternatives

| Package | Zero-dep | TypeScript | Styles | CJK | ANSI | CLI |
|---------|----------|------------|--------|-----|------|-----|
| **fmtable** | ✅ | ✅ | 6 | ✅ | ✅ | ✅ |
| cli-table3 | ❌ | partial | 3 | ❌ | ✅ | ❌ |
| table | ❌ | ✅ | 1 | ❌ | ✅ | ❌ |
| text-table | ✅ | ❌ | 1 | ❌ | ❌ | ❌ |
| columnify | ✅ | ❌ | 1 | ❌ | ❌ | ❌ |

## Contributors ✨

Contributions of any kind are welcome! See the [contributing guide](https://github.com/all-contributors/all-contributors) and add yourself via `@all-contributors please add @<username> for <contributions>`.

<!-- ALL-CONTRIBUTORS-LIST:START --><!-- ALL-CONTRIBUTORS-LIST:END -->

## License

MIT © [trananhtung](https://github.com/trananhtung)
