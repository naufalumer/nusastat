// NusaStat v2 — data: published Indonesian statistics, each figure carrying
// its source and year. Headline figures from Badan Pusat Statistik (BPS),
// the World Bank and APJII as published; rounded where noted.
// Nothing here is fetched at run time: the whole site works offline.

export const META = {
  country: 'Indonesia',
  siteName: 'NusaStat',
  tagline: 'Indonesia dalam angka — satu halaman, semua angka penting.',
  updated: '27 November 2026',
  note: 'Angka dibulatkan dari publikasi resmi. Setiap gambar dilengkapi sumber dan tahunnya.',
};

// Giant KPI cards in the hero.
export const HERO_KPI = [
  { id: 'population', label: 'Penduduk', value: '283,5', unit: 'juta jiwa', change: '+0,8% per tahun', year: '2024', source: 'BPS' },
  { id: 'gdp', label: 'PDB nominal', value: 'Rp22.139', unit: 'triliun', change: 'tumbuh 5,03%', year: '2024', source: 'BPS' },
  { id: 'inflation', label: 'Inflasi (y-on-y)', value: '2,86', unit: '%', change: 'Oktober 2025', year: '2025', source: 'BPS' },
  { id: 'unemployment', label: 'Pengangguran terbuka', value: '4,76', unit: '%', change: 'Februari 2025', year: '2025', source: 'BPS' },
  { id: 'poverty', label: 'Penduduk miskin', value: '8,47', unit: '%', change: 'Maret 2025', year: '2025', source: 'BPS' },
  { id: 'hdi', label: 'Indeks Pembangunan Manusia', value: '75,02', unit: 'skala 0–100', change: 'naik 0,63 poin', year: '2024', source: 'BPS' },
];

// Annual series: year, value. Sources noted per series.
export const SERIES = {
  gdpGrowth: {
    title: 'Pertumbuhan ekonomi',
    subtitle: 'PDB, % per tahun',
    unit: '%',
    source: 'BPS, Berita Resmi Statistik',
    years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
    values: [4.88, 5.03, 5.07, 5.17, 5.02, -2.07, 3.70, 5.31, 5.05, 5.03],
    highlight: { year: 2020, note: 'Kontraksi pandemi −2,07%' },
  },
  gdpNominal: {
    title: 'PDB nominal',
    subtitle: 'Atas dasar harga berlaku, Rp triliun',
    unit: 'Rp T',
    source: 'BPS',
    years: [2019, 2020, 2021, 2022, 2023, 2024],
    values: [15833, 15434, 16970, 19588, 20892, 22139],
    highlight: null,
  },
  inflation: {
    title: 'Inflasi tahunan',
    subtitle: 'IHK, % y-on-y, Desember',
    unit: '%',
    source: 'BPS',
    years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
    values: [3.35, 3.02, 3.61, 3.13, 2.72, 1.68, 1.87, 5.51, 2.61, 1.57],
    highlight: { year: 2022, note: 'Puncak 5,51% pasca kenaikan BBM' },
  },
  unemployment: {
    title: 'Pengangguran terbuka',
    subtitle: 'Tingkat pengangguran terbuka, %, Agustus',
    unit: '%',
    source: 'BPS, Sakernas',
    years: [2019, 2020, 2021, 2022, 2023, 2024],
    values: [5.28, 7.07, 6.49, 5.86, 5.45, 4.91],
    highlight: { year: 2020, note: 'Puncak pandemi 7,07%' },
  },
  poverty: {
    title: 'Penduduk miskin',
    subtitle: '%, Maret',
    unit: '%',
    source: 'BPS',
    years: [2019, 2020, 2021, 2022, 2023, 2024, 2025],
    values: [9.41, 9.78, 10.14, 9.54, 9.36, 9.03, 8.47],
    highlight: { year: 2025, note: 'Terendah dalam satu dekade: 8,47%' },
  },
  population: {
    title: 'Jumlah penduduk',
    subtitle: 'Juta jiwa, pertengahan tahun',
    unit: 'jt',
    source: 'BPS, proyeksi penduduk',
    years: [2020, 2021, 2022, 2023, 2024],
    values: [270.2, 273.7, 276.4, 279.4, 283.5],
    highlight: null,
  },
  exports: {
    title: 'Ekspor',
    subtitle: 'US$ miliar',
    unit: 'US$ M',
    source: 'BPS',
    years: [2019, 2020, 2021, 2022, 2023, 2024],
    values: [167.7, 163.2, 231.6, 291.9, 258.8, 264.7],
    highlight: null,
  },
  imports: {
    title: 'Impor',
    subtitle: 'US$ miliar',
    unit: 'US$ M',
    source: 'BPS',
    years: [2019, 2020, 2021, 2022, 2023, 2024],
    values: [171.3, 141.6, 196.2, 237.4, 221.9, 233.7],
    highlight: null,
  },
};

// GDP by sector, 2024 shares of GDP (%). Source: BPS.
export const SECTORS = [
  { name: 'Industri pengolahan', share: 18.9 },
  { name: 'Perdagangan', share: 12.9 },
  { name: 'Pertanian & perikanan', share: 12.9 },
  { name: 'Konstruksi', share: 9.9 },
  { name: 'Pertambangan & penggalian', share: 8.5 },
  { name: 'Transportasi & pergudangan', share: 6.0 },
  { name: 'Informasi & komunikasi', share: 4.4 },
  { name: 'Jasa keuangan & asuransi', share: 4.1 },
  { name: 'Lainnya', share: 22.4 },
];

// Age structure, 2024 (rounded shares, BPS). Sums to 100.
export const AGE_GROUPS = [
  { group: '0–14 tahun', share: 24.5 },
  { group: '15–64 tahun', share: 68.0 },
  { group: '65 tahun ke atas', share: 7.5 },
];

// Labour: share of employed persons by sector, Feb 2025 (BPS, Sakernas).
export const LABOUR_SECTORS = [
  { name: 'Pertanian', share: 28.6 },
  { name: 'Perdagangan', share: 19.4 },
  { name: 'Industri pengolahan', share: 13.7 },
  { name: 'Jasa kemasyarakatan', share: 17.3 },
  { name: 'Konstruksi', share: 6.1 },
  { name: 'Lainnya', share: 14.9 },
];

// Provinces: 2024 mid-year population estimate (million), BPS. Top 10.
export const PROVINCES_TOP = [
  { name: 'Jawa Barat', pop: 49.9, capital: 'Bandung' },
  { name: 'Jawa Timur', pop: 41.8, capital: 'Surabaya' },
  { name: 'Jawa Tengah', pop: 38.3, capital: 'Semarang' },
  { name: 'Sumatera Utara', pop: 15.6, capital: 'Medan' },
  { name: 'Banten', pop: 12.4, capital: 'Serang' },
  { name: 'DKI Jakarta', pop: 10.6, capital: 'Jakarta' },
  { name: 'Sulawesi Selatan', pop: 9.5, capital: 'Makassar' },
  { name: 'Lampung', pop: 9.3, capital: 'Bandar Lampung' },
  { name: 'Sumatera Selatan', pop: 8.8, capital: 'Palembang' },
  { name: 'Riau', pop: 6.7, capital: 'Pekanbaru' },
];

// Neraca perdagangan (ekspor − impor, US$ miliar), dihitung dari kedua seri
// di atas — bukan angka baru, hanya selisih yang ditampilkan di halaman.
export const TRADE_BALANCE = SERIES.exports.years.map((year, i) => ({
  year,
  balance: +(SERIES.exports.values[i] - SERIES.imports.values[i]).toFixed(1),
}));

// Latest releases, as published.
export const RELEASES = [
  { date: '03 Nov 2025', title: 'Inflasi Oktober 2025 sebesar 2,86% (y-on-y)', source: 'BPS' },
  { date: '05 Nov 2025', title: 'Ekonomi triwulan III-2025 tumbuh 5,04% (y-on-y)', source: 'BPS' },
  { date: '05 Nov 2025', title: 'Tingkat pengangguran terbuka Februari 2025 sebesar 4,76%', source: 'BPS' },
  { date: '15 Jul 2025', title: 'Profil kemiskinan Maret 2025: 8,47% penduduk miskin', source: 'BPS' },
  { date: '01 Agu 2025', title: 'Ekspor Juni 2025 mencapai US$23,73 miliar', source: 'BPS' },
  { date: '28 Feb 2025', title: 'IPM 2024 mencapai 75,02, naik 0,63 poin', source: 'BPS' },
];

export const SOURCES = [
  { name: 'Badan Pusat Statistik (BPS)', what: 'Penduduk, PDB, inflasi, pengangguran, kemiskinan, IPM, perdagangan', url: 'bps.go.id' },
  { name: 'Bank Dunia (World Bank)', what: 'Perbandingan internasional, PDB per kapita ±US$4.925 (2024)', url: 'worldbank.org' },
  { name: 'APJII', what: 'Penetrasi pengguna internet 2024: 79,5%', url: 'apjii.or.id' },
];

export const RELEASE_CALENDAR = [
  { date: '01 Des 2025', item: 'Inflasi November 2025' },
  { date: '15 Des 2025', item: 'Ekspor–impor November 2025' },
  { date: '05 Feb 2026', item: 'Pertumbuhan ekonomi 2025 (tahunan)' },
  { date: '16 Feb 2026', item: 'Tingkat pengangguran terbuka Agustus 2025' },
  { date: '15 Jul 2026', item: 'Profil kemiskinan Maret 2026' },
];
