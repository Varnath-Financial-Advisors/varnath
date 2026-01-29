import { useMemo } from "react";
import { Lightbulb, TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface KeyTakeawaysProps {
  content: string;
  title: string;
}

const KeyTakeaways = ({ content, title }: KeyTakeawaysProps) => {
  const takeaways = useMemo(() => {
    const items: { text: string; type: 'tip' | 'important' | 'benefit' }[] = [];
    
    // Extract key points from content
    const lines = content.split('\n');
    let inImportantSection = false;
    
    lines.forEach((line) => {
      // Check for important keywords
      if (line.includes('**Note**') || line.includes('**Important**')) {
        const text = line.replace(/\*\*/g, '').replace(/Note:|Important:/g, '').trim();
        if (text.length > 10) {
          items.push({ text, type: 'important' });
        }
      }
      
      // Extract key benefits or thresholds
      if (line.includes('Rebate') || line.includes('Exemption') || line.includes('Benefit')) {
        const cleanText = line.replace(/^[-*•]\s*/, '').replace(/\*\*/g, '').trim();
        if (cleanText.length > 10 && cleanText.length < 100) {
          items.push({ text: cleanText, type: 'benefit' });
        }
      }
    });
    
    // Limit to 3 takeaways
    return items.slice(0, 3);
  }, [content]);

  // Generate smart takeaways based on article title
  const smartTakeaways = useMemo(() => {
    const lowerTitle = title.toLowerCase();
    
    if (lowerTitle.includes('income tax') || lowerTitle.includes('tax slab')) {
      return [
        { text: "New Tax Regime is the default from FY 2023-24", type: 'important' as const, icon: AlertCircle },
        { text: "Standard deduction of ₹75,000 available in New Regime", type: 'benefit' as const, icon: TrendingUp },
        { text: "Compare both regimes before filing ITR", type: 'tip' as const, icon: Lightbulb },
      ];
    }
    
    if (lowerTitle.includes('gst')) {
      return [
        { text: "Registration mandatory for inter-state supply", type: 'important' as const, icon: AlertCircle },
        { text: "File GSTR-1 by 11th and GSTR-3B by 20th monthly", type: 'tip' as const, icon: Lightbulb },
        { text: "ITC available only on matched invoices in GSTR-2B", type: 'important' as const, icon: CheckCircle2 },
      ];
    }
    
    if (lowerTitle.includes('tds')) {
      return [
        { text: "TDS must be deposited by 7th of following month", type: 'important' as const, icon: AlertCircle },
        { text: "Quarterly returns due within 30 days of quarter end", type: 'tip' as const, icon: Lightbulb },
        { text: "Late filing attracts ₹200 per day penalty", type: 'important' as const, icon: CheckCircle2 },
      ];
    }
    
    if (lowerTitle.includes('company') || lowerTitle.includes('mca') || lowerTitle.includes('roc')) {
      return [
        { text: "AOC-4 must be filed by October 31st", type: 'important' as const, icon: AlertCircle },
        { text: "DIR-3 KYC mandatory for all directors by September 30", type: 'tip' as const, icon: Lightbulb },
        { text: "Minimum 4 board meetings required per year", type: 'important' as const, icon: CheckCircle2 },
      ];
    }
    
    return [
      { text: "Keep documentation ready for compliance", type: 'tip' as const, icon: Lightbulb },
      { text: "Track all deadlines to avoid penalties", type: 'important' as const, icon: AlertCircle },
      { text: "Consult experts for complex matters", type: 'benefit' as const, icon: CheckCircle2 },
    ];
  }, [title]);

  const displayTakeaways = takeaways.length > 0 ? takeaways : smartTakeaways;

  const getIcon = (type: string) => {
    switch (type) {
      case 'important':
        return <AlertCircle className="w-4 h-4 text-destructive" />;
      case 'benefit':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      default:
        return <Lightbulb className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'important':
        return 'bg-destructive/10 border-destructive/20';
      case 'benefit':
        return 'bg-green-500/10 border-green-500/20';
      default:
        return 'bg-yellow-500/10 border-yellow-500/20';
    }
  };

  return (
    <Card className="mb-6 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-primary" />
          Key Takeaways
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {smartTakeaways.map((item, idx) => (
          <div 
            key={idx} 
            className={`flex items-start gap-3 p-3 rounded-lg border ${getBgColor(item.type)}`}
          >
            <item.icon className="w-4 h-4 mt-0.5 shrink-0" />
            <span className="text-sm text-foreground">{item.text}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default KeyTakeaways;
