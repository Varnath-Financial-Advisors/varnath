import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, IndianRupee, TrendingDown, ArrowRight } from "lucide-react";

const TaxCalculator = () => {
  const [income, setIncome] = useState<string>("");
  const [result, setResult] = useState<{
    oldRegime: number;
    newRegime: number;
    savings: number;
    betterOption: string;
  } | null>(null);

  const calculateTax = () => {
    const annualIncome = parseFloat(income) || 0;
    
    // Old Regime Tax Slabs (FY 2024-25 with standard deduction of ₹50,000)
    const taxableIncomeOld = Math.max(0, annualIncome - 50000);
    let oldTax = 0;
    if (taxableIncomeOld > 250000) {
      if (taxableIncomeOld <= 500000) {
        oldTax = (taxableIncomeOld - 250000) * 0.05;
      } else if (taxableIncomeOld <= 1000000) {
        oldTax = 12500 + (taxableIncomeOld - 500000) * 0.20;
      } else {
        oldTax = 12500 + 100000 + (taxableIncomeOld - 1000000) * 0.30;
      }
    }

    // New Regime Tax Slabs (FY 2024-25 with standard deduction of ₹75,000)
    const taxableIncomeNew = Math.max(0, annualIncome - 75000);
    let newTax = 0;
    if (taxableIncomeNew > 300000) {
      if (taxableIncomeNew <= 700000) {
        newTax = (taxableIncomeNew - 300000) * 0.05;
      } else if (taxableIncomeNew <= 1000000) {
        newTax = 20000 + (taxableIncomeNew - 700000) * 0.10;
      } else if (taxableIncomeNew <= 1200000) {
        newTax = 50000 + (taxableIncomeNew - 1000000) * 0.15;
      } else if (taxableIncomeNew <= 1500000) {
        newTax = 80000 + (taxableIncomeNew - 1200000) * 0.20;
      } else {
        newTax = 140000 + (taxableIncomeNew - 1500000) * 0.30;
      }
    }

    // Apply rebate under Section 87A if applicable
    if (taxableIncomeOld <= 500000) oldTax = 0;
    if (taxableIncomeNew <= 700000) newTax = 0;

    // Add cess (4%)
    oldTax = oldTax * 1.04;
    newTax = newTax * 1.04;

    const savings = Math.abs(oldTax - newTax);
    const betterOption = oldTax < newTax ? "Old Regime" : "New Regime";

    setResult({
      oldRegime: Math.round(oldTax),
      newRegime: Math.round(newTax),
      savings: Math.round(savings),
      betterOption
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <section className="py-20 px-4 bg-accent/50">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Calculator className="w-4 h-4" />
            Free Tool
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Tax Regime Comparison Calculator
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find out which tax regime saves you more money in FY 2024-25
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="shadow-lg border-2 border-border">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl flex items-center justify-center gap-2">
                <IndianRupee className="w-5 h-5 text-primary" />
                Enter Your Annual Income
              </CardTitle>
              <CardDescription>
                We'll compare both tax regimes and show you the better option
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 items-end">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="income">Annual Gross Income (₹)</Label>
                  <Input
                    id="income"
                    type="number"
                    placeholder="e.g., 1000000"
                    value={income}
                    onChange={(e) => setIncome(e.target.value)}
                    className="text-lg h-12"
                  />
                </div>
                <Button 
                  onClick={calculateTax}
                  className="h-12 px-8"
                  disabled={!income || parseFloat(income) <= 0}
                >
                  Calculate <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>

              {result && (
                <div className="mt-8 space-y-6 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className={`p-6 rounded-xl border-2 ${result.betterOption === "Old Regime" ? "border-primary bg-primary/5" : "border-border bg-muted/30"}`}>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-lg">Old Regime</h3>
                        {result.betterOption === "Old Regime" && (
                          <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">Better</span>
                        )}
                      </div>
                      <p className="text-3xl font-bold text-foreground">{formatCurrency(result.oldRegime)}</p>
                      <p className="text-sm text-muted-foreground mt-1">Estimated tax liability</p>
                    </div>
                    <div className={`p-6 rounded-xl border-2 ${result.betterOption === "New Regime" ? "border-primary bg-primary/5" : "border-border bg-muted/30"}`}>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-lg">New Regime</h3>
                        {result.betterOption === "New Regime" && (
                          <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">Better</span>
                        )}
                      </div>
                      <p className="text-3xl font-bold text-foreground">{formatCurrency(result.newRegime)}</p>
                      <p className="text-sm text-muted-foreground mt-1">Estimated tax liability</p>
                    </div>
                  </div>

                  <div className="p-6 rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
                    <div className="flex items-center gap-3 mb-2">
                      <TrendingDown className="w-6 h-6 text-primary" />
                      <h3 className="font-semibold text-lg">Your Potential Savings</h3>
                    </div>
                    <p className="text-2xl font-bold text-primary">{formatCurrency(result.savings)}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      by choosing the {result.betterOption}
                    </p>
                  </div>

                  <p className="text-xs text-muted-foreground text-center">
                    *This is a simplified calculation. For accurate tax planning with deductions (80C, 80D, HRA, etc.), 
                    <a href="#contact" className="text-primary hover:underline ml-1">consult our experts</a>.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default TaxCalculator;
