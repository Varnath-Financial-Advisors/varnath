/**
 * glossary.ts — one-line definitions for technical terms used across the
 * knowledge base. Terms are matched inline in article text and rendered as
 * hover/tap tooltips so readers never have to leave the page.
 */

export const GLOSSARY: Record<string, string> = {
  "rebate":
    "A reduction of the tax itself (not of income). Section 87A wipes out slab-rate tax up to ₹60,000 (new regime) / ₹12,500 (old regime) for eligible residents.",
  "surcharge":
    "An extra levy calculated on your tax amount (not income) when total income crosses ₹50 lakh — 10% to 37% depending on income and regime.",
  "cess":
    "Health & Education Cess — 4% charged on income tax plus surcharge, in both regimes.",
  "marginal relief":
    "A cap that ensures earning slightly more than a threshold (₹12L rebate limit or a surcharge slab) never costs more in extra tax than the extra income itself.",
  "TDS":
    "Tax Deducted at Source — tax withheld by the payer (employer, bank, tenant) and deposited with the government against your PAN.",
  "TCS":
    "Tax Collected at Source — tax collected by a seller from the buyer on specified transactions and deposited against the buyer's PAN.",
  "LTCG":
    "Long-Term Capital Gains — profit on selling a capital asset held beyond the qualifying period (12 months for listed equity). Listed-equity LTCG is taxed at 12.5% above ₹1.25 lakh.",
  "STCG":
    "Short-Term Capital Gains — profit on selling a capital asset within the qualifying holding period. Listed-equity STCG is taxed at 20% u/s 111A.",
  "standard deduction":
    "A flat deduction from salary/pension income with no proof required — ₹75,000 in the new regime, ₹50,000 in the old regime.",
  "basic exemption":
    "The income threshold below which no tax applies — ₹4 lakh in the new regime; ₹2.5L / ₹3L / ₹5L by age in the old regime.",
  "presumptive taxation":
    "Schemes (44AD/44ADA) where small businesses and professionals declare income as a fixed percentage of turnover instead of maintaining detailed books.",
  "advance tax":
    "Tax paid in four instalments during the year (Jun/Sep/Dec/Mar) when your annual liability exceeds ₹10,000, instead of one payment at filing.",
  "ITC":
    "Input Tax Credit — GST you paid on business purchases, which you can set off against the GST you collect on sales.",
  "reverse charge":
    "A GST mechanism where the recipient of goods/services (not the supplier) is liable to pay the tax directly to the government.",
  "composition scheme":
    "A simplified GST scheme for small businesses — pay a flat low rate on turnover, file quarterly, but cannot claim ITC or collect tax.",
  "HSN":
    "Harmonized System of Nomenclature — the international commodity code that determines the GST rate for goods.",
  "SAC":
    "Services Accounting Code — the classification code that determines the GST rate for services.",
  "e-way bill":
    "An electronic document required for moving goods worth over ₹50,000, generated before transport begins.",
  "DTAA":
    "Double Taxation Avoidance Agreement — a treaty ensuring the same income isn't fully taxed in two countries, via exemptions or credits.",
  "transfer pricing":
    "Rules requiring transactions between related entities (e.g., Indian subsidiary and foreign parent) to be priced as if between independent parties.",
  "MAT":
    "Minimum Alternate Tax — a floor tax on book profits for companies whose normal tax liability is very low due to exemptions.",
  "Tax Year":
    "The single 12-month period (April–March) used by the Income-tax Act, 2025 from 1 April 2026 — replacing the old Previous Year / Assessment Year pairing.",
  "assessment year":
    "Under the 1961 Act, the year following the financial year in which income is assessed — e.g., FY 2025-26 income is assessed in AY 2026-27.",
  "AGM":
    "Annual General Meeting — the yearly shareholders' meeting a company must hold within 6 months of the financial year end.",
};
