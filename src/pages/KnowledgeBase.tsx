import { useState, useMemo } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { taxLaws, Article, Category } from "@/data/knowledgeBaseData";
import ArticleCard from "@/components/knowledge-base/ArticleCard";
import ArticleDetail from "@/components/knowledge-base/ArticleDetail";
import CategorySection from "@/components/knowledge-base/CategorySection";

const KnowledgeBase = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArticle, setSelectedArticle] = useState<{
    article: Article;
    categoryName: string;
  } | null>(null);

  const filteredContent = useMemo(() => {
    if (!searchQuery) return taxLaws;
    
    return taxLaws
      .map((category) => ({
        ...category,
        articles: category.articles.filter(
          (article) =>
            article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
            article.topics.some((topic) =>
              topic.toLowerCase().includes(searchQuery.toLowerCase())
            )
        ),
      }))
      .filter((category) => category.articles.length > 0);
  }, [searchQuery]);

  const handleArticleClick = (article: Article, categoryName: string) => {
    setSelectedArticle({ article, categoryName });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setSelectedArticle(null);
  };

  if (selectedArticle) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-grow pt-24 pb-16 px-4">
          <div className="container mx-auto">
            <ArticleDetail
              article={selectedArticle.article}
              categoryName={selectedArticle.categoryName}
              onBack={handleBack}
            />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-grow pt-24 pb-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              Knowledge Base
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Simplified guides to Indian tax laws and business regulations.
              Navigate complex compliance with ease.
            </p>

            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for tax laws, compliance topics, or regulations..."
                className="pl-10 py-6 text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="flex flex-wrap h-auto gap-2 mb-8 bg-transparent">
              <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                All Topics
              </TabsTrigger>
              {taxLaws.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  {category.category}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="all" className="space-y-12">
              {filteredContent.map((category) => (
                <CategorySection
                  key={category.id}
                  category={category}
                  onArticleClick={handleArticleClick}
                />
              ))}
            </TabsContent>

            {taxLaws.map((category) => (
              <TabsContent key={category.id} value={category.id} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.articles.map((article) => (
                    <ArticleCard
                      key={article.id}
                      article={article}
                      onClick={() => handleArticleClick(article, category.category)}
                    />
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>

          <Card className="mt-12 bg-primary text-primary-foreground">
            <CardHeader>
              <CardTitle className="text-2xl">Need Personalized Guidance?</CardTitle>
              <CardDescription className="text-primary-foreground/80">
                Our team of experts is ready to help you navigate complex tax and
                compliance matters
              </CardDescription>
            </CardHeader>
            <CardContent>
              <a
                href={`${import.meta.env.BASE_URL}#contact`}
                className="inline-block bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Schedule a Consultation
              </a>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default KnowledgeBase;
