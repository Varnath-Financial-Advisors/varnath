import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, CheckSquare, FileSpreadsheet } from "lucide-react";
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

  return (
    <Card 
      className="hover:shadow-lg transition-shadow cursor-pointer group"
      onClick={onClick}
    >
      <CardHeader>
        <CardTitle className="text-xl group-hover:text-primary transition-colors">
          {article.title}
        </CardTitle>
        <CardDescription>{article.summary}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {article.topics.map((topic, topicIdx) => (
            <span
              key={topicIdx}
              className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full"
            >
              {topic}
            </span>
          ))}
        </div>
        
        {article.downloadable && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground border-t pt-3">
            {getDownloadIcon(article.downloadable.type)}
            <span className="font-medium">{article.downloadable.title}</span>
            <Badge variant="secondary" className="ml-auto text-xs">
              {article.downloadable.type.toUpperCase()}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ArticleCard;
