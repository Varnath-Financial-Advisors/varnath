import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, BookOpen, FileText, Building, Scale } from "lucide-react";

const KnowledgeBase = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const taxLaws = [
    {
      category: "Income Tax",
      icon: <FileText className="w-8 h-8 text-primary" />,
      articles: [
        {
          title: "Understanding Income Tax Slabs for FY 2024-25",
          summary: "Learn about the new and old tax regimes, applicable tax rates, and choose the best option for your income level.",
          topics: ["Tax Slabs", "New Tax Regime", "Deductions under 80C"]
        },
        {
          title: "TDS Provisions and Compliance",
          summary: "Comprehensive guide on Tax Deducted at Source (TDS), rates, filing requirements, and common scenarios.",
          topics: ["TDS on Salary", "Form 16", "Quarterly Returns"]
        },
        {
          title: "Capital Gains Tax Simplified",
          summary: "Understand short-term and long-term capital gains, exemptions, and tax implications on property and investments.",
          topics: ["LTCG", "STCG", "Section 54", "Indexation"]
        }
      ]
    },
    {
      category: "GST",
      icon: <Scale className="w-8 h-8 text-primary" />,
      articles: [
        {
          title: "GST Basics: Registration and Compliance",
          summary: "Everything you need to know about GST registration thresholds, filing deadlines, and compliance requirements.",
          topics: ["GST Registration", "GSTR-1", "GSTR-3B", "Input Tax Credit"]
        },
        {
          title: "Understanding GST Rates and HSN Codes",
          summary: "Guide to applicable GST rates across different goods and services, and how to determine the correct HSN/SAC codes.",
          topics: ["Tax Rates", "HSN Codes", "SAC Codes", "Exemptions"]
        },
        {
          title: "GST Return Filing Process",
          summary: "Step-by-step guide for filing various GST returns, reconciliation, and avoiding common mistakes.",
          topics: ["Monthly Returns", "Annual Returns", "GSTR-9", "E-way Bills"]
        }
      ]
    },
    {
      category: "Company Law",
      icon: <Building className="w-8 h-8 text-primary" />,
      articles: [
        {
          title: "Companies Act 2013: Key Provisions",
          summary: "Overview of the Companies Act, director responsibilities, board meetings, and statutory requirements.",
          topics: ["Director Duties", "Board Meetings", "AGM Requirements"]
        },
        {
          title: "MCA Annual Filing Requirements",
          summary: "Complete guide to mandatory annual filings including AOC-4, MGT-7, and ADT-1 with deadlines.",
          topics: ["AOC-4", "MGT-7", "MGT-14", "Due Dates"]
        },
        {
          title: "ROC Compliance Checklist",
          summary: "Essential checklist for maintaining compliance with Registrar of Companies (ROC) throughout the year.",
          topics: ["DIN eKYC", "DSC Renewal", "Form Filings", "Penalty Avoidance"]
        }
      ]
    },
    {
      category: "Business Laws",
      icon: <BookOpen className="w-8 h-8 text-primary" />,
      articles: [
        {
          title: "Choosing the Right Business Structure",
          summary: "Compare Proprietorship, Partnership, LLP, and Private Limited Company to choose the best structure for your business.",
          topics: ["Sole Proprietorship", "Partnership Firm", "LLP", "Pvt Ltd"]
        },
        {
          title: "MSME Registration Benefits",
          summary: "Learn about Udyam Registration, benefits for MSMEs, and how to apply for various government schemes.",
          topics: ["Udyam Registration", "MSME Benefits", "Priority Sector Lending"]
        },
        {
          title: "Foreign Exchange Management Act (FEMA)",
          summary: "Understand FEMA regulations for foreign investments, overseas remittances, and compliance requirements.",
          topics: ["FDI Rules", "ODI Guidelines", "FEMA Compliance"]
        }
      ]
    }
  ];

  const filteredContent = taxLaws.map(category => ({
    ...category,
    articles: category.articles.filter(article => 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.topics.some(topic => topic.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  })).filter(category => category.articles.length > 0);

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
              Simplified guides to Indian tax laws and business regulations. Navigate complex compliance with ease.
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
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-8">
              <TabsTrigger value="all">All Topics</TabsTrigger>
              <TabsTrigger value="income-tax">Income Tax</TabsTrigger>
              <TabsTrigger value="gst">GST</TabsTrigger>
              <TabsTrigger value="company">Company Law</TabsTrigger>
              <TabsTrigger value="business">Business Laws</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-8">
              {(searchQuery ? filteredContent : taxLaws).map((category, idx) => (
                <div key={idx}>
                  <div className="flex items-center gap-3 mb-4">
                    {category.icon}
                    <h2 className="text-2xl font-bold text-foreground">{category.category}</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {category.articles.map((article, articleIdx) => (
                      <Card key={articleIdx} className="hover:shadow-lg transition-shadow cursor-pointer">
                        <CardHeader>
                          <CardTitle className="text-xl">{article.title}</CardTitle>
                          <CardDescription>{article.summary}</CardDescription>
                        </CardHeader>
                        <CardContent>
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
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </TabsContent>

            {taxLaws.map((category, idx) => (
              <TabsContent 
                key={idx} 
                value={category.category.toLowerCase().replace(' ', '-')}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.articles.map((article, articleIdx) => (
                    <Card key={articleIdx} className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardHeader>
                        <CardTitle className="text-xl">{article.title}</CardTitle>
                        <CardDescription>{article.summary}</CardDescription>
                      </CardHeader>
                      <CardContent>
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
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>

          <Card className="mt-12 bg-primary text-primary-foreground">
            <CardHeader>
              <CardTitle className="text-2xl">Need Personalized Guidance?</CardTitle>
              <CardDescription className="text-primary-foreground/80">
                Our team of experts is ready to help you navigate complex tax and compliance matters
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
      </main>

      <Footer />
    </div>
  );
};

export default KnowledgeBase;
