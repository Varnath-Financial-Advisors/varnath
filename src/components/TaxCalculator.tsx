import { useEffect, useMemo, useState } from "react";
import TaxInputField from "@/components/TaxInputField";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calculator, TrendingDown, ArrowRight, Building2, Heart, Briefcase, Home,
  GraduationCap, Landmark, Info, Users, Calendar, Lightbulb, BarChart3,
  Download, RefreshCw, LineChart, AlertTriangle,
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { calcHRAExemption, computeTax, TaxResult } from "@/lib/taxEngine";
import { AgeGroup, FY_OPTIONS, RATES_LAST_VERIFIED, RATES_SOURCE_NOTE } from "@/data/taxRules";

interface TaxInputs {
  ageGroup: AgeGroup;
  residentialStatus: "resident" | "nonResident";
  basicSalary: string;
  hra: string;
  specialAllowances: string;
  lta: string;
  otherIncome: string;
  interestIncome: string;
  rentalIncome: string;
  // Special-rate income (87A rebate does NOT apply to these)
  stcgEquity: string;
  ltcgEquity: string;
  lotteryWinnings: string;
  // HRA
  isMetroCity: boolean;
  actualRentPaid: string;
  // Old-regime deductions
  section80C: string;
  section80CCD1B: string;
  section80D_self: string;
  section80D_parents: string;
  section80E: string;
  section80G: string;
  section80TTA: string;
  homeLoanInterest: string;
  isPropertySelfOccupied: boolean;
  professionalTax: string;
  npsEmployerContribution: string;
}

const EMPTY_INPUTS: TaxInputs = {
  ageGroup: "below60",
  residentialStatus: "resident",
  basicSalary: "",
  hra: "",
  specialAllowances: "",
  lta: "",
  otherIncome: "",
  interestIncome: "",
  rentalIncome: "",
  stcgEquity: "",
  ltcgEquity: "",
  lotteryWinnings: "",
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
};

const STORAGE_KEY = "varnath-tax-calculator-v2";

/** Inline explainer for jargon terms — expands on tap/hover, keeps user on page */
const TermInfo = ({ children }: { children: React.ReactNode }) => (
  <TooltipProvider delayDuration={150}>
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label="What does this mean?"
          className="inline-flex align-middle text-muted-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-full transition-colors"
        >
          <Info className="w-3.5 h-3.5" />
        </button>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <p className="text-xs leading-relaxed">{children}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

const TaxCalculator = () => {
  const [inputs, setInputs] = useState<TaxInputs>(() => {
    // Persist the user's last inputs so refresh / tab-switch doesn't reset the form
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return { ...EMPTY_INPUTS, ...JSON.parse(saved).inputs };
    } catch { /* corrupt/blocked storage — fall through to defaults */ }
    return EMPTY_INPUTS;
  });
  const [fyId, setFyId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved).fyId;
        if (FY_OPTIONS.some((f) => f.id === parsed)) return parsed;
      }
    } catch { /* ignore */ }
    return FY_OPTIONS[0].id;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ inputs, fyId }));
    } catch { /* storage may be unavailable (private mode) — non-fatal */ }
  }, [inputs, fyId]);

  const [activeTab, setActiveTab] = useState("income");
  const [viewMode, setViewMode] = useState<"annual" | "monthly">("annual");
  const [showTips, setShowTips] = useState(false);

  const fy = FY_OPTIONS.find((f) => f.id === fyId) ?? FY_OPTIONS[0];

  const parseNumber = (value: string): number => {
    if (!value) return 0;
    const parsed = parseFloat(value.replace(/,/g, "").replace(/[^0-9.]/g, ""));
    return isNaN(parsed) || parsed < 0 ? 0 : parsed;
  };

  const updateInput = (field: keyof TaxInputs, value: string | boolean) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const hraExemption = useMemo(
    () =>
      calcHRAExemption(
        parseNumber(inputs.basicSalary),
        parseNumber(inputs.hra),
        parseNumber(inputs.actualRentPaid),
        inputs.isMetroCity
      ),
    [inputs.basicSalary, inputs.hra, inputs.actualRentPaid, inputs.isMetroCity]
  );

  const engineInput = useMemo(() => {
    const salaryIncome =
      parseNumber(inputs.basicSalary) +
      parseNumber(inputs.hra) +
      parseNumber(inputs.specialAllowances) +
      parseNumber(inputs.lta);
    return {
      ageGroup: inputs.ageGroup,
      resident: inputs.residentialStatus === "resident",
      salaryIncome,
      otherIncome:
        parseNumber(inputs.otherIncome) +
        parseNumber(inputs.interestIncome) +
        parseNumber(inputs.rentalIncome),
      hraExemption,
      ded80C: parseNumber(inputs.section80C),
      ded80CCD1B: parseNumber(inputs.section80CCD1B),
      ded80D_self: parseNumber(inputs.section80D_self),
      ded80D_parents: parseNumber(inputs.section80D_parents),
      ded80E: parseNumber(inputs.section80E),
      ded80G: parseNumber(inputs.section80G),
      dedInterest: parseNumber(inputs.section80TTA),
      npsEmployer: parseNumber(inputs.npsEmployerContribution),
      basicSalary: parseNumber(inputs.basicSalary),
      homeLoanInterest: parseNumber(inputs.homeLoanInterest),
      isPropertySelfOccupied: inputs.isPropertySelfOccupied,
      professionalTax: parseNumber(inputs.professionalTax),
      special: {
        stcgEquity: parseNumber(inputs.stcgEquity),
        ltcgEquity: parseNumber(inputs.ltcgEquity),
        lottery: parseNumber(inputs.lotteryWinnings),
      },
    };
  }, [inputs, hraExemption]);

  const oldRegimeResult = useMemo(
    () => computeTax({ ...engineInput, regime: "old" }),
    [engineInput]
  );
  const newRegimeResult = useMemo(
    () => computeTax({ ...engineInput, regime: "new" }),
    [engineInput]
  );

  const savings = Math.abs(oldRegimeResult.totalTax - newRegimeResult.totalTax);
  const betterRegime =
    oldRegimeResult.totalTax === newRegimeResult.totalTax
      ? "Both Equal"
      : oldRegimeResult.totalTax < newRegimeResult.totalTax
        ? "Old Regime"
        : "New Regime";

  const hasSpecialIncome = engineInput.special.stcgEquity > 0 || engineInput.special.ltcgEquity > 0 || engineInput.special.lottery > 0;

  const handleReset = () => {
    setInputs(EMPTY_INPUTS);
    setShowTips(false);
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
  };

  const formatCurrency = (value: number) => {
    const displayValue = viewMode === "monthly" ? value / 12 : value;
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(displayValue);
  };

  const formatLakh = (value: number) => {
    const displayValue = viewMode === "monthly" ? value / 12 : value;
    if (viewMode === "annual") {
      if (displayValue >= 10000000) return `₹${(displayValue / 10000000).toFixed(2)} Cr`;
      if (displayValue >= 100000) return `₹${(displayValue / 100000).toFixed(2)} L`;
    }
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(displayValue);
  };

  const handleDownloadSummary = () => {
    const line = (r: TaxResult) => `
- Standard Deduction: ${formatCurrency(r.standardDeduction)}
${r.hraExemption > 0 ? `- HRA Exemption: ${formatCurrency(r.hraExemption)}\n` : ""}${r.chapterVIA > 0 ? `- Chapter VI-A / NPS: ${formatCurrency(r.chapterVIA)}\n` : ""}${r.homeLoanDeduction > 0 ? `- Home Loan Interest: ${formatCurrency(r.homeLoanDeduction)}\n` : ""}- Taxable Income: ${formatCurrency(r.totalTaxableIncome)}
- Tax Before Rebate: ${formatCurrency(r.taxBeforeRebate)}
${r.rebate87A > 0 ? `- Rebate u/s 87A: -${formatCurrency(r.rebate87A)}\n` : ""}${r.marginalRelief87A > 0 ? `- Marginal Relief (87A): -${formatCurrency(r.marginalRelief87A)}\n` : ""}${r.surcharge > 0 ? `- Surcharge: ${formatCurrency(r.surcharge)}\n` : ""}${r.surchargeMarginalRelief > 0 ? `- Surcharge Marginal Relief: -${formatCurrency(r.surchargeMarginalRelief)}\n` : ""}- Cess (4%): ${formatCurrency(r.cess)}
- TOTAL TAX: ${formatCurrency(r.totalTax)}
- Effective Rate: ${r.effectiveRate.toFixed(2)}%`;

    const summary = `
INCOME TAX CALCULATION SUMMARY — ${fy.label} (${fy.assessmentYear})
============================================

GROSS INCOME: ${formatCurrency(newRegimeResult.grossIncome)}
${hasSpecialIncome ? `(includes special-rate income of ${formatCurrency(newRegimeResult.specialIncomeTotal)} — not eligible for 87A rebate)\n` : ""}
OLD REGIME:${line(oldRegimeResult)}

NEW REGIME:${line(newRegimeResult)}

RECOMMENDATION: ${betterRegime}
${betterRegime !== "Both Equal" ? `SAVINGS: ${formatCurrency(savings)}` : ""}

Rates last verified: ${RATES_LAST_VERIFIED}
Note: This is an estimate. Consult a tax professional for personalized advice.
Generated by Varnath Tax Calculator
    `.trim();

    const blob = new Blob([summary], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tax-summary-${fy.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Tax-saving tips (old-regime deduction gaps)
  const tips = useMemo(() => {
    const list: { title: string; description: string; icon: React.ElementType }[] = [];
    if (parseNumber(inputs.section80C) < 150000)
      list.push({
        title: "Maximize 80C Investments",
        description: `₹${(150000 - parseNumber(inputs.section80C)).toLocaleString("en-IN")} of your 80C limit is unused (PPF, ELSS, life insurance, EPF).`,
        icon: Landmark,
      });
    if (parseNumber(inputs.section80CCD1B) < 50000)
      list.push({
        title: "NPS under 80CCD(1B)",
        description: "Extra ₹50,000 deduction over and above 80C for NPS contributions.",
        icon: GraduationCap,
      });
    if (parseNumber(inputs.section80D_self) === 0)
      list.push({
        title: "Health Insurance (80D)",
        description: "Premiums for self & family are deductible up to ₹25,000 (₹50,000 for seniors).",
        icon: Heart,
      });
    if (parseNumber(inputs.hra) > 0 && parseNumber(inputs.actualRentPaid) === 0)
      list.push({
        title: "Claim HRA Exemption",
        description: "Enter your annual rent to compute the HRA exemption (old regime).",
        icon: Home,
      });
    if (list.length === 0)
      list.push({
        title: "Great Tax Planning!",
        description: "You're utilizing the major deductions effectively.",
        icon: Lightbulb,
      });
    return list.slice(0, 3);
  }, [inputs]);

  /* ── Regime result card (rendered twice, side by side) ── */
  const RegimeCard = ({ title, result }: { title: string; result: TaxResult }) => (
    <Card
      className={`shadow-lg border-2 transition-all duration-200 ${betterRegime === title ? "border-primary" : "border-border"}`}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          {betterRegime === title && (
            <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
              Recommended
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-center py-2" aria-live="polite">
          <p className="text-3xl font-bold text-foreground">{formatCurrency(result.totalTax)}</p>
          <p className="text-xs text-muted-foreground">
            Effective Rate: {result.effectiveRate.toFixed(1)}% | Marginal: {result.marginalRate}%
          </p>
        </div>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Gross Income</span>
            <span>{formatLakh(result.grossIncome)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Standard Deduction</span>
            <span className="text-destructive">-{formatCurrency(result.standardDeduction)}</span>
          </div>
          {result.hraExemption > 0 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">HRA Exemption</span>
              <span className="text-destructive">-{formatCurrency(result.hraExemption)}</span>
            </div>
          )}
          {result.chapterVIA > 0 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                {result.regime === "new" ? "NPS (Employer)" : "Chapter VI-A"}
              </span>
              <span className="text-destructive">-{formatCurrency(result.chapterVIA)}</span>
            </div>
          )}
          {result.homeLoanDeduction > 0 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Home Loan Int.</span>
              <span className="text-destructive">-{formatCurrency(result.homeLoanDeduction)}</span>
            </div>
          )}
          <div className="flex justify-between font-medium pt-2 border-t">
            <span>Taxable Income</span>
            <span>{formatLakh(result.totalTaxableIncome)}</span>
          </div>

          {/* Slab breakdown */}
          {result.normalTax > 0 && (
            <div className="mt-2 pt-2 border-t">
              <p className="text-xs text-muted-foreground mb-2">Slab-rate tax:</p>
              {result.slabBreakdown.filter((s) => s.tax > 0).map((slab, idx) => (
                <div key={idx} className="flex justify-between text-xs">
                  <span className="text-muted-foreground">
                    {slab.label} @ {(slab.rate * 100).toFixed(0)}%
                  </span>
                  <span>{formatCurrency(slab.tax)}</span>
                </div>
              ))}
            </div>
          )}

          {/* Special-rate income taxes (87A carve-out) */}
          {result.specialTaxLines.length > 0 && (
            <div className="mt-2 pt-2 border-t">
              <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                Special-rate tax
                <TermInfo>
                  Capital gains on equity (u/s 111A / 112A) and lottery winnings are taxed at
                  fixed rates. The Section 87A rebate does not apply to this tax — it stays
                  payable even if your total income is under ₹12 lakh (new regime).
                </TermInfo>
              </p>
              {result.specialTaxLines.map((s, idx) => (
                <div key={idx} className="flex justify-between text-xs">
                  <span className="text-muted-foreground">
                    {s.label} @ {(s.rate * 100).toFixed(1).replace(/\.0$/, "")}%
                  </span>
                  <span>{formatCurrency(s.tax)}</span>
                </div>
              ))}
              {result.ltcgExemptionUsed > 0 && (
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">LTCG exemption used</span>
                  <span className="text-destructive">-{formatCurrency(result.ltcgExemptionUsed)}</span>
                </div>
              )}
            </div>
          )}

          {result.taxBeforeRebate > 0 && (
            <div className="flex justify-between text-xs font-medium mt-1 pt-1 border-t border-dashed">
              <span>Tax Before Rebate</span>
              <span>{formatCurrency(result.taxBeforeRebate)}</span>
            </div>
          )}

          {result.rebate87A > 0 && (
            <div className="flex justify-between text-xs bg-green-50 dark:bg-green-950/30 p-1 rounded">
              <span className="text-green-700 dark:text-green-400 font-medium flex items-center gap-1">
                Rebate u/s 87A
                <TermInfo>
                  Resident individuals with taxable income up to ₹12 lakh (new regime) / ₹5 lakh
                  (old regime) get their slab-rate tax waived up to ₹60,000 / ₹12,500.
                </TermInfo>
              </span>
              <span className="text-green-700 dark:text-green-400 font-medium">
                -{formatCurrency(result.rebate87A)}
              </span>
            </div>
          )}

          {result.marginalRelief87A > 0 && (
            <div className="flex justify-between text-xs bg-blue-50 dark:bg-blue-950/30 p-1 rounded">
              <span className="text-blue-700 dark:text-blue-400 font-medium flex items-center gap-1">
                Marginal Relief
                <TermInfo>
                  If your income is just above ₹12 lakh, your extra tax is capped at the amount
                  by which income exceeds ₹12 lakh — so earning ₹1 more never costs you more
                  than ₹1 in tax.
                </TermInfo>
              </span>
              <span className="text-blue-700 dark:text-blue-400 font-medium">
                -{formatCurrency(result.marginalRelief87A)}
              </span>
            </div>
          )}

          {result.surcharge > 0 && (
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground flex items-center gap-1">
                Surcharge ({(result.surchargeRate * 100).toFixed(0)}%)
                <TermInfo>
                  An additional levy on the tax amount for total income above ₹50 lakh
                  (10% / 15% / 25% / 37%; capped at 25% in the new regime and 15% on equity
                  capital-gains tax). Marginal relief applies at each threshold.
                </TermInfo>
              </span>
              <span>{formatCurrency(result.surcharge)}</span>
            </div>
          )}
          {result.surchargeMarginalRelief > 0 && (
            <div className="flex justify-between text-xs bg-blue-50 dark:bg-blue-950/30 p-1 rounded">
              <span className="text-blue-700 dark:text-blue-400 font-medium">
                Surcharge Marginal Relief
              </span>
              <span className="text-blue-700 dark:text-blue-400 font-medium">
                -{formatCurrency(result.surchargeMarginalRelief)}
              </span>
            </div>
          )}
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground flex items-center gap-1">
              Cess (4%)
              <TermInfo>
                Health &amp; Education Cess — 4% charged on income tax plus surcharge, in both
                regimes.
              </TermInfo>
            </span>
            <span>{formatCurrency(result.cess)}</span>
          </div>
          <div className="flex justify-between font-semibold text-sm pt-2 border-t">
            <span>Net Tax Payable</span>
            <span>{formatCurrency(result.totalTax)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const maxTax = Math.max(oldRegimeResult.totalTax, newRegimeResult.totalTax, 1);

  return (
    <section id="tax-calculator" className="py-20 px-4 bg-accent/50">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Calculator className="w-4 h-4" />
            Advanced Tax Calculator
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Income Tax Calculator {fy.label}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            Compare Old vs New Tax Regime with all deductions, exemptions &amp; surcharges —
            updated for {fy.label} ({fy.assessmentYear})
          </p>
          <div className="inline-flex items-center gap-2">
            <Label className="text-sm text-muted-foreground">Financial Year</Label>
            <Select value={fyId} onValueChange={setFyId}>
              <SelectTrigger className="w-44 bg-card">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FY_OPTIONS.map((f) => (
                  <SelectItem key={f.id} value={f.id}>
                    {f.label} ({f.assessmentYear})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {fy.taxYearNote && (
            <p className="text-xs text-muted-foreground max-w-xl mx-auto mt-3">
              <Info className="w-3 h-3 inline mr-1" />
              {fy.taxYearNote}
            </p>
          )}
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
                    <TabsList className="grid w-full grid-cols-5 mb-6">
                      <TabsTrigger value="income" className="text-xs sm:text-sm">
                        <Briefcase className="w-4 h-4 mr-1 hidden sm:inline" />
                        Income
                      </TabsTrigger>
                      <TabsTrigger value="gains" className="text-xs sm:text-sm">
                        <LineChart className="w-4 h-4 mr-1 hidden sm:inline" />
                        Gains
                      </TabsTrigger>
                      <TabsTrigger value="hra" className="text-xs sm:text-sm">
                        <Home className="w-4 h-4 mr-1 hidden sm:inline" />
                        HRA
                      </TabsTrigger>
                      <TabsTrigger value="deductions" className="text-xs sm:text-sm">
                        <Landmark className="w-4 h-4 mr-1 hidden sm:inline" />
                        Deduct
                      </TabsTrigger>
                      <TabsTrigger value="other" className="text-xs sm:text-sm">
                        <Building2 className="w-4 h-4 mr-1 hidden sm:inline" />
                        Other
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="income" className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                        <div className="space-y-2">
                          <Label className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-muted-foreground" />
                            Age Group
                          </Label>
                          <Select
                            value={inputs.ageGroup}
                            onValueChange={(v) => updateInput("ageGroup", v as AgeGroup)}
                          >
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
                          <Select
                            value={inputs.residentialStatus}
                            onValueChange={(v) =>
                              updateInput("residentialStatus", v as TaxInputs["residentialStatus"])
                            }
                          >
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

                      <div className="space-y-4">
                        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                          Salary Income
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <TaxInputField
                            label="Basic Salary (Annual)"
                            id="basicSalary"
                            value={inputs.basicSalary}
                            onChange={(v) => updateInput("basicSalary", v)}
                            icon={Briefcase}
                            tooltip="Your annual basic salary before any allowances"
                          />
                          <TaxInputField
                            label="HRA Received"
                            id="hra"
                            value={inputs.hra}
                            onChange={(v) => updateInput("hra", v)}
                            icon={Home}
                            tooltip="House Rent Allowance received from employer"
                          />
                          <TaxInputField
                            label="Special Allowances"
                            id="specialAllowances"
                            value={inputs.specialAllowances}
                            onChange={(v) => updateInput("specialAllowances", v)}
                            tooltip="DA, Conveyance, Medical, and other allowances"
                          />
                          <TaxInputField
                            label="LTA"
                            id="lta"
                            value={inputs.lta}
                            onChange={(v) => updateInput("lta", v)}
                            tooltip="Leave Travel Allowance"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                          Other Income
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <TaxInputField
                            label="Other Income"
                            id="otherIncome"
                            value={inputs.otherIncome}
                            onChange={(v) => updateInput("otherIncome", v)}
                            tooltip="Freelance, business, or any other income"
                          />
                          <TaxInputField
                            label="Interest Income"
                            id="interestIncome"
                            value={inputs.interestIncome}
                            onChange={(v) => updateInput("interestIncome", v)}
                            tooltip="Interest from savings, FD, bonds etc."
                          />
                          <TaxInputField
                            label="Rental Income"
                            id="rentalIncome"
                            value={inputs.rentalIncome}
                            onChange={(v) => updateInput("rentalIncome", v)}
                            tooltip="Annual rental income from properties"
                          />
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="gains" className="space-y-6">
                      <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                        <p className="text-sm text-amber-700 dark:text-amber-400 flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                          <span>
                            <strong>Important:</strong> the Section 87A rebate does <strong>not</strong> apply
                            to this income. Equity capital gains and lottery winnings are taxed at
                            special rates even if your total income is below ₹12 lakh (new regime).
                          </span>
                        </p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <TaxInputField
                          label="STCG — Equity Shares / MFs"
                          id="stcgEquity"
                          value={inputs.stcgEquity}
                          onChange={(v) => updateInput("stcgEquity", v)}
                          icon={LineChart}
                          tooltip="Short-term capital gains on listed equity shares / equity mutual funds (u/s 111A) — taxed at 20%"
                        />
                        <TaxInputField
                          label="LTCG — Equity Shares / MFs"
                          id="ltcgEquity"
                          value={inputs.ltcgEquity}
                          onChange={(v) => updateInput("ltcgEquity", v)}
                          icon={LineChart}
                          tooltip="Long-term capital gains on listed equity (u/s 112A) — first ₹1.25 lakh exempt, balance taxed at 12.5%"
                        />
                        <TaxInputField
                          label="Lottery / Game-Show Winnings"
                          id="lotteryWinnings"
                          value={inputs.lotteryWinnings}
                          onChange={(v) => updateInput("lotteryWinnings", v)}
                          tooltip="Winnings from lotteries, game shows, puzzles (u/s 115BB) — flat 30%, no basic exemption or rebate"
                        />
                      </div>
                      {(newRegimeResult.rebateBlockedBySpecialIncome ||
                        oldRegimeResult.rebateBlockedBySpecialIncome) && (
                        <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                          <p className="text-xs text-muted-foreground">
                            <Info className="w-3 h-3 inline mr-1" />
                            Your special-rate income affects the 87A rebate: the rebate (if any)
                            applies only to slab-rate tax — tax on these gains stays payable
                            separately. See the “Special-rate tax” lines in the results.
                          </p>
                        </div>
                      )}
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
                        <TaxInputField
                          label="Actual Rent Paid (Annual)"
                          id="actualRentPaid"
                          value={inputs.actualRentPaid}
                          onChange={(v) => updateInput("actualRentPaid", v)}
                          icon={Home}
                          tooltip="Total rent paid in a year. Required for HRA exemption calculation."
                        />
                        {hraExemption > 0 && (
                          <div className="p-3 bg-primary/10 rounded-lg">
                            <p className="text-sm font-medium text-primary">
                              Estimated HRA Exemption:{" "}
                              {new Intl.NumberFormat("en-IN", {
                                style: "currency",
                                currency: "INR",
                                maximumFractionDigits: 0,
                              }).format(hraExemption)}
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
                          ⚠️ These deductions are applicable only under the <strong>Old Tax Regime</strong>.
                          The new regime allows only the ₹75,000 standard deduction and employer NPS
                          u/s 80CCD(2).
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
                            <TaxInputField
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
                              Additional deduction for NPS contribution (over &amp; above 80C limit)
                            </p>
                            <TaxInputField
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
                            <TaxInputField
                              label="Self & Family Premium"
                              id="section80D_self"
                              value={inputs.section80D_self}
                              onChange={(v) => updateInput("section80D_self", v)}
                              tooltip={`Max limit: ${inputs.ageGroup === "below60" ? "₹25,000" : "₹50,000"}`}
                            />
                            <TaxInputField
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
                            <TaxInputField
                              label="Section 80E - Education Loan Interest"
                              id="section80E"
                              value={inputs.section80E}
                              onChange={(v) => updateInput("section80E", v)}
                              tooltip="No upper limit. Deduction for interest on education loan."
                            />
                            <TaxInputField
                              label="Section 80G - Donations"
                              id="section80G"
                              value={inputs.section80G}
                              onChange={(v) => updateInput("section80G", v)}
                              tooltip="Donations to approved charities (50% or 100% deduction)"
                            />
                            <TaxInputField
                              label={inputs.ageGroup === "below60" ? "Section 80TTA - Savings Interest" : "Section 80TTB - Interest Income"}
                              id="section80TTA"
                              value={inputs.section80TTA}
                              onChange={(v) => updateInput("section80TTA", v)}
                              tooltip={
                                inputs.ageGroup === "below60"
                                  ? "Interest from savings account. Max ₹10,000"
                                  : "Senior citizens: interest from savings + deposits. Max ₹50,000 (80TTB)"
                              }
                            />
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </TabsContent>

                    <TabsContent value="other" className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                          Home Loan
                        </h3>
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
                          <TaxInputField
                            label="Home Loan Interest (Annual)"
                            id="homeLoanInterest"
                            value={inputs.homeLoanInterest}
                            onChange={(v) => updateInput("homeLoanInterest", v)}
                            icon={Building2}
                            tooltip="Section 24(b) - Interest on home loan (Old Regime, self-occupied)"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                          Employer Contributions
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <TaxInputField
                            label="NPS Employer Contribution"
                            id="npsEmployerContribution"
                            value={inputs.npsEmployerContribution}
                            onChange={(v) => updateInput("npsEmployerContribution", v)}
                            tooltip="Section 80CCD(2) - Allowed in both regimes. Capped at 14% of basic (new) / 10% (old)."
                          />
                          <TaxInputField
                            label="Professional Tax"
                            id="professionalTax"
                            value={inputs.professionalTax}
                            onChange={(v) => updateInput("professionalTax", v)}
                            tooltip="Professional tax paid. Max ₹2,500 (Old Regime)"
                          />
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>

                  <div className="mt-8 flex flex-wrap justify-center gap-3">
                    <Button onClick={handleReset} variant="outline" size="lg">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Reset All
                    </Button>
                    <Button onClick={() => setShowTips(!showTips)} variant="outline" size="lg">
                      <Lightbulb className="w-4 h-4 mr-2" />
                      {showTips ? "Hide Tips" : "Tax Saving Tips"}
                    </Button>
                    <Button
                      onClick={() => {
                        const element = document.getElementById("tax-results");
                        element?.scrollIntoView({ behavior: "smooth" });
                      }}
                      size="lg"
                      className="px-8"
                    >
                      View Results <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>

                  {showTips && (
                    <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                      <h3 className="font-semibold flex items-center gap-2 mb-4">
                        <Lightbulb className="w-5 h-5 text-primary" />
                        Personalized Tax Saving Tips (Old Regime)
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {tips.map((tip, index) => (
                          <div key={index} className="p-3 bg-background rounded-lg border">
                            <div className="flex items-center gap-2 mb-2">
                              <tip.icon className="w-4 h-4 text-primary" />
                              <span className="font-medium text-sm">{tip.title}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">{tip.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Results Section — both regimes visible side by side */}
            <div id="tax-results" className="lg:col-span-1 space-y-4">
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
                        <p className="text-xs text-muted-foreground">
                          {viewMode === "monthly" ? "/month" : "/year"}
                        </p>
                      </>
                    )}
                    {betterRegime === "Both Equal" && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Both regimes result in the same tax
                      </p>
                    )}
                  </div>

                  {newRegimeResult.grossIncome > 0 && (
                    <div className="mt-4 space-y-3">
                      <div className="flex items-center gap-2 text-xs">
                        <BarChart3 className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Tax Comparison</span>
                      </div>
                      <div className="space-y-2">
                        {[
                          { label: "Old", value: oldRegimeResult.totalTax, cls: "bg-chart-1" },
                          { label: "New", value: newRegimeResult.totalTax, cls: "bg-chart-2" },
                        ].map((row) => (
                          <div key={row.label} className="flex items-center gap-2">
                            <span className="text-xs w-16">{row.label}</span>
                            <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                              <div
                                className={`h-full ${row.cls} rounded-full transition-all duration-500`}
                                style={{ width: `${(row.value / maxTax) * 100}%` }}
                              />
                            </div>
                            <span className="text-xs w-20 text-right">{formatLakh(row.value)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <RegimeCard title="New Regime" result={newRegimeResult} />
              <RegimeCard title="Old Regime" result={oldRegimeResult} />

              <p className="text-xs text-muted-foreground text-center px-4">
                *Calculations follow {fy.label} ({fy.assessmentYear}) rules under the Income-tax
                law. For personalized advice,
                <a href="#contact" className="text-primary hover:underline ml-1">
                  consult our experts
                </a>.
              </p>
              <p className="text-[11px] text-muted-foreground/80 text-center px-4">
                Rates last verified: {RATES_LAST_VERIFIED}. {RATES_SOURCE_NOTE}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TaxCalculator;
