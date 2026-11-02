# Service categories: design inheritance verification

Checked on 2026-10-23. This is an ordinary extension of the existing service-page family. `servicos/DESIGN.md` remains the visual authority and remains unchanged. No approved global system change was introduced; no new DESIGN.md or design sidecar is required by this extension. No sidecar was found at `.impeccable/design.json` or `servicos/.impeccable/design.json` during this check.

## Evidence checked

- Operating reference: `.agents/skills/impeccable/reference/document.md` (read in full); incumbent system: `servicos/DESIGN.md`; direction: `.impeccable/surfaces/service-categories.md`; product scope: `PRODUCT.md` and `servicos/PRODUCT.md`.
- Source: `servicos/assets/servicos.css` (brand and context tokens, type, container, section rhythm, focus), `categorias.css` (category materials, catalogue, layouts and breakpoints), `categorias.js` (visibility and anchors), and the tab/pause implementation in `servicos.js`.
- Representative generated components: `servicos/branding/index.html`, `en/services/creative-ai/index.html`, and the catalogue extension in `servicos/design-system/index.html`. Generation and commercial policy were checked against `scripts/catalog/README.md`.
- Rendered samples inspected directly: `branding-desktop-hero.png` and `consultoria-mobile-hero.png` in this directory. These show the inherited linen/dotted field, graphite typography and controls, variable category specimen, desktop split composition, mobile stack, and demonstrative material contained inside the stage. This documentation pass sampled these images; it did not independently repeat every screenshot review.
- Existing verification evidence: `report.json` records 16 passing PT/EN category/index routes, all 64 source services plus two retained offers, no-JavaScript catalogues, keyboard tabs, explicit pause, direct disclosure anchors, contextual WhatsApp links, preserved price pages, and no errors. `docs/seo-validation.json` records 27 passing routes, language navigation and sitemap passes, and no runtime errors. These are recorded test results, not fresh tests run by this documentation pass.
- The full desktop/mobile evidence set for the hub and seven categories, plus viewport and alternate-panel captures, is retained in this directory. The supplied independent finish-review disposition is ship with no material fixes. Homepage category captures hide the global header/skip link only for capture; they are scoped evidence of category content.

## Five-line system summary

Palette: inherited Linho (#efefef), Grafite (#212121), Carmim (#aa1f23), Cadmio (#ee2324), and contextual readable text tones; demonstration palettes remain inside mockups.
Type: locally hosted Roboto Flex for specimens/headings and Plus Jakarta Sans for body/controls; existing giant specimen and section ramp remain, with category catalogue titles at clamp(23px, 2.8vw, 38px) and 25px on small screens.
Named rule — Brand outside, example inside: category demonstrations may vary their local paper/ink/accent; those colors do not redefine the VS shell palette.
Named rule — Content before enhancement: native disclosures and static links carry catalogue content; JS adds disclosure-anchor opening, keyboard tabs, visibility and pause behavior.
Named rule — Inherited composition: fine rules, restrained rounded mockups, variable specimens, linen/graphite fields and curtain closing continue the incumbent family; mobile stacks the content and collapses related navigation.

## Reusable category surface patterns

These are observed category-family extensions, not new global primitives or replacements for the incumbent system.

- **Catalogue disclosure rows:** native `details`/`summary`, stable service IDs, fine horizontal rules, large variable-font service names, Carmim hover/open state and a CSS plus/minus. Details expose descriptive copy and an existing service route or contextual WhatsApp contact. Deep links open the corresponding disclosure through progressive enhancement. The first item is initially open.
- **Demonstration stage:** inherited accessible tab machinery with a category-specific brand specimen, workflow, diagnosis/roadmap or learning workbook. Real case stages use existing case imagery and contextual captions. Provenance labels identify illustrative content; these are explanatory labels, not a new decorative eyebrow style. No new raster assets were generated; shipping case/logo images predate this extension.
- **Stage controls and motion:** tab selection uses `aria-selected`, roving tab stops, ArrowLeft/ArrowRight/Home/End and associated hidden panels. Visible stages cycle at 5.2 seconds; pointer hover and internal focus suspend playback. An explicit pressed-state pause button controls automatic tabs and the AI workflow. Reduced motion disables autoplay, workflow animation and the pause affordance while retaining manual tabs. Category workflow animation is bounded by viewport visibility.
- **Responsive layout:** shared 1328px container, clamped gutter and inherited section spacing persist. Category layout adjustments at 1040px stack introductory/scope content; catalogue detail stacks at 780px; related navigation changes from three columns to two, then one at 540px. Category stages retain space for controls and remain meaningful on touch.
- **Hub and related navigation:** category names reuse the incumbent service-list specimen and preview behavior; category navigation uses ruled links and SVG arrows. The generator is the source of PT/EN content and preserves the existing Design System mockup, process and prices.

## Drift preserved, not canonized or repaired

The incumbent DESIGN.md predates the current document reference: it has no normative YAML token frontmatter and uses legacy section names. Its file inventory describes page-local mockup CSS, whereas the new category family shares `categorias.css`; local demonstration tokens use `--demo-*` rather than the older documented `--c-*` convention. These are documentation coverage/format differences, not an approved visual-world change. The inherited palette, typography, composition and material rules remain valid for this extension. This scoped pass records the differences without migrating the authoritative file, creating a sidecar, or treating incidental values and defects as house rules.

Not canonized or repaired: legacy documentation format/inventory drift; no new visual defect was promoted into a design-system rule, and source/UI repairs were outside this documentation boundary.
