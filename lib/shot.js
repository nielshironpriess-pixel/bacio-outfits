// Decides if a photo is a clean product shot, and cuts the product free.
// Pure JS on an RGBA buffer, so the browser and the /api/audit check run the same code.

const REF = {
  black: [28, 28, 30], charcoal: [62, 63, 67], grey: [140, 140, 142], white: [242, 242, 240], cream: [228, 220, 202], beige: [192, 180, 154],
  tan: [172, 128, 86], brown: [88, 60, 44], navy: [36, 46, 74], denim_dark: [52, 66, 96], denim_mid: [86, 110, 145], denim_light: [152, 172, 196],
  olive: [98, 102, 66], green: [48, 88, 60], burgundy: [100, 36, 50], red: [190, 42, 40], mustard: [198, 150, 52], blue: [56, 98, 170]
};
export function nearestFamily([r, g, b], sub) {
  let best = null, bd = 1e9;
  for (const [k, [R, G, B]] of Object.entries(REF)) {
    if (sub !== 'jeans' && k.startsWith('denim')) continue;
    const d = 2 * (r - R) ** 2 + 4 * (g - G) ** 2 + 3 * (b - B) ** 2; if (d < bd) { bd = d; best = k; }
  }
  if (sub === 'jeans' && ['navy', 'blue', 'grey', 'charcoal'].includes(best)) { const l = (r + g + b) / 3; best = l > 140 ? 'denim_light' : l > 85 ? 'denim_mid' : 'denim_dark'; }
  return best;
}

// Allowed width/height of the cut-out product per slot type.
const ASPECT = {
  sneakers: [1.55, 4.5], loafers: [0.95, 4], boots: [0.7, 4],
  jeans: [0.25, 1.05], trousers: [0.25, 1.05],
  jacket: [0.55, 1.7], hoodie: [0.55, 1.7], coat: [0.4, 1.5], overshirt: [0.55, 1.7], knit: [0.55, 1.7],
  cap: [0.8, 2.6], beanie: [0.6, 2], scarf: [0.15, 3], bag: [0.4, 2.5], sunglasses: [1.6, 5], watch: [0.3, 1.6], socks: [0.3, 2.5]
};
const PATTERN_CHECK = new Set(['jeans', 'trousers', 'cap', 'hoodie', 'knit']);
const SKIN_TOLERANT = new Set(['tan', 'brown', 'beige', 'cream', 'burgundy', 'red', 'mustard']);

const isSkin = (r, g, b) => {
  if (!(r > 95 && g > 40 && b > 20 && r > g && r > b && r - g > 15 && Math.max(r, g, b) - Math.min(r, g, b) > 15)) return false;
  const cb = 128 - 0.168736 * r - 0.331264 * g + 0.5 * b, cr = 128 + 0.5 * r - 0.418688 * g - 0.081312 * b;
  return cr > 138 && cr < 175 && cb > 85 && cb < 125;
};

/** data: RGBA bytes (alpha is rewritten in place). Returns {ok, reason, stats, family, box}. */
export function analyze(data, w, h, sub) {
  const d = data, N = w * h;
  const dist = (i, c) => Math.abs(d[i] - c[0]) + Math.abs(d[i + 1] - c[1]) + Math.abs(d[i + 2] - c[2]);
  const border = [];
  for (let x = 0; x < w; x += 2) border.push(x * 4, ((h - 1) * w + x) * 4);
  for (let y = 0; y < h; y += 2) border.push(y * w * 4, (y * w + w - 1) * 4);
  const transparent = border.filter(i => d[i + 3] < 20).length / border.length > 0.6;
  const med = [0, 1, 2].map(c => { const v = border.map(i => d[i + c]).sort((a, b) => a - b); return v[v.length >> 1]; });
  const bgLum = (med[0] + med[1] + med[2]) / 3;
  const uniform = border.filter(i => d[i + 3] < 20 || dist(i, med) < 24).length / border.length;
  const stats = { uniform: +uniform.toFixed(2), bgLum: Math.round(bgLum) };
  if (!transparent) {
    if (uniform < 0.9) return { ok: false, reason: 'baggrund ikke ensfarvet', stats };
    if (bgLum < 165) return { ok: false, reason: 'mørk baggrund', stats };
  }
  const bg = new Uint8Array(N);
  if (transparent) { for (let p = 0; p < N; p++) bg[p] = d[p * 4 + 3] < 20 ? 1 : 0; }
  else {
    const TOL = bgLum > 215 ? 26 : 32, STEP = bgLum > 215 ? 9 : 12;
    const q = new Int32Array(N); let qh = 0, qt = 0;
    const seed = p => { if (!bg[p] && dist(p * 4, med) < TOL) { bg[p] = 1; q[qt++] = p; } };
    for (let x = 0; x < w; x++) { seed(x); seed((h - 1) * w + x); }
    for (let y = 0; y < h; y++) { seed(y * w); seed(y * w + w - 1); }
    while (qh < qt) {
      const p = q[qh++], x = p % w, i = p * 4;
      for (const n of [x > 0 ? p - 1 : -1, x < w - 1 ? p + 1 : -1, p - w, p + w]) {
        if (n < 0 || n >= N || bg[n]) continue;
        const j = n * 4;
        if (dist(j, med) < TOL && Math.abs(d[j] - d[i]) + Math.abs(d[j + 1] - d[i + 1]) + Math.abs(d[j + 2] - d[i + 2]) < STEP) { bg[n] = 1; q[qt++] = n; }
      }
    }
    for (let p = 0; p < N; p++) if (bg[p]) d[p * 4 + 3] = 0;
    for (let p = 0; p < N; p++) if (!bg[p]) {
      const x = p % w; const touch = (x > 0 && bg[p - 1]) || (x < w - 1 && bg[p + 1]) || (p >= w && bg[p - w]) || (p + w < N && bg[p + w]);
      if (touch) d[p * 4 + 3] = Math.min(d[p * 4 + 3], dist(p * 4, med) < 60 ? 110 : 200);
    }
  }
  let x0 = w, y0 = h, x1 = 0, y1 = 0, n = 0, R = 0, G = 0, B = 0, cn = 0, skin = 0, sat = 0; const hues = new Float64Array(12);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const p = y * w + x, i = p * 4; if (bg[p] || d[i + 3] < 200) continue;
    n++; if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
    const l = d[i] + d[i + 1] + d[i + 2];
    if (l < 720 && l > 20) { R += d[i]; G += d[i + 1]; B += d[i + 2]; cn++; }
    if (isSkin(d[i], d[i + 1], d[i + 2])) skin++;
    const mx = Math.max(d[i], d[i + 1], d[i + 2]), mn = Math.min(d[i], d[i + 1], d[i + 2]);
    if (mx - mn > 60 && mx > 60) { sat++; const c = mx - mn; let hh = mx === d[i] ? ((d[i + 1] - d[i + 2]) / c) % 6 : mx === d[i + 1] ? (d[i + 2] - d[i]) / c + 2 : (d[i] - d[i + 1]) / c + 4; hh = (hh * 60 + 360) % 360; hues[Math.floor(hh / 30)]++; }
  }
  const area = n / N, bw = x1 - x0 + 1, bh = y1 - y0 + 1, aspect = bw / Math.max(1, bh);
  const family = nearestFamily(cn ? [R / cn, G / cn, B / cn] : [128, 128, 128], sub);
  const skinFrac = n ? skin / n : 0;
  Object.assign(stats, { area: +area.toFixed(2), aspect: +aspect.toFixed(2), skin: +skinFrac.toFixed(3), family });
  const box = { x: x0, y: y0, w: bw, h: bh };
  if (area < 0.05) return { ok: false, reason: 'produktet er for lille', stats, family, box };
  if (area > 0.85) return { ok: false, reason: 'fylder hele billedet', stats, family, box };
  const m = Math.max(2, Math.round(Math.min(w, h) * 0.008));
  const edges = (y0 <= m) + (y1 >= h - 1 - m) + (x0 <= m) + (x1 >= w - 1 - m);
  if (y0 <= m || y1 >= h - 1 - m || edges >= 2) return { ok: false, reason: 'beskåret (sandsynligvis model)', stats, family, box };
  const [amin, amax] = ASPECT[sub] || [0.2, 5];
  if (aspect < amin || aspect > amax) return { ok: false, reason: 'forkert form (sandsynligvis model)', stats, family, box };
  const strong = [...hues].filter(v => v > sat * 0.12 && v > n * 0.02).length;
  stats.colours = strong;
  if (PATTERN_CHECK.has(sub) && strong >= 3) return { ok: false, reason: 'print eller mønster', stats, family, box };
  if (skinFrac > (SKIN_TOLERANT.has(family) ? 0.4 : 0.03)) return { ok: false, reason: 'hud i billedet (model)', stats, family, box };
  return { ok: true, reason: 'ok', stats, family, box };
}

// Filenames that usually mean a model / campaign photo.
export const MODEL_HINT = /model|on[-_]?body|onfigure|worn|look_?\d|lookbook|campaign|editorial|lifestyle|street|_lb_|-lb-/i;
