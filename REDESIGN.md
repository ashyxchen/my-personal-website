# Redesign — Warm Editorial Digital Garden / Knowledge Base

Plan for transforming this site (the React Portfolio Template by Ryan Balieiro —
a single-page slideshow SPA with no routing) into a multi-page, content-first
personal site and wiki/knowledge base ("digital garden"), inspired by
[Maggie Appleton](https://maggieappleton.com) (warm, editorial, light) and
[Rauno Freiberg](https://rauno.me) (minimal structure).

This file is **not** part of the published site.

## Confirmed decisions

- **Architecture** — Full restructure. Add client-side routing; each note gets
  its own URL.
- **Authoring** — Markdown/MDX content files, structured like a personal
  knowledge base / wiki (with backlinks).
- **Aesthetic** — Maggie Appleton: warm, hand-drawn/illustrated, light,
  editorial.
- **Keep** — light/dark theme toggle, multilingual (en/fr/zh) UI chrome.
- **Strip** — animated cursor, preloader screen, animated background.
- **Garden features** — growth stages (seedling / budding / evergreen), topic
  tags + filtering, planted + last-tended dates, backlinks between notes.

## Resolved decisions

- Garden notes are authored in **English only**; the UI chrome and the
  Projects / About content stay en/fr/zh.
- The homepage **became a Maggie-style hub** (hero + Garden + Projects + About),
  and the old portfolio slideshow was removed entirely.
- GitHub Pages SPA routing uses a `404.html` fallback with `BrowserRouter`.

## Current architecture (post-migration)

- `src/main.jsx` wraps the app in `<BrowserRouter>` + the provider stack (Data,
  Language, Viewport, Input, Feedbacks, Theme, Location, Navigation) and renders
  routes: `/` (`HomePage`), `/projects` (`ProjectsPage`), `/about` (`AboutPage`),
  `/garden` (`GardenIndexPage`), `/garden/:slug` (`NotePage`), `*` → home.
- The original slideshow (`Portfolio.jsx`, `LayoutSlideshow`, `Section*`,
  `Article*`, old `nav/`, `hooks/parser.js`) has been **removed** (Phase 5).
- Content: `public/data/*.json` + `public/data/sections/*.json`, loaded by
  `src/providers/DataProvider.jsx`. The editorial pages read these directly
  (e.g. `getSections().find(s => s.id === "portfolio")`).
- Editorial pages live in `src/pages/`; the shared shell is in
  `src/components/garden/` (`SiteHeader`, `SiteFooter`, `EditorialLayout`).
- Styling: SCSS + Bootstrap + CSS vars. Fonts in `src/styles/_constants.scss`
  (Newsreader body, Fraunces headings). Warm theme palettes in
  `src/styles/themes/_variables-theme-{light,dark}.scss`. Editorial styles in
  `src/styles/garden/{_garden,_home}.scss`.
- Still wired into the provider shell (kept): `src/components/{mouse, modals,
  notifications, loaders, widgets, generic/Tooltip}` and the live buttons + nav
  tool pickers.

## Phased plan

### Phase 1 — Routing + MDX build pipeline (foundation) ✅ DONE

- [x] Add deps: `react-router-dom`, `@mdx-js/rollup`, `@mdx-js/react`,
  `remark-gfm`, `remark-frontmatter`, `remark-mdx-frontmatter`, `rehype-slug`,
  `rehype-autolink-headings`. Wiki-links use a local plugin
  (`src/garden/remark-wiki-link.js`) instead of an external dependency.
- [x] `vite.config.js`: register `@mdx-js/rollup` (with `enforce: 'pre'`) ahead
  of `react()`, wired with the remark/rehype plugins; `react()` now also matches
  `.mdx`.
- [x] `src/main.jsx`: wrap the app in
  `<BrowserRouter basename={import.meta.env.BASE_URL}>` with routes `/`
  (`HomePage` → existing `Portfolio`), `/garden` (`GardenIndexPage`),
  `/garden/:slug` (`NotePage`), and a `*` fallback. Removed the
  `window.history.pushState(..., BASE_URL)` block that fought the router.
- [x] `public/404.html` SPA fallback + decode snippet in `index.html` for
  GitHub Pages deep links.
- [x] `src/garden/loader.js`: eager-globs `/content/garden/*.mdx`, reads
  `frontmatter`, builds the note index + bidirectional backlink graph from
  `[[wiki-links]]`. Exposes `getAllNotes / getNoteBySlug / getBacklinks /
  getOutboundNotes / getAllTopics / getAllAreas / getGrowthStage`.
- [x] Pages + MDX map: `src/pages/{HomePage,GardenIndexPage,NotePage}.jsx`,
  `src/garden/mdx-components.jsx`. Two seed notes in `content/garden/`.
  Baseline styling in `src/styles/garden/_garden.scss`.
- [x] Verified: `npm install`, `npm run build` (850 modules, no errors), and
  `npm run dev` all succeed.

> **Note metadata decision applied:** each note carries a primary `area` (KB
> cluster) plus freeform `topics[]`.

### Phase 2 — Maggie editorial design system ✅ DONE

- [x] Fonts: headings **Fraunces** (variable serif), body **Newsreader**
  (editorial serif), loaded via Google Fonts in `index.html`; updated
  `$headings-font-family` / `$font-family-base` in `_constants.scss`.
- [x] Warm light palette in `_variables-theme-light.scss`: cream bg (`#faf6ef`),
  warm ink (`#2b2622`), muted (`#7a6f62`), terracotta accent (`#9a4b2e`).
  Updated the dark palette to a warm-dark variant (`#17130f` bg, `#d8794f`
  accent). Updated `theme-color` meta + `<body>` bg to cream.
- [x] Editorial polish in `src/styles/garden/_garden.scss`: Fraunces headings
  with optical sizing, ~65ch prose measure, larger prose size.
- [x] Stripped template features in `settings.json`: `animatedCursorEnabled` →
  `false`, `backgroundStyle` → `plain`, `preloaderSettings.enabled` → `false`.
- [x] Verified: `npm run build` compiles cleanly.

> Global portfolio typography scale left intact for now (the font swap alone
> reshapes the feel); the portfolio sections get their full restyle in Phase 4.

### Phase 3 — Garden index + note pages ✅ DONE

- [x] Growth stages: seedling 🌱 / budding 🌿 / evergreen 🌳, defined in
  `src/garden/loader.js` (`GROWTH_STAGES` + `getGrowthStage`) and surfaced on the
  index and note pages.
- [x] `src/pages/GardenIndexPage.jsx`: lists notes with growth icon, title,
  summary, area, and topics. (Topic / growth-stage *filtering* is still a
  later enhancement — see Phase 6.)
- [x] `src/pages/NotePage.jsx`: prose layout; frontmatter header (growth,
  planted, tended, area, topics); rendered MDX; backlinks panel ("Notes that
  link here").
- [x] `src/garden/mdx-components.jsx`: `Callout` + an internal-aware `Link` that
  routes wiki-links through React Router.
- [x] Two seed notes in `content/garden/` (`hello-garden`, `embedded-ml`) with
  working bidirectional `[[wiki-links]]`.

### Phase 4 — Editorial homepage + site shell ✅ DONE

- [x] Maggie-style editorial homepage (`src/pages/HomePage.jsx`) replacing the
  template slideshow at `/`: large Fraunces serif hero statement, localized
  subtitle, then flowing sections — *The Garden* (recent notes), *Projects*
  (read live from `portfolio.json`), and *About* — all en/fr/zh.
- [x] Shared site shell: `src/components/garden/SiteHeader.jsx` (brand + nav +
  reused theme/language pickers) and `SiteFooter.jsx` (GitHub / LinkedIn /
  email). `EditorialLayout.jsx` wraps every editorial route and adds a
  `body-flow` class that unlocks body scrolling (the template locked `<body>`
  to a fixed viewport for the slideshow).
- [x] Garden index + note pages adopt the same `EditorialLayout` shell.
- [x] New editorial stylesheet `src/styles/garden/_home.scss` (header, hero,
  sections, list rows, footer, project cards, tag chips, About timeline,
  interests grid). Fixed an invalid border var (`--theme-borders` →
  `--theme-standard-borders`).

### Phase 5 — Full migration + deep cleanup ✅ DONE

- [x] Dedicated **Projects** page (`src/pages/ProjectsPage.jsx`, `/projects`) —
  full portfolio read from `portfolio.json` (title, description, tech-tag chips,
  GitHub links), localized.
- [x] Dedicated **About** page (`src/pages/AboutPage.jsx`, `/about`) — bio from
  `cover.json`, a work-experience timeline + education from
  `experience.json` / `education.json`, and an interests grid. Renders the
  template's `{{…}}` / `[[…]]` markers as accent / plain text.
- [x] Top nav is now **Garden / Projects / About** (+ theme + language toggles);
  the old `/portfolio` route, the `Résumé` tab, and all `/portfolio` links were
  removed.
- [x] **Removed the old slideshow template entirely.** Deleted `Portfolio.jsx`
  then ran a reachability sweep from `src/main.jsx` and removed **143 dead
  files** (+ co-located `.scss`, + 8 empty dirs): all of
  `components/{articles,sections,layout,capabilities,forms}`, most of
  `components/generic`, the old `components/nav` (sidebar/mobile/tab + 5 unused
  tools), dead `components/buttons` + `components/widgets`, and
  `hooks/parser.js` + `hooks/models/*`.
- [x] Kept the live UI shell still wired into providers: `components/`
  `{mouse, modals, notifications, loaders, widgets/PacMan+Logo, generic/Tooltip}`
  and the live buttons + the two nav tool pickers. `styles/_extend.scss` is kept
  (shared by those stylesheets).
- [x] Verified: `npm run build` passes (488 modules; JS bundle 450 kB → 295 kB
  after the slideshow tree was dropped).

### Phase 6 — Remaining / optional polish

- [x] SEO / identity pass: aligned `index.html` title, description, keywords,
  Open Graph, Twitter, and the JSON-LD `Person` to the current positioning
  (Embedded ML & Firmware Engineer / Systems Design Engineering @ Waterloo,
  digital garden) instead of the old "Machine Learning Engineer" copy. Removed
  the template's generic tab favicon (blank `data:,` icon). Renamed the package
  to `ashton-chen-personal-site`.
- [ ] Garden filtering: filter the index by topic + growth stage; a growth-stage
  legend.
- [ ] Per-note SEO meta (title / description / og), topic index pages.
- [ ] Resource cleanup (deferred — touches data/assets): unused section data
  (`skills.json`, `contact.json`, no page renders them), template demo images in
  `public/images/`, the company logos in `images/logos/` (the About timeline is
  text-only), and obsolete tooling (`npm/` article generators).
- [ ] Optional later: graph view, RSS, search; show company logos in the About
  timeline.



## Files (high level)

**New**: `src/pages/{HomePage,GardenIndexPage,NotePage,ProjectsPage,AboutPage}.jsx`,
`src/components/garden/{SiteHeader,SiteFooter,EditorialLayout}.jsx`,
`src/garden/{loader.js,mdx-components.jsx,remark-wiki-link.js}`,
`content/garden/*.mdx`, `public/404.html`,
`src/styles/garden/{_garden,_home}.scss`.

**Modified**: `vite.config.js`, `package.json`, `src/main.jsx`,
`src/styles/_constants.scss`,
`src/styles/themes/_variables-theme-{light,dark}.scss`, `index.html`
(title / SEO / OG / JSON-LD aligned to current positioning, generic favicon
removed), `settings.json` (preloader / background / cursor off).

**Removed** (Phase 5): `src/components/Portfolio.jsx` + 142 other dead template
files (articles, sections, layout, capabilities, forms, most of generic, old
nav, dead buttons/widgets) and `src/hooks/{parser.js,models/*}`.

## Verification

- `npm run build` succeeds (488 modules, no errors).
- `/`, `/projects`, `/about`, `/garden`, `/garden/:slug` all render; theme +
  language toggles work across every page.
- Wiki-links `[[note]]` navigate correctly; backlinks resolve in both
  directions.
- No animated cursor / preloader / animated background appear (disabled in
  `settings.json`).
- Editorial pages scroll on desktop (the `body-flow` unlock); prose column,
  Fraunces/Newsreader fonts, and contrast read well in light + dark.

### Still open (Phase 6)

- Garden topic / growth-stage filtering + legend.
- Per-note SEO meta, topic index pages.
- Optional resource cleanup (unused data JSON, demo images, logos, `npm/`
  tooling).

## Further considerations (decided)

1. **Homepage** — ✅ Converted to a Maggie-style hub (Garden / Projects / About);
   the portfolio slideshow was removed.
2. **Body font** — ✅ Editorial serif (**Newsreader**) for body, **Fraunces** for
   headings; sans reserved for UI chrome.
3. **Note metadata** — ✅ Each note carries one primary `area` plus freeform
   `topics[]`.
