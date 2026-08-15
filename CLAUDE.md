# CLAUDE.md

Guidance for Claude Code working in this repo.

## What this is

A static GitHub Pages personal site + tool collection for Sanjeet Kumar Nayak (Engineering Manager, Energy Modelling at alliantgroup). Vanilla HTML/CSS/JS only — **no build step, no framework, no package manager**. Bootstrap 4.5 and Font Awesome 4.7 load from CDN; fonts from Google Fonts. Deploys by pushing `main` (user site, no workflow).

## Structure

- Page roots are directories: `/`, `about/`, `ductsizer/`, `Tax/`, `Blackjack/`. Each holds its own `index.html` plus page-local CSS/JS.
- Shared shell: `main.css` (site-wide styles) and `main.js` (nav, auth, shared behaviour). Individual pages may add their own `main.css`/`styles.css`/`game.css` on top — `ductsizer/` has its own `main.css` and `main.js` that shadow the root ones by same-name convention; check which file you're editing.
- `images/` — profile and cover photos.

## Shared nav (important)

Every page has an empty `<header class="site-header" data-nav-placeholder></header>`. `main.js` injects the navbar into every such placeholder at load, so **new pages must**:

1. Include `<header class="site-header" data-nav-placeholder></header>`.
2. Load `main.js` (via `../main.js` for pages in subdirectories) at the end of `<body>`.
3. Add any new top-level link to `NAV_LINKS` in `main.js` (currently Home / About / DuctSizer). It renders links and marks the active one by `pathname.startsWith(href)`.

## Auth system

`main.js` implements a token-based login (Login/Logout in the navbar, plus `login.html`). It talks to a backend whose base URL defaults to `http://127.0.0.1:8000` and can be overridden per-deploy via `window.AUTH_API_BASE_URL`. Auth state lives in `localStorage` (override: `window.AUTH_TOKEN_STORAGE`). Exposes `window.authFetch` for authenticated requests. Treat this as shared site-wide behaviour — don't duplicate or bypass it per page.

## Conventions

- Match existing style: Bootstrap 4.5 utility classes, page-local CSS files, vanilla JS in IIFEs.
- Numbers/units: tools support both SI and US units — keep unit handling in one place per tool.
- No tests. Validate by opening the page locally (`python -m http.server 8000`).
- CDN links must stay consistent with the rest of the site (Bootstrap 4.5.0, FA 4.7.0, same Google Fonts family).
