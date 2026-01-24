import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Calculator, Building2, Users, Shield, TrendingUp, FileCheck, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";

const ServicesPage = () => {
  const services = [
    {
      icon: <FileText className="w-12 h-12 text-primary" />,
      title: "Tax Filing & Advisory",
      description: "Expert assistance with direct and indirect tax filings including Income Tax, GST, and TDS. Strategic tax planning to optimize your tax liability.",
      features: [
        "Income Tax Returns (ITR-1 to ITR-7)",
        "GST Registration & Monthly/Quarterly Filing",
        "TDS Return Filing & Compliance",
        "Tax Planning & Optimization Strategies",
        "Advance Tax Computation",
        "Tax Audit under Section 44AB",
      ],
    },
    {
      icon: <Calculator className="w-12 h-12 text-primary" />,
      title: "Virtual CFO Services",
      description: "Get C-suite financial expertise without the overhead. We provide strategic financial management and insights for growing businesses.",
      features: [
        "Financial Planning & Analysis",
        "Budgeting & Forecasting",
        "Cash Flow Management",
        "Management Reporting (MIS)",
        "Investor Relations & Reporting",
        "Financial Strategy Consulting",
      ],
    },
    {
      icon: <Building2 className="w-12 h-12 text-primary" />,
      title: "MCA & ROC Compliance",
      description: "Comprehensive compliance solutions for company law requirements. Stay compliant with MCA regulations and avoid penalties.",
      features: [
        "Annual Filing (AOC-4, MGT-7, MGT-7A)",
        "Board Meeting Compliance",
        "DIN & DSC Services",
        "Company Incorporation (Pvt Ltd, LLP, OPC)",
        "Change in Directors/Registered Office",
        "Increase in Authorized Capital",
      ],
    },
    {
      icon: <Users className="w-12 h-12 text-primary" />,
      title: "Business Advisory",
      description: "Strategic guidance to help your business grow. From startup consulting to expansion planning, we're with you every step.",
      features: [
        "Business Structure Planning",
        "Financial Due Diligence",
        "Regulatory Advisory",
        "Risk Management",
        "Business Valuation",
        "Merger & Acquisition Support",
      ],
    },
    {
      icon: <Shield className="w-12 h-12 text-primary" />,
      title: "Audit & Assurance",
      description: "Independent and thorough audit services to ensure accuracy and compliance of your financial statements.",
      features: [
        "Statutory Audit",
        "Internal Audit",
        "Tax Audit",
        "GST Audit",
        "Stock Audit",
        "Concurrent Audit",
      ],
    },
    {
      icon: <TrendingUp className="w-12 h-12 text-primary" />,
      title: "Startup Services",
      description: "Specialized services for startups from incorporation to fundraising. We understand the unique needs of new ventures.",
      features: [
        "Startup India Registration",
        "DPIIT Recognition",
        "ESOP Structuring",
        "Pitch Deck Financial Modeling",
        "Seed Funding Documentation",
        "Compliance Calendar Management",
      ],
    },
    {
      icon: <FileCheck className="w-12 h-12 text-primary" />,
      title: "Registration Services",
      description: "Hassle-free registration and licensing services for businesses of all sizes across India.",
      features: [
        "MSME/Udyam Registration",
        "Import Export Code (IEC)",
        "Professional Tax Registration",
        "Shop & Establishment License",
        "FSSAI License",
        "Trademark Registration",
      ],
    },
    {
      icon: <Briefcase className="w-12 h-12 text-primary" />,
      title: "Payroll & HR Compliance",
      description: "End-to-end payroll processing and statutory compliance management for your workforce.",
      features: [
        "Monthly Payroll Processing",
        "PF & ESI Compliance",
        "Professional Tax Filing",
        "Form 16 Generation",
        "Gratuity & Leave Encashment",
        "HR Policy Documentation",
      ],
    },
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 bg-accent">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            Our Services
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive financial and compliance solutions tailored to help your business thrive. 
            From tax planning to regulatory compliance, we've got you covered.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mb-4">{service.icon}</div>
                  <CardTitle className="text-2xl mb-2">{service.title}</CardTitle>
                  <CardDescription className="text-base">{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-primary mr-2">✓</span>
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-primary">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 text-primary-foreground">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Let's discuss how we can help your business achieve financial excellence and regulatory compliance.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link to="/#contact">Contact Us Today</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ServicesPage;
