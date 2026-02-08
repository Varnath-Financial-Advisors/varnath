import { useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, TrendingDown, ArrowRight, Building2, Heart, Briefcase, Home, GraduationCap, Landmark, Info, Users, Calendar, Lightbulb, BarChart3, Download, RefreshCw } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";

interface TaxInputs {
  // Basic Details
  ageGroup: "below60" | "60to80" | "above80";
  residentialStatus: "resident" | "nonResident";
  
  // Income Details
  basicSalary: string;
  hra: string;
  specialAllowances: string;
  lta: string;
  otherIncome: string;
  interestIncome: string;
  rentalIncome: string;
  
  // HRA Calculation
  isMetroCity: boolean;
  actualRentPaid: string;
  
  // Deductions (Old Regime)
  section80C: string;
  section80CCD1B: string;
  section80D_self: string;
  section80D_parents: string;
  section80E: string;
  section80G: string;
  section80TTA: string;
  
  // Home Loan
  homeLoanInterest: string;
  isPropertySelfOccupied: boolean;
  
  // Other
  professionalTax: string;
  npsEmployerContribution: string;
}

interface TaxResult {
  grossIncome: number;
  standardDeduction: number;
  hraExemption: number;
  chapter6Deductions: number;
  homeLoanDeduction: number;
  taxableIncome: number;
  taxBeforeCess: number;
  cess: number;
  totalTax: number;
  effectiveRate: number;
  surcharge: number;
  marginalRate: number;
  slabBreakdown: { slab: string; rate: string; tax: number }[];
}

interface TaxSavingTip {
  title: string;
  description: string;
  potential: string;
  icon: React.ElementType;
}

const TaxCalculator = () => {
  const [inputs, setInputs] = useState<TaxInputs>({
    ageGroup: "below60",
    residentialStatus: "resident",
    basicSalary: "",
    hra: "",
    specialAllowances: "",
    lta: "",
    otherIncome: "",
    interestIncome: "",
    rentalIncome: "",
    isMetroCity: true,
    actualRentPaid: "",
    section80C: "",
    section80CCD1B: "",
    section80D_self: "",
    section80D_parents: "",
    section80E: "",
    section80G: "",
    section80TTA: "",
    homeLoanInterest: "",
    isPropertySelfOccupied: true,
    professionalTax: "",
    npsEmployerContribution: "",
  });

  const [activeTab, setActiveTab] = useState("income");
  const [viewMode, setViewMode] = useState<"annual" | "monthly">("annual");
  const [showTips, setShowTips] = useState(false);

  const parseNumber = (value: string): number => {
    if (!value || value === "") return 0;
    // Remove commas and non-numeric characters except decimal point
    const cleanValue = value.replace(/,/g, "").replace(/[^0-9.]/g, "");
    const parsed = parseFloat(cleanValue);
    // Return 0 for negative or NaN values
    return isNaN(parsed) || parsed < 0 ? 0 : parsed;
  };

  const formatInputValue = (value: string): string => {
    if (!value || value === "") return "";
    // Remove non-numeric characters except decimal
    const cleanValue = value.replace(/,/g, "").replace(/[^0-9.]/g, "");
    if (cleanValue === "") return "";
    
    // Format with Indian number system (lakhs, crores)
    const parts = cleanValue.split(".");
    const integerPart = parts[0];
    const decimalPart = parts[1];
    
    // Apply Indian number formatting
    const lastThree = integerPart.slice(-3);
    const otherNumbers = integerPart.slice(0, -3);
    const formatted = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + (otherNumbers ? "," : "") + lastThree;
    
    return decimalPart !== undefined ? `${formatted}.${decimalPart}` : formatted;
  };

  const updateInput = (field: keyof TaxInputs, value: string | boolean) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const calculateHRAExemption = useCallback((): number => {
    const basic = parseNumber(inputs.basicSalary);
    const hraReceived = parseNumber(inputs.hra);
    const rentPaid = parseNumber(inputs.actualRentPaid);
    
    if (hraReceived === 0 || rentPaid === 0) return 0;
    
    const metroPercent = inputs.isMetroCity ? 0.5 : 0.4;
    
    const exemption1 = hraReceived;
    const exemption2 = basic * metroPercent;
    const exemption3 = Math.max(0, rentPaid - (basic * 0.1));
    
    return Math.min(exemption1, exemption2, exemption3);
  }, [inputs.basicSalary, inputs.hra, inputs.actualRentPaid, inputs.isMetroCity]);

  const calculateOldRegimeTax = useCallback((): TaxResult => {
    const basic = parseNumber(inputs.basicSalary);
    const hra = parseNumber(inputs.hra);
    const specialAllowances = parseNumber(inputs.specialAllowances);
    const lta = parseNumber(inputs.lta);
    const otherIncome = parseNumber(inputs.otherIncome);
    const interestIncome = parseNumber(inputs.interestIncome);
    const rentalIncome = parseNumber(inputs.rentalIncome);
    
    const grossIncome = basic + hra + specialAllowances + lta + otherIncome + interestIncome + rentalIncome;
    
    // Standard Deduction
    const standardDeduction = Math.min(50000, grossIncome);
    
    // HRA Exemption
    const hraExemption = calculateHRAExemption();
    
    // Chapter VI-A Deductions
    const section80C = Math.min(parseNumber(inputs.section80C), 150000);
    const section80CCD1B = Math.min(parseNumber(inputs.section80CCD1B), 50000);
    const section80D_self = Math.min(parseNumber(inputs.section80D_self), inputs.ageGroup === "below60" ? 25000 : 50000);
    const section80D_parents = Math.min(parseNumber(inputs.section80D_parents), 50000);
    const section80E = parseNumber(inputs.section80E);
    const section80G = parseNumber(inputs.section80G);
    const section80TTA = Math.min(parseNumber(inputs.section80TTA), 10000);
    const npsEmployer = Math.min(parseNumber(inputs.npsEmployerContribution), basic * 0.1);
    
    const chapter6Deductions = section80C + section80CCD1B + section80D_self + section80D_parents + section80E + section80G + section80TTA + npsEmployer;
    
    // Home Loan Interest Deduction
    const homeLoanInterest = parseNumber(inputs.homeLoanInterest);
    const homeLoanDeduction = inputs.isPropertySelfOccupied ? Math.min(homeLoanInterest, 200000) : homeLoanInterest;
    
    // Professional Tax
    const professionalTax = Math.min(parseNumber(inputs.professionalTax), 2500);
    
    // Calculate Taxable Income
    const taxableIncome = Math.max(0, grossIncome - standardDeduction - hraExemption - chapter6Deductions - homeLoanDeduction - professionalTax);
    
    // Calculate Tax based on age group with slab breakdown
    let tax = 0;
    let marginalRate = 0;
    const slabBreakdown: { slab: string; rate: string; tax: number }[] = [];
    
    if (inputs.ageGroup === "above80") {
      if (taxableIncome > 0) slabBreakdown.push({ slab: "0 - 5L", rate: "0%", tax: 0 });
      if (taxableIncome > 500000) {
        const slabTax = Math.min(taxableIncome - 500000, 500000) * 0.20;
        tax += slabTax;
        slabBreakdown.push({ slab: "5L - 10L", rate: "20%", tax: slabTax });
        marginalRate = 20;
      }
      if (taxableIncome > 1000000) {
        const slabTax = (taxableIncome - 1000000) * 0.30;
        tax += slabTax;
        slabBreakdown.push({ slab: "Above 10L", rate: "30%", tax: slabTax });
        marginalRate = 30;
      }
    } else if (inputs.ageGroup === "60to80") {
      if (taxableIncome > 0) slabBreakdown.push({ slab: "0 - 3L", rate: "0%", tax: 0 });
      if (taxableIncome > 300000) {
        const slabTax = Math.min(taxableIncome - 300000, 200000) * 0.05;
        tax += slabTax;
        slabBreakdown.push({ slab: "3L - 5L", rate: "5%", tax: slabTax });
        marginalRate = 5;
      }
      if (taxableIncome > 500000) {
        const slabTax = Math.min(taxableIncome - 500000, 500000) * 0.20;
        tax += slabTax;
        slabBreakdown.push({ slab: "5L - 10L", rate: "20%", tax: slabTax });
        marginalRate = 20;
      }
      if (taxableIncome > 1000000) {
        const slabTax = (taxableIncome - 1000000) * 0.30;
        tax += slabTax;
        slabBreakdown.push({ slab: "Above 10L", rate: "30%", tax: slabTax });
        marginalRate = 30;
      }
    } else {
      if (taxableIncome > 0) slabBreakdown.push({ slab: "0 - 2.5L", rate: "0%", tax: 0 });
      if (taxableIncome > 250000) {
        const slabTax = Math.min(taxableIncome - 250000, 250000) * 0.05;
        tax += slabTax;
        slabBreakdown.push({ slab: "2.5L - 5L", rate: "5%", tax: slabTax });
        marginalRate = 5;
      }
      if (taxableIncome > 500000) {
        const slabTax = Math.min(taxableIncome - 500000, 500000) * 0.20;
        tax += slabTax;
        slabBreakdown.push({ slab: "5L - 10L", rate: "20%", tax: slabTax });
        marginalRate = 20;
      }
      if (taxableIncome > 1000000) {
        const slabTax = (taxableIncome - 1000000) * 0.30;
        tax += slabTax;
        slabBreakdown.push({ slab: "Above 10L", rate: "30%", tax: slabTax });
        marginalRate = 30;
      }
    }
    
    // Rebate u/s 87A
    let rebateApplied = false;
    if (inputs.residentialStatus === "resident" && taxableIncome <= 500000) {
      tax = Math.max(0, tax - 12500);
      rebateApplied = true;
    }
    
    // Calculate Surcharge
    let surcharge = 0;
    if (taxableIncome > 5000000) {
      if (taxableIncome <= 10000000) surcharge = tax * 0.10;
      else if (taxableIncome <= 20000000) surcharge = tax * 0.15;
      else if (taxableIncome <= 50000000) surcharge = tax * 0.25;
      else surcharge = tax * 0.37;
    }
    
    const taxBeforeCess = tax + surcharge;
    const cess = taxBeforeCess * 0.04;
    const totalTax = Math.round(taxBeforeCess + cess);
    
    return {
      grossIncome,
      standardDeduction,
      hraExemption,
      chapter6Deductions,
      homeLoanDeduction,
      taxableIncome,
      taxBeforeCess: Math.round(taxBeforeCess),
      cess: Math.round(cess),
      totalTax,
      effectiveRate: grossIncome > 0 ? (totalTax / grossIncome) * 100 : 0,
      surcharge: Math.round(surcharge),
      marginalRate: rebateApplied && totalTax === 0 ? 0 : marginalRate,
      slabBreakdown,
    };
  }, [inputs, calculateHRAExemption]);

  const calculateNewRegimeTax = useCallback((): TaxResult => {
    const basic = parseNumber(inputs.basicSalary);
    const hra = parseNumber(inputs.hra);
    const specialAllowances = parseNumber(inputs.specialAllowances);
    const lta = parseNumber(inputs.lta);
    const otherIncome = parseNumber(inputs.otherIncome);
    const interestIncome = parseNumber(inputs.interestIncome);
    const rentalIncome = parseNumber(inputs.rentalIncome);
    
    const grossIncome = basic + hra + specialAllowances + lta + otherIncome + interestIncome + rentalIncome;
    
    // Standard Deduction (New Regime - ₹75,000)
    const standardDeduction = Math.min(75000, grossIncome);
    
    // Only NPS employer contribution allowed in new regime
    const npsEmployer = Math.min(parseNumber(inputs.npsEmployerContribution), basic * 0.14);
    
    const taxableIncome = Math.max(0, grossIncome - standardDeduction - npsEmployer);
    
    // New Regime Tax Slabs (FY 2024-25) with breakdown
    let tax = 0;
    let marginalRate = 0;
    const slabBreakdown: { slab: string; rate: string; tax: number }[] = [];
    
    if (taxableIncome > 0) slabBreakdown.push({ slab: "0 - 3L", rate: "0%", tax: 0 });
    
    if (taxableIncome > 300000) {
      const slabTax = Math.min(taxableIncome - 300000, 400000) * 0.05;
      tax += slabTax;
      slabBreakdown.push({ slab: "3L - 7L", rate: "5%", tax: slabTax });
      marginalRate = 5;
    }
    if (taxableIncome > 700000) {
      const slabTax = Math.min(taxableIncome - 700000, 300000) * 0.10;
      tax += slabTax;
      slabBreakdown.push({ slab: "7L - 10L", rate: "10%", tax: slabTax });
      marginalRate = 10;
    }
    if (taxableIncome > 1000000) {
      const slabTax = Math.min(taxableIncome - 1000000, 200000) * 0.15;
      tax += slabTax;
      slabBreakdown.push({ slab: "10L - 12L", rate: "15%", tax: slabTax });
      marginalRate = 15;
    }
    if (taxableIncome > 1200000) {
      const slabTax = Math.min(taxableIncome - 1200000, 300000) * 0.20;
      tax += slabTax;
      slabBreakdown.push({ slab: "12L - 15L", rate: "20%", tax: slabTax });
      marginalRate = 20;
    }
    if (taxableIncome > 1500000) {
      const slabTax = (taxableIncome - 1500000) * 0.30;
      tax += slabTax;
      slabBreakdown.push({ slab: "Above 15L", rate: "30%", tax: slabTax });
      marginalRate = 30;
    }
    
    // Rebate u/s 87A (New Regime)
    let rebateApplied = false;
    if (inputs.residentialStatus === "resident" && taxableIncome <= 700000) {
      tax = Math.max(0, tax - 25000);
      rebateApplied = true;
    }
    
    // Calculate Surcharge
    let surcharge = 0;
    if (taxableIncome > 5000000) {
      if (taxableIncome <= 10000000) surcharge = tax * 0.10;
      else if (taxableIncome <= 20000000) surcharge = tax * 0.15;
      else surcharge = tax * 0.25;
    }
    
    const taxBeforeCess = tax + surcharge;
    const cess = taxBeforeCess * 0.04;
    const totalTax = Math.round(taxBeforeCess + cess);
    
    return {
      grossIncome,
      standardDeduction,
      hraExemption: 0,
      chapter6Deductions: npsEmployer,
      homeLoanDeduction: 0,
      taxableIncome,
      taxBeforeCess: Math.round(taxBeforeCess),
      cess: Math.round(cess),
      totalTax,
      effectiveRate: grossIncome > 0 ? (totalTax / grossIncome) * 100 : 0,
      surcharge: Math.round(surcharge),
      marginalRate: rebateApplied && totalTax === 0 ? 0 : marginalRate,
      slabBreakdown,
    };
  }, [inputs]);

  const oldRegimeResult = useMemo(() => calculateOldRegimeTax(), [calculateOldRegimeTax]);
  const newRegimeResult = useMemo(() => calculateNewRegimeTax(), [calculateNewRegimeTax]);
  
  const savings = Math.abs(oldRegimeResult.totalTax - newRegimeResult.totalTax);
  const betterRegime = oldRegimeResult.totalTax === newRegimeResult.totalTax 
    ? "Both Equal" 
    : oldRegimeResult.totalTax < newRegimeResult.totalTax 
      ? "Old Regime" 
      : "New Regime";

  // Generate tax saving tips based on current inputs
  const generateTaxTips = useMemo((): TaxSavingTip[] => {
    const tips: TaxSavingTip[] = [];
    const section80C = parseNumber(inputs.section80C);
    const section80CCD1B = parseNumber(inputs.section80CCD1B);
    const section80D_self = parseNumber(inputs.section80D_self);
    const hra = parseNumber(inputs.hra);
    const rentPaid = parseNumber(inputs.actualRentPaid);

    // Helper function to format currency for tips (annual only)
    const formatTipAmount = (value: number) => {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
      }).format(value);
    };

    if (section80C < 150000) {
      tips.push({
        title: "Maximize 80C Investments",
        description: `You can invest ${formatTipAmount(150000 - section80C)} more in PPF, ELSS, or Life Insurance`,
        potential: `Save up to ${formatTipAmount((150000 - section80C) * 0.3)}`,
        icon: Landmark,
      });
    }

    if (section80CCD1B < 50000) {
      tips.push({
        title: "NPS Additional Contribution",
        description: "Invest in NPS under 80CCD(1B) for extra ₹50,000 deduction",
        potential: `Save up to ${formatTipAmount((50000 - section80CCD1B) * 0.3)}`,
        icon: GraduationCap,
      });
    }

    if (section80D_self === 0) {
      tips.push({
        title: "Get Health Insurance",
        description: "Health insurance premium is deductible under 80D",
        potential: "Save up to ₹7,500 - ₹15,000",
        icon: Heart,
      });
    }

    if (hra > 0 && rentPaid === 0) {
      tips.push({
        title: "Claim HRA Exemption",
        description: "Enter your rent paid to claim HRA exemption (Old Regime)",
        potential: "Significant tax savings possible",
        icon: Home,
      });
    }

    if (tips.length === 0) {
      tips.push({
        title: "Great Tax Planning!",
        description: "You're utilizing most available deductions effectively",
        potential: "Keep up the good work!",
        icon: Lightbulb,
      });
    }

    return tips.slice(0, 3);
  }, [inputs]);

  const handleReset = () => {
    setInputs({
      ageGroup: "below60",
      residentialStatus: "resident",
      basicSalary: "",
      hra: "",
      specialAllowances: "",
      lta: "",
      otherIncome: "",
      interestIncome: "",
      rentalIncome: "",
      isMetroCity: true,
      actualRentPaid: "",
      section80C: "",
      section80CCD1B: "",
      section80D_self: "",
      section80D_parents: "",
      section80E: "",
      section80G: "",
      section80TTA: "",
      homeLoanInterest: "",
      isPropertySelfOccupied: true,
      professionalTax: "",
      npsEmployerContribution: "",
    });
    setShowTips(false);
  };

  const formatCurrency = (value: number) => {
    const displayValue = viewMode === "monthly" ? value / 12 : value;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(displayValue);
  };

  const formatLakh = (value: number) => {
    const displayValue = viewMode === "monthly" ? value / 12 : value;
    if (viewMode === "annual") {
      if (displayValue >= 10000000) return `₹${(displayValue / 10000000).toFixed(2)} Cr`;
      if (displayValue >= 100000) return `₹${(displayValue / 100000).toFixed(2)} L`;
    }
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(displayValue);
  };

  const handleDownloadSummary = () => {
    const summary = `
INCOME TAX CALCULATION SUMMARY - FY 2024-25
============================================

GROSS INCOME: ${formatCurrency(oldRegimeResult.grossIncome)}

OLD REGIME:
- Standard Deduction: ${formatCurrency(oldRegimeResult.standardDeduction)}
- HRA Exemption: ${formatCurrency(oldRegimeResult.hraExemption)}
- Chapter VI-A Deductions: ${formatCurrency(oldRegimeResult.chapter6Deductions)}
- Home Loan Interest: ${formatCurrency(oldRegimeResult.homeLoanDeduction)}
- Taxable Income: ${formatCurrency(oldRegimeResult.taxableIncome)}
- Total Tax: ${formatCurrency(oldRegimeResult.totalTax)}
- Effective Rate: ${oldRegimeResult.effectiveRate.toFixed(2)}%

NEW REGIME:
- Standard Deduction: ${formatCurrency(newRegimeResult.standardDeduction)}
- NPS Employer: ${formatCurrency(newRegimeResult.chapter6Deductions)}
- Taxable Income: ${formatCurrency(newRegimeResult.taxableIncome)}
- Total Tax: ${formatCurrency(newRegimeResult.totalTax)}
- Effective Rate: ${newRegimeResult.effectiveRate.toFixed(2)}%

RECOMMENDATION: ${betterRegime}
${betterRegime !== "Both Equal" ? `SAVINGS: ${formatCurrency(savings)}` : ""}

Note: This is an estimate. Consult a tax professional for personalized advice.
Generated by Varnath Tax Calculator
    `.trim();

    const blob = new Blob([summary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tax-calculation-summary.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const InputWithLabel = ({ 
    label, 
    id, 
    value, 
    onChange, 
    placeholder = "0",
    tooltip,
    icon: Icon
  }: { 
    label: string; 
    id: keyof TaxInputs; 
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    tooltip?: string;
    icon?: React.ElementType;
  }) => (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4 text-muted-foreground" />}
        <Label htmlFor={id} className="text-sm font-medium">{label}</Label>
        {tooltip && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-xs">{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">₹</span>
        <Input
          id={id}
          type="text"
          inputMode="numeric"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(formatInputValue(e.target.value))}
          className="pl-7"
        />
      </div>
    </div>
  );

  // Calculate comparison bar percentages
  const maxTax = Math.max(oldRegimeResult.totalTax, newRegimeResult.totalTax, 1);
  const oldRegimePercent = (oldRegimeResult.totalTax / maxTax) * 100;
  const newRegimePercent = (newRegimeResult.totalTax / maxTax) * 100;

  return (
    <section id="tax-calculator" className="py-20 px-4 bg-accent/50">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Calculator className="w-4 h-4" />
            Advanced Tax Calculator
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Income Tax Calculator FY 2024-25
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Compare Old vs New Tax Regime with all deductions, exemptions & surcharges
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Input Section */}
            <div className="lg:col-span-2">
              <Card className="shadow-lg border-2 border-border">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <CardTitle className="text-xl flex items-center gap-2">
                        <Calculator className="w-5 h-5 text-primary" />
                        Enter Your Details
                      </CardTitle>
                      <CardDescription>
                        Fill in your income and deduction details for accurate calculation
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-1">
                      <Button
                        variant={viewMode === "annual" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("annual")}
                        className="text-xs"
                      >
                        <Calendar className="w-3 h-3 mr-1" />
                        Annual
                      </Button>
                      <Button
                        variant={viewMode === "monthly" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("monthly")}
                        className="text-xs"
                      >
                        <Calendar className="w-3 h-3 mr-1" />
                        Monthly
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-4 mb-6">
                      <TabsTrigger value="income" className="text-xs sm:text-sm">
                        <Briefcase className="w-4 h-4 mr-1 hidden sm:inline" />
                        Income
                      </TabsTrigger>
                      <TabsTrigger value="hra" className="text-xs sm:text-sm">
                        <Home className="w-4 h-4 mr-1 hidden sm:inline" />
                        HRA
                      </TabsTrigger>
                      <TabsTrigger value="deductions" className="text-xs sm:text-sm">
                        <Landmark className="w-4 h-4 mr-1 hidden sm:inline" />
                        Deductions
                      </TabsTrigger>
                      <TabsTrigger value="other" className="text-xs sm:text-sm">
                        <Building2 className="w-4 h-4 mr-1 hidden sm:inline" />
                        Other
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="income" className="space-y-6">
                      {/* Basic Details */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                        <div className="space-y-2">
                          <Label className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-muted-foreground" />
                            Age Group
                          </Label>
                          <Select value={inputs.ageGroup} onValueChange={(v) => updateInput("ageGroup", v as TaxInputs["ageGroup"])}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="below60">Below 60 years</SelectItem>
                              <SelectItem value="60to80">60 to 80 years (Senior)</SelectItem>
                              <SelectItem value="above80">Above 80 years (Super Senior)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Residential Status</Label>
                          <Select value={inputs.residentialStatus} onValueChange={(v) => updateInput("residentialStatus", v as TaxInputs["residentialStatus"])}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="resident">Resident</SelectItem>
                              <SelectItem value="nonResident">Non-Resident</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Salary Income */}
                      <div className="space-y-4">
                        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Salary Income</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <InputWithLabel
                            label="Basic Salary (Annual)"
                            id="basicSalary"
                            value={inputs.basicSalary}
                            onChange={(v) => updateInput("basicSalary", v)}
                            icon={Briefcase}
                            tooltip="Your annual basic salary before any allowances"
                          />
                          <InputWithLabel
                            label="HRA Received"
                            id="hra"
                            value={inputs.hra}
                            onChange={(v) => updateInput("hra", v)}
                            icon={Home}
                            tooltip="House Rent Allowance received from employer"
                          />
                          <InputWithLabel
                            label="Special Allowances"
                            id="specialAllowances"
                            value={inputs.specialAllowances}
                            onChange={(v) => updateInput("specialAllowances", v)}
                            tooltip="DA, Conveyance, Medical, and other allowances"
                          />
                          <InputWithLabel
                            label="LTA"
                            id="lta"
                            value={inputs.lta}
                            onChange={(v) => updateInput("lta", v)}
                            tooltip="Leave Travel Allowance"
                          />
                        </div>
                      </div>
                      
                      {/* Other Income */}
                      <div className="space-y-4">
                        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Other Income</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <InputWithLabel
                            label="Other Income"
                            id="otherIncome"
                            value={inputs.otherIncome}
                            onChange={(v) => updateInput("otherIncome", v)}
                            tooltip="Freelance, business, or any other income"
                          />
                          <InputWithLabel
                            label="Interest Income"
                            id="interestIncome"
                            value={inputs.interestIncome}
                            onChange={(v) => updateInput("interestIncome", v)}
                            tooltip="Interest from savings, FD, bonds etc."
                          />
                          <InputWithLabel
                            label="Rental Income"
                            id="rentalIncome"
                            value={inputs.rentalIncome}
                            onChange={(v) => updateInput("rentalIncome", v)}
                            tooltip="Annual rental income from properties"
                          />
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="hra" className="space-y-6">
                      <div className="p-4 bg-muted/30 rounded-lg space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-base font-semibold">Do you live in a Metro City?</Label>
                            <p className="text-sm text-muted-foreground">Delhi, Mumbai, Kolkata, Chennai</p>
                          </div>
                          <Switch
                            checked={inputs.isMetroCity}
                            onCheckedChange={(v) => updateInput("isMetroCity", v)}
                          />
                        </div>
                        <InputWithLabel
                          label="Actual Rent Paid (Annual)"
                          id="actualRentPaid"
                          value={inputs.actualRentPaid}
                          onChange={(v) => updateInput("actualRentPaid", v)}
                          icon={Home}
                          tooltip="Total rent paid in a year. Required for HRA exemption calculation."
                        />
                        {parseNumber(inputs.hra) > 0 && parseNumber(inputs.actualRentPaid) > 0 && (
                          <div className="p-3 bg-primary/10 rounded-lg">
                            <p className="text-sm font-medium text-primary">
                              Estimated HRA Exemption: {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(calculateHRAExemption())}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              (Applicable only in Old Regime)
                            </p>
                          </div>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="deductions" className="space-y-6">
                      <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg mb-4">
                        <p className="text-sm text-amber-700 dark:text-amber-400">
                          ⚠️ These deductions are applicable only under the <strong>Old Tax Regime</strong>
                        </p>
                      </div>
                      
                      <Accordion type="single" collapsible className="space-y-2">
                        <AccordionItem value="80c" className="border rounded-lg px-4">
                          <AccordionTrigger className="hover:no-underline">
                            <div className="flex items-center gap-2">
                              <Landmark className="w-4 h-4 text-primary" />
                              <span>Section 80C, 80CCC, 80CCD(1)</span>
                              <span className="text-xs text-muted-foreground ml-2">Max ₹1.5L</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="pt-2">
                            <p className="text-xs text-muted-foreground mb-4">
                              PPF, ELSS, Life Insurance, EPF, NSC, Tuition Fees, Home Loan Principal, etc.
                            </p>
                            <InputWithLabel
                              label="Total 80C Investment"
                              id="section80C"
                              value={inputs.section80C}
                              onChange={(v) => updateInput("section80C", v)}
                            />
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="80ccd" className="border rounded-lg px-4">
                          <AccordionTrigger className="hover:no-underline">
                            <div className="flex items-center gap-2">
                              <GraduationCap className="w-4 h-4 text-primary" />
                              <span>Section 80CCD(1B) - NPS</span>
                              <span className="text-xs text-muted-foreground ml-2">Max ₹50K</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="pt-2">
                            <p className="text-xs text-muted-foreground mb-4">
                              Additional deduction for NPS contribution (over & above 80C limit)
                            </p>
                            <InputWithLabel
                              label="NPS Contribution"
                              id="section80CCD1B"
                              value={inputs.section80CCD1B}
                              onChange={(v) => updateInput("section80CCD1B", v)}
                            />
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="80d" className="border rounded-lg px-4">
                          <AccordionTrigger className="hover:no-underline">
                            <div className="flex items-center gap-2">
                              <Heart className="w-4 h-4 text-primary" />
                              <span>Section 80D - Health Insurance</span>
                              <span className="text-xs text-muted-foreground ml-2">Max ₹1L</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="pt-2 space-y-4">
                            <InputWithLabel
                              label="Self & Family Premium"
                              id="section80D_self"
                              value={inputs.section80D_self}
                              onChange={(v) => updateInput("section80D_self", v)}
                              tooltip={`Max limit: ${inputs.ageGroup === "below60" ? "₹25,000" : "₹50,000"}`}
                            />
                            <InputWithLabel
                              label="Parents' Premium"
                              id="section80D_parents"
                              value={inputs.section80D_parents}
                              onChange={(v) => updateInput("section80D_parents", v)}
                              tooltip="Max limit: ₹50,000 (for senior citizen parents)"
                            />
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="others" className="border rounded-lg px-4">
                          <AccordionTrigger className="hover:no-underline">
                            <div className="flex items-center gap-2">
                              <Landmark className="w-4 h-4 text-primary" />
                              <span>Other Deductions</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="pt-2 space-y-4">
                            <InputWithLabel
                              label="Section 80E - Education Loan Interest"
                              id="section80E"
                              value={inputs.section80E}
                              onChange={(v) => updateInput("section80E", v)}
                              tooltip="No upper limit. Deduction for interest on education loan."
                            />
                            <InputWithLabel
                              label="Section 80G - Donations"
                              id="section80G"
                              value={inputs.section80G}
                              onChange={(v) => updateInput("section80G", v)}
                              tooltip="Donations to approved charities (50% or 100% deduction)"
                            />
                            <InputWithLabel
                              label="Section 80TTA - Savings Interest"
                              id="section80TTA"
                              value={inputs.section80TTA}
                              onChange={(v) => updateInput("section80TTA", v)}
                              tooltip="Interest from savings account. Max ₹10,000"
                            />
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </TabsContent>

                    <TabsContent value="other" className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Home Loan</h3>
                        <div className="p-4 bg-muted/30 rounded-lg space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <Label className="text-base font-semibold">Self-Occupied Property?</Label>
                              <p className="text-sm text-muted-foreground">Max ₹2L interest deduction if yes</p>
                            </div>
                            <Switch
                              checked={inputs.isPropertySelfOccupied}
                              onCheckedChange={(v) => updateInput("isPropertySelfOccupied", v)}
                            />
                          </div>
                          <InputWithLabel
                            label="Home Loan Interest (Annual)"
                            id="homeLoanInterest"
                            value={inputs.homeLoanInterest}
                            onChange={(v) => updateInput("homeLoanInterest", v)}
                            icon={Building2}
                            tooltip="Section 24(b) - Interest on home loan"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Employer Contributions</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <InputWithLabel
                            label="NPS Employer Contribution"
                            id="npsEmployerContribution"
                            value={inputs.npsEmployerContribution}
                            onChange={(v) => updateInput("npsEmployerContribution", v)}
                            tooltip="Section 80CCD(2) - Allowed in both regimes. Max 10-14% of basic."
                          />
                          <InputWithLabel
                            label="Professional Tax"
                            id="professionalTax"
                            value={inputs.professionalTax}
                            onChange={(v) => updateInput("professionalTax", v)}
                            tooltip="Professional tax paid. Max ₹2,500"
                          />
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>

                  <div className="mt-8 flex flex-wrap justify-center gap-3">
                    <Button 
                      onClick={handleReset}
                      variant="outline"
                      size="lg"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Reset All
                    </Button>
                    <Button 
                      onClick={() => setShowTips(!showTips)}
                      variant="outline"
                      size="lg"
                    >
                      <Lightbulb className="w-4 h-4 mr-2" />
                      {showTips ? "Hide Tips" : "Tax Saving Tips"}
                    </Button>
                    <Button 
                      onClick={() => {
                        const element = document.getElementById('tax-results');
                        element?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      size="lg"
                      className="px-8"
                    >
                      View Results <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>

                  {/* Tax Saving Tips Section */}
                  {showTips && (
                    <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                      <h3 className="font-semibold flex items-center gap-2 mb-4">
                        <Lightbulb className="w-5 h-5 text-primary" />
                        Personalized Tax Saving Tips
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {generateTaxTips.map((tip, index) => (
                          <div key={index} className="p-3 bg-background rounded-lg border">
                            <div className="flex items-center gap-2 mb-2">
                              <tip.icon className="w-4 h-4 text-primary" />
                              <span className="font-medium text-sm">{tip.title}</span>
                            </div>
                            <p className="text-xs text-muted-foreground mb-2">{tip.description}</p>
                            <p className="text-xs font-semibold text-primary">{tip.potential}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Results Section */}
            <div id="tax-results" className="lg:col-span-1 space-y-4">
              {/* Quick Summary */}
              <Card className="shadow-lg border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <TrendingDown className="w-5 h-5 text-primary" />
                      Best Option
                    </CardTitle>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={handleDownloadSummary}
                      className="h-8 w-8 p-0"
                      title="Download Summary"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-4">
                    <p className="text-3xl font-bold text-primary">{betterRegime}</p>
                    {betterRegime !== "Both Equal" && (
                      <>
                        <p className="text-sm text-muted-foreground mt-1">saves you</p>
                        <p className="text-2xl font-bold text-foreground">{formatCurrency(savings)}</p>
                        <p className="text-xs text-muted-foreground">{viewMode === "monthly" ? "/month" : "/year"}</p>
                      </>
                    )}
                    {betterRegime === "Both Equal" && (
                      <p className="text-sm text-muted-foreground mt-2">Both regimes result in the same tax</p>
                    )}
                  </div>

                  {/* Visual Comparison Bar */}
                  {oldRegimeResult.grossIncome > 0 && (
                    <div className="mt-4 space-y-3">
                      <div className="flex items-center gap-2 text-xs">
                        <BarChart3 className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Tax Comparison</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs w-16">Old</span>
                          <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-chart-1 rounded-full transition-all duration-500"
                              style={{ width: `${oldRegimePercent}%` }}
                            />
                          </div>
                          <span className="text-xs w-20 text-right">{formatLakh(oldRegimeResult.totalTax)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs w-16">New</span>
                          <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-chart-2 rounded-full transition-all duration-500"
                              style={{ width: `${newRegimePercent}%` }}
                            />
                          </div>
                          <span className="text-xs w-20 text-right">{formatLakh(newRegimeResult.totalTax)}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Old Regime */}
              <Card className={`shadow-lg border-2 transition-all ${betterRegime === "Old Regime" ? "border-primary" : "border-border"}`}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Old Regime</CardTitle>
                    {betterRegime === "Old Regime" && (
                      <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">Recommended</span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-center py-2">
                    <p className="text-3xl font-bold text-foreground">{formatCurrency(oldRegimeResult.totalTax)}</p>
                    <p className="text-xs text-muted-foreground">
                      Effective Rate: {oldRegimeResult.effectiveRate.toFixed(1)}% | Marginal: {oldRegimeResult.marginalRate}%
                    </p>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Gross Income</span>
                      <span>{formatLakh(oldRegimeResult.grossIncome)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Standard Deduction</span>
                      <span className="text-destructive">-{formatCurrency(oldRegimeResult.standardDeduction)}</span>
                    </div>
                    {oldRegimeResult.hraExemption > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">HRA Exemption</span>
                        <span className="text-destructive">-{formatCurrency(oldRegimeResult.hraExemption)}</span>
                      </div>
                    )}
                    {oldRegimeResult.chapter6Deductions > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Chapter VI-A</span>
                        <span className="text-destructive">-{formatCurrency(oldRegimeResult.chapter6Deductions)}</span>
                      </div>
                    )}
                    {oldRegimeResult.homeLoanDeduction > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Home Loan Int.</span>
                        <span className="text-destructive">-{formatCurrency(oldRegimeResult.homeLoanDeduction)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-medium pt-2 border-t">
                      <span>Taxable Income</span>
                      <span>{formatLakh(oldRegimeResult.taxableIncome)}</span>
                    </div>
                    
                    {/* Slab Breakdown */}
                    {oldRegimeResult.slabBreakdown.length > 0 && oldRegimeResult.totalTax > 0 && (
                      <div className="mt-2 pt-2 border-t">
                        <p className="text-xs text-muted-foreground mb-2">Tax Slab Breakdown:</p>
                        {oldRegimeResult.slabBreakdown.filter(s => s.tax > 0).map((slab, idx) => (
                          <div key={idx} className="flex justify-between text-xs">
                            <span className="text-muted-foreground">{slab.slab} @ {slab.rate}</span>
                            <span>{formatCurrency(slab.tax)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {oldRegimeResult.surcharge > 0 && (
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Surcharge</span>
                        <span>{formatCurrency(oldRegimeResult.surcharge)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Cess (4%)</span>
                      <span>{formatCurrency(oldRegimeResult.cess)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* New Regime */}
              <Card className={`shadow-lg border-2 transition-all ${betterRegime === "New Regime" ? "border-primary" : "border-border"}`}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">New Regime</CardTitle>
                    {betterRegime === "New Regime" && (
                      <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">Recommended</span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-center py-2">
                    <p className="text-3xl font-bold text-foreground">{formatCurrency(newRegimeResult.totalTax)}</p>
                    <p className="text-xs text-muted-foreground">
                      Effective Rate: {newRegimeResult.effectiveRate.toFixed(1)}% | Marginal: {newRegimeResult.marginalRate}%
                    </p>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Gross Income</span>
                      <span>{formatLakh(newRegimeResult.grossIncome)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Standard Deduction</span>
                      <span className="text-destructive">-{formatCurrency(newRegimeResult.standardDeduction)}</span>
                    </div>
                    {newRegimeResult.chapter6Deductions > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">NPS (Employer)</span>
                        <span className="text-destructive">-{formatCurrency(newRegimeResult.chapter6Deductions)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-medium pt-2 border-t">
                      <span>Taxable Income</span>
                      <span>{formatLakh(newRegimeResult.taxableIncome)}</span>
                    </div>
                    
                    {/* Slab Breakdown */}
                    {newRegimeResult.slabBreakdown.length > 0 && newRegimeResult.totalTax > 0 && (
                      <div className="mt-2 pt-2 border-t">
                        <p className="text-xs text-muted-foreground mb-2">Tax Slab Breakdown:</p>
                        {newRegimeResult.slabBreakdown.filter(s => s.tax > 0).map((slab, idx) => (
                          <div key={idx} className="flex justify-between text-xs">
                            <span className="text-muted-foreground">{slab.slab} @ {slab.rate}</span>
                            <span>{formatCurrency(slab.tax)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {newRegimeResult.surcharge > 0 && (
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Surcharge</span>
                        <span>{formatCurrency(newRegimeResult.surcharge)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Cess (4%)</span>
                      <span>{formatCurrency(newRegimeResult.cess)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <p className="text-xs text-muted-foreground text-center px-4">
                *Calculations are based on FY 2024-25 tax rules. For personalized advice, 
                <a href="#contact" className="text-primary hover:underline ml-1">consult our experts</a>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TaxCalculator;
