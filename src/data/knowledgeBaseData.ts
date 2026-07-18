import { BookOpen, FileText, Building, Scale, Calculator, Globe, Briefcase, FileCheck } from "lucide-react";
import React from "react";

export interface Article {
  id: string;
  title: string;
  summary: string;
  topics: string[];
  content: string;
  /** Date the figures in this article were last cross-checked against the source */
  lastVerified?: string;
  /** The circular / notification / Act the figures come from */
  source?: string;
  /** Financial year(s) the article applies to — shown as a chip on the article */
  fyLabel?: string;
  downloadable?: {
    title: string;
    type: "pdf" | "checklist" | "template";
    description: string;
  };
}

export interface Category {
  id: string;
  category: string;
  icon: React.ReactNode;
  articles: Article[];
}

export const taxLaws: Category[] = [
  {
    id: "income-tax",
    category: "Income Tax",
    icon: React.createElement(FileText, { className: "w-8 h-8 text-primary" }),
    articles: [
      {
        id: "income-tax-slabs-2025-26",
        title: "Income Tax Slabs for FY 2025-26 & FY 2026-27",
        summary: "The Finance Act 2025 slabs (unchanged by Budget 2026): new-regime rates, the ₹60,000 rebate that makes income up to ₹12.75 lakh tax-free, and when the old regime still wins.",
        topics: ["Tax Slabs", "New Tax Regime", "Old Tax Regime", "Rebate u/s 87A", "Marginal Relief", "Surcharge"],
        lastVerified: "18 July 2026",
        source: "Finance Act, 2025; Budget 2026 (no slab change); cross-checked with the Income Tax Dept e-filing calculator",
        fyLabel: "FY 2025-26 & FY 2026-27",
        content: `
## What this means for you

If you're salaried with income up to **₹12.75 lakh**, you pay **zero tax** under the new regime — the ₹75,000 standard deduction plus the ₹60,000 rebate u/s 87A wipe out the liability. Above that, the new regime's wider slabs beat the old regime unless your deductions (HRA, 80C, home loan interest) exceed roughly ₹4.5–5 lakh a year. Budget 2026 changed nothing here — these rates hold for both FY 2025-26 and FY 2026-27.

---

## New Tax Regime (Default) — Section 115BAC

| Income Range | Tax Rate | Max Tax in Slab |
|--------------|----------|-----------------|
| Up to ₹4,00,000 | Nil | ₹0 |
| ₹4,00,001 – ₹8,00,000 | 5% | ₹20,000 |
| ₹8,00,001 – ₹12,00,000 | 10% | ₹40,000 |
| ₹12,00,001 – ₹16,00,000 | 15% | ₹60,000 |
| ₹16,00,001 – ₹20,00,000 | 20% | ₹80,000 |
| ₹20,00,001 – ₹24,00,000 | 25% | ₹1,00,000 |
| Above ₹24,00,000 | 30% | As applicable |

### New Regime Benefits
- **Standard Deduction**: ₹75,000 for salaried and pensioners
- **Rebate u/s 87A**: up to ₹60,000 — full tax waiver if taxable income ≤ ₹12,00,000
- **Effectively tax-free**: salary up to ₹12,75,000 (₹12L + ₹75K standard deduction)
- **Same slabs for all ages** — no separate senior-citizen slabs in the new regime

> **Watch out:** the 87A rebate does NOT cover tax on equity capital gains (STCG/LTCG) or lottery winnings. That tax is payable even if your total income is under ₹12 lakh. See our dedicated explainer on the 87A carve-out.

### Marginal relief — income just above ₹12 lakh

Without relief, earning ₹12,10,000 (taxable) would mean ₹61,500 tax — a ₹61,500 jump for ₹10,000 of extra income. Marginal relief caps your tax at the amount by which income exceeds ₹12 lakh:

| Taxable Income | Slab Tax | Tax After Marginal Relief (before cess) |
|----------------|----------|------------------------------------------|
| ₹12,00,000 | ₹60,000 | ₹0 (rebate) |
| ₹12,10,000 | ₹61,500 | ₹10,000 |
| ₹12,50,000 | ₹67,500 | ₹50,000 |
| ₹12,75,000 | ₹71,250 | ₹71,250 (relief exhausted) |

---

## Old Tax Regime (by election — Form 10-IEA)

| Income Range | Tax Rate |
|--------------|----------|
| Up to ₹2,50,000 | Nil |
| ₹2,50,001 – ₹5,00,000 | 5% |
| ₹5,00,001 – ₹10,00,000 | 20% |
| Above ₹10,00,000 | 30% |

### Higher basic exemption for resident senior citizens

| Category | Age | Basic Exemption |
|----------|-----|-----------------|
| Regular Individual | Below 60 | ₹2,50,000 |
| Senior Citizen | 60 – 80 | ₹3,00,000 |
| Super Senior Citizen | Above 80 | ₹5,00,000 |

### Old Regime — key figures
- **Standard Deduction**: ₹50,000 (unchanged)
- **Rebate u/s 87A**: up to ₹12,500, income ≤ ₹5,00,000

### Old Regime Deductions (not available in new regime)

| Section | Deduction | Maximum Limit |
|---------|-----------|---------------|
| 80C | PPF, ELSS, LIC, EPF, tuition, home-loan principal | ₹1,50,000 |
| 80CCD(1B) | NPS (additional) | ₹50,000 |
| 80D | Health insurance | ₹25,000 – ₹1,00,000 |
| 80E | Education loan interest | No limit |
| 80G | Donations | 50% – 100% |
| 80TTA / 80TTB | Savings / deposit interest | ₹10,000 / ₹50,000 (seniors) |
| 24(b) | Home loan interest (self-occupied) | ₹2,00,000 |
| HRA | House Rent Allowance | As per rules |

---

## Worked example — ₹10,00,000 salary

**New regime:** ₹10,00,000 − ₹75,000 standard deduction = ₹9,25,000 taxable.
Tax: ₹20,000 (4–8L @ 5%) + ₹12,500 (8–9.25L @ 10%) = ₹32,500.
Taxable income ≤ ₹12L → rebate u/s 87A wipes it out. **Tax payable: ₹0.**

**Old regime (no deductions):** ₹10,00,000 − ₹50,000 = ₹9,50,000 taxable.
Tax: ₹12,500 (2.5–5L @ 5%) + ₹90,000 (5–9.5L @ 20%) = ₹1,02,500 + 4% cess = **₹1,06,600.**

**Old regime (80C ₹1.5L + 80D ₹25K):** taxable ₹7,75,000 → ₹12,500 + ₹55,000 = ₹67,500 + cess = **₹70,200.**

Even with ₹1.75 lakh of deductions, the old regime costs ₹70,200 where the new regime costs nil — at this income the new regime wins decisively.

---

## Surcharge (income above ₹50 lakh)

| Total Income | Old Regime | New Regime |
|--------------|------------|------------|
| ₹50L – ₹1 Cr | 10% | 10% |
| ₹1 Cr – ₹2 Cr | 15% | 15% |
| ₹2 Cr – ₹5 Cr | 25% | 25% |
| Above ₹5 Cr | 37% | 25% (capped) |

- Surcharge on tax on equity capital gains (111A/112A) is capped at **15%** in both regimes.
- **Marginal relief** applies at every threshold: the extra tax + surcharge can never exceed the income above the threshold.

## Health & Education Cess

4% on (tax + surcharge), in both regimes.

---

## New vs Old — quick comparison (salaried, no old-regime deductions)

| Gross Salary | New Regime Tax | Old Regime Tax | Better Option |
|--------------|----------------|----------------|---------------|
| ₹10,00,000 | ₹0 | ₹1,06,600 | New Regime |
| ₹12,75,000 | ₹0 | ₹1,87,200 | New Regime |
| ₹15,00,000 | ₹97,500 | ₹2,57,400 | New Regime |
| ₹20,00,000 | ₹1,92,400 | ₹4,13,400 | New Regime |
| ₹25,00,000 | ₹3,19,800 | ₹5,69,400 | New Regime |

With substantial deductions (HRA + 80C + home loan interest totalling ₹4.5L+), the old regime can still win — run both in our calculator before choosing.

## Choosing and switching

| Point | Details |
|-------|---------|
| Default Regime | New Tax Regime |
| Switch Option | Salaried: every year; Business income: once in a lifetime |
| Form for Opting Out | Form 10-IEA (to elect the Old Regime) |
| Due Date | Before filing the ITR |

## A note on "Tax Year" terminology

From 1 April 2026 the **Income-tax Act, 2025** replaces the 1961 Act. It drops the "Previous Year / Assessment Year" pairing for a single **"Tax Year"**. FY 2025-26 corresponds to AY 2026-27 under the old terminology; under the new Act, FY 2026-27 is simply Tax Year 2026-27. We keep both labels because AY remains in older forms, notices and search habits.
        `,
        downloadable: {
          title: "Tax Regime Comparison Calculator",
          type: "template",
          description: "Excel template to compare your tax liability under both regimes"
        }
      },
      {
        id: "section-87a-special-rate-carveout",
        title: "Section 87A Rebate: Why Capital Gains Stay Taxable Under ₹12 Lakh",
        summary: "The ₹60,000 rebate does not apply to equity capital gains or lottery winnings — a common and costly point of confusion, clarified with worked examples.",
        topics: ["Rebate u/s 87A", "LTCG", "STCG", "Section 111A", "Section 112A", "Lottery Winnings"],
        lastVerified: "18 July 2026",
        source: "Proviso to s.87A, Finance Act 2025; ss. 111A, 112A, 115BB, Income-tax Act",
        fyLabel: "FY 2025-26 & FY 2026-27",
        content: `
## What this means for you

Even if your total income is under ₹12 lakh, you will still pay tax on **capital gains from equity shares/equity mutual funds** and on **lottery or game-show winnings**. The Section 87A rebate only wipes out tax on income taxed at normal slab rates — special-rate income is carved out. Plan redemptions and expect TDS accordingly.

---

## The rule in one table

| Income Type | Rate | 87A Rebate Applies? (New Regime) |
|-------------|------|----------------------------------|
| Salary, rent, interest, business (slab rates) | 0–30% slabs | Yes — up to ₹60,000 |
| STCG on listed equity / equity MFs (s.111A) | 20% | **No** |
| LTCG on listed equity / equity MFs (s.112A) | 12.5% above ₹1.25L | **No** |
| Lottery, game shows, puzzles (s.115BB) | 30% flat | **No** |

Under the **old regime**, the rebate (max ₹12,500, income ≤ ₹5L) can still offset STCG u/s 111A tax — but never LTCG u/s 112A tax (barred by s.112A itself).

## Worked example 1 — salary + equity LTCG

Salary ₹10,00,000 and LTCG on equity mutual funds ₹2,00,000 (new regime, FY 2025-26):

| Step | Amount |
|------|--------|
| Salary after ₹75K standard deduction | ₹9,25,000 |
| Slab tax on ₹9,25,000 | ₹32,500 |
| Rebate u/s 87A (total income ≤ ₹12L) | −₹32,500 |
| LTCG ₹2,00,000 − ₹1,25,000 exemption | ₹75,000 taxable |
| Tax @ 12.5% | ₹9,375 |
| Add 4% cess | ₹375 |
| **Total payable** | **₹9,750** |

The salary tax vanished; the LTCG tax did not.

## Worked example 2 — gains push you past ₹12 lakh

Salary ₹11,50,000 (taxable ₹10,75,000) plus STCG ₹1,50,000. Total income = ₹12,25,000 — **over the ₹12L limit**, so the ₹60,000 rebate is lost entirely. Marginal relief caps the slab tax at ₹25,000 (the excess over ₹12L), but the STCG tax of ₹30,000 @ 20% is payable in full: (₹25,000 + ₹30,000) + 4% cess = **₹57,200** — versus ₹0 if the same person had no capital gains.

**Takeaway:** special-rate income can silently push your total income past ₹12 lakh and cost you the entire rebate on your salary tax too.

## Practical planning points

- The ₹1,25,000 LTCG exemption u/s 112A still applies before the 12.5% rate.
- Residents can set an **unused basic exemption** (₹4L new regime) against equity capital gains — useful for retirees with no salary income.
- Nothing shields lottery/game-show winnings: 30% flat, no basic exemption, no rebate, TDS u/s 194B at source.
- Marginal relief protects slab-rate income just above ₹12L — it does not reduce special-rate tax.
        `
      },
      {
        id: "income-tax-act-2025",
        title: "Income-tax Act 2025: What Actually Changes From 1 April 2026",
        summary: "The 1961 Act is replaced — but this is a rewrite, not a rate change. What's genuinely different, what's just renumbered, and what 'Tax Year' means.",
        topics: ["Income-tax Act 2025", "Tax Year", "Assessment Year", "Compliance"],
        lastVerified: "18 July 2026",
        source: "Income-tax Act, 2025 (effective 1 April 2026); Budget 2026",
        fyLabel: "From FY 2026-27",
        content: `
## What this means for you

Your tax **rates, deductions and due dates do not change** because of the new Act. The Income-tax Act, 2025 replaces the 1961 Act from 1 April 2026 as a plain-language rewrite: shorter sentences, tables instead of provisos, and a single "Tax Year" replacing the confusing Previous Year / Assessment Year pairing. Expect new section numbers on notices and forms — not new taxes.

---

## What stays the same

| Area | Position |
|------|----------|
| Tax slabs & rates | Unchanged (Budget 2026 made no changes) |
| New regime as default, old regime by election | Unchanged |
| Deductions (80C-style benefits, standard deduction) | Carried over with new section numbers |
| TDS/TCS framework | Carried over |
| Filing obligations & broad due-date structure | Carried over |

## What actually changes

| Change | Detail |
|--------|--------|
| **"Tax Year"** | One term replaces "Previous Year" + "Assessment Year". FY 2026-27 is simply Tax Year 2026-27. |
| **Renumbering** | Sections are renumbered and consolidated (the 1961 Act's 800+ sections come down substantially). Old references like "80C" map to new numbers — mapping tables are published by the department. |
| **Simplified drafting** | Formulas and tables replace nested provisos and explanations — fewer interpretation disputes over language. |
| **Digital-first administration** | Faceless assessment and digital processes are embedded in the Act's design rather than bolted on. |

## Old vs new terminology

| Old (1961 Act) | New (2025 Act) |
|----------------|----------------|
| Previous Year (FY 2026-27) | Tax Year 2026-27 |
| Assessment Year (AY 2027-28) | — (concept merged into Tax Year) |

## Don't overstate the disruption

Most provisions carry over with the same substance. Where you'll feel it:
- Notices and orders issued after 1 April 2026 cite **new section numbers**
- ITR forms and utilities progressively adopt **Tax Year** labels
- Old case law generally continues to apply where language is materially the same

Our advice: update templates and engagement letters to cite both old and new section numbers during the transition year.
        `
      },
      {
        id: "stt-hike-fo-budget-2026",
        title: "STT Hike on F&O (Budget 2026): New Rates From 1 April 2026",
        summary: "Securities Transaction Tax on equity futures rises to 0.05% and on options to 0.15% of premium. What it costs traders per crore of turnover.",
        topics: ["STT", "Futures & Options", "Budget 2026", "Capital Markets"],
        lastVerified: "18 July 2026",
        source: "Budget 2026 / Finance Act 2026 (as reported by NSE-member brokers and tax portals); effective 1 April 2026",
        fyLabel: "FY 2026-27",
        content: `
## What this means for you

If you trade F&O, your transaction cost went up from 1 April 2026: STT on **equity futures more than doubled to 0.05%** of traded value (from 0.02%) and on **equity options rose to 0.15%** of premium (from 0.1%). Delivery-based equity investing is untouched. High-frequency and thin-margin strategies feel this the most; occasional hedgers barely notice.

---

## Revised STT rates (effective 1 April 2026)

| Instrument | Charged On | Old Rate | New Rate | Paid By |
|------------|-----------|----------|----------|---------|
| Equity futures (sale) | Traded price | 0.02% | 0.05% | Seller |
| Equity options (sale) | Premium | 0.1% | 0.15% | Seller |
| Options exercised | Settlement/intrinsic value | 0.125% | 0.15% | Buyer |
| Equity delivery (buy & sell) | Traded value | 0.1% | 0.1% (unchanged) | Both |
| Equity intraday (sale) | Traded value | 0.025% | 0.025% (unchanged) | Seller |

## What it costs in rupees

| Trade | STT Before | STT Now |
|-------|-----------|---------|
| Sell futures worth ₹1 crore | ₹2,000 | ₹5,000 |
| Sell options premium of ₹1,00,000 | ₹100 | ₹150 |

## Why the government did it

- Cool speculative retail activity in derivatives (a stated SEBI/CBDT concern since 2024)
- Improve parity between derivatives and cash-market taxation
- Raise revenue without touching long-term investors

## Points for traders

- STT on F&O remains **deductible as a business expense** if you report F&O income as business income (the normal treatment).
- Breakeven points rise — reprice strategies with the new cost per lot before FY 2026-27 positions.
- Remember F&O income is **normal slab-rate income** (not capital gains) — the 87A rebate can apply to it, unlike equity capital gains.
        `
      },
      {
        id: "tds-provisions",
        title: "TDS Provisions and Compliance",
        summary: "Comprehensive guide on Tax Deducted at Source (TDS), rates, filing requirements, and common scenarios.",
        topics: ["TDS on Salary", "Form 16", "Quarterly Returns"],
        content: `
## TDS Provisions and Compliance Guide

Tax Deducted at Source (TDS) is a method of collecting income tax at the source of income.

### Common TDS Rates
| Section | Nature of Payment | TDS Rate |
|---------|-------------------|----------|
| 192 | Salary | As per slab |
| 194A | Interest (Banks) | 10% |
| 194C | Contractor Payments | 1% / 2% |
| 194J | Professional Fees | 10% |
| 194H | Commission | 5% |
| 194I | Rent | 10% |

### TDS Return Filing Due Dates
- **Q1 (Apr-Jun)**: July 31
- **Q2 (Jul-Sep)**: October 31
- **Q3 (Oct-Dec)**: January 31
- **Q4 (Jan-Mar)**: May 31

### Important Forms
- **Form 16**: TDS certificate for salary
- **Form 16A**: TDS certificate for non-salary
- **Form 26Q**: Quarterly TDS return (non-salary)
- **Form 24Q**: Quarterly TDS return (salary)

### Penalties for Non-Compliance
- Late filing: ₹200 per day
- Non-deduction: Interest @ 1% per month
- Non-payment: Interest @ 1.5% per month
        `,
        downloadable: {
          title: "TDS Compliance Checklist",
          type: "checklist",
          description: "Monthly and quarterly TDS compliance checklist"
        }
      },
      {
        id: "capital-gains",
        title: "Capital Gains Tax Simplified",
        summary: "Understand short-term and long-term capital gains, exemptions, and tax implications on property and investments.",
        topics: ["LTCG", "STCG", "Section 54", "Indexation"],
        content: `
## Capital Gains Tax Guide

Capital gains tax applies when you sell capital assets like property, shares, or mutual funds.

### Short-Term vs Long-Term
| Asset Type | Short-Term Period | Long-Term Period |
|------------|-------------------|------------------|
| Listed Shares/Equity MFs | ≤ 12 months | > 12 months |
| Unlisted Shares | ≤ 24 months | > 24 months |
| Immovable Property | ≤ 24 months | > 24 months |
| Debt Mutual Funds | Any period (taxed as per slab) | - |

### Tax Rates
- **STCG on Listed Equity**: 15%
- **LTCG on Listed Equity**: 10% (above ₹1 lakh exemption)
- **STCG on Other Assets**: As per income tax slab
- **LTCG on Other Assets**: 20% with indexation

### Exemptions under Section 54
- **Section 54**: Reinvest in residential property
- **Section 54EC**: Invest in specified bonds (₹50 lakh limit)
- **Section 54F**: Reinvest in residential property (for non-residential asset sale)

### Indexation Benefit
Indexation adjusts the purchase price for inflation, reducing your taxable gains.
        `
      },
      {
        id: "advance-tax",
        title: "Advance Tax: Payment Schedule and Calculation",
        summary: "Complete guide on advance tax payment dates, calculation methods, and penalties for late payment.",
        topics: ["Due Dates", "Calculation", "Form 280", "Interest 234C"],
        content: `
## Advance Tax Payment Guide

If your total tax liability exceeds ₹10,000 in a financial year, you must pay advance tax.

### Payment Schedule
| Installment | Due Date | Minimum % of Tax |
|-------------|----------|------------------|
| 1st | June 15 | 15% |
| 2nd | September 15 | 45% |
| 3rd | December 15 | 75% |
| 4th | March 15 | 100% |

### Who Must Pay Advance Tax?
- Salaried individuals with other income sources
- Freelancers and professionals
- Business owners
- Rental income earners

### How to Calculate
1. Estimate total annual income
2. Calculate tax liability as per applicable slab
3. Deduct TDS already paid
4. Pay the balance as advance tax

### Penalties
- **Section 234B**: Interest for non-payment (1% per month)
- **Section 234C**: Interest for deferment (1% per month)
        `,
        downloadable: {
          title: "Advance Tax Calculator",
          type: "template",
          description: "Excel calculator for advance tax estimation"
        }
      }
    ]
  },
  {
    id: "gst",
    category: "GST",
    icon: React.createElement(Scale, { className: "w-8 h-8 text-primary" }),
    articles: [
      {
        id: "gst-registration",
        title: "GST Basics: Registration and Compliance",
        summary: "Everything you need to know about GST registration thresholds, filing deadlines, and compliance requirements.",
        topics: ["GST Registration", "GSTR-1", "GSTR-3B", "Input Tax Credit"],
        content: `
## GST Registration and Compliance

### Registration Thresholds
| Business Type | Threshold |
|--------------|-----------|
| Goods (Normal States) | ₹40 lakhs |
| Goods (Special States) | ₹20 lakhs |
| Services | ₹20 lakhs |
| Inter-state Supply | No threshold |

### Mandatory Registration Cases
- Inter-state taxable supply
- E-commerce operators
- Casual taxable persons
- Non-resident taxable persons
- Reverse charge liability

### Monthly Compliance Calendar
| Return | Due Date | Purpose |
|--------|----------|---------|
| GSTR-1 | 11th | Outward supplies |
| GSTR-3B | 20th | Summary & tax payment |
| ITC-04 | Quarterly | Job work details |

### Input Tax Credit Rules
- Must have valid tax invoice
- Goods/services must be received
- Tax must be paid to government
- Return must be filed by supplier
        `,
        downloadable: {
          title: "GST Registration Checklist",
          type: "checklist",
          description: "Documents required for GST registration"
        }
      },
      {
        id: "gst-rates-hsn",
        title: "GST Rates After the 2025 Rationalisation (GST 2.0) & HSN Codes",
        summary: "The 56th GST Council collapsed the four-slab structure into 5% / 18% / 40% from 22 September 2025. Current rates and how to determine the correct HSN/SAC codes.",
        topics: ["Tax Rates", "GST 2.0", "HSN Codes", "SAC Codes", "Exemptions"],
        lastVerified: "18 July 2026",
        source: "56th GST Council meeting; CBIC rate notifications effective 22-09-2025",
        fyLabel: "From 22 Sep 2025",
        content: `
## What this means for you

Since 22 September 2025, GST has just **three main rates: 5%, 18% and 40%**. The old 12% and 28% slabs are gone — most 12% items moved down to 5%, and 28% items moved to 18% (or 40% for sin/luxury goods, which replaces 28% + cess). Re-check the rate on everything you sell or buy; invoices raised with the old rates after the switchover are a common audit finding.

### GST Rate Structure (current)
| Rate | Category |
|------|----------|
| 0% | Exempted (fresh food, healthcare, 33 lifesaving drugs, educational materials, certain dairy) |
| 5% | Merit rate — daily essentials, packaged foods, agricultural goods, healthcare equipment (absorbed most old 12% items) |
| 18% | Standard rate — most goods and services, electronics, cement, small cars, appliances |
| 40% | Demerit rate — pan masala, aerated/caffeinated drinks, luxury vehicles (replaces 28% + compensation cess) |

> **Transition note:** tobacco products and pan masala remain on the old 28% + cess structure until a separate notification (pending discharge of compensation-cess loan obligations).

### HSN Code Structure
HSN (Harmonized System of Nomenclature) is used for goods:
- 2-digit: Chapter
- 4-digit: Heading
- 6-digit: Subheading
- 8-digit: Tariff item

### SAC Code Structure
SAC (Services Accounting Code) is used for services:
- Format: 99XXXX
- First 2 digits: Always 99
- Next 2 digits: Major category
- Last 2 digits: Detailed classification

### Common HSN/SAC Examples
| Description | Code | Rate |
|-------------|------|------|
| IT Services | 998314 | 18% |
| Restaurant (AC) | 996331 | 5% |
| Legal Services | 998211 | 18% |
| Textiles | 5208 | 5% |
        `
      },
      {
        id: "gst-returns",
        title: "GST Return Filing Process",
        summary: "Step-by-step guide for filing various GST returns, reconciliation, and avoiding common mistakes.",
        topics: ["Monthly Returns", "Annual Returns", "GSTR-9", "E-way Bills"],
        content: `
## GST Return Filing Guide

### Types of GST Returns
| Return | Frequency | Due Date | Who Files |
|--------|-----------|----------|-----------|
| GSTR-1 | Monthly | 11th | Regular taxpayers |
| GSTR-3B | Monthly | 20th | Regular taxpayers |
| GSTR-4 | Annual | 30th April | Composition dealers |
| GSTR-9 | Annual | 31st Dec | Regular taxpayers |
| GSTR-9C | Annual | 31st Dec | Turnover > ₹5 Cr |

### GSTR-1 Filing Steps
1. Login to GST portal
2. Go to Returns > GSTR-1
3. Add B2B invoices with GSTIN
4. Add B2C invoices (consolidated)
5. Report credit/debit notes
6. Submit and file with DSC/EVC

### Common Mistakes to Avoid
- Mismatch between GSTR-1 and GSTR-3B
- Wrong HSN/SAC codes
- Incorrect place of supply
- Missing e-invoicing for eligible businesses
- Late filing leading to interest

### E-way Bill Requirements
Required for goods movement exceeding ₹50,000:
- Generated before movement
- Valid for distance-based time
- Part A: Invoice details
- Part B: Transporter details
        `,
        downloadable: {
          title: "GST Return Filing Calendar 2026-27",
          type: "pdf",
          description: "Complete calendar with all GST due dates"
        }
      },
      {
        id: "gst-itc",
        title: "Input Tax Credit (ITC) - Complete Guide",
        summary: "Learn how to claim input tax credit, blocked credits, and reconciliation with GSTR-2A/2B.",
        topics: ["ITC Rules", "Blocked Credits", "GSTR-2B", "Reconciliation"],
        content: `
## Input Tax Credit (ITC) Guide

### Conditions for Claiming ITC
1. Possession of tax invoice or debit note
2. Receipt of goods or services
3. Tax actually paid to government
4. Filing of return by supplier
5. Payment made within 180 days

### Blocked Credits (Section 17(5))
ITC is NOT available on:
- Motor vehicles and conveyances
- Food and beverages, outdoor catering
- Beauty treatment, health services
- Club membership fees
- Rent-a-cab, life insurance
- Works contract for construction
- Goods lost, stolen, destroyed

### ITC Reconciliation with GSTR-2B
| Step | Action |
|------|--------|
| 1 | Download GSTR-2B |
| 2 | Match with purchase register |
| 3 | Identify mismatches |
| 4 | Follow up with suppliers |
| 5 | Claim only matched ITC |

### Rule 36(4) Restriction
- ITC can be claimed **only to the extent reflected in GSTR-2B** — the earlier provisional/extra-percentage claim no longer exists (nil since 1 January 2022)
- Monthly reconciliation with GSTR-2B is mandatory before filing GSTR-3B
        `,
        downloadable: {
          title: "ITC Reconciliation Template",
          type: "template",
          description: "Excel template for monthly ITC reconciliation"
        }
      }
    ]
  },
  {
    id: "company-law",
    category: "Company Law",
    icon: React.createElement(Building, { className: "w-8 h-8 text-primary" }),
    articles: [
      {
        id: "companies-act-2013",
        title: "Companies Act 2013: Key Provisions",
        summary: "Overview of the Companies Act, director responsibilities, board meetings, and statutory requirements.",
        topics: ["Director Duties", "Board Meetings", "AGM Requirements"],
        content: `
## Companies Act 2013 - Key Provisions

### Types of Companies
| Type | Min Directors | Min Capital |
|------|---------------|-------------|
| Private Ltd | 2 | Nil |
| Public Ltd | 3 | Nil |
| One Person Company | 1 | Nil |

### Director Requirements
- Minimum age: 18 years
- Maximum directorships: 20 companies
- DIN (Director Identification Number) mandatory
- Annual KYC compliance required

### Board Meeting Requirements
- Minimum 4 meetings per year
- Gap between meetings: Not more than 120 days
- Quorum: 1/3rd of total strength or 2, whichever is higher
- First meeting within 30 days of incorporation

### Annual General Meeting (AGM)
- Must be held within 6 months from financial year end
- Gap between 2 AGMs: Not more than 15 months
- Business: Adoption of accounts, dividend declaration, director appointment
- Notice period: 21 clear days
        `,
        downloadable: {
          title: "Board Meeting Checklist",
          type: "checklist",
          description: "Pre and post meeting compliance checklist"
        }
      },
      {
        id: "mca-filings",
        title: "MCA Annual Filing Requirements",
        summary: "Complete guide to mandatory annual filings including AOC-4, MGT-7, and ADT-1 with deadlines.",
        topics: ["AOC-4", "MGT-7", "MGT-14", "Due Dates"],
        content: `
## MCA Annual Filing Requirements

### Key Annual Forms
| Form | Purpose | Due Date |
|------|---------|----------|
| AOC-4 | Financial statements | 31st October |
| MGT-7/MGT-7A | Annual return | 60 days from AGM |
| ADT-1 | Auditor appointment | 15 days from AGM |
| DIR-3 KYC | Director KYC | 30th September |

### AOC-4 Filing
Contains:
- Balance Sheet
- Profit & Loss Statement
- Cash Flow Statement
- Notes to Accounts
- Director's Report
- Auditor's Report

### MGT-7 Annual Return
Contains:
- Registered office details
- Principal business activities
- Share capital structure
- Shareholding pattern
- Director details
- Meeting details

### Penalties for Late Filing
- AOC-4/MGT-7: ₹100 per day (max ₹10 lakhs)
- DIR-3 KYC: ₹5,000 one-time
- DIN deactivation for non-KYC
        `,
        downloadable: {
          title: "MCA Filing Calendar",
          type: "pdf",
          description: "Annual calendar with all MCA due dates"
        }
      },
      {
        id: "roc-compliance",
        title: "ROC Compliance Checklist",
        summary: "Essential checklist for maintaining compliance with Registrar of Companies (ROC) throughout the year.",
        topics: ["DIN eKYC", "DSC Renewal", "Form Filings", "Penalty Avoidance"],
        content: `
## ROC Compliance Checklist

### Monthly Compliance
- [ ] Maintain statutory registers
- [ ] Update register of members
- [ ] Record share transfers
- [ ] Maintain minute books

### Quarterly Compliance
- [ ] Hold board meetings
- [ ] File MGT-14 for resolutions (if applicable)
- [ ] Review related party transactions
- [ ] Monitor director appointments/resignations

### Annual Compliance
| Task | Timeline |
|------|----------|
| Board meeting for accounts | Before AGM |
| AGM | Within 6 months of FY end |
| AOC-4 filing | 31st October |
| MGT-7 filing | 60 days from AGM |
| ADT-1 filing | 15 days from AGM |
| DIR-3 KYC | By 30th September |

### Event-Based Compliance
- Change in directors: DIR-12 within 30 days
- Increase in capital: SH-7 within 30 days
- Change in registered office: INC-22 within 30 days
- Charge creation: CHG-1 within 30 days
        `,
        downloadable: {
          title: "ROC Compliance Master Checklist",
          type: "checklist",
          description: "Complete year-round ROC compliance tracker"
        }
      }
    ]
  },
  {
    id: "business-laws",
    category: "Business Laws",
    icon: React.createElement(BookOpen, { className: "w-8 h-8 text-primary" }),
    articles: [
      {
        id: "business-structure",
        title: "Choosing the Right Business Structure",
        summary: "Compare Proprietorship, Partnership, LLP, and Private Limited Company to choose the best structure for your business.",
        topics: ["Sole Proprietorship", "Partnership Firm", "LLP", "Pvt Ltd"],
        content: `
## Choosing the Right Business Structure

### Comparison Table
| Feature | Proprietorship | Partnership | LLP | Pvt Ltd |
|---------|---------------|-------------|-----|---------|
| Legal Status | Not separate | Not separate | Separate | Separate |
| Liability | Unlimited | Unlimited | Limited | Limited |
| Min Members | 1 | 2 | 2 | 2 |
| Max Members | 1 | 50 | Unlimited | 200 |
| Compliance | Low | Low | Medium | High |
| Tax Rate | Slab rate | Slab rate | 30%* | 25%* |

### When to Choose What?

**Sole Proprietorship**: 
- Low-risk businesses
- Single owner
- Minimal compliance preferred

**Partnership Firm**:
- Family businesses
- Professional practices
- Simple operations

**LLP**:
- Professional services
- Medium-sized businesses
- Want limited liability

**Private Limited**:
- Seeking investment
- Scalable business
- Brand building
        `
      },
      {
        id: "msme-registration",
        title: "MSME Registration Benefits",
        summary: "Learn about Udyam Registration, benefits for MSMEs, and how to apply for various government schemes.",
        topics: ["Udyam Registration", "MSME Benefits", "Priority Sector Lending"],
        content: `
## MSME Registration (Udyam) Benefits

### Classification Criteria
| Category | Investment | Turnover |
|----------|------------|----------|
| Micro | ≤ ₹1 Cr | ≤ ₹5 Cr |
| Small | ≤ ₹10 Cr | ≤ ₹50 Cr |
| Medium | ≤ ₹50 Cr | ≤ ₹250 Cr |

### Key Benefits

**Financial Benefits**:
- Priority sector lending
- Lower interest rates (2-3% less)
- Collateral-free loans up to ₹1 Cr
- Credit guarantee coverage

**Tax Benefits**:
- Reduced income tax rate
- MAT credit for 15 years
- Capital gains exemption (Section 54GB)

**Business Benefits**:
- Government tender preference
- Protection against delayed payments
- Electricity bill concessions
- ISO certification reimbursement

### How to Register
1. Visit udyamregistration.gov.in
2. Aadhaar authentication
3. Fill business details
4. Self-declare investment and turnover
5. Instant Udyam certificate
        `,
        downloadable: {
          title: "Udyam Registration Guide",
          type: "pdf",
          description: "Step-by-step registration guide with screenshots"
        }
      },
      {
        id: "fema-compliance",
        title: "Foreign Exchange Management Act (FEMA)",
        summary: "Understand FEMA regulations for foreign investments, overseas remittances, and compliance requirements.",
        topics: ["FDI Rules", "ODI Guidelines", "FEMA Compliance"],
        content: `
## FEMA Compliance Guide

### Key FEMA Provisions

**Automatic Route (No Approval)**:
- Most sectors up to 100% FDI
- No prior RBI approval
- Only reporting required

**Approval Route**:
- Sensitive sectors
- Defence, media, etc.
- Prior government approval needed

### FDI Reporting Requirements
| Transaction | Form | Timeline |
|-------------|------|----------|
| Share issue | FC-GPR | 30 days |
| Share transfer | FC-TRS | 60 days |
| Annual return | APR | By July 15 |
| Advance reporting | ARF | Within 30 days |

### Overseas Remittances (LRS)
- Limit: $250,000 per financial year
- Purposes: Education, travel, investment
- TCS applicable above ₹7 lakhs

### Common Contraventions
- Late reporting
- Exceeding LRS limits
- Unauthorized current account transactions
- Non-compliance with pricing guidelines
        `
      }
    ]
  },
  {
    id: "accounting-standards",
    category: "Accounting Standards",
    icon: React.createElement(Calculator, { className: "w-8 h-8 text-primary" }),
    articles: [
      {
        id: "ind-as-overview",
        title: "Indian Accounting Standards (Ind AS) Overview",
        summary: "Introduction to Ind AS framework, applicability criteria, and key differences from previous GAAP.",
        topics: ["Ind AS Applicability", "Key Standards", "GAAP Differences"],
        content: `
## Indian Accounting Standards (Ind AS)

### Applicability
| Company Type | Net Worth Threshold |
|--------------|---------------------|
| Listed Companies | Mandatory |
| Unlisted Companies | ≥ ₹250 Cr |
| Banks & NBFCs | ≥ ₹500 Cr |
| Insurance Companies | Mandatory (from 2023) |

### Key Ind AS Standards
| Standard | Topic |
|----------|-------|
| Ind AS 1 | Presentation of Financial Statements |
| Ind AS 2 | Inventories |
| Ind AS 16 | Property, Plant and Equipment |
| Ind AS 36 | Impairment of Assets |
| Ind AS 37 | Provisions and Contingencies |
| Ind AS 115 | Revenue Recognition |
| Ind AS 116 | Leases |

### Major Changes from Previous GAAP
- Fair value measurement introduced
- Revenue recognition based on performance obligations
- Leases brought on balance sheet
- Expected credit loss for impairment
- Component accounting mandatory
        `,
        downloadable: {
          title: "Ind AS Applicability Checker",
          type: "template",
          description: "Tool to check if Ind AS applies to your company"
        }
      },
      {
        id: "revenue-recognition",
        title: "Ind AS 115: Revenue Recognition",
        summary: "Five-step model for revenue recognition under Ind AS 115 with practical examples.",
        topics: ["Performance Obligations", "Transaction Price", "Variable Consideration"],
        content: `
## Ind AS 115 - Revenue Recognition

### Five-Step Model

**Step 1: Identify the Contract**
- Agreement creating enforceable rights
- Commercial substance
- Collection probability

**Step 2: Identify Performance Obligations**
- Distinct goods or services
- Series of distinct goods/services
- Separate vs. combined obligations

**Step 3: Determine Transaction Price**
- Fixed consideration
- Variable consideration
- Significant financing component
- Non-cash consideration

**Step 4: Allocate Transaction Price**
- Standalone selling prices
- Residual approach
- Discount allocation

**Step 5: Recognize Revenue**
- Point in time recognition
- Over time recognition
- Measuring progress

### Common Examples
- Construction contracts: Over time (percentage of completion)
- Product sales: Point in time (transfer of control)
- Software licenses: Depends on nature
        `
      }
    ]
  },
  {
    id: "international-tax",
    category: "International Taxation",
    icon: React.createElement(Globe, { className: "w-8 h-8 text-primary" }),
    articles: [
      {
        id: "dtaa-basics",
        title: "Double Taxation Avoidance Agreements (DTAA)",
        summary: "How DTAA works, key treaties India has signed, and how to claim benefits.",
        topics: ["DTAA Benefits", "Tax Residency", "Treaty Benefits"],
        content: `
## Double Taxation Avoidance Agreements

### What is DTAA?
DTAA is a tax treaty between two countries to:
- Avoid double taxation
- Prevent tax evasion
- Encourage cross-border trade

### India's Key Tax Treaties
| Country | Dividend | Interest | Royalty |
|---------|----------|----------|---------|
| USA | 15%/25% | 15% | 15% |
| UK | 15%/20% | 15% | 15% |
| Singapore | 15% | 15% | 10% |
| UAE | 10% | 12.5% | 10% |
| Mauritius | 5%/15% | 7.5% | 15% |

### Claiming DTAA Benefits
1. Determine tax residency
2. Check applicable DTAA
3. Compare domestic law vs. treaty rate
4. Obtain Tax Residency Certificate (TRC)
5. Furnish Form 10F
6. Provide self-declaration

### Key Documents Required
- Tax Residency Certificate (TRC)
- Form 10F (self-declaration)
- No PE declaration (if applicable)
- Beneficial ownership declaration
        `,
        downloadable: {
          title: "DTAA Benefit Claim Checklist",
          type: "checklist",
          description: "Documents required for claiming DTAA benefits"
        }
      },
      {
        id: "transfer-pricing",
        title: "Transfer Pricing Regulations in India",
        summary: "Arm's length principle, documentation requirements, and transfer pricing methods.",
        topics: ["Arm's Length Price", "TP Documentation", "BEPS"],
        content: `
## Transfer Pricing in India

### What is Transfer Pricing?
Pricing of transactions between associated enterprises to ensure they're at arm's length.

### When Applicable?
- International transactions with Associated Enterprises
- Specified Domestic Transactions above ₹20 Cr
- Transactions exceeding ₹1 Cr threshold

### Transfer Pricing Methods
| Method | Best For |
|--------|----------|
| CUP | Similar products exist |
| RPM | Distribution activities |
| CPM | Manufacturing activities |
| TNMM | Complex transactions |
| PSM | Unique transactions |

### Documentation Requirements
**Master File**:
- Group structure
- Description of business
- Intangibles overview
- Financial activities

**Local File**:
- Entity profile
- Industry analysis
- FAR analysis
- Economic analysis
- Benchmarking

### Penalties
- Failure to maintain docs: 2% of transaction value
- Failure to furnish report: ₹1 lakh
- TP adjustment: 100-300% of tax payable
        `,
        downloadable: {
          title: "Transfer Pricing Documentation Template",
          type: "template",
          description: "Template for maintaining TP documentation"
        }
      }
    ]
  },
  {
    id: "compliance-calendar",
    category: "Compliance Calendar",
    icon: React.createElement(Briefcase, { className: "w-8 h-8 text-primary" }),
    articles: [
      {
        id: "monthly-compliance",
        title: "Monthly Compliance Deadlines",
        summary: "All monthly compliance deadlines for GST, TDS, PF, ESI, and other statutory requirements.",
        topics: ["GST Deadlines", "TDS Dates", "PF/ESI", "Professional Tax"],
        content: `
## Monthly Compliance Deadlines

### 7th of Every Month
- TDS/TCS payment (except March)
- Professional Tax payment

### 10th of Every Month
- GSTR-7 (TDS)
- GSTR-8 (E-commerce)

### 11th of Every Month
- GSTR-1 (Monthly filers)

### 13th of Every Month
- GSTR-5 (Non-resident)
- GSTR-6 (ISD)

### 15th of Every Month
- PF payment (with challan)
- ESI payment
- Advance tax installments (quarterly)

### 20th of Every Month
- GSTR-3B (Monthly filers)
- GSTR-5A (OIDAR services)

### 25th of Every Month
- PMT-06 (GST advance tax)

### End of Month
- Challan reconciliation
- Bank reconciliation
- ITC reconciliation
        `,
        downloadable: {
          title: "Monthly Compliance Tracker",
          type: "template",
          description: "Excel tracker for all monthly compliances"
        }
      },
      {
        id: "annual-compliance",
        title: "Annual Compliance Calendar 2026-27",
        summary: "Complete annual compliance calendar for the FY 2026-27 filing cycle covering Income Tax, GST, MCA, and other regulatory filings.",
        topics: ["ITR Filing", "GST Annual", "MCA Forms", "Audit Deadlines"],
        lastVerified: "18 July 2026",
        source: "Standard statutory due dates under the Income-tax law, CGST Act and Companies Act; check CBDT/CBIC/MCA circulars for year-specific extensions",
        fyLabel: "Filing year 2026-27",
        content: `
## What this means for you

These are the recurring statutory deadlines for the 2026-27 filing cycle (returns for FY 2025-26 and payments for FY 2026-27). From 1 April 2026 filings are governed by the **Income-tax Act, 2025** — due-date structure carries over, but watch CBDT notifications for year-specific extensions before relying on any date near a deadline.

## Annual Compliance Calendar 2026-27

### April 2026
- 30th: GSTR-4 Annual (Composition)

### May 2026
- 31st: TDS Q4 return (Form 24Q, 26Q)
- 31st: Form 61A (SFT)

### June 2026
- 15th: Advance tax - 1st installment

### July 2026
- 15th: TCS Q1 return
- 31st: ITR for FY 2025-26 (non-audit cases)
- 31st: TDS Q1 return

### September 2026
- 15th: Advance tax - 2nd installment
- 30th: Tax audit report (FY 2025-26)
- 30th: DIR-3 KYC

### October 2026
- 15th: TCS Q2 return
- 31st: ITR (audit cases, FY 2025-26)
- 31st: TDS Q2 return
- 30th: AOC-4 filing (within 30 days of AGM)

### November 2026
- 29th: MGT-7 filing (within 60 days of AGM — typically)

### December 2026
- 15th: Advance tax - 3rd installment
- 31st: GSTR-9, GSTR-9C (FY 2025-26)

### January 2027
- 15th: TCS Q3 return
- 31st: TDS Q3 return

### March 2027
- 15th: Advance tax - 4th installment
- 31st: Financial year closing
        `,
        downloadable: {
          title: "FY 2026-27 Compliance Calendar",
          type: "pdf",
          description: "Printable annual compliance calendar"
        }
      }
    ]
  },
  {
    id: "audit-assurance",
    category: "Audit & Assurance",
    icon: React.createElement(FileCheck, { className: "w-8 h-8 text-primary" }),
    articles: [
      {
        id: "statutory-audit",
        title: "Statutory Audit Requirements",
        summary: "Understanding statutory audit applicability, auditor appointment, and audit procedures.",
        topics: ["Audit Applicability", "Auditor Appointment", "Audit Report"],
        content: `
## Statutory Audit Requirements

### Who Needs Statutory Audit?
- All companies under Companies Act
- LLPs with turnover > ₹40 lakhs or capital > ₹25 lakhs
- Businesses with turnover > ₹1 Cr (tax audit)
- Professionals with receipts > ₹50 lakhs (tax audit)

### Auditor Appointment
**First Auditor**:
- Within 30 days of incorporation
- By Board of Directors
- Holds office till first AGM

**Subsequent Auditors**:
- Appointed at AGM
- Term: 5 years (individual) / 10 years (firm)
- Form ADT-1 filing within 15 days

### Audit Process
1. Planning and risk assessment
2. Understanding internal controls
3. Substantive testing
4. Analytical procedures
5. Audit completion
6. Audit report issuance

### Types of Audit Opinions
- Unmodified (Clean)
- Modified - Qualified
- Modified - Adverse
- Modified - Disclaimer
        `,
        downloadable: {
          title: "Audit Document Checklist",
          type: "checklist",
          description: "Documents to prepare before audit"
        }
      },
      {
        id: "tax-audit",
        title: "Tax Audit under Section 44AB",
        summary: "When tax audit is required, forms to be filed, and key audit procedures.",
        topics: ["44AB Limits", "Form 3CA/3CB", "Form 3CD", "Due Date"],
        content: `
## Tax Audit under Section 44AB

### Applicability
| Category | Threshold |
|----------|-----------|
| Business | Turnover > ₹1 Cr |
| Business (presumptive opted out) | > ₹2 Cr |
| Profession | Receipts > ₹50 lakhs |
| Cash transactions < 5% | > ₹10 Cr |

### Forms Required
**Form 3CA**: For companies (audited under other law)
**Form 3CB**: For non-companies
**Form 3CD**: Statement of particulars (common to both)

### Key Particulars in Form 3CD
- Books of accounts maintained
- Depreciation details
- Amounts disallowable
- Deductions claimed
- TDS compliance
- GST reconciliation
- MSME payment compliance

### Due Date
- 30th September of Assessment Year
- (Extended to 31st October if TP audit applicable)

### Penalties
- Non-compliance: 0.5% of turnover (max ₹1.5 lakhs)
        `,
        downloadable: {
          title: "Tax Audit Preparation Checklist",
          type: "checklist",
          description: "Comprehensive checklist for tax audit preparation"
        }
      }
    ]
  }
];
