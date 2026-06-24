export type StyleName = "plain" | "simple" | "grid" | "rounded" | "pipe" | "minimal";

export interface BorderStyle {
  topLeft: string;
  top: string;
  topMid: string;
  topRight: string;
  midLeft: string;
  mid: string;
  midMid: string;
  midRight: string;
  bottomLeft: string;
  bottom: string;
  bottomMid: string;
  bottomRight: string;
  left: string;
  right: string;
  middle: string;
  headerTopLeft: string;
  headerTop: string;
  headerTopMid: string;
  headerTopRight: string;
  headerMidLeft: string;
  headerMid: string;
  headerMidMid: string;
  headerMidRight: string;
}

const NONE = "";

export const STYLES: Record<StyleName, BorderStyle> = {
  plain: {
    topLeft: NONE, top: NONE, topMid: NONE, topRight: NONE,
    midLeft: NONE, mid: NONE, midMid: NONE, midRight: NONE,
    bottomLeft: NONE, bottom: NONE, bottomMid: NONE, bottomRight: NONE,
    left: NONE, right: NONE, middle: "  ",
    headerTopLeft: NONE, headerTop: NONE, headerTopMid: NONE, headerTopRight: NONE,
    headerMidLeft: NONE, headerMid: "-", headerMidMid: "  ", headerMidRight: NONE,
  },
  simple: {
    topLeft: NONE, top: "-", topMid: "  ", topRight: NONE,
    midLeft: NONE, mid: "-", midMid: "  ", midRight: NONE,
    bottomLeft: NONE, bottom: "-", bottomMid: "  ", bottomRight: NONE,
    left: NONE, right: NONE, middle: "  ",
    headerTopLeft: NONE, headerTop: "-", headerTopMid: "  ", headerTopRight: NONE,
    headerMidLeft: NONE, headerMid: "-", headerMidMid: "  ", headerMidRight: NONE,
  },
  grid: {
    topLeft: "+", top: "-", topMid: "+", topRight: "+",
    midLeft: "+", mid: "-", midMid: "+", midRight: "+",
    bottomLeft: "+", bottom: "-", bottomMid: "+", bottomRight: "+",
    left: "|", right: "|", middle: "|",
    headerTopLeft: "+", headerTop: "-", headerTopMid: "+", headerTopRight: "+",
    headerMidLeft: "+", headerMid: "=", headerMidMid: "+", headerMidRight: "+",
  },
  rounded: {
    topLeft: "╭", top: "─", topMid: "┬", topRight: "╮",
    midLeft: "├", mid: "─", midMid: "┼", midRight: "┤",
    bottomLeft: "╰", bottom: "─", bottomMid: "┴", bottomRight: "╯",
    left: "│", right: "│", middle: "│",
    headerTopLeft: "╭", headerTop: "─", headerTopMid: "┬", headerTopRight: "╮",
    headerMidLeft: "├", headerMid: "─", headerMidMid: "┼", headerMidRight: "┤",
  },
  pipe: {
    topLeft: NONE, top: NONE, topMid: NONE, topRight: NONE,
    midLeft: "|", mid: "-", midMid: "|", midRight: "|",
    bottomLeft: NONE, bottom: NONE, bottomMid: NONE, bottomRight: NONE,
    left: "|", right: "|", middle: "|",
    headerTopLeft: NONE, headerTop: NONE, headerTopMid: NONE, headerTopRight: NONE,
    headerMidLeft: "|", headerMid: "-", headerMidMid: "|", headerMidRight: "|",
  },
  minimal: {
    topLeft: NONE, top: NONE, topMid: NONE, topRight: NONE,
    midLeft: NONE, mid: NONE, midMid: NONE, midRight: NONE,
    bottomLeft: NONE, bottom: NONE, bottomMid: NONE, bottomRight: NONE,
    left: NONE, right: NONE, middle: " │ ",
    headerTopLeft: NONE, headerTop: NONE, headerTopMid: NONE, headerTopRight: NONE,
    headerMidLeft: NONE, headerMid: "─", headerMidMid: "─┼─", headerMidRight: NONE,
  },
};
