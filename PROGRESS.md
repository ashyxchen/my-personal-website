# Portfolio — Progress & Next Steps

Personal notes for picking up work on this site (based on the React Portfolio
Template by Ryan Balieiro). This file tracks what's customized vs. what still
needs doing. It is **not** part of the published site.

## How to run

> **Prerequisite — Node.js.** This machine had no Node/npm installed (the only
> `node.exe` on disk belonged to Adobe Creative Cloud). Installed **Node.js LTS
> v24.17.0** (npm 11.13.0) via `winget install --id OpenJS.NodeJS.LTS --source
> winget`. New terminals pick it up automatically from the system PATH.

```bash
npm install      # first time only
npm run dev      # start the dev server (Vite)
npm run build    # production build
npm run preview  # preview the production build
```

> **Build verified (2026-06-21).** `npm install` + `npm run build` complete
> cleanly with Vite 6.4.1 (836 modules transformed, no errors) after the
> deploy-readiness edits and demo-image cleanup below.

All site content lives in `public/data/` (top-level config) and
`public/data/sections/` (per-section content). Resume source of truth:
`MLE Resume.txt`.

## Current state

P1 (core resume content) is done. The profile name/title plus experience,
education, skills, projects, and roles now reflect the real resume. P2/P3
(identity, contact, branding, polish) are still the template's placeholder
content.

> **Locales:** P1 content was written for `en`, `fr`, and `zh` only. Spanish
> (`es`) was intentionally dropped from these sections and falls back to
> English.

| Area | File | Status |
|------|------|--------|
| Name + stylized name | `public/data/profile.json` | ✅ Done |
| Hero title | `public/data/sections/cover.json` | ✅ Done |
| Roles | `public/data/profile.json` | ✅ Done |
| Work experience | `public/data/sections/experience.json` | ✅ Done |
| Education | `public/data/sections/education.json` | ✅ Done |
| Skills | `public/data/sections/skills.json` | ✅ Done |
| Projects | `public/data/sections/portfolio.json` | ⚠️ Only 1 project |
| Contact info | `public/data/sections/contact.json` | ✅ Done (real info) |
| EmailJS | `public/data/sections/contact.json` | ⚠️ Lock key to domain |
| About / interests | `public/data/sections/cover.json` | ✅ Done |
| Achievements | `public/data/sections/achievements.json` | ✅ Section removed |
| Stats / facts | `public/data/sections/updates.json` | ✅ Section removed |
| Branding (preloader, dev console) | `public/data/settings.json` | ✅ Done |
| Company / school logos | `public/images/logos/` | ✅ Done (official) |
| Default theme | `public/data/settings.json` | ✅ Light mode |
| Headshot | `public/images/pictures/profile-picture.jpg` | ❌ Template placeholder |
| SEO / OG / canonical URLs | `index.html` | ✅ Done |
| Deploy base path | `vite.config.js` | ✅ Done |

> **Resume download is live.** `resumePdfUrl` in `profile.json` points to
> `Ashton-Chen-Resume.pdf` (hosted in `public/`), so the "Download CV" button
> is shown.

## Roadmap

### P1 — Core resume content ✅ DONE

- [x] **Experience** — replaced template jobs with the real ones: Magna
  International – OtO Inc., U Waterloo RA, Motorola Solutions, IBM / Venturelab.
- [x] **Education** — single entry: University of Waterloo, BASc Honours Systems
  Design Engineering (AI Option), 2022–2027, cGPA 3.8.
- [x] **Skills** — ML/AI focused: capability cards (CV, Deep Learning, MLOps,
  Edge Inference, Reproducible ML), "ML / AI Frameworks", "MLOps & Cloud",
  and "Programming Languages".
- [x] **Projects** — SafePulse (1st place hackathon). Removed fake projects.
- [x] **Roles** (`profile.json`) — ML / CV / MLOps / Deep Learning roles
  (en/fr/zh).

### P2 — Identity, contact & branding

- [x] **Contact** — real info wired: `ash.chen@uwaterloo.ca`,
  `linkedin.com/in/ashyuxchen`, `github.com/yuxstar1444`, (647)-780-3866.
  Removed the stale Facebook/Mark Choi links.
- [ ] **EmailJS** — keys in `contact.json` are the template author's defaults.
  Replace with your own EmailJS account (or lock the key to your domain).
- [x] **Cover** — rewrote the about text (now Systems Design Engineering / ML
  Engineer, less technical), updated the inline list (Toronto / real email /
  @yuxstar1444), and replaced personal interests with Dogs, Planes, Muay Thai,
  and Chess. _(Testimonials already removed.)_
- [x] **Achievements & stats** — removed both sections (`achievements` and
  `updates`) from `sections.json`.
- [x] **Branding** (`settings.json`) — preloader rebranded to "Ashton Chen /
  Machine Learning Engineer"; dev-console message stripped of the template
  repo + author links. Also updated `index.html` title and SEO/OG/Twitter meta.

### P3 — Polish

- [ ] Replace `public/images/pictures/profile-picture.jpg` if it's still the
  template image.
- [x] Remove unused template demo images (testimonial-person-*,
  timeline-place-mit/harvard/adobe, screenshot-demo-*).
- [x] Fix locale keys: several section files use `ko` (Korean) but the site is
  configured for `zh` (Chinese).
- [ ] Fill in missing `zh` keys in `strings.json`.
- [x] Removed the Spanish (`es`) language tab from `settings.json`; the switcher
  now offers English / Français / 简体中文 only.

## Evaluation TODOs (2026-06-12)

From a full site audit. Hosting target confirmed: **GitHub Pages project site**
`yuxstar1444/my-personal-website` → `https://yuxstar1444.github.io/my-personal-website/`.

### 🔴 Critical

- [x] **Fix `index.html` template URLs** — canonical, `og:url`, `og:image`,
  `twitter:url`, `twitter:image`, and the `ld+json` `url` all still point to
  `https://ryanbalieiro.github.io/react-portfolio-template/`. Repoint to
  `https://yuxstar1444.github.io/my-personal-website/` (images →
  `…/images/pictures/og-image.jpg`). Breaks SEO + social-share previews.
- [x] **Fix `index.html` dark theme meta** (light mode is now default, causes a
  dark flash on load): `color-scheme` `dark`→`light`, `theme-color` `#111111`→
  light (`#ffd3a6`), and `<body style="background-color:#111111">`→ light.
- [x] **Set Vite base path** — `vite.config.js` `base`
  `/react-portfolio-template/` → `/my-personal-website/` (required for the
  deployed site to resolve JS/CSS/images).
- [ ] **Real headshot** — replace `public/images/pictures/profile-picture.jpg`
  (currently the template's anonymous hooded-figure illustration). _Needs a
  photo from the user; can't be fetched from LinkedIn (auth-gated)._

### 🟠 High

- [ ] **Expand portfolio** — `portfolio.json` has only 1 project (SafePulse).
  Add 3–5 real projects (IBM / Motorola / Magna internship work, CV/ML
  coursework, or OSS) with screenshots and live/repo links.

### 🟡 Medium

- [ ] **Replace `og-image.jpg`** social-preview card with a branded one.
- [ ] **Personalize favicon** — currently the generic template `logo.svg`.
- [ ] **EmailJS** — lock the public key to the deployed domain in the EmailJS
  dashboard to prevent abuse.

### 🟢 Low / cleanup

- [x] Delete leftover template demo images in `public/images/pictures/`
  (Adobe / Coursera / Harvard / MIT / Udacity timeline logos,
  `screenshot-demo-*`).
- [x] Fix locale keys: several section files use `ko` (Korean) but the site is
  configured for `zh`.
- [ ] Fill in missing `zh` keys in `strings.json`.

### Deploy

- [ ] Build + deploy per
  `docs/tutorials/TUTORIAL_21_DEPLOYING_FOR_PRODUCTION.md`.

## Next steps (remaining)

Deploy-readiness (URLs, base path, theme meta), the `ko`→`zh` locale fix, and
the demo-image cleanup are **done**, and the production build passes. What's
left, by priority:

**🔴 Needs an asset from you**
- [ ] **Headshot** — supply a real photo to replace
  `public/images/pictures/profile-picture.jpg`.

**🟠 High**
- [ ] **Expand portfolio** — add 3–5 real projects to `portfolio.json` with
  links/screenshots (needs project details from you).

**🟡 Medium**
- [ ] **Branded `og-image.jpg`** social-preview card (needs a designed image).
- [ ] **Personalize favicon** — replace the generic template
  `public/images/svg/logo.svg`. _(Can be generated without input.)_
- [ ] **EmailJS** — swap the template author's keys in `contact.json` for your
  own account and lock the public key to the deployed domain.

**🟢 Low**
- [ ] **Fill missing `zh` keys** in `strings.json`. _(Can be done without
  input.)_

**Can be done now without input:** favicon, `zh` string keys, EmailJS config
scaffold. **Needs you:** headshot photo, real project details, designed OG card.

## Done-when checklist

- [ ] `npm run dev` renders with no console errors.
- [x] `npm run build` completes without errors (verified 2026-06-21).
- [ ] No remaining `Ryan Balieiro`, `Mark Choi`, or `mark.choi` strings
  (`grep -ri "ryan balieiro\|mark choi" public/`).
- [ ] Resume download button stays hidden while `resumePdfUrl` is empty.
