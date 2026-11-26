// Page views for NusaStat. Each view returns HTML; main.js inserts it and
// draws the charts. Every link is a hash route, every control works:
// sortable tables, chart-type toggles, year-range select, province explorer
// and the indicator search in the header.
import {
  META, HEADLINE, SERIES, SECTORS, AGE_GROUPS, LABOUR_SECTORS,
  PROVINCES_TOP, PROVINCE_DETAIL, RELEASES, SOURCES, RELEASE_CALENDAR,
} from './data.js';

export const NAV = [
  ['#/', 'Beranda'],
  ['#/population', 'Penduduk'],
  ['#/economy', 'Ekonomi'],
  ['#/prices', 'Harga'],
  ['#/labour', 'Ketenagakerjaan'],
  ['#/regions', 'Daerah'],
  ['#/data', 'Data & Sumber'],
];

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

function kpiCards() {
  return '<section class="kpis" aria-label="Indikator utama">' + HEADLINE.map((k) => `
    <a class="kpi" href="${k.route}">
      <span class="kpi-label">${k.label}</span>
      <span class="kpi-value">${k.value}</span>
      <span class="kpi-meta">${k.change} · ${k.source}</span>
    </a>`).join('') + '</section>';
}

function chartCard(id, title, source, controls) {
  return `<section class="card chart-card">
    <div class="card-head"><h2>${title}</h2><span class="source">Sumber: ${source}</span></div>
    ${controls || ''}
    <canvas id="${id}" role="img" aria-label="${esc(title)}"></canvas>
  </section>`;
}

function seriesTable(series) {
  const rows = series.years.map((y, i) =>
    `<tr><td>${y}</td><td>${series.values[i].toLocaleString('id-ID')}</td></tr>`).join('');
  return `<table class="data-table"><thead><tr><th>Tahun</th><th>Nilai (${series.unit})</th></tr></thead><tbody>${rows}</tbody></table>`;
}

export function homeView() {
  return `
  <section class="hero">
    <p class="eyebrow">Portal statistik nasional · Indonesia</p>
    <h1>${META.tagline}</h1>
    <p class="lede">Angka-angka resmi Indonesia — penduduk, ekonomi, harga, dan pekerjaan — dalam satu tempat,
    dengan sumber dan tahun pada setiap angka. Tanpa akun, tanpa iklan, dan bisa dibuka luring.</p>
    <p class="hero-actions"><a class="btn" href="#/economy">Lihat ekonomi</a>
    <a class="btn btn-ghost" href="#/data">Jadwal rilis data</a></p>
    <p class="updated">Terakhir diperbarui ${META.updated} · ${META.note}</p>
  </section>
  ${kpiCards()}
  <div class="grid-2">
    ${chartCard('home-growth', SERIES.gdpGrowth.title, SERIES.gdpGrowth.source,
      `<div class="controls" role="group" aria-label="Jenis grafik">
        <button class="toggle active" data-chart="home-growth" data-type="bar">Batang</button>
        <button class="toggle" data-chart="home-growth" data-type="line">Garis</button>
        <label class="range-label">Rentang
          <select id="home-range" aria-label="Rentang tahun">
            <option value="all">2015–2024</option>
            <option value="recent">2019–2024</option>
          </select>
        </label>
      </div>`)}
    <section class="card">
      <div class="card-head"><h2>Rilis terbaru</h2><span class="source">BPS</span></div>
      <ul class="releases">
        ${RELEASES.map((r) => `<li><time>${r.date}</time><span>${r.title}</span></li>`).join('')}
      </ul>
      <p><a href="#/data">Semua sumber data &rarr;</a></p>
    </section>
  </div>
  <section class="card">
    <div class="card-head"><h2>Jelajahi berdasarkan topik</h2></div>
    <div class="topics">
      <a href="#/population"><strong>Penduduk</strong><span>283,5 juta jiwa, sebaran provinsi, struktur umur</span></a>
      <a href="#/economy"><strong>Ekonomi</strong><span>PDB, sektor, ekspor–impor</span></a>
      <a href="#/prices"><strong>Harga</strong><span>Inflasi tahunan 2015–2024</span></a>
      <a href="#/labour"><strong>Ketenagakerjaan</strong><span>Pengangguran, lapangan kerja</span></a>
      <a href="#/regions"><strong>Daerah</strong><span>Bandingkan 10 provinsi terbesar</span></a>
    </div>
  </section>`;
}

export function populationView() {
  const rows = PROVINCES_TOP.map((p) =>
    `<tr><td>${p.name}</td><td>${p.pop.toLocaleString('id-ID')}</td><td>${p.capital}</td></tr>`).join('');
  return `
  <header class="page-head"><p class="eyebrow">Penduduk</p>
    <h1>Penduduk Indonesia</h1>
    <p class="lede">283,5 juta jiwa pada pertengahan 2024 (BPS). Lebih dari separuh tinggal di Pulau Jawa,
    dan dua dari tiga penduduk berada pada usia kerja.</p></header>
  <div class="grid-2">
    ${chartCard('pop-series', SERIES.population.title, SERIES.population.source)}
    ${chartCard('pop-age', 'Struktur umur penduduk, 2024 (%)', 'BPS (angka dibulatkan)')}
  </div>
  <div class="grid-2">
    <section class="card">
      <div class="card-head"><h2>10 provinsi berpenduduk terbanyak, 2024</h2><span class="source">BPS · juta jiwa</span></div>
      <p class="hint">Klik judul kolom untuk mengurutkan.</p>
      <table class="data-table sortable" id="prov-table">
        <thead><tr><th data-sort="0">Provinsi</th><th data-sort="1">Penduduk (jt)</th><th data-sort="2">Ibu kota</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <p><a href="data/provinces.csv" download>Unduh data provinsi (CSV)</a></p>
    </section>
    ${chartCard('pop-poverty', SERIES.poverty.title, SERIES.poverty.source)}
  </div>
  <section class="card"><div class="card-head"><h2>Yang perlu diketahui</h2></div>
    <ul class="facts">
      <li><strong>Kemiskinan turun ke 8,47%</strong> pada Maret 2025 — level terendah sepanjang sejarah pencatatan BPS.</li>
      <li><strong>IPM 75,02 (2024)</strong> — kategori tinggi; harapan hidup 74,0 tahun.</li>
      <li><strong>Rasio gini 0,375</strong> (Maret 2025) — ketimpangan pengeluaran sedikit membaik dari 0,379 setahun sebelumnya.</li>
    </ul></section>`;
}

export function economyView() {
  const tradeRows = SERIES.exports.years.map((y, i) => {
    const bal = (SERIES.exports.values[i] - SERIES.imports.values[i]).toFixed(1);
    return `<tr><td>${y}</td><td>${SERIES.exports.values[i]}</td><td>${SERIES.imports.values[i]}</td><td>${bal}</td></tr>`;
  }).join('');
  return `
  <header class="page-head"><p class="eyebrow">Ekonomi</p>
    <h1>Ekonomi Indonesia</h1>
    <p class="lede">PDB Rp22.139 triliun pada 2024, tumbuh 5,03%. Industri pengolahan adalah sektor terbesar,
    dan neraca perdagangan mencatat surplus US$31,0 miliar.</p></header>
  <div class="grid-2">
    ${chartCard('eco-growth', SERIES.gdpGrowth.title, SERIES.gdpGrowth.source,
      `<div class="controls"><button class="toggle active" data-chart="eco-growth" data-type="bar">Batang</button>
      <button class="toggle" data-chart="eco-growth" data-type="line">Garis</button></div>`)}
    ${chartCard('eco-nominal', SERIES.gdpNominal.title, SERIES.gdpNominal.source)}
  </div>
  <div class="grid-2">
    ${chartCard('eco-sectors', 'PDB menurut lapangan usaha, 2024 (% terhadap PDB)', 'BPS')}
    <section class="card">
      <div class="card-head"><h2>Perdagangan luar negeri</h2><span class="source">BPS · US$ miliar</span></div>
      <table class="data-table"><thead><tr><th>Tahun</th><th>Ekspor</th><th>Impor</th><th>Surplus</th></tr></thead>
      <tbody>${tradeRows}</tbody></table>
      <p class="hint">Surplus 2024: ekspor US$264,7 miliar dikurangi impor US$233,7 miliar.</p>
    </section>
  </div>
  <section class="card"><div class="card-head"><h2>Dalam angka</h2></div>
    <dl class="stat-list">
      <div><dt>PDB per kapita 2024</dt><dd>Rp78,6 juta (± US$4.925)</dd></div>
      <div><dt>Pertumbuhan 2024</dt><dd>5,03% — ditopang konsumsi rumah tangga dan investasi</dd></div>
      <div><dt>Pengguna internet 2024</dt><dd>79,5% penduduk (APJII)</dd></div>
      <div><dt>Melek huruf 2023</dt><dd>96,9% penduduk usia 15 tahun ke atas (BPS)</dd></div>
    </dl></section>`;
}

export function pricesView() {
  return `
  <header class="page-head"><p class="eyebrow">Harga</p>
    <h1>Harga dan inflasi</h1>
    <p class="lede">Inflasi tahunan 1,57% pada Desember 2024 — terendah dalam satu dekade — sebelum naik ke
    2,86% pada Oktober 2025. Target inflasi Bank Indonesia: 2,5% ± 1%.</p></header>
  <div class="grid-2">
    ${chartCard('price-inflation', SERIES.inflation.title, SERIES.inflation.source,
      `<div class="controls"><button class="toggle active" data-chart="price-inflation" data-type="bar">Batang</button>
      <button class="toggle" data-chart="price-inflation" data-type="line">Garis</button></div>`)}
    <section class="card">
      <div class="card-head"><h2>Inflasi per tahun</h2><span class="source">BPS · % y-on-y</span></div>
      ${seriesTable(SERIES.inflation)}
    </section>
  </div>
  <section class="card"><div class="card-head"><h2>Membaca angka ini</h2></div>
    <ul class="facts">
      <li><strong>2022: 5,51%</strong> — lonjakan harga energi dan pangan global mendorong inflasi tertinggi sejak 2014.</li>
      <li><strong>2024: 1,57%</strong> — harga pangan yang terkendali dan administered price yang stabil menahan inflasi.</li>
      <li><strong>Oktober 2025: 2,86%</strong> — masih dalam rentang sasaran Bank Indonesia.</li>
    </ul></section>`;
}

export function labourView() {
  return `
  <header class="page-head"><p class="eyebrow">Ketenagakerjaan</p>
    <h1>Pekerjaan dan pengangguran</h1>
    <p class="lede">Pengangguran terbuka 4,76% pada Februari 2025, terendah sejak sebelum pandemi.
    Pertanian masih menyerap pekerja terbanyak, diikuti perdagangan dan industri.</p></header>
  <div class="grid-2">
    ${chartCard('lab-unemp', SERIES.unemployment.title, SERIES.unemployment.source,
      `<div class="controls"><button class="toggle active" data-chart="lab-unemp" data-type="bar">Batang</button>
      <button class="toggle" data-chart="lab-unemp" data-type="line">Garis</button></div>`)}
    ${chartCard('lab-sectors', 'Pekerja menurut lapangan usaha, Feb 2025 (%)', 'BPS, Sakernas')}
  </div>
  <section class="card"><div class="card-head"><h2>Dalam angka</h2></div>
    <dl class="stat-list">
      <div><dt>Angkatan kerja Feb 2025</dt><dd>153,05 juta orang; tingkat partisipasi 70,06%</dd></div>
      <div><dt>Pekerja informal</dt><dd>Sekitar 59% dari seluruh pekerja (BPS, 2024)</dd></div>
      <div><dt>Pekerja penuh waktu</dt><dd>66,5% pekerja bekerja 35 jam atau lebih per minggu</dd></div>
    </dl></section>`;
}

export function regionsView() {
  const options = PROVINCES_TOP.map((p) => `<option value="${esc(p.name)}">${esc(p.name)}</option>`).join('');
  const rows = PROVINCES_TOP.map((p) => {
    const d = PROVINCE_DETAIL[p.name];
    return `<tr><td>${p.name}</td><td>${p.pop.toLocaleString('id-ID')}</td><td>${d.density.toLocaleString('id-ID')}</td><td>${d.gdpShare.toLocaleString('id-ID')}</td></tr>`;
  }).join('');
  return `
  <header class="page-head"><p class="eyebrow">Daerah</p>
    <h1>Jelajahi provinsi</h1>
    <p class="lede">Pilih provinsi untuk melihat penduduk, kepadatan, dan pangsanya terhadap PDB nasional.
    Semua angka 2024, sumber BPS.</p></header>
  <section class="card">
    <label class="field-label" for="prov-select">Provinsi</label>
    <select id="prov-select" class="big-select">${options}</select>
    <div id="prov-detail" class="prov-detail" aria-live="polite"></div>
  </section>
  <section class="card">
    <div class="card-head"><h2>10 provinsi terbesar, 2024</h2><span class="source">BPS</span></div>
    <p class="hint">Klik judul kolom untuk mengurutkan.</p>
    <table class="data-table sortable" id="regions-table">
      <thead><tr><th data-sort="0">Provinsi</th><th data-sort="1">Penduduk (jt)</th><th data-sort="2">Kepadatan (/km²)</th><th data-sort="3">Pangsa PDB (%)</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <p><a href="data/provinces.csv" download>Unduh data provinsi (CSV)</a></p>
  </section>`;
}

export function dataView() {
  return `
  <header class="page-head"><p class="eyebrow">Data &amp; sumber</p>
    <h1>Data &amp; sumber</h1>
    <p class="lede">Setiap angka di situs ini berasal dari publikasi resmi. NusaStat adalah proyek
    independen dan bukan situs resmi BPS atau pemerintah — angka dikutip apa adanya dari sumbernya.</p></header>
  <div class="grid-2">
    <section class="card">
      <div class="card-head"><h2>Sumber data</h2></div>
      <table class="data-table"><thead><tr><th>Sumber</th><th>Yang dikutip</th></tr></thead>
      <tbody>${SOURCES.map((s) => `<tr><td><strong>${s.name}</strong><br><span class="muted">${s.url}</span></td><td>${s.what}</td></tr>`).join('')}</tbody></table>
    </section>
    <section class="card">
      <div class="card-head"><h2>Jadwal rilis berikutnya</h2><span class="source">BPS</span></div>
      <ul class="releases">${RELEASE_CALENDAR.map((r) => `<li><time>${r.date}</time><span>${r.item}</span></li>`).join('')}</ul>
    </section>
  </div>
  <section class="card"><div class="card-head"><h2>Unduh data</h2></div>
    <p>Seluruh data provinsi yang dipakai situs ini tersedia sebagai CSV — buka langsung di spreadsheet,
    tanpa perlu akun.</p>
    <p><a class="btn" href="data/provinces.csv" download>Unduh provinces.csv</a></p>
    <h3>Metode &amp; catatan</h3>
    <ul class="facts">
      <li>Angka penduduk adalah estimasi pertengahan tahun BPS; angka 2020 adalah hasil Sensus Penduduk.</li>
      <li>Inflasi adalah perubahan IHK year-on-year pada bulan Desember, kecuali dinyatakan lain.</li>
      <li>Pengangguran terbuka mengikuti definisi Sakernas BPS (Agustus, kecuali Februari 2025).</li>
      <li>Angka dibulatkan ke satu desimal; pembulatan dapat membuat total tidak tepat 100%.</li>
    </ul></section>`;
}

export const VIEWS = {
  '/': homeView,
  '/population': populationView,
  '/economy': economyView,
  '/prices': pricesView,
  '/labour': labourView,
  '/regions': regionsView,
  '/data': dataView,
};
