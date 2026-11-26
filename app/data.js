// NusaStat v2.1 — data: published Indonesian statistics, each figure carrying
// its source and year. Headline figures from Statistics Indonesia (BPS),
// the World Bank and APJII as published; rounded where noted.
// Nothing here is fetched at run time: the whole site works offline.
// All figures are identical to v2 — only the words were translated.

export const META = {
  country: 'Indonesia',
  siteName: 'NusaStat',
  tagline: 'Indonesia in numbers — one page, every key number.',
  updated: '27 November 2026',
  note: 'Figures rounded from official publications. Every chart carries its source and year.',
};

// Giant KPI cards in the hero.
export const HERO_KPI = [
  { id: 'population', label: 'Population', value: '283.5', unit: 'million people', change: '+0.8% per year', year: '2024', source: 'BPS' },
  { id: 'gdp', label: 'Nominal GDP', value: 'Rp22,139', unit: 'trillion', change: 'up 5.03%', year: '2024', source: 'BPS' },
  { id: 'inflation', label: 'Inflation', value: '2.86', unit: '%', change: 'October 2025 · y-o-y', year: '2025', source: 'BPS' },
  { id: 'unemployment', label: 'Open unemployment', value: '4.76', unit: '%', change: 'February 2025', year: '2025', source: 'BPS' },
  { id: 'poverty', label: 'People in poverty', value: '8.47', unit: '%', change: 'March 2025', year: '2025', source: 'BPS' },
  { id: 'hdi', label: 'Human Development Index', value: '75.02', unit: 'scale 0–100', change: 'up 0.63 points', year: '2024', source: 'BPS' },
];

// Annual series: year, value. Sources noted per series.
export const SERIES = {
  gdpGrowth: {
    title: 'Economic growth',
    subtitle: 'GDP, % per year',
    unit: '%',
    source: 'BPS, Official Statistics News',
    years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
    values: [4.88, 5.03, 5.07, 5.17, 5.02, -2.07, 3.70, 5.31, 5.05, 5.03],
    highlight: { year: 2020, note: 'Pandemic contraction −2.07%' },
  },
  gdpNominal: {
    title: 'Nominal GDP',
    subtitle: 'at current prices, Rp trillion',
    unit: 'Rp T',
    source: 'BPS',
    years: [2019, 2020, 2021, 2022, 2023, 2024],
    values: [15833, 15434, 16970, 19588, 20892, 22139],
    highlight: null,
  },
  inflation: {
    title: 'Annual inflation',
    subtitle: 'CPI, % y-o-y, December',
    unit: '%',
    source: 'BPS',
    years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
    values: [3.35, 3.02, 3.61, 3.13, 2.72, 1.68, 1.87, 5.51, 2.61, 1.57],
    highlight: { year: 2022, note: 'Peak of 5.51% after the fuel-price rise' },
  },
  unemployment: {
    title: 'Open unemployment',
    subtitle: 'Open unemployment rate, %, August',
    unit: '%',
    source: 'BPS, Sakernas',
    years: [2019, 2020, 2021, 2022, 2023, 2024],
    values: [5.28, 7.07, 6.49, 5.86, 5.45, 4.91],
    highlight: { year: 2020, note: 'Pandemic peak 7.07%' },
  },
  poverty: {
    title: 'People in poverty',
    subtitle: '%, March',
    unit: '%',
    source: 'BPS',
    years: [2019, 2020, 2021, 2022, 2023, 2024, 2025],
    values: [9.41, 9.78, 10.14, 9.54, 9.36, 9.03, 8.47],
    highlight: { year: 2025, note: 'Lowest in a decade: 8.47%' },
  },
  population: {
    title: 'Population',
    subtitle: 'Million people, mid-year',
    unit: 'M',
    source: 'BPS, population projection',
    years: [2020, 2021, 2022, 2023, 2024],
    values: [270.2, 273.7, 276.4, 279.4, 283.5],
    highlight: null,
  },
  exports: {
    title: 'Exports',
    subtitle: 'US$ billion',
    unit: 'US$ B',
    source: 'BPS',
    years: [2019, 2020, 2021, 2022, 2023, 2024],
    values: [167.7, 163.2, 231.6, 291.9, 258.8, 264.7],
    highlight: null,
  },
  imports: {
    title: 'Imports',
    subtitle: 'US$ billion',
    unit: 'US$ B',
    source: 'BPS',
    years: [2019, 2020, 2021, 2022, 2023, 2024],
    values: [171.3, 141.6, 196.2, 237.4, 221.9, 233.7],
    highlight: null,
  },
};

// GDP by industry, 2024 shares of GDP (%). Source: BPS.
export const SECTORS = [
  { name: 'Manufacturing', share: 18.9 },
  { name: 'Trade', share: 12.9 },
  { name: 'Agriculture & fisheries', share: 12.9 },
  { name: 'Construction', share: 9.9 },
  { name: 'Mining & quarrying', share: 8.5 },
  { name: 'Transportation & warehousing', share: 6.0 },
  { name: 'Information & communications', share: 4.4 },
  { name: 'Financial & insurance services', share: 4.1 },
  { name: 'Other', share: 22.4 },
];

// Age structure, 2024 (rounded shares, BPS). Sums to 100.
export const AGE_GROUPS = [
  { group: '0–14 years', share: 24.5 },
  { group: '15–64 years', share: 68.0 },
  { group: '65 years and over', share: 7.5 },
];

// Labour: share of employed persons by sector, Feb 2025 (BPS, Sakernas).
export const LABOUR_SECTORS = [
  { name: 'Agriculture', share: 28.6 },
  { name: 'Trade', share: 19.4 },
  { name: 'Manufacturing', share: 13.7 },
  { name: 'Community services', share: 17.3 },
  { name: 'Construction', share: 6.1 },
  { name: 'Other', share: 14.9 },
];

// Provinces: 2024 mid-year population estimate (million), BPS. Top 10.
export const PROVINCES_TOP = [
  { name: 'West Java', pop: 49.9, capital: 'Bandung' },
  { name: 'East Java', pop: 41.8, capital: 'Surabaya' },
  { name: 'Central Java', pop: 38.3, capital: 'Semarang' },
  { name: 'North Sumatra', pop: 15.6, capital: 'Medan' },
  { name: 'Banten', pop: 12.4, capital: 'Serang' },
  { name: 'Jakarta', pop: 10.6, capital: 'Jakarta' },
  { name: 'South Sulawesi', pop: 9.5, capital: 'Makassar' },
  { name: 'Lampung', pop: 9.3, capital: 'Bandar Lampung' },
  { name: 'South Sumatra', pop: 8.8, capital: 'Palembang' },
  { name: 'Riau', pop: 6.7, capital: 'Pekanbaru' },
];

// Trade balance (exports − imports, US$ billion), computed from the two series
// above — no new figure, only the difference shown on the page.
export const TRADE_BALANCE = SERIES.exports.years.map((year, i) => ({
  year,
  balance: +(SERIES.exports.values[i] - SERIES.imports.values[i]).toFixed(1),
}));

// Latest releases, as published.
export const RELEASES = [
  { date: '03 Nov 2025', title: 'October 2025 inflation at 2.86% (y-o-y)', source: 'BPS' },
  { date: '05 Nov 2025', title: 'Q3 2025 economy grew 5.04% (y-o-y)', source: 'BPS' },
  { date: '05 Nov 2025', title: 'Open unemployment rate in February 2025 at 4.76%', source: 'BPS' },
  { date: '15 Jul 2025', title: 'Poverty profile, March 2025: 8.47% of people in poverty', source: 'BPS' },
  { date: '01 Aug 2025', title: 'June 2025 exports reached US$23.73 billion', source: 'BPS' },
  { date: '28 Feb 2025', title: '2024 HDI reached 75.02, up 0.63 points', source: 'BPS' },
];

export const SOURCES = [
  { name: 'Statistics Indonesia (BPS)', what: 'Population, GDP, inflation, unemployment, poverty, HDI, trade', url: 'bps.go.id' },
  { name: 'World Bank', what: 'International comparisons, GDP per capita ±US$4,925 (2024)', url: 'worldbank.org' },
  { name: 'APJII', what: 'Internet user penetration 2024: 79.5%', url: 'apjii.or.id' },
];

export const RELEASE_CALENDAR = [
  { date: '01 Dec 2025', item: 'November 2025 inflation' },
  { date: '15 Dec 2025', item: 'November 2025 exports–imports' },
  { date: '05 Feb 2026', item: '2025 economic growth (annual)' },
  { date: '16 Feb 2026', item: 'Open unemployment rate, August 2025' },
  { date: '15 Jul 2026', item: 'Poverty profile, March 2026' },
];
