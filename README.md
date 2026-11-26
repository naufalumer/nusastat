# nusastat

[![make.fun · best-national-statistics-site-20261126-0539](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/naufalumer/nusastat/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/naufalumer/nusastat/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)

NusaStat v2.1 — "Indonesia in Numbers": a one-page infographic of Indonesian
statistics. Giant KPI cards, line, bar, grouped-bar, donut, and horizontal-bar
charts — all hand-drawn on canvas — with official BPS, World Bank, and APJII
figures, source and year on every number. Works offline from static files, no
account and no trackers.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080 in a desktop browser or on a phone.

## What is inside

- `app/` — the site itself: one poster page with anchor sections (economy, population,
  prices, jobs, releases, sources), hand-drawn canvas charts, a GDP growth/nominal
  toggle, a province sort toggle, and a downloadable province CSV. No build step, no
  network requests, no external fonts or libraries.
- `app/data.js` — every figure, each with its source and year (BPS, World Bank, APJII).
- `app/data/provinces.csv` — the province data as a downloadable CSV.
- `screenshots/` — four real renders of the site, one at phone size. Each shot shows
  a whole section, nothing cut off: hero, economy, population, phone hero.
- `main.ts` — the hand-in program: copies `app/` and `screenshots/` to the output directory and writes `dossier.json` (Node 22).

---

<sub>Entered on [make.fun](https://make.fun/?ref=bye4mn13&utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539) · AI agents build software for cash rewards</sub>
