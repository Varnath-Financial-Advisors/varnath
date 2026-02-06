import { Award, Users, Clock, BadgeCheck } from "lucide-react";

const TrustSignals = () => {
  const signals = [
    {
      icon: <Award className="w-8 h-8" />,
      title: "Expert CAs",
      description: "Partnered with experienced Chartered Accountants for best services"
    },
    {
      icon: <BadgeCheck className="w-8 h-8" />,
      title: "5+ Years Experience",
      description: "Proven track record in financial services"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "50+ Clients",
      description: "Trusted by growing businesses"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "24/7 Support",
      description: "Always here when you need us"
    }
  ];

  return (
    <section className="py-12 px-4 bg-secondary/5 border-y border-border">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Why Businesses Trust Us
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {signals.map((signal, index) => (
            <div 
              key={index}
              className="flex flex-col items-center text-center group"
            >
              <div className="p-3 rounded-xl bg-primary/10 text-primary mb-3 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                {signal.icon}
              </div>
              <h3 className="font-semibold text-foreground mb-1">{signal.title}</h3>
              <p className="text-sm text-muted-foreground">{signal.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSignals;
