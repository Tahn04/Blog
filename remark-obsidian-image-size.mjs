import { visit } from "unist-util-visit";

const ALIGN = ["left", "right", "center"];

export function remarkObsidianImageSize() {
  return (tree) => {
    visit(tree, "image", (node) => {
      if (!node.alt?.includes("|")) return;
      const parts = node.alt.split("|").map((p) => p.trim());
      const caption = parts[0];
      let width, height, align;

      for (const p of parts.slice(1)) {
        const sizeMatch = p.match(/^(\d+)(?:x(\d+))?$/i);
        if (sizeMatch) {
          width = sizeMatch[1];
          height = sizeMatch[2];
        } else if (ALIGN.includes(p.toLowerCase())) {
          align = p.toLowerCase();
        }
      }

      node.alt = caption;
      const style = [];
      if (width) style.push(`width:${width}px`);
      if (height) style.push(`height:${height}px`);
      if (align === "center") style.push("display:block", "margin-inline:auto");
      if (align === "left") style.push("float:left", "margin-right:1rem");
      if (align === "right") style.push("float:right", "margin-left:1rem");

      node.data ??= {};
      node.data.hProperties = { style: style.join(";") };
    });
  };
}
