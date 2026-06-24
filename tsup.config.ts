import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "bin/fmtable": "src/bin/fmtable.ts",
  },
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  sourcemap: true,
  target: "es2020",
  banner: ({ format }) =>
    format === "cjs" ? {} : {},
});
