import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";

const Hero = () => {
  return (
    <section className="pt-32 pb-20 px-4">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground">
            Expert Financial Guidance for Your Business Success
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
            Comprehensive tax advisory, virtual CFO services, and regulatory compliance solutions tailored for Indian businesses
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="text-lg" asChild>
              <a href="#contact">
                Schedule Consultation <ArrowRight className="ml-2" size={20} />
              </a>
            </Button>
            <Button size="lg" variant="outline" className="text-lg" asChild>
              <a href="/knowledge-base">Explore Resources</a>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            {[
              { label: "Years of Experience", value: "15+" },
              { label: "Satisfied Clients", value: "500+" },
              { label: "Compliance Success Rate", value: "99.8%" },
            ].map((stat) => (
              <div key={stat.label} className="bg-card p-6 rounded-lg border border-border">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
