import {
  Document,
  Block,
  Inline,
  Text,
  TopLevelBlock,
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
