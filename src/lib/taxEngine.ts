/**
 * taxEngine.ts — Pure computation layer for the income-tax calculator.
 * All rates/limits come from src/data/taxRules.ts (data). The UI lives in
 * src/components/TaxCalculator.tsx. Nothing here should hardcode a rupee figure.
 */

import {
  AgeGroup,
  DEDUCTION_LIMITS,
  NEW_REGIME,
  OLD_REGIME,
  OLD_REGIME_SLABS,
  RegimeRules,
  SPECIAL_RATES,
  TaxSlab,
} from "@/data/taxRules";

export type Regime = "old" | "new";

export interface SpecialIncome {
  /** Short-term capital gains on listed equity / equity MFs (u/s 111A) */
  stcgEquity: number;
  /** Long-term capital gains on listed equity / equity MFs (u/s 112A), gross */
  ltcgEquity: number;
  /** Lottery, game shows, puzzles (u/s 115BB) */
  lottery: number;
}

export interface TaxEngineInput {
  regime: Regime;
  ageGroup: AgeGroup;
  resident: boolean;
  /** Salary income (basic + HRA + allowances + LTA). Standard deduction applies if > 0. */
  salaryIncome: number;
  /** Other normal-rate income: interest, rent, business/other */
  otherIncome: number;
  /** Precomputed HRA exemption (old regime only) — use calcHRAExemption */
  hraExemption: number;
  /** Raw deduction inputs — engine applies statutory caps */
  ded80C: number;
  ded80CCD1B: number;
  ded80D_self: number;
  ded80D_parents: number;
  ded80E: number;
  ded80G: number;
  /** Savings/deposit interest deduction input (80TTA below 60 / 80TTB for seniors) */
  dedInterest: number;
  /** Employer NPS contribution u/s 80CCD(2) — allowed in BOTH regimes */
  npsEmployer: number;
  /** Basic salary — used only to cap employer NPS */
  basicSalary: number;
  homeLoanInterest: number;
  isPropertySelfOccupied: boolean;
  professionalTax: number;
  special: SpecialIncome;
}

export interface SlabLine {
  label: string;
  rate: number;
  tax: number;
}

export interface SpecialTaxLine {
  label: string;
  amount: number;
  rate: number;
  tax: number;
}

export interface TaxResult {
  regime: Regime;
  grossIncome: number; // normal + special
  normalGrossIncome: number;
  specialIncomeTotal: number;
  standardDeduction: number;
  hraExemption: number;
  chapterVIA: number;
  homeLoanDeduction: number;
  professionalTax: number;
  totalDeductions: number;
  normalTaxableIncome: number;
  /** ₹1.25L LTCG exemption u/s 112A actually used */
  ltcgExemptionUsed: number;
  /** Unused basic exemption adjusted against equity CG (residents) */
  basicExemptionAdjusted: number;
  totalTaxableIncome: number;
  slabBreakdown: SlabLine[];
  normalTax: number;
  specialTaxLines: SpecialTaxLine[];
  specialTax: number;
  taxBeforeRebate: number;
  rebate87A: number;
  marginalRelief87A: number;
  taxAfterRebate: number;
  surchargeRate: number;
  surcharge: number;
  surchargeMarginalRelief: number;
  cess: number;
  totalTax: number;
  effectiveRate: number;
  marginalRate: number;
  /** True when 87A eligibility was lost only because of special-rate income */
  rebateBlockedBySpecialIncome: boolean;
}

/* ─────────────────────────── helpers ─────────────────────────── */

export const calcHRAExemption = (
  basicSalary: number,
  hraReceived: number,
  rentPaid: number,
  isMetroCity: boolean
): number => {
  if (hraReceived <= 0 || rentPaid <= 0) return 0;
  const metroPct = isMetroCity ? 0.5 : 0.4;
  return Math.max(
    0,
    Math.min(hraReceived, basicSalary * metroPct, rentPaid - basicSalary * 0.1)
  );
};

const slabTax = (income: number, slabs: TaxSlab[]) => {
  let tax = 0;
  let prev = 0;
  let marginalRate = 0;
  const breakdown: SlabLine[] = [];
  for (const s of slabs) {
    if (income <= prev) break;
    const amount = Math.min(income, s.upTo) - prev;
    const t = amount * s.rate;
    tax += t;
    breakdown.push({ label: s.label, rate: s.rate, tax: t });
    marginalRate = s.rate;
    prev = s.upTo;
  }
  return { tax, breakdown, marginalRate };
};

const rulesFor = (regime: Regime, ageGroup: AgeGroup): RegimeRules =>
  regime === "new"
    ? NEW_REGIME
    : { ...OLD_REGIME, slabs: OLD_REGIME_SLABS[ageGroup] };

/** Cap and total old-regime Chapter VI-A deductions from raw inputs */
const capChapterVIA = (input: TaxEngineInput, isSenior: boolean) => {
  const L = DEDUCTION_LIMITS;
  const d80C = Math.min(input.ded80C, L.section80C);
  const d80CCD1B = Math.min(input.ded80CCD1B, L.section80CCD1B);
  const d80D_self = Math.min(
    input.ded80D_self,
    isSenior ? L.section80D_self_senior : L.section80D_self_below60
  );
  const d80D_parents = Math.min(input.ded80D_parents, L.section80D_parents);
  const dInterest = Math.min(
    input.dedInterest,
    isSenior ? L.section80TTB : L.section80TTA
  );
  const npsEmployer = Math.min(
    input.npsEmployer,
    input.basicSalary * L.npsEmployerPctOld
  );
  return (
    d80C + d80CCD1B + d80D_self + d80D_parents + input.ded80E + input.ded80G + dInterest + npsEmployer
  );
};

/* ───────────────── core computation (before cess) ─────────────────
 * Split out so surcharge marginal relief can re-evaluate at the threshold. */

interface CoreResult {
  normalTax: number;
  slabBreakdown: SlabLine[];
  marginalRate: number;
  specialTaxLines: SpecialTaxLine[];
  specialTax: number;
  rebate87A: number;
  marginalRelief87A: number;
  taxAfterRebate: number;
  surchargeRate: number;
  surcharge: number;
  ltcgExemptionUsed: number;
  basicExemptionAdjusted: number;
  totalIncome: number;
  rebateBlockedBySpecialIncome: boolean;
}

const computeCore = (
  rules: RegimeRules,
  resident: boolean,
  normalTaxableIncome: number,
  special: SpecialIncome
): CoreResult => {
  const S = SPECIAL_RATES;

  // LTCG u/s 112A: first ₹1.25L exempt
  const ltcgExemptionUsed = Math.min(special.ltcgEquity, S.ltcgEquity.exemption);
  let taxableLTCG = Math.max(0, special.ltcgEquity - ltcgExemptionUsed);
  let taxableSTCG = Math.max(0, special.stcgEquity);
  const lottery = Math.max(0, special.lottery);

  // Residents may set unused basic exemption against equity CG (111A/112A).
  // Adjust against STCG first (higher rate), then LTCG. Not available vs lottery.
  const basicExemption = rules.slabs[0].rate === 0 ? rules.slabs[0].upTo : 0;
  let basicExemptionAdjusted = 0;
  if (resident) {
    let shortfall = Math.max(0, basicExemption - normalTaxableIncome);
    const useSTCG = Math.min(shortfall, taxableSTCG);
    taxableSTCG -= useSTCG;
    shortfall -= useSTCG;
    const useLTCG = Math.min(shortfall, taxableLTCG);
    taxableLTCG -= useLTCG;
    basicExemptionAdjusted = useSTCG + useLTCG;
  }

  // Slab tax on normal income
  const { tax: normalTax, breakdown: slabBreakdown, marginalRate } = slabTax(
    normalTaxableIncome,
    rules.slabs
  );

  // Special-rate taxes
  const stcgTax = taxableSTCG * S.stcgEquity.rate;
  const ltcgTax = taxableLTCG * S.ltcgEquity.rate;
  const lotteryTax = lottery * S.lottery.rate;
  const specialTaxLines: SpecialTaxLine[] = [];
  if (special.stcgEquity > 0)
    specialTaxLines.push({ label: S.stcgEquity.label, amount: special.stcgEquity, rate: S.stcgEquity.rate, tax: stcgTax });
  if (special.ltcgEquity > 0)
    specialTaxLines.push({ label: S.ltcgEquity.label, amount: special.ltcgEquity, rate: S.ltcgEquity.rate, tax: ltcgTax });
  if (lottery > 0)
    specialTaxLines.push({ label: S.lottery.label, amount: lottery, rate: S.lottery.rate, tax: lotteryTax });
  const specialTax = stcgTax + ltcgTax + lotteryTax;

  // Total income for 87A eligibility & surcharge slab determination
  const totalIncome = normalTaxableIncome + special.stcgEquity + special.ltcgEquity + lottery;

  // ── Rebate u/s 87A ──
  // scope "normalOnly" (new regime): rebate only against slab-rate tax
  // scope "allExcept112A" (old regime): also against 111A/115BB, never 112A
  let rebate87A = 0;
  let marginalRelief87A = 0;
  let rebateBlockedBySpecialIncome = false;
  const rebateEligibleTax =
    rules.rebate.scope === "normalOnly" ? normalTax : normalTax + stcgTax + lotteryTax;

  if (resident && totalIncome <= rules.rebate.incomeLimit) {
    rebate87A = Math.min(rebateEligibleTax, rules.rebate.maxRebate);
    if (specialTax > 0 && rebateEligibleTax < normalTax + specialTax) {
      // Rebate granted, but special-rate tax stays payable — flag for messaging
      rebateBlockedBySpecialIncome = true;
    }
  } else if (
    resident &&
    rules.rebate.marginalRelief &&
    totalIncome > rules.rebate.incomeLimit
  ) {
    // Marginal relief (new regime): slab tax capped at income above the limit
    const excess = totalIncome - rules.rebate.incomeLimit;
    if (rebateEligibleTax > excess) {
      marginalRelief87A = rebateEligibleTax - excess;
    }
  }
  // If income ≤ limit but the taxpayer is a non-resident, no rebate (law).
  if (
    resident &&
    totalIncome > rules.rebate.incomeLimit &&
    normalTaxableIncome <= rules.rebate.incomeLimit &&
    rules.rebate.scope === "normalOnly"
  ) {
    // Special income pushed total income past the limit → rebate lost entirely
    rebateBlockedBySpecialIncome = true;
  }

  const taxAfterRebate = Math.max(
    0,
    normalTax + specialTax - rebate87A - marginalRelief87A
  );

  // ── Surcharge (rate from TOTAL income; equity-CG tax surcharge capped 15%) ──
  let surchargeRate = 0;
  for (const s of rules.surcharge) {
    if (totalIncome > s.above) surchargeRate = s.rate;
  }
  let surcharge = 0;
  if (surchargeRate > 0 && taxAfterRebate > 0) {
    const equityCGTax = stcgTax + ltcgTax;
    const nonCGTax = Math.max(0, taxAfterRebate - equityCGTax);
    const cgRate = Math.min(surchargeRate, rules.surchargeCapOnEquityCG);
    surcharge = nonCGTax * surchargeRate + equityCGTax * cgRate;
  }

  return {
    normalTax,
    slabBreakdown,
    marginalRate,
    specialTaxLines,
    specialTax,
    rebate87A,
    marginalRelief87A,
    taxAfterRebate,
    surchargeRate,
    surcharge,
    ltcgExemptionUsed,
    basicExemptionAdjusted,
    totalIncome,
    rebateBlockedBySpecialIncome,
  };
};

/* ─────────────────────────── main entry ─────────────────────────── */

export const computeTax = (input: TaxEngineInput): TaxResult => {
  const rules = rulesFor(input.regime, input.ageGroup);
  const isSenior = input.ageGroup !== "below60";
  const L = DEDUCTION_LIMITS;

  const salary = Math.max(0, input.salaryIncome);
  const other = Math.max(0, input.otherIncome);
  const normalGrossIncome = salary + other;

  // Standard deduction only against salary income
  const standardDeduction = Math.min(rules.standardDeduction, salary);

  let hraExemption = 0;
  let chapterVIA = 0;
  let homeLoanDeduction = 0;
  let professionalTax = 0;

  if (input.regime === "old") {
    hraExemption = Math.min(input.hraExemption, salary);
    chapterVIA = capChapterVIA(input, isSenior);
    homeLoanDeduction = input.isPropertySelfOccupied
      ? Math.min(input.homeLoanInterest, L.homeLoanInterestSelfOccupied)
      : input.homeLoanInterest;
    professionalTax = Math.min(input.professionalTax, L.professionalTax);
  } else {
    // New regime: only employer NPS u/s 80CCD(2), at 14% of basic
    chapterVIA = Math.min(input.npsEmployer, input.basicSalary * L.npsEmployerPctNew);
  }

  const totalDeductions =
    standardDeduction + hraExemption + chapterVIA + homeLoanDeduction + professionalTax;
  const normalTaxableIncome = Math.max(0, normalGrossIncome - totalDeductions);

  const core = computeCore(rules, input.resident, normalTaxableIncome, input.special);

  // ── Marginal relief on surcharge ──
  // Increase in (tax + surcharge) over the threshold scenario must not exceed
  // the income above the threshold. Re-evaluate the core at the threshold by
  // trimming the excess from normal income first, then special income.
  let surchargeMarginalRelief = 0;
  if (core.surchargeRate > 0) {
    let threshold = 0;
    for (const s of rules.surcharge) {
      if (core.totalIncome > s.above) threshold = s.above;
    }
    const excess = core.totalIncome - threshold;
    // Trim income back to exactly the threshold
    let trimLeft = excess;
    const trimNormal = Math.min(trimLeft, normalTaxableIncome);
    trimLeft -= trimNormal;
    const trimSTCG = Math.min(trimLeft, input.special.stcgEquity);
    trimLeft -= trimSTCG;
    const trimLTCG = Math.min(trimLeft, input.special.ltcgEquity);
    trimLeft -= trimLTCG;
    const trimLottery = Math.min(trimLeft, input.special.lottery);
    const atThreshold = computeCore(rules, input.resident, normalTaxableIncome - trimNormal, {
      stcgEquity: input.special.stcgEquity - trimSTCG,
      ltcgEquity: input.special.ltcgEquity - trimLTCG,
      lottery: input.special.lottery - trimLottery,
    });
    const nowTotal = core.taxAfterRebate + core.surcharge;
    const thresholdTotal = atThreshold.taxAfterRebate + atThreshold.surcharge;
    if (nowTotal - thresholdTotal > excess) {
      surchargeMarginalRelief = nowTotal - thresholdTotal - excess;
    }
  }

  const taxPlusSurcharge = Math.max(
    0,
    core.taxAfterRebate + core.surcharge - surchargeMarginalRelief
  );
  const cess = taxPlusSurcharge * rules.cessRate;
  const totalTax = Math.round(taxPlusSurcharge + cess);

  const specialIncomeTotal =
    input.special.stcgEquity + input.special.ltcgEquity + input.special.lottery;
  const grossIncome = normalGrossIncome + specialIncomeTotal;

  return {
    regime: input.regime,
    grossIncome,
    normalGrossIncome,
    specialIncomeTotal,
    standardDeduction,
    hraExemption,
    chapterVIA,
    homeLoanDeduction,
    professionalTax,
    totalDeductions,
    normalTaxableIncome,
    ltcgExemptionUsed: core.ltcgExemptionUsed,
    basicExemptionAdjusted: core.basicExemptionAdjusted,
    totalTaxableIncome: core.totalIncome,
    slabBreakdown: core.slabBreakdown.map((s) => ({ ...s, tax: Math.round(s.tax) })),
    normalTax: Math.round(core.normalTax),
    specialTaxLines: core.specialTaxLines.map((s) => ({ ...s, tax: Math.round(s.tax) })),
    specialTax: Math.round(core.specialTax),
    taxBeforeRebate: Math.round(core.normalTax + core.specialTax),
    rebate87A: Math.round(core.rebate87A),
    marginalRelief87A: Math.round(core.marginalRelief87A),
    taxAfterRebate: Math.round(core.taxAfterRebate),
    surchargeRate: core.surchargeRate,
    surcharge: Math.round(core.surcharge),
    surchargeMarginalRelief: Math.round(surchargeMarginalRelief),
    cess: Math.round(cess),
    totalTax,
    effectiveRate: grossIncome > 0 ? (totalTax / grossIncome) * 100 : 0,
    marginalRate:
      core.rebate87A > 0 && totalTax === 0 ? 0 : Math.round(core.marginalRate * 100),
    rebateBlockedBySpecialIncome: core.rebateBlockedBySpecialIncome,
  };
};
