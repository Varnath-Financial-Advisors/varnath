import { Category, Article } from "@/data/knowledgeBaseData";
import ArticleCard from "./ArticleCard";
import { Badge } from "@/components/ui/badge";

interface CategorySectionProps {
  category: Category;
  onArticleClick: (article: Article, categoryName: string) => void;
}

const CategorySection = ({ category, onArticleClick }: CategorySectionProps) => {
  const articleCount = category.articles.length;
  
  return (
    <div className="relative">
      {/* Category header with enhanced styling */}
      <div className="flex items-center gap-4 mb-6 pb-4 border-b-2 border-primary/20">
        <div className="p-3 bg-primary/10 rounded-xl">
          {category.icon}
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-foreground">{category.category}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {articleCount} {articleCount === 1 ? 'article' : 'articles'} available
          </p>
        </div>
        <Badge variant="outline" className="hidden sm:flex">
          {category.id.toUpperCase()}
        </Badge>
      </div>
      
      {/* Articles grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {category.articles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            onClick={() => onArticleClick(article, category.category)}
          />
        ))}
      </div>
    </div>
  );
};

export default CategorySection;
