// NusaStat v2.1 — single-page infographic wiring. No router, no network: every
// chart is drawn from data.js on canvas by charts.js, and every control below
// really works (GDP toggle, province sort). Redraws on resize.
import { drawLineChart, drawBarChart, drawGroupedBars, drawDonut, drawHBars, PALETTE } from './charts.js';
import {
  META, HERO_KPI, SERIES, SECTORS, AGE_GROUPS, LABOUR_SECTORS,
  PROVINCES_TOP, RELEASES, SOURCES, RELEASE_CALENDAR, TRADE_BALANCE,
} from './data.js';

const $ = (id) => document.getElementById(id);

// --- hero KPI cards ---------------------------------------------------------

function renderHeroKpis() {
  $('hero-kpis').innerHTML = HERO_KPI.map((k) => `
    <div class="kpi">
      <span class="kpi-label">${k.label}</span>
      <span class="kpi-value">${k.value} <span class="unit">${k.unit}</span></span>
      <span class="kpi-meta">${k.change}</span>
      <span class="kpi-source">Source: ${k.source}, ${k.year}</span>
    </div>`).join('');
}

// --- legends for donut charts -----------------------------------------------

function renderLegend(listId, slices, key) {
  $(listId).innerHTML = slices.map((slice, i) => `
    <li><span class="swatch" style="background:${PALETTE[i % PALETTE.length]}"></span>
    ${slice[key]}<span class="pct">${slice.share}%</span></li>`).join('');
}

// --- lists ------------------------------------------------------------------

function renderLists() {
  $('releases').innerHTML = RELEASES.map((r) => `
    <li><time>${r.date}</time><span>${r.title} <span class="source">· ${r.source}</span></span></li>`).join('');
  $('calendar').innerHTML = RELEASE_CALENDAR.map((r) => `
    <li><time>${r.date}</time><span>${r.item}</span></li>`).join('');
  $('sources').innerHTML = SOURCES.map((s) => `
    <li><strong>${s.name}</strong><span>${s.what}</span><br><code>${s.url}</code></li>`).join('');
}

// --- charts -----------------------------------------------------------------

const gdpMode = { current: 'growth' };
const provinceSort = { current: 'pop' };

function drawGdp() {
  const series = gdpMode.current === 'growth' ? SERIES.gdpGrowth : SERIES.gdpNominal;
  $('gdp-title').textContent = series.title + ', ' + series.subtitle;
  $('gdp-note').textContent = gdpMode.current === 'growth'
    ? 'Pandemic contraction −2.07% in 2020, then recovered to 5.31% in 2022.'
    : 'Nominal GDP rose from Rp15,833 T (2019) to Rp22,139 T (2024).';
  if (gdpMode.current === 'growth') drawLineChart($('chart-gdp'), series, { height: 280 });
  else drawBarChart($('chart-gdp'), series, { height: 280, color: '#2a63a6' });
}

function drawProvinces() {
  const rows = [...PROVINCES_TOP];
  if (provinceSort.current === 'name') rows.sort((a, b) => a.name.localeCompare(b.name, 'en'));
  drawHBars($('chart-provinces'), rows.map((p, i) => ({
    label: p.name,
    value: p.pop,
    display: p.pop.toLocaleString('en-US') + ' M',
    color: i === 0 && provinceSort.current === 'pop' ? '#d9930d' : '#176b45',
  })), { rowHeight: 34, labelWidth: 140 });
}

function drawAll() {
  drawGdp();
  drawDonut($('chart-sectors'), SECTORS, { height: 250, centreTop: '100%', centreBottom: 'GDP 2024' });
  drawGroupedBars($('chart-trade'), SERIES.exports, SERIES.imports, { height: 250 });
  const latestTrade = TRADE_BALANCE[TRADE_BALANCE.length - 1];
  $('trade-balance').textContent = `Trade surplus ${latestTrade.year}: US$${latestTrade.balance.toLocaleString('en-US')} billion.`;
  drawLineChart($('chart-population'), SERIES.population, { height: 250 });
  drawBarChart($('chart-poverty'), SERIES.poverty, { height: 250, color: '#176b45' });
  drawProvinces();
  drawDonut($('chart-age'), AGE_GROUPS.map((a) => ({ name: a.group, share: a.share })), { height: 230, centreTop: '283.5 M', centreBottom: 'population 2024' });
  drawBarChart($('chart-inflation'), SERIES.inflation, { height: 280, color: '#c2502b', highlightYear: 2022 });
  drawLineChart($('chart-unemployment'), SERIES.unemployment, { height: 250 });
  drawDonut($('chart-labour'), LABOUR_SECTORS, { height: 250, centreTop: '100%', centreBottom: 'workers Feb 2025' });
}

// --- controls ---------------------------------------------------------------

function wireControls() {
  document.querySelectorAll('[data-gdp]').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-gdp]').forEach((b) => {
        const on = b === btn;
        b.classList.toggle('active', on);
        b.setAttribute('aria-pressed', String(on));
      });
      gdpMode.current = btn.dataset.gdp;
      drawGdp();
    });
  });
  document.querySelectorAll('[data-sort]').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-sort]').forEach((b) => {
        const on = b === btn;
        b.classList.toggle('active', on);
        b.setAttribute('aria-pressed', String(on));
      });
      provinceSort.current = btn.dataset.sort;
      drawProvinces();
    });
  });
}

// --- boot -------------------------------------------------------------------

document.title = `${META.siteName} — ${META.tagline}`;
renderHeroKpis();
// Shorten age-group labels in the legend so they fit beside the donut.
renderLegend('sectors-legend', SECTORS, 'name');
renderLegend('age-legend', AGE_GROUPS.map((a) => ({ name: a.group.replace(' years and over', ' yrs+').replace(' years', ' yrs'), share: a.share })), 'name');
renderLegend('labour-legend', LABOUR_SECTORS, 'name');
renderLists();
wireControls();
drawAll();

let resizeTimer = null;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(drawAll, 150);
});
