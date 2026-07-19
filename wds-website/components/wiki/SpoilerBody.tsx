"use client";

import { useState } from "react";
import { EyeOff } from "lucide-react";
import {
  documentToReactComponents,
  Options,
} from "@contentful/rich-text-react-renderer";
import { BLOCKS, Document } from "@contentful/rich-text-types";

const renderOptions: Options = {
  renderNode: {
    [BLOCKS.PARAGRAPH]: (_node, children) => (
      <p className="mb-4 leading-relaxed text-foreground/90">{children}</p>
    ),
    [BLOCKS.HEADING_2]: (_node, children) => (
      <h2 className="mb-3 mt-8 text-xl font-bold text-foreground">{children}</h2>
    ),
    [BLOCKS.HEADING_3]: (_node, children) => (
      <h3 className="mb-2 mt-6 text-lg font-semibold text-foreground">{children}</h3>
    ),
    [BLOCKS.QUOTE]: (_node, children) => (
      <blockquote className="my-6 border-l-4 border-primary-0/60 pl-4 italic text-wds-text-secondary">
        {children}
      </blockquote>
    ),
  },
};

// Spoiler content stays hidden behind a manual reveal toggle. The reader opts
// in explicitly — we don't gate on reading progress. Entries flagged without
// spoilers (`gated = false`) render their body straight away.
export function SpoilerBody({
  body,
  gated = true,
}: {
  body: Document;
  gated?: boolean;
}) {
  const [revealed, setRevealed] = useState(false);

  if (gated && !revealed) {
    return (
      <div className="rounded-xl border border-amber-500/40 bg-amber-500/5 p-6 text-center">
        <EyeOff className="mx-auto mb-3 h-6 w-6 text-amber-400" />
        <p className="mb-4 text-sm text-wds-text-secondary">
          This section contains spoilers from later in the story.
        </p>
        <button
          onClick={() => setRevealed(true)}
          className="rounded-full bg-amber-500 px-5 py-2 text-sm font-semibold text-gray-900 transition-transform hover:scale-105"
        >
          Reveal spoilers
        </button>
      </div>
    );
  }

  return (
    <div className="prose-invert max-w-none">
      {documentToReactComponents(body, renderOptions)}
    </div>
  );
}
