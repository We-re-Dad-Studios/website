// lib/highlight-dom.ts
// DOM range walking for text-selection highlights in the chapter reader.
// Highlights are stored as { paragraphIndex, startOffset, endOffset } relative
// to a paragraph's concatenated text content — stable across React re-renders.

import type { Bookmark, HighlightColor } from "./reader-storage";

/**
 * Given a selection anchored inside an article element, return paragraph-local
 * offsets so we can persist and re-apply the highlight later. Returns null if
 * the selection is empty, collapsed, or crosses multiple paragraphs.
 */
export function describeSelection(
  article: HTMLElement,
  selection: Selection
): {
  paragraphIndex: number;
  startOffset: number;
  endOffset: number;
  text: string;
  rect: DOMRect;
} | null {
  if (selection.isCollapsed || selection.rangeCount === 0) return null;

  const range = selection.getRangeAt(0);
  if (!article.contains(range.commonAncestorContainer)) return null;

  const startPara = findParagraph(range.startContainer);
  const endPara = findParagraph(range.endContainer);
  if (!startPara || startPara !== endPara) return null;

  const paragraphIndex = Number(startPara.dataset.paraIdx);
  if (Number.isNaN(paragraphIndex)) return null;

  const startOffset = offsetWithinParagraph(startPara, range.startContainer, range.startOffset);
  const endOffset = offsetWithinParagraph(startPara, range.endContainer, range.endOffset);
  if (startOffset === null || endOffset === null || endOffset <= startOffset) return null;

  const text = range.toString();
  const rect = range.getBoundingClientRect();
  return { paragraphIndex, startOffset, endOffset, text, rect };
}

/**
 * Re-apply every highlight bookmark to the article DOM. Safe to call whenever
 * the article re-renders — it first unwraps any stale spans we had wrapped on
 * a previous pass.
 */
export function applyHighlights(article: HTMLElement, bookmarks: Bookmark[]) {
  // Unwrap stale highlights from prior renders.
  article.querySelectorAll("span[data-wds-highlight-id]").forEach((el) => {
    const parent = el.parentNode;
    if (!parent) return;
    while (el.firstChild) parent.insertBefore(el.firstChild, el);
    parent.removeChild(el);
    parent.normalize?.();
  });

  // Apply each highlight. Paragraph-level bookmarks are not rendered in DOM.
  for (const h of bookmarks) {
    if (h.type !== "highlight") continue;
    if (h.startOffset === undefined || h.endOffset === undefined) continue;
    const p = article.querySelector<HTMLElement>(
      `[data-para-idx="${h.paragraphIndex}"]`
    );
    if (!p) continue;

    const range = rangeFromOffsets(p, h.startOffset, h.endOffset);
    if (!range) continue;

    wrapRange(range, h.color, h.id);
  }
}

function findParagraph(node: Node): HTMLElement | null {
  let cur: Node | null = node;
  while (cur) {
    if (cur.nodeType === 1) {
      const el = cur as HTMLElement;
      if (el.dataset && el.dataset.paraIdx !== undefined) return el;
    }
    cur = cur.parentNode;
  }
  return null;
}

function offsetWithinParagraph(
  paragraph: HTMLElement,
  node: Node,
  offsetInNode: number
): number | null {
  let total = 0;
  const walker = document.createTreeWalker(paragraph, NodeFilter.SHOW_TEXT);
  let tn: Node | null;
  while ((tn = walker.nextNode())) {
    if (tn === node) return total + offsetInNode;
    total += (tn.textContent ?? "").length;
  }
  // Fallback: node might be the paragraph itself or an element child —
  // in that case the offset refers to child index, not a character index.
  if (node === paragraph) {
    let running = 0;
    for (let i = 0; i < offsetInNode && i < paragraph.childNodes.length; i++) {
      running += (paragraph.childNodes[i].textContent ?? "").length;
    }
    return running;
  }
  return null;
}

function rangeFromOffsets(
  paragraph: HTMLElement,
  start: number,
  end: number
): Range | null {
  const walker = document.createTreeWalker(paragraph, NodeFilter.SHOW_TEXT);
  let offset = 0;
  let startNode: Text | null = null;
  let startLocal = 0;
  let endNode: Text | null = null;
  let endLocal = 0;

  let tn: Node | null;
  while ((tn = walker.nextNode())) {
    const len = (tn.textContent ?? "").length;
    if (!startNode && offset + len >= start) {
      startNode = tn as Text;
      startLocal = start - offset;
    }
    if (offset + len >= end) {
      endNode = tn as Text;
      endLocal = end - offset;
      break;
    }
    offset += len;
  }
  if (!startNode || !endNode) return null;
  try {
    const range = document.createRange();
    range.setStart(startNode, Math.max(0, Math.min(startLocal, startNode.length)));
    range.setEnd(endNode, Math.max(0, Math.min(endLocal, endNode.length)));
    return range;
  } catch {
    return null;
  }
}

/**
 * Wrap a range in a span. Uses surroundContents when possible, falls back to
 * walking text nodes within the range for cross-element selections.
 */
function wrapRange(range: Range, color: HighlightColor, id: string) {
  const className = `wds-highlight wds-highlight-${color}`;
  try {
    const span = document.createElement("span");
    span.className = className;
    span.dataset.wdsHighlightId = id;
    range.surroundContents(span);
    return;
  } catch {
    // Range crosses element boundaries — walk text nodes within the range.
    const textNodes = collectTextNodesInRange(range);
    for (const tn of textNodes) {
      const span = document.createElement("span");
      span.className = className;
      span.dataset.wdsHighlightId = id;
      const parent = tn.parentNode;
      if (!parent) continue;
      parent.insertBefore(span, tn);
      span.appendChild(tn);
    }
  }
}

function collectTextNodesInRange(range: Range): Text[] {
  const result: Text[] = [];
  const walker = document.createTreeWalker(
    range.commonAncestorContainer,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode(node) {
        const nr = document.createRange();
        nr.selectNodeContents(node);
        if (
          range.compareBoundaryPoints(Range.END_TO_START, nr) < 0 &&
          range.compareBoundaryPoints(Range.START_TO_END, nr) > 0
        ) {
          return NodeFilter.FILTER_ACCEPT;
        }
        return NodeFilter.FILTER_REJECT;
      },
    }
  );
  let n: Node | null;
  while ((n = walker.nextNode())) result.push(n as Text);
  return result;
}
