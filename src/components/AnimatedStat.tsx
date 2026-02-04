import { useCountUp } from "@/hooks/useCountUp";

interface AnimatedStatProps {
  value: string;
  label: string;
}

const AnimatedStat = ({ value, label }: AnimatedStatProps) => {
  // Parse the numeric value and suffix
  const numericMatch = value.match(/^([\d.]+)(.*)$/);
  const numericValue = numericMatch ? parseFloat(numericMatch[1]) : 0;
  const suffix = numericMatch ? numericMatch[2] : value;
  const isDecimal = value.includes(".");

  const { count, ref } = useCountUp({ 
    end: isDecimal ? numericValue * 10 : numericValue, 
    duration: 2000 
  });

  const displayValue = isDecimal ? (count / 10).toFixed(1) : count;

  return (
    <div 
      ref={ref}
      className="group relative bg-card p-6 rounded-xl border border-border overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/30"
    >
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative z-10">
        <div className="text-3xl md:text-4xl font-bold text-primary mb-2 tabular-nums">
          {displayValue}{suffix}
        </div>
        <div className="text-muted-foreground font-medium">{label}</div>
      </div>
    </div>
  );
};

export default AnimatedStat;
