import { Category, Article } from "@/data/knowledgeBaseData";
import ArticleCard from "./ArticleCard";

interface CategorySectionProps {
  category: Category;
  onArticleClick: (article: Article, categoryName: string) => void;
}

const CategorySection = ({ category, onArticleClick }: CategorySectionProps) => {
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        {category.icon}
        <h2 className="text-2xl font-bold text-foreground">{category.category}</h2>
      </div>
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
