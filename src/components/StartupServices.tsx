import { Building2, CheckCircle2, TrendingUp, Lightbulb, Shield, BookOpen } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const StartupServices = () => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  const services = [
    {
      icon: Building2,
      title: "Business Setup",
      description: "Expert guidance for company incorporation, registrations, and legal structure optimization for startups"
    },
    {
      icon: Shield,
      title: "Compliance Management",
      description: "Ensure full regulatory compliance with GST, labour laws, MCA filings, and statutory requirements"
    },
    {
      icon: BookOpen,
      title: "Accounting Services",
      description: "Professional bookkeeping, financial reporting, and accounting support from day one"
    },
    {
      icon: TrendingUp,
      title: "Financial Planning",
      description: "Strategic financial planning and cash flow management for sustainable growth"
    },
    {
      icon: Lightbulb,
      title: "Tax Optimization",
      description: "Smart tax planning strategies including startup incentives and government benefits"
    },
    {
      icon: CheckCircle2,
      title: "Investor Ready",
      description: "Prepare audited financials and compliance documentation for investor pitches and funding rounds"
    }
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-background to-accent/30">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div 
          ref={ref}
          className={`text-center mb-16 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">
            Supporting Make in India Initiative
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Complete Startup Solutions
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            We empower Indian entrepreneurs by providing comprehensive support in business setup, regulatory compliance, 
            and accounting services. From day one to series funding, we're your trusted growth partner.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                ref={ref}
                className={`transition-all duration-700 delay-${(index + 1) * 100}ms ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
              >
                <Card className="h-full border border-border/50 hover:border-primary/50 hover:shadow-lg transition-all duration-300 group">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {service.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>

        {/* Why Choose Us for Startups */}
        <div ref={ref} className={`bg-card border border-border/50 rounded-xl p-8 mb-12 transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}>
          <h3 className="text-2xl font-bold text-foreground mb-6">Why Choose Varnath for Your Startup?</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-foreground">Cost-Effective Solutions</h4>
                  <p className="text-sm text-muted-foreground">Affordable packages designed for startups with limited budgets</p>
                </div>
              </div>
              <div className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-foreground">Government Benefits Expertise</h4>
                  <p className="text-sm text-muted-foreground">Maximize DPIIT recognition, MSME benefits, and startup tax incentives</p>
                </div>
              </div>
              <div className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-foreground">Scalable Support</h4>
                  <p className="text-sm text-muted-foreground">Grow from idea to unicorn with services that scale with you</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-foreground">Investor Relations Ready</h4>
                  <p className="text-sm text-muted-foreground">Prepare compliant financials and documentation for funding rounds</p>
                </div>
              </div>
              <div className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-foreground">Multi-State Expertise</h4>
                  <p className="text-sm text-muted-foreground">Seamless support across all Indian states and union territories</p>
                </div>
              </div>
              <div className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-foreground">Dedicated Support Team</h4>
                  <p className="text-sm text-muted-foreground">Access to experienced consultants who understand startup challenges</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div ref={ref} className={`text-center transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}>
          <h3 className="text-2xl font-bold text-foreground mb-4">Ready to Start Your Startup Journey?</h3>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Let us handle the compliance and accounting while you focus on building your dream. Get a personalized consultation today.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Schedule Free Consultation
            </Button>
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StartupServices;
