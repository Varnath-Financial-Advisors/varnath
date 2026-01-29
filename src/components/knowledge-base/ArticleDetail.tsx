import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, FileText, CheckSquare, FileSpreadsheet, Share2, Bookmark, Clock, Calendar, Printer } from "lucide-react";
import { Article } from "@/data/knowledgeBaseData";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import TableOfContents from "./TableOfContents";
import KeyTakeaways from "./KeyTakeaways";

interface ArticleDetailProps {
  article: Article;
  categoryName: string;
  onBack: () => void;
}

const ArticleDetail = ({ article, categoryName, onBack }: ArticleDetailProps) => {
  const getDownloadIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="w-5 h-5" />;
      case "checklist":
        return <CheckSquare className="w-5 h-5" />;
      case "template":
        return <FileSpreadsheet className="w-5 h-5" />;
      default:
        return <Download className="w-5 h-5" />;
    }
  };

  // Estimate reading time
  const estimateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  const readingTime = estimateReadingTime(article.content);
  const tableCount = (article.content.match(/\|.*\|/g) || []).length / 3; // Rough estimate

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  const handleBookmark = () => {
    toast.success("Article bookmarked!");
  };

  const handleDownload = () => {
    toast.info("This resource will be available soon. Contact us for immediate assistance.");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-6 hover:bg-primary/10"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Knowledge Base
      </Button>

      {/* Article Header */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <Badge variant="outline" className="bg-primary/10 border-primary/30">
            {categoryName}
          </Badge>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{readingTime} min read</span>
          </div>
          {tableCount > 0 && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <FileSpreadsheet className="w-4 h-4" />
              <span>{Math.round(tableCount)} tables</span>
            </div>
          )}
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>FY 2024-25</span>
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          {article.title}
        </h1>
        <p className="text-lg text-muted-foreground mb-6">
          {article.summary}
        </p>

        {/* Topics */}
        <div className="flex flex-wrap gap-2 mb-6">
          {article.topics.map((topic, idx) => (
            <Badge key={idx} variant="secondary" className="bg-secondary/80">
              {topic}
            </Badge>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm" onClick={handleBookmark}>
            <Bookmark className="w-4 h-4 mr-2" />
            Bookmark
          </Button>
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
        </div>
      </div>

      {/* Key Takeaways */}
      <KeyTakeaways content={article.content} title={article.title} />

      {/* Table of Contents */}
      <TableOfContents content={article.content} />

      {/* Article Content */}
      <Card className="mb-8 border-2">
        <CardContent className="pt-6 prose prose-slate dark:prose-invert max-w-none">
          <ReactMarkdown
            components={{
              table: ({ children }) => (
                <div className="overflow-x-auto my-6 rounded-xl border-2 border-primary/20 shadow-md bg-card">
                  <table className="min-w-full divide-y divide-border">
                    {children}
                  </table>
                </div>
              ),
              thead: ({ children }) => (
                <thead className="bg-primary text-primary-foreground">{children}</thead>
              ),
              tr: ({ children }) => (
                <tr className="border-b border-border last:border-0 hover:bg-primary/5 transition-colors even:bg-muted/30">
                  {children}
                </tr>
              ),
              th: ({ children }) => (
                <th className="px-4 py-3 text-left text-sm font-bold uppercase tracking-wider whitespace-nowrap">
                  {children}
                </th>
              ),
              td: ({ children }) => {
                const content = String(children);
                // Highlight currency values
                const isCurrency = /₹[\d,]+/.test(content);
                // Highlight percentages
                const isPercentage = /\d+%/.test(content);
                // Highlight important keywords
                const isImportant = /(Mandatory|Required|Nil|Exempt|No limit)/i.test(content);
                // Highlight dates
                const isDate = /(January|February|March|April|May|June|July|August|September|October|November|December|\d{1,2}(st|nd|rd|th))/i.test(content);
                
                let className = "px-4 py-3 text-sm whitespace-nowrap";
                if (isCurrency) {
                  className += " font-bold text-primary";
                } else if (isPercentage) {
                  className += " font-semibold text-accent-foreground bg-accent/20 rounded";
                } else if (isImportant) {
                  className += " font-medium text-primary";
                } else if (isDate) {
                  className += " font-medium text-foreground";
                } else {
                  className += " text-foreground";
                }
                
                return (
                  <td className={className}>
                    <span className="inline-flex items-center">
                      {children}
                    </span>
                  </td>
                );
              },
              h2: ({ children }) => {
                const id = String(children).toLowerCase().replace(/\s+/g, '-');
                return (
                  <h2 id={id} className="text-2xl font-bold mt-8 mb-4 text-foreground border-b-2 border-primary/30 pb-2 scroll-mt-24">
                    {children}
                  </h2>
                );
              },
              h3: ({ children }) => {
                const id = String(children).toLowerCase().replace(/\s+/g, '-');
                return (
                  <h3 id={id} className="text-xl font-semibold mt-6 mb-3 text-primary flex items-center gap-2 scroll-mt-24">
                    <span className="w-1 h-6 bg-primary rounded-full"></span>
                    {children}
                  </h3>
                );
              },
              p: ({ children }) => (
                <p className="mb-4 text-muted-foreground leading-relaxed">{children}</p>
              ),
              ul: ({ children }) => (
                <ul className="list-none pl-0 mb-4 space-y-2">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal pl-6 mb-4 space-y-2">{children}</ol>
              ),
              li: ({ children }) => (
                <li className="text-muted-foreground leading-relaxed flex items-start gap-2">
                  <span className="text-primary mt-1.5 shrink-0">•</span>
                  <span>{children}</span>
                </li>
              ),
              strong: ({ children }) => (
                <strong className="font-semibold text-foreground bg-primary/10 px-1 rounded">{children}</strong>
              ),
              code: ({ children }) => (
                <code className="bg-muted px-2 py-1 rounded text-sm font-mono text-primary">{children}</code>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-primary pl-4 py-2 my-4 bg-primary/5 rounded-r-lg italic text-muted-foreground">
                  {children}
                </blockquote>
              ),
              hr: () => (
                <hr className="my-8 border-t-2 border-primary/20" />
              ),
            }}
          >
            {article.content}
          </ReactMarkdown>
        </CardContent>
      </Card>

      {/* Downloadable Resource */}
      {article.downloadable && (
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-lg">
                {getDownloadIcon(article.downloadable.type)}
              </div>
              <div>
                <span className="text-lg">Downloadable Resource</span>
                <Badge variant="secondary" className="ml-3">
                  {article.downloadable.type.toUpperCase()}
                </Badge>
              </div>
            </CardTitle>
            <CardDescription className="text-base">{article.downloadable.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleDownload} size="lg" className="w-full sm:w-auto">
              <Download className="w-4 h-4 mr-2" />
              Download {article.downloadable.title}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* CTA Card */}
      <Card className="bg-primary text-primary-foreground">
        <CardHeader>
          <CardTitle className="text-xl">Need Expert Assistance?</CardTitle>
          <CardDescription className="text-primary-foreground/80">
            Our team can help you navigate these regulations with personalized guidance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <a
            href="/#contact"
            className="inline-block bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Schedule a Consultation
          </a>
        </CardContent>
      </Card>
    </div>
  );
};

export default ArticleDetail;
