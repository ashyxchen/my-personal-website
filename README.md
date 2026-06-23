# Ashton Chen — Personal Site & Digital Garden

My personal website and digital garden, live at **[ashyxchen.me](https://ashyxchen.me)**.

Part wiki, part workshop: a place to grow notes on embedded firmware, edge ML, and
computer vision, and to write up the things I build and the thinking behind them.
The design and the "digital garden" idea are inspired by
**[Maggie Appleton](https://maggieappleton.com/)**.

> **Version 1.0** — first public release.

## What it is

This started as Ryan Balieiro's [React Portfolio Template](https://github.com/ryanbalieiro/react-portfolio-template)
and was reworked into a warm, editorial, long-scroll digital garden:

- **The Garden** — an MDX-backed knowledge base with two tabs:
  - **Wiki** — notes and concepts, filterable by growth stage and topic.
  - **Projects** — engineering write-ups, filterable by status and tool.
- **Growth stages** — every note is a 🌱 seedling, 🌿 budding, or 🌳 evergreen,
  signalling how developed an idea is rather than pretending it's finished.
- **Wiki-links & backlinks** — notes connect with `[[wiki-links]]`, and each note
  shows the notes that link back to it.
- **Hierarchical, browsable areas** — `area` frontmatter is a `/`-separated path
  (e.g. `Engineering / Machine Learning`) that compiles into browsable
  `/garden/area/*` pages with linked breadcrumbs and folder cards.
- **Editorial pages** — Home, Projects, and About, in warm serif type.
- **Light / dark theme toggle** and **multilingual UI** (English, French, Chinese)
  carried over from the original template.

## Tech

- **React 18** + **react-router-dom**
- **Vite 6** for bundling
- **MDX** (`@mdx-js/rollup`) for note content, with `remark-gfm`, frontmatter,
  `rehype-slug` / `rehype-autolink-headings`, and a small custom remark plugin for
  `[[wiki-links]]`
- **SCSS** + CSS custom properties for theming
- Type: **Fraunces** (headings) and **Newsreader** (body)
- Hosted on **GitHub Pages** via a **GitHub Actions** workflow, on the custom
  domain `ashyxchen.me`

## Project layout

```
content/garden/      # MDX notes — the digital garden lives here
public/data/         # JSON content for the editorial pages (about, experience, projects…)
src/
  garden/            # note loader, area/backlink graph, MDX components, wiki-links
  components/garden/ # editorial layout, header/footer, breadcrumb
  pages/             # HomePage, ProjectsPage, AboutPage, GardenIndexPage, NotePage, AreaPage
  providers/         # data, language, theme, viewport, etc.
  styles/            # design system + garden/editorial styles
```

## Running locally

```
npm install
npm run dev
```

Build a production bundle:

```
npm run build
```

## Adding a note

Drop a new `.mdx` file into `content/garden/` with frontmatter, for example:

```mdx
---
title: "Quantization, and What Breaks"
type: "wiki"            # "wiki" (default) or "project"
growth: "seedling"      # seedling | budding | evergreen
area: "Engineering / Machine Learning"
topics: ["quantization", "edge-ai"]
summary: "Notes on shrinking models without wrecking them."
planted: "2026-06-23"
---

Your note here. Link to other notes with [[another-note]].
```

It's indexed automatically — the area path, breadcrumbs, and backlinks all follow
from the frontmatter and `[[wiki-links]]`.

## Credits

- Originally based on the **[React Portfolio Template](https://github.com/ryanbalieiro/react-portfolio-template)**
  by **[Ryan Balieiro](https://ryanbalieiro.com/)** (MIT). The customization
  tutorials for that template are still under [`docs/tutorials`](./docs/tutorials).
- Design and the digital-garden concept are inspired by
  **[Maggie Appleton](https://maggieappleton.com/)**.
- Built with **[React](https://reactjs.org/)**, **[Vite](https://vitejs.dev/)**,
  **[MDX](https://mdxjs.com/)**, **Swiper**, **Font Awesome**, and **PrimeIcons**.

## License

Released under the [MIT](./LICENSE) license.