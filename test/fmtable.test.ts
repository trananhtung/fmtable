import { fmtable } from "../src/index.js";

describe("fmtable — basic rendering", () => {
  test("rounded style (default) with headers", () => {
    const out = fmtable(
      [[1, "Alice", true], [2, "Bob", false]],
      { headers: ["ID", "Name", "Active"] },
    );
    expect(out).toContain("╭");
    expect(out).toContain("╰");
    expect(out).toContain("ID");
    expect(out).toContain("Alice");
    expect(out).toContain("Bob");
    expect(out).toContain("false");
  });

  test("plain style — no borders, double-space separator", () => {
    const out = fmtable([[1, "a"], [2, "b"]], { style: "plain" });
    expect(out).not.toContain("│");
    expect(out).not.toContain("─");
    expect(out).toContain("1");
    expect(out).toContain("a");
  });

  test("grid style uses + and - and |", () => {
    const out = fmtable([[1, 2]], { style: "grid" });
    expect(out).toContain("+");
    expect(out).toContain("-");
    expect(out).toContain("|");
  });

  test("pipe style produces GitHub Markdown table", () => {
    const out = fmtable(
      [["foo", "bar"]],
      { style: "pipe", headers: ["A", "B"] },
    );
    expect(out).toContain("|");
    const rows = out.split("\n");
    // header + separator + data = 3 lines
    expect(rows.length).toBe(3);
    expect(rows[1]).toMatch(/\|.*-+.*\|/);
  });

  test("minimal style", () => {
    const out = fmtable([["x", "y"]], { style: "minimal" });
    expect(out).toContain("│");
  });

  test("simple style — dashes top/bottom and header sep", () => {
    const out = fmtable(
      [["a", "b"]],
      { style: "simple", headers: ["X", "Y"] },
    );
    const rows = out.split("\n");
    expect(rows.length).toBeGreaterThanOrEqual(3);
    expect(rows[0]).toMatch(/^-/);
  });
});

describe("fmtable — alignment", () => {
  test("right align pads left", () => {
    const out = fmtable([[1], [100]], { align: "right" });
    const lines = out.split("\n").filter((l) => l.includes("1"));
    // "  1" appears before "100"
    expect(out).toContain("  1");
  });

  test("center align", () => {
    const out = fmtable([["a"], ["hello"]], { align: "center" });
    expect(out).toContain("  a  ");
  });

  test("per-column align", () => {
    const out = fmtable(
      [["left", "right", "center"]],
      { align: ["left", "right", "center"] },
    );
    expect(out).toBeTruthy();
  });
});

describe("fmtable — column widths", () => {
  test("minWidths pads short columns", () => {
    const out = fmtable([["a"]], { minWidths: [10] });
    // column must be at least 10 wide
    const line = out.split("\n").find((l) => l.includes("a"))!;
    expect(line.length).toBeGreaterThanOrEqual(10);
  });

  test("maxWidths truncates long content with ellipsis", () => {
    const out = fmtable([["Hello, World!"]], { maxWidths: [8] });
    expect(out).toContain("…");
    expect(out).not.toContain("Hello, World!");
  });
});

describe("fmtable — cell values", () => {
  test("null and undefined render as empty string", () => {
    const out = fmtable([[null, undefined, 0]]);
    // Should not throw, should render 0
    expect(out).toContain("0");
  });

  test("booleans render as 'true'/'false'", () => {
    const out = fmtable([[true, false]]);
    expect(out).toContain("true");
    expect(out).toContain("false");
  });

  test("numbers render correctly", () => {
    const out = fmtable([[3.14, -7, 0]]);
    expect(out).toContain("3.14");
    expect(out).toContain("-7");
  });

  test("empty data returns empty string", () => {
    expect(fmtable([])).toBe("");
  });

  test("jagged rows padded with empty cells", () => {
    const out = fmtable([[1, 2, 3], [4]]);
    expect(out).toContain("1");
    expect(out).toContain("4");
  });
});

describe("fmtable — rowSeparators", () => {
  test("rowSeparators adds separator between rows", () => {
    const out = fmtable([[1, 2], [3, 4]], { style: "grid", rowSeparators: true });
    const lines = out.split("\n");
    // top + row1 + sep + row2 + bottom = 5
    expect(lines.length).toBe(5);
  });

  test("rowSeparators false — no extra separator", () => {
    const out = fmtable([[1, 2], [3, 4]], { style: "grid", rowSeparators: false });
    const lines = out.split("\n");
    // top + row1 + row2 + bottom = 4
    expect(lines.length).toBe(4);
  });
});

describe("fmtable — headers interaction", () => {
  test("header separator appears between header and data", () => {
    const out = fmtable([[1, "a"]], {
      headers: ["Num", "Val"],
      style: "grid",
    });
    const lines = out.split("\n");
    // top + header + sep + data + bottom = 5
    expect(lines.length).toBe(5);
    // separator line uses '=' for grid header
    expect(lines[2]).toMatch(/=/);
  });
});

describe("fmtable — padding", () => {
  test("padding=0 removes spaces", () => {
    const out = fmtable([["x"]], { style: "grid", padding: 0 });
    expect(out).toContain("|x|");
  });

  test("padding=2 doubles the spaces", () => {
    const out = fmtable([["x"]], { style: "grid", padding: 2 });
    expect(out).toContain("|  x  |");
  });
});
