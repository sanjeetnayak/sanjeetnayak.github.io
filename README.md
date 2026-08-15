# Sanjeet Kumar Nayak

Personal site and working tools, hosted on GitHub Pages at [sanjeetnayak.github.io](https://sanjeetnayak.github.io).

Sanjeet is an Engineering Manager for energy modelling at alliantgroup — ASHRAE 90.1 baselines, Section 179D compliance, HVAC & MEP. This repo is his portfolio plus a set of small, dependency-free web tools he built for the engineering world he works in.

## Pages

| Page | What it is |
| --- | --- |
| [`/`](https://sanjeetnayak.github.io/) | Home — hero, profile, tools grid, experience timeline, contact |
| [`/about/`](https://sanjeetnayak.github.io/about/) | CV & resume, with downloadable PDF |
| [`/ductsizer/`](https://sanjeetnayak.github.io/ductsizer/) | HVAC duct-sizing calculator — flow rate, velocity, head loss and equivalent diameter, in SI or US units |
| [`/Tax/`](https://sanjeetnayak.github.io/Tax/) | 2025 US federal income tax estimator with a marginal-bracket breakdown |
| [`/Blackjack/`](https://sanjeetnayak.github.io/Blackjack/) | Blackjack against the dealer with a full 52-card deck — the coding exercise that started the site |

## Stack

- Vanilla HTML, CSS, and JS — no build step, no framework, no dependencies to install.
- Bootstrap 4.5 and Font Awesome 4.7 from CDN; Space Grotesk / Inter / JetBrains Mono from Google Fonts.
- Shared styling in [`main.css`](main.css); shared nav and auth behaviour injected by [`main.js`](main.js) into every page's `<header data-nav-placeholder>`.

## Run locally

Any static server works, e.g.:

```bash
python -m http.server 8000
```

then open <http://127.0.0.1:8000>.

## Deploy

GitHub Pages user site — pushing to `main` publishes automatically to <https://sanjeetnayak.github.io>. No workflow or build step required.

## License

All content and code © Sanjeet Kumar Nayak. Reuse with attribution.
