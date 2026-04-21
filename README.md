# Cartographer — Design System

> An enterprise developer productivity platform that visually maps large monorepos, renders complex call-graphs, and generates automated architectural documentation for engineering teams.

Cartographer is built for staff and principal engineers, platform teams, and engineering managers who need to reason about **architecture, ownership, and blast radius** at scale. The interface is analytical, trustworthy, and information-dense — it is meant to sit alongside an IDE, not replace it.

---

## Sources provided

| Source | Reference | Status |
|---|---|---|
| Design brief | From project kickoff | ✅ Internalized |
| Codebase | `pavanchow/Codebase-Cartographer` | ⚠️ Repo is empty / private (GitHub tree 409). Design system is derived from the brief and conventions for this product category. |
| Authors | Pavan N ([LinkedIn](https://www.linkedin.com/in/pavanchow/)), Dina M ([LinkedIn](https://www.linkedin.com/in/dina-m-0388462a3/)) | — |

> If the Cartographer repo becomes available (screens, Figma, component code), re-run this design system so component details, exact color usage, and real copy are cross-referenced against source-of-truth. **Current flagged substitutions:** Inter and JetBrains Mono are loaded from Google Fonts (brief-specified); all icons use [Lucide](https://lucide.dev) CDN.

---

## Index

| File / Folder | Purpose |
|---|---|
| `README.md` | This file — product context, content & visual foundations, iconography |
| `SKILL.md`  | Agent Skill manifest; makes this folder portable to Claude Code |
| `colors_and_type.css` | CSS custom properties for color, type, spacing, radii, elevation, motion |
| `fonts/` | Webfonts (Inter, JetBrains Mono — substituted via Google Fonts; local `.ttf` not included) |
| `assets/` | Logo marks, illustrations, sample screenshots, icon references |
| `preview/` | Small HTML cards that populate the Design System tab |
| `ui_kits/cartographer-app/` | React/JSX UI kit: high-fidelity recreation of the core web app |

---

## Product surfaces

Cartographer is primarily **one surface**: a desktop web application that engineers run against their monorepo. The app has three top-level modes:

1. **Map** — the signature visual: a 2-D force-directed or layered graph of modules, services, and data flow. Zoomable, filterable, supports "blast radius" highlighting when a node is selected.
2. **Inspect** — a per-node detail view showing owners, recent commits, call-graph in / out, and auto-generated architectural documentation.
3. **Docs** — an auto-generated, versioned architecture site (README + ADRs + diagrams) that the platform publishes on every merge.

There are lightweight satellite surfaces — a settings/admin area, a sign-in flow, and a CLI output viewer — but **Map / Inspect / Docs is the product**.

---

## CONTENT FUNDAMENTALS

Cartographer writes for senior engineers. The voice is **precise, calm, and declarative** — never cheerful, never salesy, never apologetic.

### Voice & tone

- **Declarative over aspirational.** "247 modules depend on `auth/session`." — not "You'll love seeing what depends on your code!"
- **Second person, sparingly.** Use "you" for direct instructions ("Select a node to inspect its dependents"). Avoid "we" — the product is not a teammate, it's a tool.
- **No exclamation marks.** Ever. Even on success.
- **No hedging.** Avoid "might," "could," "perhaps." Say what happened or what to do.
- **Numbers first.** When a metric is the point, lead with the number: `↑ 12 callers · ↓ 3 callees` — not "This module has 12 callers and 3 callees."

### Casing

- **Sentence case for all UI.** Page titles, buttons, menu items, section headers. ("Blast radius," not "Blast Radius.")
- **Exceptions:** proper nouns (module names, service names), product modes ("Map," "Inspect," "Docs" — capitalized as nouns), and `UPPERCASE` micro-labels (`OWNERS`, `LAST TOUCHED`, `CALLERS`) used to label fields in dense panels.
- **Code references** are always in `monospace` and preserve the author's original casing. `getUserById`, not `GetUserById`.

### Terminology (canonical)

| Use | Not |
|---|---|
| Module | Package, library, component |
| Service | Microservice, app |
| Call-graph | Dependency graph (reserve "dependency" for package-level) |
| Blast radius | Impact analysis, affected surface |
| Owner | Maintainer, author (for CODEOWNERS data) |
| Architectural drift | Code rot, tech debt |

### Numbers & units

- Counts are integer with no units: `247 modules`, `1,204 edges`.
- Durations use compact SI: `1.4s`, `230ms`, `4m 12s`.
- Percentages always one decimal when < 10: `3.2% of repo`; else whole: `68% coverage`.
- Byte sizes: `1.2 MB`, `340 KB`. No lower-case `kb`.

### Examples

```
Empty state:            No modules match these filters.
Error (recoverable):    Graph failed to load. Retry?
Error (fatal):          Cartographer can't reach the index service. Check /health.
Success toast:          Exported 247 nodes to cartographer.dot
Inline help:            Blast radius counts every transitive dependent up to depth 6.
Button:                 Run analysis
CTA (rare):             Start free trial — 14 days, no card
```

### Emoji, gifs, exclamation marks

Not used anywhere in product UI. Emoji may appear in engineer-authored content (e.g., CODEOWNERS comments, commit messages surfaced in feeds), but the chrome itself is emoji-free. Unicode arrows (`→`, `↑`, `↓`, `⇢`) are used sparingly in graph legends and deltas.

---

## VISUAL FOUNDATIONS

Cartographer's visual system is **lines, not shadows**. Hierarchy is established through layout, typography, and 1-pixel borders on subtle gray surfaces — not through card elevation or depth tricks.

### Color

- **Canvas:** pure white `#FFFFFF`. Panels, rails, and secondary surfaces use cool gray `#F9FAFB` (`--bg-subtle`) to create hierarchy without borders.
- **Primary / accent:** cobalt-indigo `#3B4BDB` (`--brand-600`). Used for active graph nodes, blast-radius highlights, selected rows, primary buttons, and focus rings. Used **sparingly** — typically one accent element per viewport.
- **Text:** `--gray-900` for display, `--gray-800` for body, `--gray-600` for secondary, `--gray-500` for muted. Never pure black.
- **Status:** `--success-500` (green), `--warning-500` (amber), `--danger-500` (red). Surfaces use the `-50` tint; borders use the `-500`; text on surface uses the `-700`.
- **Graph node palette:** 7 categorical hues (module / service / data / util / external / deprecated / test). See tokens.

### Typography

- **Sans:** Inter, 400 / 500 / 600 / 700. Used for all chrome, metrics, headings.
- **Mono:** JetBrains Mono, 400 / 500 / 600. Used for identifiers, file paths, counts in dense tables, and every code reference. Mono is load-bearing in this product — don't substitute it for convenience.
- **Scale:** dense. Default body is **14px** (`--fs-14`); 16px is reserved for emphasized body; 11–13px appears frequently in tables, legends, and gutters. Headings top out at 36px in-app and 48px in marketing.
- **Feature settings:** `cv11`, `ss01`, `ss03` on Inter for straighter `1`, single-story `a`, and slashed zeros — this matters for engineers glancing at numbers.

### Spacing & layout

- **4-px grid** everywhere. Never half-values.
- Dense UI (graph panels, inspect rails) uses 8–12px paddings; reading surfaces (Docs, empty states) use 16–24px.
- **Fixed chrome:** top bar 48px; left nav rail 56px (icon-only, collapsible); right inspector 360px; bottom status bar 28px when present.
- **Max content width** in Docs mode: 720px for reading, 1120px for diagrams.

### Corners

Subtle rounding is the rule: **4px** on inputs, buttons, and chips; **6px** on cards, dialogs, and panels; 2px on tiny chrome (badges, graph-node rects); **999px pill** only on status dots and filter chips. Sharp corners on large panels — never soft, rounded marketing cards.

### Borders

The workhorse. **1px solid `--border-default` (`#E5E7EB`)** separates surfaces, panels, table rows (on hover), and inputs. `--border-subtle` (`#ECEEF2`) for internal dividers inside a card. `--border-strong` for emphasized separation (rare). Focus ring is **3px `rgba(59,75,219,0.22)`** — not a border change, a halo.

### Shadows

Minimal. `--shadow-xs` (1px hairline) for sticky headers; `--shadow-sm` for cards that float over canvas; `--shadow-lg` only for modals, popovers, and dropdowns. No neon glows, no colored shadows, no multi-layer "depth" stacks. The whole system could be rendered on e-ink and still read correctly.

### Backgrounds

- No hero images, no gradients, no patterns in the app chrome.
- The graph canvas itself is white with an optional 16px dot-grid at `--gray-150` for orientation at high zoom.
- Marketing / docs surfaces may use a single subtle radial-gradient accent behind a diagram (very restrained; `rgba(59,75,219,0.04)`) — **not** behind headings or hero copy.

### Imagery

When imagery is used (About page, blog, case studies), it is **b&w or desaturated**, often screenshots of the product itself, framed inside a 1px `--border-default` with 6px radius and `--shadow-sm`. No stock photography of people. No illustration mascots.

### Animation

Restrained and functional.

- **Durations:** 120ms for micro (hover color shift), 180ms for standard (panel expand, dropdown), 260ms for emphasized (modal enter).
- **Easing:** `cubic-bezier(0.2, 0, 0, 1)` standard; `cubic-bezier(0.3, 0, 0, 1)` emphasized. No bounce, no overshoot, no spring.
- **Graph animation:** force-directed layout uses smooth 400–600ms ease-out when re-laying out after a filter change. Selection highlights fade in at 180ms.
- Page transitions: **none**. Route changes are instant; content loads with a 1-px indeterminate progress bar at the top.

### States

- **Hover:** background shifts from transparent to `--gray-100`, or from `--gray-50` to `--gray-100`. Text color does not change on hover unless it's a link. Cursor becomes `pointer` only on interactive elements.
- **Press:** background goes one step darker (`--gray-150` or `--brand-700`). No scale or translate.
- **Focus:** always visible — 3px halo of `rgba(59,75,219,0.22)` plus a 1px `--border-focus`.
- **Disabled:** 50% opacity + `cursor: not-allowed`; never hidden.
- **Selected (row, node, tab):** `--bg-selected` (`--brand-50`) background + `--brand-600` left accent border or underline.

### Transparency & blur

Used in exactly two places: the scrim behind modals (`rgba(17, 24, 39, 0.5)`, no blur) and the sticky table-header fade (4px blur, `rgba(255,255,255,0.8)`). Never decorative.

### Cards

- **1px border**, **6px radius**, **white background**, **no shadow** by default.
- On hover (if clickable): `--shadow-sm` + border becomes `--border-strong`.
- Internal padding: 16px for dense, 24px for spacious.
- Card headers sit above a 1px `--border-subtle` divider.

### Layout rules (fixed)

- The navigation rail, top bar, and (when present) status bar do not scroll.
- The graph viewport is always visible when in Map mode; the inspector collapses, the nav rail doesn't.
- Dialogs are centered with `--shadow-lg`; full-page takeovers are reserved for onboarding only.

---

## ICONOGRAPHY

Cartographer uses [**Lucide**](https://lucide.dev) (MIT) for all UI iconography, loaded from CDN. Lucide is a fork of Feather with broader coverage and a consistent **1.75px stroke** that matches the brand's analytical, line-first aesthetic.

- **Stroke weight:** 1.75 (Lucide default). Do not mix with filled icons.
- **Size:** 14px in dense chrome (tables, chips), **16px default** in nav & buttons, 20px for mode switchers, 24px for empty-state illustrations.
- **Color:** inherits `currentColor`. Accent icons use `--fg-accent`; inactive nav icons use `--fg-muted`.
- **No emoji, no unicode "icons".** Arrows (`→ ↑ ↓`) are the only unicode characters that may stand in for icons — used in graph legends and KPI deltas.
- **Graph node icons** (inside a node shape) are 10–12px Lucide glyphs, solid `--gray-0` on a colored node fill.

### Canonical icon mapping

| Concept | Lucide icon |
|---|---|
| Module | `box` |
| Service | `server` |
| Data store | `database` |
| External dep | `external-link` |
| Owner / team | `users` |
| Call-graph in | `arrow-down-to-line` |
| Call-graph out | `arrow-up-from-line` |
| Blast radius | `radar` |
| Search | `search` |
| Filter | `sliders-horizontal` |
| Documentation | `file-text` |
| Commit / history | `git-commit-horizontal` |
| Settings | `settings` |
| Deprecated | `archive` |

### Logo

The Cartographer mark lives in `assets/logo.svg` (wordmark) and `assets/logo-mark.svg` (glyph-only). The glyph is a **minimal compass-rose / graph-node hybrid** — four lines meeting at a filled dot, in `--brand-600`. See the logo card in the Design System tab.

### Placeholders

When real product imagery is unavailable (screenshots, ADRs, team photos), use a **1px bordered rectangle** with a dim diagonal-line pattern and a small caption — never stock imagery or AI-generated illustration.

---

## Working with this system

1. Always start from tokens in `colors_and_type.css`. Do not introduce new colors or font sizes without adding them there first.
2. Read the CONTENT FUNDAMENTALS section before writing any copy. Cartographer has a specific voice.
3. For component-level patterns (button states, form layouts, table conventions), see `ui_kits/cartographer-app/`.
4. For agent use (Claude Code, prototyping), read `SKILL.md`.
