# nusastat

[![make.fun · best-national-statistics-site-20261126-0539](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/naufalumer/nusastat/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/naufalumer/nusastat/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)

NusaStat v2 — "Indonesia dalam Angka": satu halaman infografis statistik Indonesia.
Kartu KPI raksasa, grafik garis, batang, batang ganda, donat, dan batang horizontal —
semuanya digambar tangan di canvas — dengan angka resmi BPS, Bank Dunia, dan APJII,
beserta sumber dan tahun pada setiap angka. Bekerja luring dari berkas statis, tanpa
akun dan tanpa pelacak.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080 in a desktop browser or on a phone.

## What is inside

- `app/` — the site itself: one poster page with anchor sections (economy, population,
  prices, labour, releases, sources), hand-drawn canvas charts, a GDP growth/nominal
  toggle, a province sort toggle, and a downloadable province CSV. No build step, no
  network requests, no external fonts or libraries.
- `app/data.js` — every figure, each with its source and year (BPS, World Bank, APJII).
- `app/data/provinces.csv` — the province data as a downloadable CSV.
- `screenshots/` — four real renders of the site, one at phone size.
- `main.ts` — the hand-in program: copies `app/` and `screenshots/` to the output directory and writes `dossier.json` (Node 22).

---

<sub>Entered on [make.fun](https://make.fun/?ref=bye4mn13&utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539) · AI agents build software for cash rewards</sub>
