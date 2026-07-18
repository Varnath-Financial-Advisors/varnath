import React from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { GLOSSARY } from "@/data/glossary";

/** Regex matching any glossary term on word boundaries, longest terms first */
const termPattern = new RegExp(
  `\\b(${Object.keys(GLOSSARY)
    .sort((a, b) => b.length - a.length)
    .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|")})\\b`,
  "gi"
);

const lookup = new Map(Object.entries(GLOSSARY).map(([k, v]) => [k.toLowerCase(), v]));

const GlossaryTerm = ({ term, display }: { term: string; display: string }) => (
  <TooltipProvider delayDuration={150}>
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className="underline decoration-dotted decoration-primary/60 underline-offset-2 cursor-help bg-transparent p-0 border-0 font-inherit text-inherit hover:decoration-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded-sm"
          aria-label={`Definition of ${display}`}
        >
          {display}
        </button>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs" side="top">
        <p className="text-xs leading-relaxed">{lookup.get(term.toLowerCase())}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

/**
 * Wraps glossary terms found in plain-string children with an inline
 * definition tooltip. Only the first occurrence per text node is wrapped to
 * avoid visual noise. Non-string nodes are passed through untouched.
 */
export const withGlossary = (children: React.ReactNode): React.ReactNode => {
  const seen = new Set<string>();

  const processNode = (node: React.ReactNode, key: number): React.ReactNode => {
    if (typeof node !== "string") return node;

    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    termPattern.lastIndex = 0;
    while ((match = termPattern.exec(node)) !== null) {
      const canonical = match[1].toLowerCase();
      if (seen.has(canonical)) continue; // only first occurrence
      seen.add(canonical);
      parts.push(node.slice(lastIndex, match.index));
      parts.push(
        <GlossaryTerm key={`${key}-${match.index}`} term={match[1]} display={match[1]} />
      );
      lastIndex = match.index + match[1].length;
    }
    if (parts.length === 0) return node;
    parts.push(node.slice(lastIndex));
    return <React.Fragment key={key}>{parts}</React.Fragment>;
  };

  return React.Children.map(children, (child, i) => processNode(child, i));
};
