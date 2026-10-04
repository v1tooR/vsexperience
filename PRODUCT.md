# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Static HTML, CSS and vanilla JS, with no build step, deployed to shared Apache hosting (`public_html`, `.htaccess`). Small libraries may load from a CDN. The user chose this over migrating to React or Next.js in October 2026. React components sent as references get rebuilt in vanilla JS.

## Users

People who reach vsexperience.com.br through WhatsApp, Instagram (@victorssantos.ux), LinkedIn, Google reviews or a referral, and want to judge whether Victor Santos and VS Experience are worth a conversation:

- Owners of small and mid-sized companies who need a site, store or system that sells or captures leads.
- Marketing managers and founders of digital products.
- Teams that already have a product and need audit, consulting, consistency or a design system.
- Agencies that subcontract design and build (G4 through Falcotec, Casa Floresta through Voia Agency).
- International clients (one case: Beyond Speaking). The site is bilingual, PT and EN.

## Product Purpose

vsexperience.com.br is the hub of the **VS** ecosystem. It presents the ecosystem and routes the visitor to its two fronts:

- **Victor Santos**: audit and consulting (UX, product, conversion). This is the front where his personal authority leads.
- **VS Experience**: building sites, apps and design systems (landing pages, institutional sites, e-commerce, systems/SaaS, design systems).

Success means the visitor sees him as a business partner, not just someone who executes, understands which front fits their problem, and starts a WhatsApp conversation.

## Positioning

One person who covers the whole chain: diagnosis, UX, UI and production-grade code, with nothing lost in handoff. He starts from business clarity (objective, user, offer) before the visual. The new identity's stated goal: "Não ser visto apenas como executor, mas sim como parceiro de negócios."

## Operating Context

- Main CTA: WhatsApp conversation (`5512991833641`), currently with a message that asks "o que você vende, pra quem e qual o objetivo".
- Pricing ranges live only in `/servicos` (and its five service pages). The home does not show prices and links to `/servicos` for them.
- PT/EN language switch through `assets/js/i18n.js`.
- Sibling surfaces in the same repo: `/servicos` (has its own PRODUCT.md and DESIGN.md), `bio.html`, client proposals in `proposta-*` folders (each one is its own mini-project), `qr-generator`.
- SEO: JSON-LD (Person, ProfessionalService, FAQPage), sitemap and robots are already in place and must be kept and updated.

## Capabilities and Constraints

- Services offered: Landing Page, Site Institucional, E-commerce (Pix, shipping, Bling and Mercado Livre integration), Sistemas e SaaS, Design System, design-only delivery in Figma for teams with their own developers.
- Process: Diagnóstico, Arquitetura e narrativa (UX), UI (component system), Construção e refinamento, Ajustes e validação, with checkpoints and one consolidated revision round per delivery.
- Timelines stated in the FAQ: landing page in 1 to 2 weeks, institutional site in 2 to 4 weeks, e-commerce and SaaS defined in the diagnosis.
- **Open:** the specific offer of the Victor Santos audit and consulting front (formats, deliverables, pricing) is not defined yet. Don't invent packages.

## Brand Commitments

- Identity designed by Samuel Cipriano (2026). Source deck: "Apresentação Identidade Visual – Victor Santos.pdf".
- Ecosystem names: **VS** (master brand, monogram), **Victor Santos** (consulting), **VS Experience** (build). "VS Studio" appeared only on one app-icon mockup.
- Palette: Vermelho Cádmio `#EE2324`, Carmim `#AA1F23`, Linho `#EFEFEF`, Grafite `#212121`/`#252525`, with an extended ramp of each.
- Typography: Roboto Flex and Plus Jakarta Sans.
- Elements: rounded single-mass VS monogram, wide wordmark, custom icon set, grain/streak gradients, dotted grid.
- Desired attributes (from the deck): Minimalismo, Conforto, Modernidade, Marcante.
- Background generator: https://vs-grad-k7q3m9x2.pages.dev/ (WebGL2 shader, seeded, presets Rasgo / Cortina / Núcleo, perfect-loop motion). Its shader may be embedded live on the site.
- Voice: first person, direct, no hype ("Sem achismo. Sem estética vazia."). Self-titles in use: "Product Designer // Design Engineer".

## Evidence on Hand

- Logo files (SVG, four colors each): monogram, wordmark lockup and square tiles, in `C:\Users\Usuario\Downloads\drive-download-20261003T043133Z-1-001\` (Assets 9–12 = monogram, 13–16 = wordmark, 1–8 = tiles).
- Photos: old portraits in `assets/images/hero/victorsemfundo.webp` and `assets/images/about/`. The new red-background portraits from the identity deck have not been supplied yet.
- Case images in `assets/images/cases/`: G4 Business, Costa Flores, Casa Floresta, Inter Store, SB Marketing, Octaverta, Multi Vegetal, Eleva Isenções, ThisTorres Seguros, Aluga Aqui, Moriah Clínica, Beyond Speaking, Fácil Organização (coming soon).
- Six real Google 5-star reviews (Kelly Roberta, Samuel Ferreira, Giovana Zucareli, Guilherme Silva, Bruna Santos, Debora Gouveia), quoted on the current home.
- Credentials: 1st place in UI/UX Design at SPSKILLS (banking app interface), work for G4 Educação and Banco Inter.
- No metrics, conversion numbers or client logos beyond the above. Never fabricate results, stats or testimonials.

## Product Principles

1. Partner before executor: lead with business thinking and diagnosis, then show the craft.
2. Two fronts, one ecosystem: a visitor always knows whether they are looking at consulting (Victor Santos) or building (VS Experience), and how to switch.
3. Proof over promises: real cases, real reviews, real credentials, nothing invented.
4. The site is the portfolio piece: its own build quality is the strongest argument for hiring him.
5. Short path to conversation: every section is one step away from WhatsApp.

## Accessibility & Inclusion

WCAG AA contrast (small text never sits on Vermelho Cádmio: white on `#EE2324` is about 4.3:1, while white on Carmim `#AA1F23` is about 7.2:1). Full keyboard navigation, visible focus, a reduced-motion alternative for every scroll/mouse effect, and mouse-only effects that never hide content or function on touch devices.
