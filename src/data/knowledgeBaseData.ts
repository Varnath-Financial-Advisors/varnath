import { BookOpen, FileText, Building, Scale, Calculator, Globe, Briefcase, FileCheck } from "lucide-react";
import React from "react";

export interface Article {
  id: string;
  title: string;
  summary: string;
  topics: string[];
  content: string;
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
        id: "income-tax-slabs-2024",
        title: "Understanding Income Tax Slabs for FY 2024-25",
        summary: "Learn about the new and old tax regimes, applicable tax rates, and choose the best option for your income level.",
        topics: ["Tax Slabs", "New Tax Regime", "Old Tax Regime", "Surcharge", "Rebate u/s 87A"],
        content: `
## Income Tax Slabs for FY 2024-25 (AY 2025-26)

The Indian income tax system offers two regimes for individual taxpayers. The **New Tax Regime is the default** from FY 2023-24 onwards.

---

## New Tax Regime (Default) - Section 115BAC

| Income Range | Tax Rate | Tax Amount (Max) |
|--------------|----------|------------------|
| Up to ₹3,00,000 | Nil | ₹0 |
| ₹3,00,001 - ₹7,00,000 | 5% | ₹20,000 |
| ₹7,00,001 - ₹10,00,000 | 10% | ₹30,000 |
| ₹10,00,001 - ₹12,00,000 | 15% | ₹30,000 |
| ₹12,00,001 - ₹15,00,000 | 20% | ₹60,000 |
| Above ₹15,00,000 | 30% | As applicable |

### New Regime Benefits
- **Standard Deduction**: ₹75,000 (increased from ₹50,000)
- **Rebate u/s 87A**: Full tax rebate if income ≤ ₹7,00,000
- **Family Pension Deduction**: ₹25,000 (increased from ₹15,000)

---

## Old Tax Regime (Optional)

| Income Range | Tax Rate | Tax Amount (Max) |
|--------------|----------|------------------|
| Up to ₹2,50,000 | Nil | ₹0 |
| ₹2,50,001 - ₹5,00,000 | 5% | ₹12,500 |
| ₹5,00,001 - ₹10,00,000 | 20% | ₹1,00,000 |
| Above ₹10,00,000 | 30% | As applicable |

### Old Regime Deductions Available
| Section | Deduction | Maximum Limit |
|---------|-----------|---------------|
| 80C | PPF, ELSS, LIC, etc. | ₹1,50,000 |
| 80CCD(1B) | NPS Additional | ₹50,000 |
| 80D | Health Insurance | ₹25,000 - ₹1,00,000 |
| 80E | Education Loan Interest | No limit |
| 80G | Donations | 50% - 100% |
| 80TTA | Savings Interest | ₹10,000 |
| 24(b) | Home Loan Interest | ₹2,00,000 |
| HRA | House Rent Allowance | As per rules |

---

## Surcharge Rates (Both Regimes)

| Total Income | Old Regime | New Regime |
|--------------|------------|------------|
| ₹50 Lakhs - ₹1 Cr | 10% | 10% |
| ₹1 Cr - ₹2 Cr | 15% | 15% |
| ₹2 Cr - ₹5 Cr | 25% | 25% |
| Above ₹5 Cr | 37% | 25% (capped) |

**Note**: Surcharge on New Regime is capped at 25% even for income above ₹5 Cr.

---

## Health & Education Cess

| Component | Rate |
|-----------|------|
| Health & Education Cess | 4% on (Tax + Surcharge) |

---

## Senior Citizen Benefits

| Category | Age | Basic Exemption (Old Regime) |
|----------|-----|------------------------------|
| Regular Individual | Below 60 | ₹2,50,000 |
| Senior Citizen | 60 - 80 | ₹3,00,000 |
| Super Senior Citizen | Above 80 | ₹5,00,000 |

**Note**: In New Regime, basic exemption is ₹3,00,000 for all age groups.

---

## Tax Comparison: Old vs New Regime

| Gross Income | New Regime Tax | Old Regime Tax* | Better Option |
|--------------|----------------|-----------------|---------------|
| ₹7,00,000 | ₹0 (Rebate) | ₹0 (with 80C) | Either |
| ₹10,00,000 | ₹54,600 | ₹54,600 | Depends on deductions |
| ₹12,00,000 | ₹83,200 | ₹93,600 | New Regime |
| ₹15,00,000 | ₹1,45,600 | ₹1,56,000 | New Regime |
| ₹20,00,000 | ₹2,49,600 | ₹2,49,600 | Depends on deductions |
| ₹25,00,000 | ₹3,64,000 | ₹3,64,000 | Depends on deductions |

*Old Regime tax calculated without any deductions. With deductions, Old Regime may be beneficial.

---

## When to Choose Which Regime?

### Choose New Regime If:
- Your total deductions are less than ₹3-4 lakhs
- You prefer simplicity with fewer compliance requirements
- You have income mainly from salary with standard deduction
- Your income is ≤ ₹7 lakhs (full rebate available)

### Choose Old Regime If:
- Your total deductions exceed ₹4-5 lakhs annually
- You have significant HRA claims
- You have home loan interest deductions
- You make substantial 80C, 80D investments

---

## Important Points to Remember

| Point | Details |
|-------|---------|
| Default Regime | New Tax Regime (from FY 2023-24) |
| Switch Option | Salaried: Every year; Business: Once in lifetime |
| Form for Opting Out | Form 10-IEA (to choose Old Regime) |
| Due Date for Form | Before filing ITR |
| Rebate Limit (New) | Income up to ₹7,00,000 |
| Rebate Limit (Old) | Income up to ₹5,00,000 |

---

## Quick Tax Calculator Formula

**New Regime (Income > ₹15 Lakhs)**:
\`Tax = ₹1,50,000 + 30% of (Income - ₹15,00,000) + 4% Cess\`

**Old Regime (Income > ₹10 Lakhs)**:
\`Tax = ₹1,12,500 + 30% of (Income - ₹10,00,000) + 4% Cess\`
        `,
        downloadable: {
          title: "Tax Regime Comparison Calculator",
          type: "template",
          description: "Excel template to compare your tax liability under both regimes"
        }
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
        title: "Understanding GST Rates and HSN Codes",
        summary: "Guide to applicable GST rates across different goods and services, and how to determine the correct HSN/SAC codes.",
        topics: ["Tax Rates", "HSN Codes", "SAC Codes", "Exemptions"],
        content: `
## GST Rates and HSN/SAC Codes

### GST Rate Structure
| Rate | Category |
|------|----------|
| 0% | Exempted goods (fresh food, healthcare) |
| 5% | Essential items (packaged food, transport) |
| 12% | Standard goods (processed food, computers) |
| 18% | Standard rate (most goods and services) |
| 28% | Luxury & sin goods (cars, tobacco, AC) |

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
          title: "GST Return Filing Calendar 2024-25",
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
- Claim ITC only to the extent reflected in GSTR-2B
- Additional 5% can be claimed on faith basis
- Reconciliation is mandatory
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
        title: "Annual Compliance Calendar 2024-25",
        summary: "Complete annual compliance calendar covering Income Tax, GST, MCA, and other regulatory filings.",
        topics: ["ITR Filing", "GST Annual", "MCA Forms", "Audit Deadlines"],
        content: `
## Annual Compliance Calendar 2024-25

### April 2025
- 30th: GSTR-4 Annual (Composition)
- 30th: ITR for audit cases (extended)

### May 2025
- 31st: TDS Q4 return (Form 24Q, 26Q)
- 31st: Form 61A (SFT)

### June 2025
- 15th: Advance tax - 1st installment

### July 2025
- 15th: TCS Q1 return
- 31st: ITR (non-audit cases)
- 31st: TDS Q1 return

### September 2025
- 15th: Advance tax - 2nd installment
- 30th: ITR (audit cases)
- 30th: DIR-3 KYC

### October 2025
- 15th: TCS Q2 return
- 31st: TDS Q2 return
- 31st: AOC-4 filing

### November 2025
- 30th: MGT-7 filing (typically)

### December 2025
- 15th: Advance tax - 3rd installment
- 31st: GSTR-9, GSTR-9C

### January 2026
- 15th: TCS Q3 return
- 31st: TDS Q3 return

### March 2026
- 15th: Advance tax - 4th installment
- 31st: Financial year closing
        `,
        downloadable: {
          title: "FY 2024-25 Compliance Calendar",
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
