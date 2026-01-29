import { useMemo } from "react";
import { List } from "lucide-react";

interface TableOfContentsProps {
  content: string;
}

const TableOfContents = ({ content }: TableOfContentsProps) => {
  const headings = useMemo(() => {
    const lines = content.split('\n');
    const toc: { level: number; text: string; id: string }[] = [];
    
    lines.forEach((line) => {
      const h2Match = line.match(/^## (.+)$/);
      const h3Match = line.match(/^### (.+)$/);
      
      if (h2Match) {
        const text = h2Match[1].trim();
        toc.push({ level: 2, text, id: text.toLowerCase().replace(/\s+/g, '-') });
      } else if (h3Match) {
        const text = h3Match[1].trim();
        toc.push({ level: 3, text, id: text.toLowerCase().replace(/\s+/g, '-') });
      }
    });
    
    return toc;
  }, [content]);

  if (headings.length < 3) return null;

  return (
    <div className="bg-muted/50 rounded-xl p-4 mb-6 border border-border">
      <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-foreground">
        <List className="w-4 h-4 text-primary" />
        <span>In This Article</span>
      </div>
      <nav className="space-y-1">
        {headings.map((heading, idx) => (
          <a
            key={idx}
            href={`#${heading.id}`}
            className={`block text-sm hover:text-primary transition-colors ${
              heading.level === 2 
                ? 'font-medium text-foreground' 
                : 'pl-4 text-muted-foreground'
            }`}
          >
            {heading.text}
          </a>
        ))}
      </nav>
    </div>
  );
};

export default TableOfContents;
