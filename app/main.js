// NusaStat router and controls. Hash routes only, no network: every page is
// rendered from data.js, every chart is drawn on canvas by charts.js.
import { barChart, lineChart, hbarChart } from './charts.js';
import {
  SERIES, SECTORS, AGE_GROUPS, LABOUR_SECTORS,
  PROVINCES_TOP, PROVINCE_DETAIL, HEADLINE,
} from './data.js';
import { VIEWS, NAV } from './views.js';

const app = document.getElementById('app');
const searchInput = document.getElementById('search');
const searchResults = document.getElementById('search-results');

// --- charts ---------------------------------------------------------------

const chartState = { 'home-growth': 'bar', 'eco-growth': 'bar', 'price-inflation': 'bar', 'lab-unemp': 'bar' };

function draw(id, series, type) {
  const el = document.getElementById(id);
  if (!el) return;
  if (type === 'line') lineChart(el, series);
  else barChart(el, series);
}

function drawCharts(route) {
  if (route === '/') {
    const range = document.getElementById('home-range');
    const s = sliceSeries(SERIES.gdpGrowth, range && range.value === 'recent' ? 2019 : 2015);
    draw('home-growth', s, chartState['home-growth']);
  }
  if (route === '/population') {
    draw('pop-series', SERIES.population, 'line');
    const age = document.getElementById('pop-age');
    if (age) hbarChart(age, { labels: AGE_GROUPS.map((a) => a.group), values: AGE_GROUPS.map((a) => a.share), unit: '%' });
    draw('pop-poverty', SERIES.poverty, 'bar');
  }
  if (route === '/economy') {
    draw('eco-growth', SERIES.gdpGrowth, chartState['eco-growth']);
    draw('eco-nominal', SERIES.gdpNominal, 'bar');
    const sec = document.getElementById('eco-sectors');
    if (sec) hbarChart(sec, { labels: SECTORS.map((s) => s.name), values: SECTORS.map((s) => s.share), unit: '%' });
  }
  if (route === '/prices') draw('price-inflation', SERIES.inflation, chartState['price-inflation']);
  if (route === '/labour') {
    draw('lab-unemp', SERIES.unemployment, chartState['lab-unemp']);
    const sec = document.getElementById('lab-sectors');
    if (sec) hbarChart(sec, { labels: LABOUR_SECTORS.map((s) => s.name), values: LABOUR_SECTORS.map((s) => s.share), unit: '%' });
  }
}

function sliceSeries(series, fromYear) {
  const idx = series.years.map((y, i) => (y >= fromYear ? i : -1)).filter((i) => i >= 0);
  return {
    ...series,
    years: idx.map((i) => series.years[i]),
    values: idx.map((i) => series.values[i]),
  };
}

// --- controls ---------------------------------------------------------------

function wireControls(route) {
  // Chart type toggles.
  document.querySelectorAll('.toggle[data-chart]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const group = document.querySelectorAll(`.toggle[data-chart="${btn.dataset.chart}"]`);
      group.forEach((b) => b.classList.toggle('active', b === btn));
      chartState[btn.dataset.chart] = btn.dataset.type;
      const series = btn.dataset.chart === 'home-growth'
        ? sliceSeries(SERIES.gdpGrowth, (document.getElementById('home-range') || {}).value === 'recent' ? 2019 : 2015)
        : btn.dataset.chart === 'eco-growth' ? SERIES.gdpGrowth
        : btn.dataset.chart === 'price-inflation' ? SERIES.inflation
        : SERIES.unemployment;
      draw(btn.dataset.chart, series, btn.dataset.type);
    });
  });
  // Home year-range select.
  const range = document.getElementById('home-range');
  if (range) range.addEventListener('change', () => drawCharts('/'));
  // Sortable tables.
  document.querySelectorAll('table.sortable').forEach((table) => {
    table.querySelectorAll('th[data-sort]').forEach((th) => {
      th.tabIndex = 0;
      th.setAttribute('role', 'button');
      const sort = () => {
        const col = Number(th.dataset.sort);
        const tbody = table.querySelector('tbody');
        const rows = [...tbody.querySelectorAll('tr')];
        const asc = th.dataset.dir !== 'asc';
        table.querySelectorAll('th').forEach((h) => delete h.dataset.dir);
        th.dataset.dir = asc ? 'asc' : 'desc';
        rows.sort((a, b) => {
          const av = a.cells[col].textContent.trim();
          const bv = b.cells[col].textContent.trim();
          const an = parseFloat(av.replace(/[^\d,.-]/g, '').replace(',', '.'));
          const bn = parseFloat(bv.replace(/[^\d,.-]/g, '').replace(',', '.'));
          const cmp = Number.isNaN(an) || Number.isNaN(bn) ? av.localeCompare(bv, 'id') : an - bn;
          return asc ? cmp : -cmp;
        });
        rows.forEach((r) => tbody.appendChild(r));
      };
      th.addEventListener('click', sort);
      th.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); sort(); } });
    });
  });
  // Province explorer.
  const select = document.getElementById('prov-select');
  const detail = document.getElementById('prov-detail');
  if (select && detail) {
    const show = () => {
      const name = select.value;
      const d = PROVINCE_DETAIL[name];
      const p = PROVINCES_TOP.find((x) => x.name === name);
      detail.innerHTML = `
        <h2>${name}</h2>
        <dl class="stat-list">
          <div><dt>Penduduk 2024</dt><dd>${p.pop.toLocaleString('id-ID')} juta jiwa</dd></div>
          <div><dt>Kepadatan</dt><dd>${d.density.toLocaleString('id-ID')} jiwa/km²</dd></div>
          <div><dt>Pangsa PDB nasional</dt><dd>${d.gdpShare.toLocaleString('id-ID')}%</dd></div>
          <div><dt>Ibu kota</dt><dd>${p.capital}</dd></div>
        </dl>
        <p>${d.note}</p>`;
    };
    select.addEventListener('change', show);
    show();
  }
}

// --- search -----------------------------------------------------------------

const SEARCH_INDEX = [
  ...HEADLINE.map((k) => ({ label: `${k.label}: ${k.value} (${k.year})`, route: k.route })),
  ...Object.values(SERIES).map((s) => ({
    label: s.title,
    route: s === SERIES.gdpGrowth || s === SERIES.gdpNominal ? '#/economy'
      : s === SERIES.inflation ? '#/prices'
      : s === SERIES.unemployment ? '#/labour'
      : '#/population',
  })),
  { label: 'Struktur umur penduduk', route: '#/population' },
  { label: 'PDB menurut lapangan usaha', route: '#/economy' },
  { label: 'Jadwal rilis data BPS', route: '#/data' },
  { label: 'Unduh data provinsi (CSV)', route: '#/data' },
];

function runSearch() {
  const q = searchInput.value.trim().toLowerCase();
  if (q.length < 2) { searchResults.innerHTML = ''; searchResults.hidden = true; return; }
  const hits = SEARCH_INDEX.filter((i) => i.label.toLowerCase().includes(q)).slice(0, 6);
  if (!hits.length) {
    searchResults.innerHTML = '<li class="no-result">Tidak ada indikator yang cocok.</li>';
  } else {
    searchResults.innerHTML = hits.map((h) => `<li><a href="${h.route}">${h.label}</a></li>`).join('');
  }
  searchResults.hidden = false;
}
searchInput.addEventListener('input', runSearch);
searchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const first = searchResults.querySelector('a');
    if (first) { location.hash = first.getAttribute('href'); searchResults.hidden = true; }
  }
  if (e.key === 'Escape') { searchResults.hidden = true; searchInput.blur(); }
});
document.addEventListener('click', (e) => {
  if (!e.target.closest('.search')) searchResults.hidden = true;
});

// --- router -----------------------------------------------------------------

function render() {
  const route = (location.hash || '#/').slice(1) || '/';
  const view = VIEWS[route] || VIEWS['/'];
  app.innerHTML = view();
  document.querySelectorAll('nav a').forEach((a) => {
    a.classList.toggle('current', a.getAttribute('href') === '#' + route);
  });
  drawCharts(route);
  wireControls(route);
  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', render);
window.addEventListener('resize', () => {
  const route = (location.hash || '#/').slice(1) || '/';
  drawCharts(route);
});
render();
