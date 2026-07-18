/**
 * taxRules.ts — Single source of truth for ALL monetary/tax figures used by the
 * tax calculator. Computation lives in src/lib/taxEngine.ts; UI in
 * src/components/TaxCalculator.tsx. Future-year updates should only touch this file.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * CHANGELOG / SOURCE LOG
 * ─────────────────────────────────────────────────────────────────────────────
 * 2026-07-18  FY 2025-26 (AY 2026-27) new-regime slabs per Finance Act, 2025
 *             (0–4L nil / 4–8L 5% / 8–12L 10% / 12–16L 15% / 16–20L 20% /
 *             20–24L 25% / >24L 30%), standard deduction ₹75,000, s.87A rebate
 *             up to ₹60,000 for taxable income ≤ ₹12,00,000 with marginal
 *             relief. Cross-checked against Finance Act 2025 summaries
 *             (cleartax.in/s/income-tax-slabs; motilaloswal.com 115BAC guide)
 *             consistent with incometax.gov.in tax-calculator figures.
 * 2026-07-18  FY 2026-27: Budget 2026 made NO change to slabs/rebate
 *             (hdfc.bank.in Budget 2026-27 note; upstox.com Budget live blog).
 *             Income-tax Act, 2025 replaces the 1961 Act w.e.f. 01-04-2026
 *             ("Tax Year" terminology).
 * 2026-07-18  s.87A rebate NOT available against tax on special-rate income
 *             (STCG u/s 111A, LTCG u/s 112A, lottery/game-show u/s 115BB) —
 *             proviso to s.87A as amended by Finance Act, 2025.
 * 2026-07-18  Capital gains rates (post 23-07-2024, Finance (No.2) Act 2024):
 *             STCG equity u/s 111A @ 20%; LTCG equity u/s 112A @ 12.5% above
 *             ₹1,25,000 exemption. Lottery u/s 115BB @ 30% flat.
 * 2026-07-18  Surcharge slabs unchanged: 10%/15%/25%/37% (old regime),
 *             capped at 25% in new regime; surcharge on 111A/112A income
 *             capped at 15%. Health & Education Cess 4%.
 * 2026-07-18  STT (Budget 2026, effective 01-04-2026): equity futures
 *             0.02% → 0.05%; equity options 0.1% → 0.15% of premium (and
 *             0.15% on exercise). Source: icicidirect.com / cleartax.in STT
 *             guides citing Budget 2026. Informational only — STT is not
 *             computed by this calculator.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Shown in the calculator footer: "Rates last verified: …" */
export const RATES_LAST_VERIFIED = "18 July 2026";
export const RATES_SOURCE_NOTE =
  "Finance Act 2025 & Budget 2026 (no slab change). Cross-checked with the Income Tax Department's e-filing portal calculator.";

export interface TaxSlab {
  /** Upper bound of the slab (Infinity for the last slab) */
  upTo: number;
  /** Rate as a fraction, e.g. 0.05 for 5% */
  rate: number;
  /** Display label, e.g. "₹4L – ₹8L" */
  label: string;
}

export interface RebateRule {
  /** Maximum rebate amount u/s 87A */
  maxRebate: number;
  /** Taxable-income ceiling for eligibility */
  incomeLimit: number;
  /** Whether marginal relief applies just above the limit (new regime only, Finance Act 2023/2025) */
  marginalRelief: boolean;
  /**
   * Which tax the rebate can be set off against:
   * - "normalOnly": slab-rate tax only — special-rate income (111A/112A/115BB)
   *   is carved out (new regime, proviso to s.87A per Finance Act 2025)
   * - "allExcept112A": all tax except LTCG u/s 112A (old regime — s.112A(6)
   *   bars the rebate against 112A tax; 111A/115BB remain eligible)
   */
  scope: "normalOnly" | "allExcept112A";
}

export interface SurchargeSlab {
  /** Total-income threshold above which this rate applies */
  above: number;
  rate: number;
}

export interface RegimeRules {
  name: string;
  slabs: TaxSlab[];
  standardDeduction: number;
  rebate: RebateRule;
  surcharge: SurchargeSlab[];
  /** Max surcharge rate applicable on tax on 111A/112A (equity CG) income */
  surchargeCapOnEquityCG: number;
  cessRate: number;
}

/* ────────────────────────── NEW REGIME (s.115BAC) ──────────────────────────
 * FY 2025-26 (AY 2026-27) — unchanged for FY 2026-27 (Budget 2026).
 * Same slabs for all ages (no separate senior-citizen slabs in new regime). */
export const NEW_REGIME: RegimeRules = {
  name: "New Regime",
  slabs: [
    { upTo: 400000, rate: 0, label: "₹0 – ₹4L" },
    { upTo: 800000, rate: 0.05, label: "₹4L – ₹8L" },
    { upTo: 1200000, rate: 0.1, label: "₹8L – ₹12L" },
    { upTo: 1600000, rate: 0.15, label: "₹12L – ₹16L" },
    { upTo: 2000000, rate: 0.2, label: "₹16L – ₹20L" },
    { upTo: 2400000, rate: 0.25, label: "₹20L – ₹24L" },
    { upTo: Infinity, rate: 0.3, label: "Above ₹24L" },
  ],
  standardDeduction: 75000,
  rebate: { maxRebate: 60000, incomeLimit: 1200000, marginalRelief: true, scope: "normalOnly" },
  surcharge: [
    { above: 5000000, rate: 0.1 },
    { above: 10000000, rate: 0.15 },
    { above: 20000000, rate: 0.25 }, // capped at 25% in new regime, even above ₹5Cr
  ],
  surchargeCapOnEquityCG: 0.15,
  cessRate: 0.04,
};

/* ────────────────────────── OLD REGIME (by election) ──────────────────────
 * Basic exemption varies by age: <60 → ₹2.5L, 60–80 → ₹3L, >80 → ₹5L */
export type AgeGroup = "below60" | "60to80" | "above80";

const oldSlabsFrom = (basicExemption: number, labels: string[]): TaxSlab[] => [
  { upTo: basicExemption, rate: 0, label: labels[0] },
  { upTo: 500000, rate: 0.05, label: labels[1] },
  { upTo: 1000000, rate: 0.2, label: labels[2] },
  { upTo: Infinity, rate: 0.3, label: labels[3] },
];

export const OLD_REGIME_SLABS: Record<AgeGroup, TaxSlab[]> = {
  below60: oldSlabsFrom(250000, ["₹0 – ₹2.5L", "₹2.5L – ₹5L", "₹5L – ₹10L", "Above ₹10L"]),
  "60to80": oldSlabsFrom(300000, ["₹0 – ₹3L", "₹3L – ₹5L", "₹5L – ₹10L", "Above ₹10L"]),
  // Super seniors: nil up to ₹5L, so the 5% band collapses to zero width
  above80: [
    { upTo: 500000, rate: 0, label: "₹0 – ₹5L" },
    { upTo: 1000000, rate: 0.2, label: "₹5L – ₹10L" },
    { upTo: Infinity, rate: 0.3, label: "Above ₹10L" },
  ],
};

export const OLD_REGIME: RegimeRules = {
  name: "Old Regime",
  slabs: OLD_REGIME_SLABS.below60, // default; engine swaps by age group
  standardDeduction: 50000,
  // No marginal-relief provision u/s 87A in the old regime
  rebate: { maxRebate: 12500, incomeLimit: 500000, marginalRelief: false, scope: "allExcept112A" },
  surcharge: [
    { above: 5000000, rate: 0.1 },
    { above: 10000000, rate: 0.15 },
    { above: 20000000, rate: 0.25 },
    { above: 50000000, rate: 0.37 },
  ],
  surchargeCapOnEquityCG: 0.15,
  cessRate: 0.04,
};

/* ─────────────── SPECIAL-RATE INCOME (excluded from 87A rebate) ───────────
 * Proviso to s.87A (Finance Act 2025): the rebate applies only to tax on
 * income charged at normal slab rates. Tax on the following is payable even
 * if total income ≤ ₹12L. */
export const SPECIAL_RATES = {
  /** STCG on listed equity shares / equity MFs u/s 111A (transfers on/after 23-07-2024) */
  stcgEquity: { rate: 0.2, label: "STCG on equity (u/s 111A)" },
  /** LTCG on listed equity u/s 112A — first ₹1.25L exempt, balance @ 12.5% */
  ltcgEquity: { rate: 0.125, exemption: 125000, label: "LTCG on equity (u/s 112A)" },
  /** Lottery / game shows / puzzles u/s 115BB — flat 30%, no basic exemption */
  lottery: { rate: 0.3, label: "Lottery & game-show winnings (u/s 115BB)" },
} as const;

/* ───────────────────── OLD-REGIME DEDUCTION LIMITS ───────────────────── */
export const DEDUCTION_LIMITS = {
  section80C: 150000,
  section80CCD1B: 50000,
  section80D_self_below60: 25000,
  section80D_self_senior: 50000,
  section80D_parents: 50000,
  section80TTA: 10000, // savings interest, below 60
  section80TTB: 50000, // all interest income, senior citizens (replaces 80TTA)
  homeLoanInterestSelfOccupied: 200000, // s.24(b)
  professionalTax: 2500,
  /** s.80CCD(2) employer NPS — % of basic+DA; 14% (new regime), 10% (old, non-govt) */
  npsEmployerPctNew: 0.14,
  npsEmployerPctOld: 0.1,
} as const;

/* ───────────── FINANCIAL YEARS SUPPORTED BY THE CALCULATOR ───────────── */
export interface FYOption {
  id: string;
  label: string;
  /** e.g. "AY 2026-27" — kept because users still search by AY */
  assessmentYear: string;
  /** Income-tax Act 2025 "Tax Year" terminology applies from 01-04-2026 */
  taxYearNote?: string;
}

export const FY_OPTIONS: FYOption[] = [
  { id: "2025-26", label: "FY 2025-26", assessmentYear: "AY 2026-27" },
  {
    id: "2026-27",
    label: "FY 2026-27",
    assessmentYear: "AY 2027-28",
    taxYearNote:
      'From 1 April 2026 the Income-tax Act, 2025 replaces the 1961 Act and uses a single "Tax Year" instead of Previous Year / Assessment Year. Rates are unchanged (Budget 2026).',
  },
];

/* Both supported FYs use identical rules — Budget 2026 made no slab changes.
 * If a future Finance Act changes rates, add a per-FY rules map here. */
export const getRegimeRules = (_fyId: string) => ({ newRegime: NEW_REGIME, oldRegime: OLD_REGIME });

/* ───────────── STT (informational — shown as a note, not computed) ───────── */
export const STT_NOTE = {
  effectiveFrom: "1 April 2026",
  changes: [
    { instrument: "Equity futures (sale)", oldRate: "0.02%", newRate: "0.05%" },
    { instrument: "Equity options (sale, on premium)", oldRate: "0.1%", newRate: "0.15%" },
    { instrument: "Options exercised (on settlement value)", oldRate: "0.125%", newRate: "0.15%" },
  ],
  source: "Budget 2026 (Finance Act 2026); verified 18-07-2026",
};
