import sharp from 'sharp';
import { getCatalog } from '../../../lib/catalog';
import { analyze, MODEL_HINT } from '../../../lib/shot';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// Checks a sample of product photos with the same rules the browser uses,
// so we can see per shop how many images are usable product shots.
// /api/audit?store=Kith&sub=jeans&n=10
async function check(url, sub) {
  if (MODEL_HINT.test(url)) return { ok: false, reason: 'filnavn tyder på model' };
  const u = new URL(url); if (u.hostname === 'cdn.shopify.com' || u.pathname.includes('/cdn/shop/')) u.searchParams.set('width', '600');
  const r = await fetch(u, { headers: { 'user-agent': 'Mozilla/5.0 BacioOutfitBot' } });
  if (!r.ok) return { ok: false, reason: 'HTTP ' + r.status };
  const { data, info } = await sharp(Buffer.from(await r.arrayBuffer())).resize(500, 500, { fit: 'inside' }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return analyze(data, info.width, info.height, sub);
}

export async function GET(req) {
  const q = new URL(req.url).searchParams;
  const store = q.get('store'), sub = q.get('sub'), n = Math.min(+(q.get('n') || 4), 25), imgs = Math.min(+(q.get('imgs') || 2), 4);
  const pool = await getCatalog();
  const groups = {};
  for (const it of pool.items) {
    if (store && it.source.toLowerCase() !== store.toLowerCase()) continue;
    if (sub && it.sub !== sub) continue;
    (groups[it.source] ||= []).push(it);
  }
  const jobs = [];
  for (const [src, list] of Object.entries(groups)) {
    const pick = list.sort(() => Math.random() - 0.5).slice(0, n);
    for (const it of pick) for (let k = 0; k < Math.min(imgs, it.images.length); k++) jobs.push({ src, it, k });
  }
  const out = []; let i = 0;
  await Promise.all(Array.from({ length: 12 }, async () => {
    while (i < jobs.length) {
      const j = jobs[i++];
      try { const r = await check(j.it.images[j.k], j.it.sub); out.push({ ...j, r }); }
      catch (e) { out.push({ ...j, r: { ok: false, reason: 'fejl: ' + String(e.message || e).slice(0, 40) } }); }
    }
  }));
  const lines = [];
  const per = {};
  for (const o of out) { const p = per[o.src] ||= { imgs: 0, ok: 0, items: new Set(), okItems: new Set() }; p.imgs++; p.items.add(o.it.id); if (o.r.ok) { p.ok++; p.okItems.add(o.it.id); } }
  lines.push('SHOP | billeder ok | produkter med mindst ét ok billede');
  for (const [s, p] of Object.entries(per)) lines.push(`${s} | ${p.ok}/${p.imgs} | ${p.okItems.size}/${p.items.size}`);
  lines.push('', 'DETALJER: shop | type | billede# | ok | grund | stats | titel');
  for (const o of out.sort((a, b) => a.src.localeCompare(b.src))) lines.push(`${o.src} | ${o.it.sub} | ${o.k} | ${o.r.ok ? 'OK' : 'nej'} | ${o.r.reason} | ${JSON.stringify(o.r.stats || {})} | ${o.it.title}`);
  return new Response(lines.join('\n'), { headers: { 'content-type': 'text/plain; charset=utf-8' } });
}
