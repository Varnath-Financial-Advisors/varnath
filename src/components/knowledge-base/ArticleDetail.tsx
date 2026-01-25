import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, FileText, CheckSquare, FileSpreadsheet, Share2, Bookmark } from "lucide-react";
import { Article } from "@/data/knowledgeBaseData";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";

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

      <div className="mb-6">
        <Badge variant="outline" className="mb-3">
          {categoryName}
        </Badge>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          {article.title}
        </h1>
        <p className="text-lg text-muted-foreground mb-4">
          {article.summary}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {article.topics.map((topic, idx) => (
            <Badge key={idx} variant="secondary">
              {topic}
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm" onClick={handleBookmark}>
            <Bookmark className="w-4 h-4 mr-2" />
            Bookmark
          </Button>
        </div>
      </div>

      <Card className="mb-8">
        <CardContent className="pt-6 prose prose-slate dark:prose-invert max-w-none">
          <ReactMarkdown
            components={{
              table: ({ children }) => (
                <div className="overflow-x-auto my-4">
                  <table className="min-w-full border-collapse border border-border">
                    {children}
                  </table>
                </div>
              ),
              thead: ({ children }) => (
                <thead className="bg-muted">{children}</thead>
              ),
              th: ({ children }) => (
                <th className="border border-border px-4 py-2 text-left font-semibold">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="border border-border px-4 py-2">{children}</td>
              ),
              h2: ({ children }) => (
                <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">{children}</h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-xl font-semibold mt-6 mb-3 text-foreground">{children}</h3>
              ),
              p: ({ children }) => (
                <p className="mb-4 text-muted-foreground">{children}</p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc pl-6 mb-4 space-y-2">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal pl-6 mb-4 space-y-2">{children}</ol>
              ),
              li: ({ children }) => (
                <li className="text-muted-foreground">{children}</li>
              ),
              strong: ({ children }) => (
                <strong className="font-semibold text-foreground">{children}</strong>
              ),
            }}
          >
            {article.content}
          </ReactMarkdown>
        </CardContent>
      </Card>

      {article.downloadable && (
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              {getDownloadIcon(article.downloadable.type)}
              Downloadable Resource
            </CardTitle>
            <CardDescription>{article.downloadable.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleDownload} className="w-full sm:w-auto">
              <Download className="w-4 h-4 mr-2" />
              Download {article.downloadable.title}
            </Button>
          </CardContent>
        </Card>
      )}

      <Card className="mt-8 bg-primary text-primary-foreground">
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
