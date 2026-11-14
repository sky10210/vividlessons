# Vivid Lessons: Personal Finance launch (staging only)

Branch: `pfm-stripe-placeholder`. Do not merge until the paid-module files are secured and checkout is fully tested.

## Prepared
- PFM-only homepage, Personal Finance page and module catalog.
- Three individual modules displayed at a proposed $9.99 each.
- Disabled Stripe checkout placeholders; no payment collection.
- Existing non-PFM pages and all module/certificate source files retained.
- D1 schema in `database/schema.sql`.

## Remaining before launch
1. Create a Stripe account, enable test mode and configure Apple Pay through Stripe Checkout (availability depends on device/browser).
2. Create three Stripe Prices and store the Price IDs in Cloudflare environment variables (never in GitHub secrets in plain text).
3. Create a Cloudflare D1 database and bind it to the Pages project.
4. Implement authenticated checkout session creation, verified Stripe webhook signature validation, idempotent purchase records and code issuance.
5. Implement teacher code activation, server-side expiration and student access validation.
6. Move complete paid module HTML and any answer keys out of the public GitHub repository and public Pages output. The current direct HTML URLs are **not secure**.
7. Keep preview modules public; preserve and test the existing certificates and scoring.
8. Configure code delivery by verified email provider and/or authenticated payment-success lookup; never trust the success URL alone as proof of payment.
9. Test successful payment, failure, duplicate webhook, refund/revocation, 30-day expiry, wrong-module code, direct URL bypass, and certificate download.
10. Merge the staging branch into main only after the complete security and checkout test passes.

## Product IDs in catalog
- pfm-credit-scores-101
- pfm-financial-planning-goal-setting
- pfm-grocery-shopping-unit-price

## Proposed settings
- $9.99 per individual module, no bundles.
- 30 days from teacher activation (server time).
- One shared classroom code per purchase.
- No student login required; minimize stored student data.

## Security notes
A public static HTML page cannot be paywalled merely by adding a JavaScript access-code prompt. Do not link protected full-module files from the public catalog or deploy them in a publicly reachable directory. Cloudflare environment secrets and Stripe private keys must not be committed to GitHub.
