# FutRanking Proposal Design System

## Direction

The proposal combines the cinematic framing of VS Experience with the visual language of a football broadcast control room. Oversized score numerals, strong horizontal rhythm, compact tables, and credible interface mockups carry the sports identity without imitating betting products.

## Color

- VS Night: `oklch(0.145 0.018 295)` — proposal shell and high-contrast sections.
- Competition Blue: `oklch(0.59 0.22 263)` — FutRanking's primary action and navigation color.
- Decision Coral: `oklch(0.68 0.19 31)` — scores, approval, and decisive moments.
- Pitch Teal: `oklch(0.48 0.12 166)` — positive performance and match status.
- Chalk: `oklch(0.97 0.006 100)` — light surfaces.
- Ink: `oklch(0.19 0.018 270)` — interface copy.

Color strategy: full palette. Blue owns the product identity, coral marks decisions, and teal is reserved for performance signals.

## Typography

- Manrope: primary family for proposal copy and product UI.
- Barlow Condensed: score numerals, positions, and match display moments.

The display scale stays below 96px, headings use balanced wrapping, and body copy remains within a 70-character measure.

## Layout

- Maximum content width: 1180px.
- Proposal sections alternate between cinematic dark surfaces and chalk-white product surfaces.
- The hero uses an asymmetric split: commercial proposition on the left, live system theatre on the right.
- Lists and matrices use rules and alignment; cards are reserved for real product containers and payment choices.

## Components

- Fixed VS Experience navigation with reading progress.
- FutRanking mark built from a shield and ascending ranking bars.
- Browser and mobile product frames.
- Role matrix for Admin, Team, and Public permissions.
- Interactive product theatre with Admin, Team, and Ranking tabs.
- Selectable payment methods linked to the closing approval state.
- Scope, timeline, safeguards, and final metadata.

## Motion

- One coordinated entrance in the hero.
- Product theatre transitions use a short crossfade and horizontal shift.
- Progress and match-status motion is subtle and disabled under `prefers-reduced-motion`.
