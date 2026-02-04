import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import AnimatedStat from "./AnimatedStat";

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 px-4 overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6 animate-fade-in">
            <Sparkles className="w-4 h-4" />
            Trusted by 50+ Growing Businesses
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground leading-tight animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Expert Financial Guidance for{" "}
            <span className="relative">
              <span className="relative z-10 text-primary">Your Business Success</span>
              <span className="absolute bottom-2 left-0 right-0 h-3 bg-primary/20 -z-0 rounded" />
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Comprehensive tax advisory, virtual CFO services, and regulatory compliance solutions tailored for Indian businesses
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <Button size="lg" className="text-lg group" asChild>
              <a href="#contact">
                Schedule Consultation 
                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </a>
            </Button>
            <Button size="lg" variant="outline" className="text-lg" asChild>
              <a href="/knowledge-base">Explore Resources</a>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <AnimatedStat value="5+" label="Years of Experience" />
            <AnimatedStat value="50+" label="Satisfied Clients" />
            <AnimatedStat value="99.8%" label="Compliance Success Rate" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
