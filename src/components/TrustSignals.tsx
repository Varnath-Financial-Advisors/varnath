import { Award, Users, Clock, BadgeCheck } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useCountUp } from "@/hooks/useCountUp";

const AnimatedStat = ({ 
  value, 
  suffix, 
  label, 
  description, 
  icon: Icon 
}: { 
  value: number; 
  suffix: string; 
  label: string; 
  description: string; 
  icon: React.ElementType;
}) => {
  const { count, ref } = useCountUp({ end: value, duration: 2000 });
  
  return (
    <div 
      ref={ref}
      className="flex flex-col items-center text-center group cursor-pointer"
    >
      <div className="p-3 rounded-xl bg-primary/10 text-primary mb-3 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110 group-hover:shadow-lg transition-all duration-300 ease-out">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors duration-300">
        <span className="text-2xl font-bold">{count}</span>
        <span className="text-lg">{suffix}</span>
        <span className="text-base font-medium ml-1">{label}</span>
      </h3>
      <p className="text-sm text-muted-foreground group-hover:text-foreground/70 transition-colors duration-300">
        {description}
      </p>
    </div>
  );
};

const StaticSignal = ({ 
  title, 
  description, 
  icon: Icon 
}: { 
  title: string; 
  description: string; 
  icon: React.ElementType;
}) => {
  return (
    <div className="flex flex-col items-center text-center group cursor-pointer">
      <div className="p-3 rounded-xl bg-primary/10 text-primary mb-3 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110 group-hover:shadow-lg transition-all duration-300 ease-out">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors duration-300">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground group-hover:text-foreground/70 transition-colors duration-300">
        {description}
      </p>
    </div>
  );
};

const TrustSignals = () => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section className="py-12 px-4 bg-secondary/5 border-y border-border overflow-hidden">
      <div className="container mx-auto">
        <div 
          ref={ref}
          className={`text-center mb-8 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Why Businesses Trust Us
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          <div className={`transition-all duration-700 delay-100 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}>
            <StaticSignal 
              icon={Award}
              title="Expert CAs"
              description="Partnered with experienced Chartered Accountants for best services"
            />
          </div>
          
          <div className={`transition-all duration-700 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}>
            <AnimatedStat 
              icon={BadgeCheck}
              value={5}
              suffix="+"
              label="Years"
              description="Proven track record in financial services"
            />
          </div>
          
          <div className={`transition-all duration-700 delay-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}>
            <AnimatedStat 
              icon={Users}
              value={50}
              suffix="+"
              label="Clients"
              description="Trusted by growing businesses"
            />
          </div>
          
          <div className={`transition-all duration-700 delay-[400ms] ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}>
            <StaticSignal 
              icon={Clock}
              title="24/7 Support"
              description="Always here when you need us"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSignals;
