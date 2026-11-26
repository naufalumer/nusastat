// Canvas charts for NusaStat. No libraries: every chart is drawn by hand on a
// <canvas> so the first load stays tiny and the site works fully offline.
// All functions take a canvas element and a series, and draw axes, gridlines,
// value labels and a title-free plot area (titles live in the page HTML).

const TEAL = '#0e7c7b';
const AMBER = '#e8a33d';
const INK = '#12303f';
const MUTED = '#5d707c';
const GRID = '#dfe6e8';

function setup(canvas, height) {
  const dpr = window.devicePixelRatio || 1;
  const width = canvas.clientWidth || canvas.parentElement.clientWidth || 640;
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  canvas.style.height = height + 'px';
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  ctx.font = '12px system-ui, -apple-system, "Segoe UI", sans-serif';
  return { ctx, width, height };
}

function niceMax(max) {
  const pow = Math.pow(10, Math.floor(Math.log10(max)));
  const n = max / pow;
  const step = n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10;
  return step * pow;
}

function niceStep(x) {
  const pow = Math.pow(10, Math.floor(Math.log10(x)));
  const n = x / pow;
  const step = n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10;
  return step * pow;
}

// Tick values from lo to hi on a clean grid.
function ticksFor(lo, hi, unit) {
  const step = niceStep((hi - lo) / 4);
  const ticks = [];
  for (let v = Math.ceil(lo / step) * step; v <= hi + 1e-9; v += step) {
    ticks.push({ value: v - lo, max: hi - lo, label: fmt(Math.round(v * 100) / 100, unit) });
  }
  return ticks;
}

function drawAxes(ctx, x0, y0, x1, y1, yTicks, yLabel) {
  ctx.strokeStyle = GRID;
  ctx.fillStyle = MUTED;
  ctx.lineWidth = 1;
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  for (const t of yTicks) {
    const y = y0 - (t.value / t.max) * (y0 - y1);
    ctx.beginPath();
    ctx.moveTo(x0, y);
    ctx.lineTo(x1, y);
    ctx.stroke();
    ctx.fillText(t.label, x0 - 8, y);
  }
  ctx.strokeStyle = '#b9c6cb';
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y0);
  ctx.stroke();
  if (yLabel) {
    ctx.textAlign = 'left';
    ctx.fillStyle = MUTED;
    ctx.fillText(yLabel, x0, y1 - 14);
  }
}

// Vertical bar chart. values may be negative (zero line drawn).
export function barChart(canvas, { years, values, unit, color = TEAL, height = 260 }) {
  const { ctx, width, height: h } = setup(canvas, height);
  const padL = 52, padR = 12, padT = 18, padB = 30;
  const x0 = padL, x1 = width - padR, y0 = h - padB, y1 = padT;
  const max = niceMax(Math.max(...values.map(Math.abs), 1));
  const min = Math.min(0, ...values);
  const lo = min < 0 ? -niceMax(Math.abs(min)) : 0;
  const hi = max;
  const span = hi - lo;
  const zeroY = y0 - ((0 - lo) / span) * (y0 - y1);
  const ticks = ticksFor(lo, hi, unit);
  drawAxes(ctx, x0, y0, x1, y1, ticks, unit);
  const slot = (x1 - x0) / values.length;
  const barW = Math.min(46, slot * 0.62);
  ctx.textAlign = 'center';
  values.forEach((v, i) => {
    const cx = x0 + slot * (i + 0.5);
    const y = y0 - ((v - lo) / span) * (y0 - y1);
    ctx.fillStyle = v < 0 ? '#c0392b' : color;
    const top = Math.min(y, zeroY);
    const bh = Math.abs(zeroY - y);
    ctx.fillRect(cx - barW / 2, top, barW, Math.max(bh, 1.5));
    ctx.fillStyle = INK;
    ctx.textBaseline = 'bottom';
    ctx.fillText(fmt(v, unit), cx, top - 4);
    ctx.fillStyle = MUTED;
    ctx.textBaseline = 'top';
    ctx.fillText(String(years[i]), cx, y0 + 6);
  });
  // zero line
  ctx.strokeStyle = '#8fa3ab';
  ctx.beginPath();
  ctx.moveTo(x0, zeroY);
  ctx.lineTo(x1, zeroY);
  ctx.stroke();
}

// Line chart with dots and value labels on every point.
export function lineChart(canvas, { years, values, unit, color = TEAL, height = 260 }) {
  const { ctx, width, height: h } = setup(canvas, height);
  const padL = 52, padR = 16, padT = 22, padB = 30;
  const x0 = padL, x1 = width - padR, y0 = h - padB, y1 = padT;
  const lo = Math.min(0, ...values);
  const hi = niceMax(Math.max(...values, 1));
  const span = hi - lo || 1;
  const ticks = ticksFor(lo, hi, unit);
  drawAxes(ctx, x0, y0, x1, y1, ticks, unit);
  const px = (i) => x0 + (i / (values.length - 1)) * (x1 - x0);
  const py = (v) => y0 - ((v - lo) / span) * (y0 - y1);
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  values.forEach((v, i) => (i === 0 ? ctx.moveTo(px(i), py(v)) : ctx.lineTo(px(i), py(v))));
  ctx.stroke();
  ctx.textAlign = 'center';
  values.forEach((v, i) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(px(i), py(v), 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = INK;
    ctx.textBaseline = 'bottom';
    ctx.fillText(fmt(v, unit), px(i), py(v) - 8);
    ctx.fillStyle = MUTED;
    ctx.textBaseline = 'top';
    ctx.fillText(String(years[i]), px(i), y0 + 6);
  });
}

// Horizontal bar chart for ranked lists (sectors, provinces).
export function hbarChart(canvas, { labels, values, unit, color = TEAL, height = 300 }) {
  const { ctx, width, height: h } = setup(canvas, height);
  const padL = 190, padR = 56, padT = 8, padB = 8;
  const x0 = padL, x1 = width - padR;
  const max = niceMax(Math.max(...values, 1));
  const slot = (h - padT - padB) / values.length;
  const barH = Math.min(22, slot * 0.6);
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  values.forEach((v, i) => {
    const y = padT + slot * (i + 0.5);
    ctx.fillStyle = INK;
    ctx.fillText(labels[i], x0 - 10, y);
    const w = (v / max) * (x1 - x0);
    ctx.fillStyle = i === 0 ? AMBER : color;
    ctx.fillRect(x0, y - barH / 2, Math.max(w, 2), barH);
    ctx.fillStyle = INK;
    ctx.textAlign = 'left';
    ctx.fillText(fmt(v, unit), x0 + w + 8, y);
    ctx.textAlign = 'right';
  });
}

function fmt(v, unit) {
  const n = Math.abs(v) >= 100 ? Math.round(v).toLocaleString('id-ID') : v.toFixed(2).replace('.', ',');
  return unit === '%' ? n + '%' : n;
}
