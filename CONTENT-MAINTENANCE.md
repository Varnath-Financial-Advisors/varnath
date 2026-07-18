# Content & Rates Maintenance Guide

How to keep the calculator and knowledge base current without re-auditing the
whole site. Data is separated from computation and UI on purpose:

| What changes | Where to edit | What NOT to touch |
|---|---|---|
| Tax slabs, rebate, surcharge, cess, deduction limits | `src/data/taxRules.ts` | `src/lib/taxEngine.ts` (computation), `src/components/TaxCalculator.tsx` (UI) |
| "Rates last verified" footer | `RATES_LAST_VERIFIED` in `src/data/taxRules.ts` | — |
| Article content | `src/data/knowledgeBaseData.ts` | KB components |
| Glossary definitions | `src/data/glossary.ts` | — |

## Versioning convention (articles)

Every article that carries figures must set:

```ts
lastVerified: "18 July 2026",           // date you actually cross-checked it
source: "Finance Act, 2025; ...",       // the notification/circular/Act
fyLabel: "FY 2025-26 & FY 2026-27",     // year chip shown on the article
```

Articles without `lastVerified` automatically display a "not yet re-verified"
warning banner — so never fake the field; leave it off until checked.

## Annual update checklist (post-Budget, each February)

1. Read the Finance Bill / Act. Update slabs, rebate, surcharge in
   `src/data/taxRules.ts` and append a dated entry to the CHANGELOG comment
   at the top of that file with the source.
2. Add the new FY to `FY_OPTIONS`; if rates changed, switch
   `getRegimeRules()` to a per-FY map (noted in the file).
3. Update `RATES_LAST_VERIFIED`.
4. Re-run the engine sanity tests (see below) with the new figures.
5. Update the slabs article + 87A article in `knowledgeBaseData.ts`;
   bump `lastVerified` / `source` / `fyLabel`.

## Quarterly checklist (GST changes more often than income tax)

- Check GST Council press releases + CBIC rate notifications → refresh the
  GST rates article (`gst-rates-hsn`) and return-filing dates.
- Check MCA circulars → refresh the compliance-calendar articles.
- Bump `lastVerified` only on articles actually re-checked.

## Engine sanity tests

The tax engine was verified against 25 hand-computed cases (zero tax at
₹12.75L, marginal relief at ₹13L, 87A carve-out for LTCG/STCG/lottery,
basic-exemption adjustment, surcharge marginal relief at 50L/1Cr/2Cr/5Cr,
regime-specific caps). After changing `taxRules.ts`, re-verify at minimum:

- Salaried income exactly at the rebate limit + standard deduction → ₹0
- Income ₹25,000 above the rebate limit → tax = excess × 1.04 (marginal relief)
- One case per surcharge threshold, just above the threshold
- One case with LTCG under the rebate limit → LTCG tax still payable
