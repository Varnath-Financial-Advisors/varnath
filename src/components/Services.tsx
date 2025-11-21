import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Calculator, Building2, Users } from "lucide-react";

const Services = () => {
  const services = [
    {
      icon: <FileText className="w-10 h-10 text-primary" />,
      title: "Tax Filing & Advisory",
      description: "Expert assistance with direct and indirect tax filings including Income Tax, GST, and TDS. Strategic tax planning to optimize your tax liability.",
      features: [
        "Income Tax Returns",
        "GST Registration & Filing",
        "TDS Compliance",
        "Tax Planning & Optimization",
      ],
    },
    {
      icon: <Calculator className="w-10 h-10 text-primary" />,
      title: "Virtual CFO Services",
      description: "Get C-suite financial expertise without the overhead. We provide strategic financial management and insights for growing businesses.",
      features: [
        "Financial Planning & Analysis",
        "Budgeting & Forecasting",
        "Cash Flow Management",
        "Management Reporting",
      ],
    },
    {
      icon: <Building2 className="w-10 h-10 text-primary" />,
      title: "MCA & ROC Compliance",
      description: "Comprehensive compliance solutions for company law requirements. Stay compliant with MCA regulations and avoid penalties.",
      features: [
        "Annual Filing (AOC-4, MGT-7)",
        "Board Meeting Compliance",
        "DIN & DSC Services",
        "Company Incorporation",
      ],
    },
    {
      icon: <Users className="w-10 h-10 text-primary" />,
      title: "Business Advisory",
      description: "Strategic guidance to help your business grow. From startup consulting to expansion planning, we're with you every step.",
      features: [
        "Business Structure Planning",
        "Financial Due Diligence",
        "Regulatory Advisory",
        "Risk Management",
      ],
    },
  ];

  return (
    <section id="services" className="py-20 px-4 bg-accent">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Our Services
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive financial solutions designed to help your business thrive
          </p>
        </div>

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
                      <span className="text-primary mr-2">•</span>
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
  );
};

export default Services;
