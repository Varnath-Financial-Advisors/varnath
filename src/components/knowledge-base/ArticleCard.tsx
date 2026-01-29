import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, CheckSquare, FileSpreadsheet, Clock, ArrowRight, Sparkles } from "lucide-react";
import { Article } from "@/data/knowledgeBaseData";

interface ArticleCardProps {
  article: Article;
  onClick: () => void;
}

const ArticleCard = ({ article, onClick }: ArticleCardProps) => {
  const getDownloadIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="w-4 h-4" />;
      case "checklist":
        return <CheckSquare className="w-4 h-4" />;
      case "template":
        return <FileSpreadsheet className="w-4 h-4" />;
      default:
        return <Download className="w-4 h-4" />;
    }
  };

  // Estimate reading time based on content length
  const estimateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return minutes;
  };

  const readingTime = estimateReadingTime(article.content);

  // Check if article has tables (numerical data)
  const hasTables = article.content.includes('|');
  
  return (
    <Card 
      className="hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 cursor-pointer group border-2 hover:border-primary/30 relative overflow-hidden"
      onClick={onClick}
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <CardHeader className="relative pb-2">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>{readingTime} min read</span>
          </div>
          {hasTables && (
            <Badge variant="outline" className="text-xs bg-accent/20 border-accent">
              <Sparkles className="w-3 h-3 mr-1" />
              With Data Tables
            </Badge>
          )}
        </div>
        <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-2">
          {article.title}
        </CardTitle>
        <CardDescription className="line-clamp-2">{article.summary}</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4 relative">
        <div className="flex flex-wrap gap-2">
          {article.topics.slice(0, 3).map((topic, topicIdx) => (
            <span
              key={topicIdx}
              className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium"
            >
              {topic}
            </span>
          ))}
          {article.topics.length > 3 && (
            <span className="text-xs text-muted-foreground px-2 py-1">
              +{article.topics.length - 3} more
            </span>
          )}
        </div>
        
        {article.downloadable && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground border-t border-border/50 pt-3">
            <div className="p-1.5 bg-primary/10 rounded-md text-primary">
              {getDownloadIcon(article.downloadable.type)}
            </div>
            <span className="font-medium truncate flex-1">{article.downloadable.title}</span>
            <Badge variant="secondary" className="text-xs shrink-0">
              {article.downloadable.type.toUpperCase()}
            </Badge>
          </div>
        )}

        {/* Read more indicator */}
        <div className="flex items-center gap-1 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity pt-2">
          <span>Read article</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </CardContent>
    </Card>
  );
};

export default ArticleCard;
