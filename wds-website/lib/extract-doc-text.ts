import {
  Document,
  Block,
  Inline,
  Text,
  TopLevelBlock,
  BLOCKS,
} from "@contentful/rich-text-types";

type Node = Document | Block | Inline | Text | TopLevelBlock;

export function extractPlainText(node: Node): string {
  if (!node) return "";

  // Handle Text nodes
  if (node.nodeType === "text") {
    return node.value + " ";
  }

  // Nodes that contain children
  if ("content" in node && Array.isArray(node.content)) {
    return node.content
      .map((child: Node) => extractPlainText(child))
      .join(" ");
  }

  return "";
}

/**
 * Returns the plain text of each PARAGRAPH block in document order.
 * The indices match the `data-para-idx` attributes in the rendered DOM.
 */
export function extractParagraphTexts(doc: Document): string[] {
  const texts: string[] = [];

  function walk(node: Node) {
    if (!node) return;
    if ("nodeType" in node && node.nodeType === BLOCKS.PARAGRAPH) {
      texts.push(extractPlainText(node).replace(/\s+/g, " ").trim());
      return; // don't recurse into children — already extracted
    }
    if ("content" in node && Array.isArray(node.content)) {
      for (const child of node.content) {
        walk(child as Node);
      }
    }
  }

  walk(doc);
  return texts;
}
