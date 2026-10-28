// Browser side: cut product photos free, check their colour, build outfits and draw 9:16 slides.
import { TEES, teeById, STYLES, rnd, candidates, colourOk, label } from './outfit';
import { illustration } from './illustrations';

export const W = 1080, H = 1920;

/* ---------------- images ---------------- */
const imgCache = new Map();
export function loadImage(src) {
  if (!imgCache.has(src)) imgCache.set(src, new Promise((res, rej) => {
    const i = new Image(); i.decoding = 'async'; i.onload = () => res(i); i.onerror = () => rej(new Error('img ' + src)); i.src = src;
  }));
  return imgCache.get(src);
}
export const proxied = u => u.startsWith('/') ? u : `/api/img?u=${encodeURIComponent(u)}`;
const svgSrc = svg => 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);

/* ---------------- colour families ---------------- */
const REF = {
  black: [28, 28, 30], charcoal: [62, 63, 67], grey: [140, 140, 142], white: [242, 242, 240], cream: [228, 220, 202], beige: [192, 180, 154],
  tan: [172, 128, 86], brown: [88, 60, 44], navy: [36, 46, 74], denim_dark: [52, 66, 96], denim_mid: [86, 110, 145], denim_light: [152, 172, 196],
  olive: [98, 102, 66], green: [48, 88, 60], burgundy: [100, 36, 50], red: [190, 42, 40], mustard: [198, 150, 52], blue: [56, 98, 170]
};
function nearestFamily([r, g, b], sub) {
  let best = null, bd = 1e9;
  for (const [k, [R, G, B]] of Object.entries(REF)) {
    if (sub !== 'jeans' && k.startsWith('denim')) continue;
    const d = 2 * (r - R) ** 2 + 4 * (g - G) ** 2 + 3 * (b - B) ** 2; if (d < bd) { bd = d; best = k; }
  }
  if (sub === 'jeans' && (best === 'navy' || best === 'blue' || best === 'grey')) { const l = (r + g + b) / 3; best = l > 140 ? 'denim_light' : l > 85 ? 'denim_mid' : 'denim_dark'; }
  return best;
}

/* ---------------- cut-out ----------------
   Works on pack shots (product on a plain background). Photos with a model or a busy
   background are rejected, and the next photo or product is tried. */
const cutCache = new Map();
export function cutout(src, sub) {
  const key = src + '|' + sub;
  if (!cutCache.has(key)) cutCache.set(key, (async () => {
    const img = await loadImage(src);
    const s = Math.min(1, 800 / Math.max(img.naturalWidth, img.naturalHeight));
    const w = Math.max(1, Math.round(img.naturalWidth * s)), h = Math.max(1, Math.round(img.naturalHeight * s));
    const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
    const ctx = cv.getContext('2d', { willReadFrequently: true }); ctx.drawImage(img, 0, 0, w, h);
    const id = ctx.getImageData(0, 0, w, h), d = id.data;
    // background colour = median of the border
    const border = [];
    for (let x = 0; x < w; x += 2) border.push((x) * 4, ((h - 1) * w + x) * 4);
    for (let y = 0; y < h; y += 2) border.push((y * w) * 4, (y * w + w - 1) * 4);
    const med = [0, 1, 2].map(c => { const v = border.map(i => d[i + c]).sort((a, b) => a - b); return v[v.length >> 1]; });
    const dist = (i, c) => Math.abs(d[i] - c[0]) + Math.abs(d[i + 1] - c[1]) + Math.abs(d[i + 2] - c[2]);
    const uniform = border.filter(i => dist(i, med) < 30 || d[i + 3] < 20).length / border.length;
    if (uniform < 0.8) return null;
    const transparentBg = border.filter(i => d[i + 3] < 20).length / border.length > 0.5;
    const bg = new Uint8Array(w * h);
    if (!transparentBg) {
      const light = (med[0] + med[1] + med[2]) / 3 > 200;
      const TOL = light ? 26 : 34, STEP = light ? 9 : 14;
      const q = new Int32Array(w * h); let qh = 0, qt = 0;
      const seed = p => { if (!bg[p] && dist(p * 4, med) < TOL) { bg[p] = 1; q[qt++] = p; } };
      for (let x = 0; x < w; x++) { seed(x); seed((h - 1) * w + x); }
      for (let y = 0; y < h; y++) { seed(y * w); seed(y * w + w - 1); }
      while (qh < qt) {
        const p = q[qh++], x = p % w, y = (p / w) | 0, i = p * 4;
        const nb = [x > 0 ? p - 1 : -1, x < w - 1 ? p + 1 : -1, y > 0 ? p - w : -1, y < h - 1 ? p + w : -1];
        for (const n of nb) if (n >= 0 && !bg[n]) {
          const j = n * 4;
          if (dist(j, med) < TOL && Math.abs(d[j] - d[i]) + Math.abs(d[j + 1] - d[i + 1]) + Math.abs(d[j + 2] - d[i + 2]) < STEP) { bg[n] = 1; q[qt++] = n; }
        }
      }
      for (let p = 0; p < w * h; p++) if (bg[p]) d[p * 4 + 3] = 0;
      // soften the edge one pixel deep
      for (let p = 0; p < w * h; p++) if (!bg[p]) {
        const x = p % w; const touch = (x > 0 && bg[p - 1]) || (x < w - 1 && bg[p + 1]) || bg[p - w] || bg[p + w];
        if (touch) d[p * 4 + 3] = Math.min(d[p * 4 + 3], dist(p * 4, med) < 60 ? 110 : 200);
      }
    } else for (let p = 0; p < w * h; p++) bg[p] = d[p * 4 + 3] < 20 ? 1 : 0;
    // bounding box, size check and average colour
    let x0 = w, y0 = h, x1 = 0, y1 = 0, n = 0, R = 0, G = 0, B = 0;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const p = y * w + x; if (bg[p] || d[p * 4 + 3] < 200) continue;
      n++; if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
      const i = p * 4, l = d[i] + d[i + 1] + d[i + 2];
      if (l < 735 && l > 15) { R += d[i]; G += d[i + 1]; B += d[i + 2]; }
    }
    const area = n / (w * h);
    if (area < 0.04 || area > 0.9 || x1 - x0 < 30 || y1 - y0 < 30) return null;
    ctx.putImageData(id, 0, 0);
    const out = document.createElement('canvas'); out.width = x1 - x0 + 1; out.height = y1 - y0 + 1;
    out.getContext('2d').drawImage(cv, x0, y0, out.width, out.height, 0, 0, out.width, out.height);
    const k = Math.max(1, n);
    return { canvas: out, family: nearestFamily([R / k, G / k, B / k], sub) };
  })().catch(() => null));
  return cutCache.get(key);
}

/* ---------------- outfit building ---------------- */
async function fillSlot(pool, cat, sub, tee, gender, used, avoid) {
  for (const it of candidates(pool, cat, sub, tee, gender, used, avoid)) {
    for (const src of it.images.slice(0, 3)) {
      const cut = await cutout(proxied(src), sub);
      if (!cut) continue;
      const fam = it.family || cut.family;
      if (!colourOk(cat, fam, tee, avoid)) break; // wrong colour: next product
      used.add(it.id);
      return { kind: 'product', item: it, img: cut.canvas, family: fam, sub };
    }
    used.add(it.id); // nothing usable here, skip it from now on
  }
  const ill = illustration(sub, [...tee.pal, ...(cat === 'shoes' ? ['white', 'black', 'brown'] : [])], avoid);
  return { kind: 'ill', ill, img: await loadImage(svgSrc(ill.svg)), family: ill.family, sub };
}

export async function buildOutfit(pool, teeId, styleKey, gender, used = new Set()) {
  const tee = teeById(teeId), sk = styleKey === 'alle' ? rnd(Object.keys(STYLES)) : styleKey, st = STYLES[sk];
  const accs = [...new Set([rnd(st.acc), rnd(st.acc), rnd(st.acc)])].slice(0, 2);
  while (accs.length < 2) accs.push(rnd(st.acc.filter(a => !accs.includes(a))));
  const bottom = await fillSlot(pool, 'bottom', rnd(st.bottom), tee, gender, used, []);
  const outer = await fillSlot(pool, 'outer', rnd(st.outer), tee, gender, used, [bottom.family]);
  const [shoes, acc0, acc1] = await Promise.all([
    fillSlot(pool, 'shoes', rnd(st.shoes), tee, gender, used, []),
    fillSlot(pool, 'acc', accs[0], tee, gender, used, [outer.family]),
    fillSlot(pool, 'acc', accs[1], tee, gender, used, [outer.family])
  ]);
  return { tee: teeId, style: sk, caption: rnd(st.captions), flip: Math.random() < 0.5, slots: { outer, bottom, shoes, acc0, acc1 } };
}

/* ---------------- drawing ---------------- */
export const BGS = {
  sand: { n: 'Sand', bg: '#EAE4D9', fg: '#241a15', mut: '#7a6a5c', dark: false },
  grey: { n: 'Lysegrå', bg: '#E8E8E6', fg: '#1d1d1f', mut: '#6d6d70', dark: false },
  white: { n: 'Hvid', bg: '#F7F6F3', fg: '#1d1d1f', mut: '#77706a', dark: false },
  espresso: { n: 'Espresso', bg: '#2A1F1A', fg: '#F3EADF', mut: '#c3ad99', dark: true },
  olive: { n: 'Oliven', bg: '#C9CBB5', fg: '#23261a', mut: '#565b40', dark: false }
};
const FONT = '"Bricolage Grotesque", Arial, sans-serif', BRAND = '"Gluten", "Bricolage Grotesque", sans-serif';
const LAY = {
  outer: { x: 30, y: 400, w: 560, h: 600, r: -6 }, shirt: { x: 390, y: 370, w: 660, h: 660, r: 3 }, bottom: { x: 70, y: 990, w: 440, h: 740, r: -2 },
  acc0: { x: 560, y: 1030, w: 270, h: 230, r: -8 }, acc1: { x: 820, y: 1090, w: 220, h: 230, r: 10 }, shoes: { x: 540, y: 1330, w: 500, h: 300, r: -3 }
};
const box = (k, flip) => { const b = { ...LAY[k] }; if (flip) { b.x = W - b.x - b.w; b.r = -b.r; } return b; };
const shadowOf = t => t.dark ? 'rgba(0,0,0,.45)' : 'rgba(40,25,15,.20)';
function drawIn(ctx, img, b, shadow) {
  const iw = img.naturalWidth || img.width, ih = img.naturalHeight || img.height;
  const s = Math.min(b.w / iw, b.h / ih), w = iw * s, h = ih * s, cx = b.x + b.w / 2, cy = b.y + b.h / 2;
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(b.r * Math.PI / 180); ctx.shadowColor = shadow; ctx.shadowBlur = 34; ctx.shadowOffsetY = 14;
  ctx.drawImage(img, -w / 2, -h / 2, w, h); ctx.restore();
  return { x: cx - w / 2, y: cy - h / 2, w, h, cx, cy };
}
function pill(ctx, text, cx, y, t, hot) {
  ctx.save(); ctx.font = `600 27px ${FONT}`;
  let s = text; while (ctx.measureText(s).width > 470 && s.length > 4) s = s.slice(0, -2);
  if (s !== text) s = s.trimEnd() + '…';
  const pw = ctx.measureText(s).width + 36, ph = 48, x = Math.max(24, Math.min(W - 24 - pw, cx - pw / 2));
  ctx.fillStyle = hot ? '#C2312B' : (t.dark ? 'rgba(243,234,223,.94)' : 'rgba(255,255,255,.93)');
  ctx.beginPath(); ctx.roundRect(x, y, pw, ph, 24); ctx.fill();
  ctx.fillStyle = hot ? '#fff' : '#241a15'; ctx.textBaseline = 'middle'; ctx.textAlign = 'left'; ctx.fillText(s, x + 18, y + ph / 2 + 1); ctx.restore();
}
function wrap(ctx, text, x, y, maxW, lh) {
  const words = text.split(' '); let line = '', lines = [];
  for (const w of words) { const t = line ? line + ' ' + w : w; if (ctx.measureText(t).width > maxW && line) { lines.push(line); line = w; } else line = t; }
  lines.push(line); ctx.textAlign = 'left'; lines.forEach((l, i) => ctx.fillText(l, x, y + i * lh)); return lines.length;
}
function bgFill(ctx, t) {
  ctx.fillStyle = t.bg; ctx.fillRect(0, 0, W, H);
  const g = ctx.createRadialGradient(W / 2, H * .45, 100, W / 2, H * .45, H * .8);
  g.addColorStop(0, 'rgba(255,255,255,.10)'); g.addColorStop(1, 'rgba(0,0,0,.07)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
}
const teeImg = id => loadImage(`/tees/${id}.webp`);
function spaced(ctx, px) { try { ctx.letterSpacing = px; } catch { } }

async function drawOutfit(ctx, o, t, opt) {
  bgFill(ctx, t); const tee = teeById(o.tee), sh = shadowOf(t), S = o.slots, shirt = await teeImg(o.tee);
  ctx.fillStyle = t.mut; ctx.font = `700 30px ${FONT}`; spaced(ctx, '6px'); ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
  ctx.fillText((opt.num ? `OUTFIT ${opt.num}  ·  ` : '') + STYLES[o.style].name.toUpperCase(), 72, 140); spaced(ctx, '0px');
  ctx.fillStyle = t.fg; ctx.font = `800 76px ${FONT}`; wrap(ctx, o.caption, 72, 232, 940, 82);
  const r = {};
  r.outer = drawIn(ctx, S.outer.img, box('outer', o.flip), sh);
  r.bottom = drawIn(ctx, S.bottom.img, box('bottom', o.flip), sh);
  r.shirt = drawIn(ctx, shirt, box('shirt', o.flip), sh);
  r.acc0 = drawIn(ctx, S.acc0.img, box('acc0', o.flip), sh);
  r.acc1 = drawIn(ctx, S.acc1.img, box('acc1', o.flip), sh);
  r.shoes = drawIn(ctx, S.shoes.img, box('shoes', o.flip), sh);
  if (opt.labels) {
    pill(ctx, label(S.outer), r.outer.cx, r.outer.y + r.outer.h - 120, t);
    pill(ctx, label(S.bottom), r.bottom.cx, r.bottom.y + r.bottom.h - 150, t);
    pill(ctx, label(S.shoes), r.shoes.cx, Math.min(r.shoes.y + r.shoes.h + 6, 1700), t);
    pill(ctx, S.acc0.kind === 'product' ? S.acc0.item.brand : S.acc0.ill.label, r.acc0.cx, r.acc0.y + r.acc0.h - 10, t);
    pill(ctx, S.acc1.kind === 'product' ? S.acc1.item.brand : S.acc1.ill.label, r.acc1.cx, r.acc1.y + r.acc1.h - 10, t);
    pill(ctx, `BACIO · ${tee.name} tee`, r.shirt.cx, r.shirt.y + r.shirt.h - 90, t, true);
  }
  ctx.fillStyle = t.fg; ctx.font = `700 46px ${BRAND}`; ctx.textAlign = 'center'; ctx.globalAlpha = .9; ctx.fillText('BACIO', W / 2, 1790); ctx.globalAlpha = 1;
}
const FAN = [[230, 1010, -9], [540, 960, -1], [850, 1010, 8], [230, 1370, -6], [540, 1330, 3], [850, 1370, 7], [540, 1650, -2]];
async function drawCover(ctx, t, tees, title) {
  bgFill(ctx, t); const imgs = await Promise.all(tees.map(teeImg));
  ctx.fillStyle = '#C2312B'; ctx.font = `700 64px ${BRAND}`; ctx.textAlign = 'left'; ctx.fillText('BACIO', 72, 190);
  ctx.fillStyle = t.fg; ctx.font = `800 116px ${FONT}`; const n = wrap(ctx, title, 72, 330, 940, 118);
  ctx.fillStyle = t.mut; ctx.font = `600 44px ${FONT}`; ctx.fillText('styl din tee som en københavner →', 72, 330 + n * 118 + 10);
  const pos = imgs.length <= 3 ? [[540, 1150, -4], [300, 1420, -8], [780, 1420, 8]] : FAN;
  imgs.forEach((im, i) => { const [x, y, r] = pos[i % pos.length], w = imgs.length <= 3 ? 560 : 380; drawIn(ctx, im, { x: x - w / 2, y: y - w / 2, w, h: w, r }, shadowOf(t)); });
}
async function drawCta(ctx, t, tees) {
  bgFill(ctx, t); const imgs = await Promise.all(tees.map(teeImg));
  ctx.fillStyle = t.fg; ctx.font = `800 104px ${FONT}`; const n = wrap(ctx, 'hvilket outfit tager du?', 72, 250, 940, 108);
  ctx.fillStyle = t.mut; ctx.font = `600 44px ${FONT}`; ctx.fillText(`skriv 1–${tees.length} i kommentarerne`, 72, 250 + n * 108 + 10);
  const cols = imgs.length > 4 ? 3 : 2, cw = (W - 144) / cols, top = 640;
  imgs.forEach((im, i) => {
    const cx = 72 + cw * (i % cols) + cw / 2, cy = top + Math.floor(i / cols) * 300 + 130;
    drawIn(ctx, im, { x: cx - cw * .45, y: cy - 130, w: cw * .9, h: 260, r: 0 }, shadowOf(t));
    ctx.fillStyle = '#C2312B'; ctx.beginPath(); ctx.arc(cx - cw * .32, cy - 104, 30, 0, 7); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.font = `800 34px ${FONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(String(i + 1), cx - cw * .32, cy - 102); ctx.textBaseline = 'alphabetic';
  });
  ctx.fillStyle = '#C2312B'; ctx.font = `700 150px ${BRAND}`; ctx.textAlign = 'center'; ctx.fillText('BACIO', W / 2, 1700);
}

export async function renderSlide(canvas, slide, scale, opts) {
  const ctx = canvas.getContext('2d'); canvas.width = Math.round(W * scale); canvas.height = Math.round(H * scale);
  ctx.setTransform(scale, 0, 0, scale, 0, 0); const t = BGS[opts.bg];
  if (slide.kind === 'cover') await drawCover(ctx, t, slide.tees, slide.title);
  else if (slide.kind === 'cta') await drawCta(ctx, t, slide.tees);
  else await drawOutfit(ctx, slide.o, t, { labels: opts.labels, num: slide.num });
}
export async function slideBlob(slide, opts) {
  const cv = document.createElement('canvas'); await renderSlide(cv, slide, 1, opts);
  return new Promise(r => cv.toBlob(r, 'image/png'));
}
export { TEES };
