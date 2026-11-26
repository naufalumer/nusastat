// NusaStat v2 — canvas chart helpers. Every chart is hand-drawn on a <canvas>:
// no chart library, no network, no fonts fetched. All helpers size the canvas
// for the device pixel ratio so lines stay crisp on desktop and on phones.

const INK = '#1b2a22';
const MUTED = '#6b7268';
const GRID = '#ddd5c2';
const GREEN = '#176b45';
const TERRA = '#c2502b';
const AMBER = '#d9930d';
const BLUE = '#2a63a6';
const PLUM = '#6b4e8e';
const TEAL = '#1f8a70';

export const PALETTE = [GREEN, BLUE, AMBER, TERRA, PLUM, TEAL, '#8a6d1d', '#4a7a96', '#9c4a6b', '#5c7a3a'];

// Prepare a canvas for crisp drawing: match its bitmap to its CSS size times
// the device pixel ratio, then scale the context back to CSS pixels.
export function setupCanvas(canvas, cssHeight) {
  const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  // Fall back to a desktop width when the canvas has no layout yet (e.g. the
  // page is still hidden); the resize listener redraws once it is visible.
  const width = canvas.clientWidth || canvas.parentElement.clientWidth || 640;
  const height = cssHeight;
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  canvas.style.height = height + 'px';
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);
  return { ctx, width, height };
}

function niceRange(values) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const span = max - min;
  const pad = span === 0 ? Math.abs(max) * 0.1 + 1 : span * 0.12;
  return { lo: min - pad, hi: max + pad };
}

function formatValue(value, unit) {
  // English number formatting: decimal point and thousands separators
  // (283.5, 15,833), matching the rest of the page.
  const text = Number.isInteger(value)
    ? value.toLocaleString('en-US')
    : value.toFixed(2).replace(/0$/, '');
  return unit === '%' ? text + '%' : text;
}

function drawAxes(ctx, box, labels, lo, hi, unit) {
  const { x0, y0, x1, y1 } = box;
  ctx.strokeStyle = GRID;
  ctx.fillStyle = MUTED;
  ctx.font = '11px system-ui, sans-serif';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  const steps = 4;
  for (let i = 0; i <= steps; i++) {
    const value = lo + ((hi - lo) * i) / steps;
    const y = y1 - ((value - lo) / (hi - lo)) * (y1 - y0);
    ctx.beginPath();
    ctx.moveTo(x0, y);
    ctx.lineTo(x1, y);
    ctx.stroke();
    ctx.fillText(formatValue(value, unit), x0 - 6, y);
  }
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  labels.forEach((label, i) => {
    const x = x0 + ((i + 0.5) / labels.length) * (x1 - x0);
    ctx.fillText(String(label), x, y1 + 6);
  });
}

// Line chart with a filled area, dots on every point and value labels on the
// first, last and extreme points. A negative dip is drawn in terracotta.
export function drawLineChart(canvas, series, opts = {}) {
  const height = opts.height || 260;
  const { ctx, width } = setupCanvas(canvas, height);
  const pad = { l: 52, r: 12, t: 14, b: 26 };
  const box = { x0: pad.l, y0: pad.t, x1: width - pad.r, y1: height - pad.b };
  const { lo, hi } = niceRange(series.values);
  // Line charts zoom to the data range (bars stay anchored at zero instead):
  // a population line from 270 to 283 must show its slope, not sit flat.
  const floor = lo;
  drawAxes(ctx, box, series.years, floor, hi, series.unit);
  const point = (i) => ({
    x: box.x0 + ((i + 0.5) / series.values.length) * (box.x1 - box.x0),
    y: box.y1 - ((series.values[i] - floor) / (hi - floor)) * (box.y1 - box.y0),
  });
  // Area fill down to the bottom of the plot box (not the zero line: with a
  // zoomed axis the zero line sits far below the canvas).
  ctx.beginPath();
  ctx.moveTo(point(0).x, box.y1);
  series.values.forEach((_, i) => ctx.lineTo(point(i).x, point(i).y));
  ctx.lineTo(point(series.values.length - 1).x, box.y1);
  ctx.closePath();
  ctx.fillStyle = 'rgba(23, 107, 69, 0.10)';
  ctx.fill();
  // Line.
  ctx.lineWidth = 2.5;
  ctx.lineJoin = 'round';
  ctx.strokeStyle = GREEN;
  ctx.beginPath();
  series.values.forEach((_, i) => {
    const p = point(i);
    if (i === 0) ctx.moveTo(p.x, p.y);
    else ctx.lineTo(p.x, p.y);
  });
  ctx.stroke();
  // Dots + labels on first, last, min and max.
  const labelled = new Set([0, series.values.length - 1]);
  labelled.add(series.values.indexOf(Math.min(...series.values)));
  labelled.add(series.values.indexOf(Math.max(...series.values)));
  series.values.forEach((value, i) => {
    const p = point(i);
    ctx.beginPath();
    ctx.arc(p.x, p.y, value < 0 ? 5 : 4, 0, Math.PI * 2);
    ctx.fillStyle = value < 0 ? TERRA : GREEN;
    ctx.fill();
    ctx.strokeStyle = '#fffdf7';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    if (labelled.has(i)) {
      ctx.fillStyle = value < 0 ? TERRA : INK;
      ctx.font = 'bold 12px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillText(formatValue(value, series.unit), p.x, p.y - 8);
    }
  });
  return { ctx, width, height };
}

// Vertical bar chart with a value label on top of every bar.
export function drawBarChart(canvas, series, opts = {}) {
  const height = opts.height || 260;
  const color = opts.color || BLUE;
  const highlightYear = opts.highlightYear || null;
  const { ctx, width } = setupCanvas(canvas, height);
  const pad = { l: 52, r: 12, t: 22, b: 26 };
  const box = { x0: pad.l, y0: pad.t, x1: width - pad.r, y1: height - pad.b };
  const { lo, hi } = niceRange(series.values);
  const floor = Math.min(lo, 0);
  drawAxes(ctx, box, series.years, floor, hi, series.unit);
  const slot = (box.x1 - box.x0) / series.values.length;
  const barW = Math.min(46, slot * 0.62);
  series.values.forEach((value, i) => {
    const x = box.x0 + (i + 0.5) * slot - barW / 2;
    const y = box.y1 - ((value - floor) / (hi - floor)) * (box.y1 - box.y0);
    const isHi = highlightYear !== null && series.years[i] === highlightYear;
    ctx.fillStyle = isHi ? TERRA : color;
    ctx.fillRect(x, y, barW, box.y1 - y);
    ctx.fillStyle = isHi ? TERRA : INK;
    ctx.font = 'bold 12px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText(formatValue(value, series.unit), x + barW / 2, y - 4);
  });
  return { ctx, width, height };
}

// Grouped bars for two series sharing the same years (e.g. exports vs imports).
export function drawGroupedBars(canvas, a, b, opts = {}) {
  const height = opts.height || 260;
  const { ctx, width } = setupCanvas(canvas, height);
  const pad = { l: 52, r: 12, t: 22, b: 26 };
  const box = { x0: pad.l, y0: pad.t, x1: width - pad.r, y1: height - pad.b };
  const all = [...a.values, ...b.values];
  const { lo, hi } = niceRange(all);
  const floor = Math.min(lo, 0);
  drawAxes(ctx, box, a.years, floor, hi, a.unit);
  const slot = (box.x1 - box.x0) / a.values.length;
  const barW = Math.min(26, slot * 0.32);
  a.values.forEach((value, i) => {
    const cx = box.x0 + (i + 0.5) * slot;
    const ya = box.y1 - ((value - floor) / (hi - floor)) * (box.y1 - box.y0);
    const yb = box.y1 - ((b.values[i] - floor) / (hi - floor)) * (box.y1 - box.y0);
    ctx.fillStyle = GREEN;
    ctx.fillRect(cx - barW - 2, ya, barW, box.y1 - ya);
    ctx.fillStyle = AMBER;
    ctx.fillRect(cx + 2, yb, barW, box.y1 - yb);
    // One combined label above the taller bar: two side-by-side labels
    // collide when the values are close (167,7 next to 171,3).
    ctx.fillStyle = INK;
    ctx.font = 'bold 11px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText(formatValue(value, a.unit) + '/' + formatValue(b.values[i], b.unit), cx, Math.min(ya, yb) - 3);
  });
  // Legend.
  ctx.font = '12px system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = GREEN;
  ctx.fillRect(box.x0, 2, 12, 12);
  ctx.fillStyle = INK;
  ctx.fillText(a.title, box.x0 + 18, 8);
  const lw = ctx.measureText(a.title).width;
  ctx.fillStyle = AMBER;
  ctx.fillRect(box.x0 + 24 + lw, 2, 12, 12);
  ctx.fillStyle = INK;
  ctx.fillText(b.title, box.x0 + 42 + lw, 8);
  return { ctx, width, height };
}

// Donut chart with a centre label. Slice percentages of 8% or more are
// printed on the ring; the page renders the full legend beside it.
export function drawDonut(canvas, slices, opts = {}) {
  const height = opts.height || 240;
  const { ctx, width } = setupCanvas(canvas, height);
  // Centre the ring in its canvas: the old left-aligned centre (width * 0.28
  // with radius 96) clipped the ring off the canvas's left edge.
  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(96, width / 2 - 10, height / 2 - 14);
  const total = slices.reduce((sum, s) => sum + s.share, 0);
  let angle = -Math.PI / 2;
  slices.forEach((slice, i) => {
    const sweep = (slice.share / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius, angle, angle + sweep);
    ctx.closePath();
    ctx.fillStyle = PALETTE[i % PALETTE.length];
    ctx.fill();
    if (slice.share >= 8) {
      // Mid-ring radius: labels at 0.62r crossed the white centre hole and
      // turned half-invisible (white on white). 0.79r sits on the colour.
      const mid = angle + sweep / 2;
      const tx = cx + Math.cos(mid) * radius * 0.79;
      const ty = cy + Math.sin(mid) * radius * 0.79;
      ctx.fillStyle = '#fffdf7';
      ctx.font = 'bold 12px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(slice.share + '%', tx, ty);
    }
    angle += sweep;
  });
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 0.58, 0, Math.PI * 2);
  ctx.fillStyle = '#fffdf7';
  ctx.fill();
  ctx.fillStyle = INK;
  ctx.font = 'bold 15px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(opts.centreTop || '100%', cx, cy - 9);
  ctx.font = '11px system-ui, sans-serif';
  ctx.fillStyle = MUTED;
  ctx.fillText(opts.centreBottom || 'total', cx, cy + 10);
  return { ctx, width, height };
}

// Horizontal bars for ranked lists (e.g. provinces by population).
export function drawHBars(canvas, rows, opts = {}) {
  const rowH = opts.rowHeight || 34;
  const height = rows.length * rowH + 14;
  const { ctx, width } = setupCanvas(canvas, height);
  const max = Math.max(...rows.map((r) => r.value));
  // Narrow screens (phone): shrink the label column so the bars keep room.
  const labelW = width < 560 ? 104 : (opts.labelWidth || 132);
  const valueW = 64;
  ctx.font = '13px system-ui, sans-serif';
  rows.forEach((row, i) => {
    const y = 8 + i * rowH;
    const barX = labelW;
    const barW = (width - labelW - valueW - 8) * (row.value / max);
    ctx.fillStyle = INK;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText(row.label, labelW - 8, y + rowH / 2 - 2);
    ctx.fillStyle = row.color || GREEN;
    ctx.fillRect(barX, y + 5, Math.max(2, barW), rowH - 12);
    ctx.fillStyle = INK;
    ctx.font = 'bold 13px system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(row.display, barX + barW + 8, y + rowH / 2 - 2);
    ctx.font = '13px system-ui, sans-serif';
  });
  return { ctx, width, height };
}
