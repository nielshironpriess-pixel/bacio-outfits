// Server side: fetch products from shops/feeds, sort them into outfit categories,
// and guess their colour from the product text.
import { storesFromEnv, feedsFromEnv } from './sources.config';

const TTL = 6 * 60 * 60 * 1000; // refresh catalogue every 6 hours
const UA = 'Mozilla/5.0 (compatible; BacioOutfitBot/1.0; +https://bacio)';
const mem = globalThis.__bacioCache || (globalThis.__bacioCache = new Map());

/* ---------------- categories ---------------- */
const EXCLUDE = /t-?shirt|\btee\b|tees\b|shorts|skirt|nederdel|\bdress(es)?\b(?! ?(shoe|pant|trouser|boot|sock))|kjole|swim|bikini|gift ?card|gavekort|\bbra\b|underwear|boxer|brief|kids|baby|toddler|junior|youth|infant|grade school|\bgs\b|\(gs\)|\(ps\)|\(td\)|little kid|big kid|sample sale|poster|candle|mug|book|sticker|keychain|key ring|incense|pillow|blanket|towel|perfume|fragrance|shoe care|cleaner|insole|shoe tree|\bbrush|lace kit|\blaces\b|repel|protector/i;
const RULES = [
  // [cat, sub, regex] — first match wins, order matters
  ['acc', 'sunglasses', /sunglass|solbrille|eyewear/i],
  ['acc', 'socks', /\bsocks?\b|strømpe/i],
  ['acc', 'beanie', /beanie|\bhue\b|watch cap/i],
  ['acc', 'cap', /\bcaps?\b|baseball hat|6-panel|kasket|ballcap/i],
  ['acc', 'scarf', /scarf|tørklæde|halstørklæde/i],
  ['acc', 'bag', /\bbag\b|tote|crossbody|messenger|taske|backpack|rygsæk|pouch/i],
  ['shoes', 'loafers', /loafer|penny|moccasin|mokasin/i],
  ['shoes', 'boots', /\bboots?\b|chukka|støvle|desert/i],
  ['shoes', 'sneakers', /sneaker|trainer|samba|gazelle|spezial|speedcat|campus|\bgel-|1906|990v|2002r|550|9060|court|runner|\bshoes?\b|sko\b|footwear/i],
  ['bottom', 'jeans', /\bjeans?\b|denim (pant|trouser)|5-pocket/i],
  ['bottom', 'trousers', /trouser|\bpants?\b|chino|cargo|bukser|slacks|corduroy pant|cord pant/i],
  ['outer', 'coat', /\bcoat\b|frakke|overcoat|trench|parka|mac\b/i],
  ['outer', 'knit', /cardigan|sweater|knit|strik|jumper|pullover|crewneck|half[- ]zip|quarter[- ]zip/i],
  ['outer', 'overshirt', /overshirt|over-shirt|shacket|chore|work jacket|skjortejakke/i],
  ['outer', 'jacket', /jacket|jakke|bomber|blouson|harrington|anorak|fleece|gilet|\bvest\b/i]
];
const WOMEN = /\bwomen|\bwoman|wmns|\bw's\b|\bdame|female|ladies|\bher\b|womenswear|\bgirls?\b/i;
const MEN = /\bmen'?s?\b|\bherre|\bmale\b/i;

export function classify(text) {
  if (EXCLUDE.test(text)) return null;
  for (const [cat, sub, re] of RULES) if (re.test(text)) return { cat, sub };
  return null;
}

/* ---------------- colours ---------------- */
const COLORS = [
  ['burgundy', /burgundy|bordeaux|wine|maroon|oxblood|merlot|claret/i],
  ['navy', /navy|marine|midnight|dark blue|dk blue|mørkeblå|ink\b/i],
  ['denim_light', /light (blue|wash|indigo|denim)|bleach|sky blue|stone ?wash|vintage blue|lys blå|light vintage/i],
  ['denim_dark', /dark (wash|indigo|denim)|rinse|raw|dry denim|deep indigo|one wash/i],
  ['denim_mid', /indigo|denim|mid (blue|wash)|medium (blue|wash)|washed blue/i],
  ['charcoal', /charcoal|anthracite|antracit|graphite|dark gr[ae]y|koksgrå/i],
  ['black', /black|sort\b|noir|jet|onyx|\bink black/i],
  ['white', /\bwhite|hvid|optic|snow/i],
  ['cream', /cream|ecru|off[- ]?white|ivory|natural|bone|egret|vanilla|chalk|oat/i],
  ['tan', /camel|\btan\b|caramel|cognac|tobacco|tobak|chestnut|toffee|whiskey|rust/i],
  ['brown', /brown|brun|chocolate|coffee|espresso|mocha|bark|cocoa|walnut|umber|dark earth|java/i],
  ['beige', /beige|sand|stone|khaki|taupe|putty|dune|desert|kit\b|clay|mushroom|greige|fawn/i],
  ['olive', /olive|oliven|army|moss|sage|military|loden|ivy green/i],
  ['green', /green|grøn|forest|bottle|pine|emerald|hunter/i],
  ['grey', /gr[ae]y\b|grå|heather|melange|silver|slate|ash|pebble|smoke|steel/i],
  ['mustard', /mustard|sennep|yellow|gul\b|ochre|gold/i],
  ['red', /\bred\b|rød|scarlet|cherry|tomato/i],
  ['blue', /blue|blå|cobalt|royal|azure/i]
];
export function colorFamily(text) {
  if (!text) return null;
  for (const [fam, re] of COLORS) if (re.test(text)) return fam;
  return null;
}

/* ---------------- shopify ---------------- */
function tagsOf(p) { return Array.isArray(p.tags) ? p.tags.join(' ') : (p.tags || ''); }
const shopImg = (src) => src ? (src.startsWith('//') ? 'https:' + src : src) : null;

function normalizeShopify(p, store) {
  const base = `${p.title} ${p.product_type || ''} ${tagsOf(p)}`;
  const c = classify(`${p.title} ${p.product_type || ''}`) || classify(base);
  if (!c) return [];
  if (!p.images || !p.images.length) return [];
  const gender = WOMEN.test(base) && !MEN.test(base) ? 'women' : MEN.test(base) ? 'men' : 'unisex';
  if (gender === 'women') return []; // menswear only
  const colorOpt = (p.options || []).find(o => /colou?r|farve|färg/i.test(o.name));
  const pos = colorOpt ? `option${colorOpt.position}` : null;
  const values = colorOpt ? colorOpt.values.slice(0, 3) : [null];
  const out = [];
  for (const val of values) {
    const vars = pos ? p.variants.filter(v => v[pos] === val) : p.variants;
    if (!vars.length || !vars.some(v => v.available !== false)) continue;
    const vids = new Set(vars.map(v => v.id));
    let imgs = p.images.filter(im => (im.variant_ids || []).some(id => vids.has(id))).map(im => im.src);
    const fi = vars.find(v => v.featured_image)?.featured_image?.src;
    if (fi) imgs.unshift(fi);
    if (!imgs.length) imgs = p.images.map(im => im.src);
    imgs = [...new Set(imgs.map(shopImg))].slice(0, 4);
    const colorText = val || p.title;
    out.push({
      id: `${store.domain}:${p.id}:${val || ''}`,
      source: store.name, brand: p.vendor || store.name,
      title: p.title.replace(/\s+/g, ' ').trim(), color: val || '',
      url: `https://${store.domain}/products/${p.handle}`,
      price: null, currency: null,
      images: imgs, cat: c.cat, sub: c.sub, gender,
      kw: `${p.title} ${val || ''} ${p.product_type || ''} ${tagsOf(p)}`.toLowerCase().slice(0, 300),
      family: colorFamily(colorText) || colorFamily(p.title) || null,
      created: p.published_at || p.created_at || null
    });
  }
  return out;
}

async function getJSON(url) {
  const r = await fetch(url, { headers: { 'user-agent': UA, accept: 'application/json' }, next: { revalidate: 21600 } });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  const ct = r.headers.get('content-type') || '';
  if (!ct.includes('json')) throw new Error('ikke JSON (sandsynligvis ikke Shopify)');
  return r.json();
}

async function fetchShopify(store) {
  const items = [];
  for (let page = 1; page <= 3; page++) {
    const j = await getJSON(`https://${store.domain}/products.json?limit=100&page=${page}`);
    const ps = j.products || [];
    for (const p of ps) items.push(...normalizeShopify(p, store));
    if (ps.length < 100) break;
  }
  return items;
}

/* ---------------- affiliate feeds ---------------- */
function parseCSV(text, max = 5000) {
  const rows = []; let row = [], cell = '', q = false, i = 0;
  const delim = (text.slice(0, 2000).match(/;/g) || []).length > (text.slice(0, 2000).match(/,/g) || []).length ? ';' : ',';
  for (; i < text.length && rows.length <= max; i++) {
    const ch = text[i];
    if (q) { if (ch === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; } else cell += ch; }
    else if (ch === '"') q = true;
    else if (ch === delim) { row.push(cell); cell = ''; }
    else if (ch === '\n') { row.push(cell); rows.push(row); row = []; cell = ''; }
    else if (ch !== '\r') cell += ch;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  const head = rows.shift().map(h => h.trim().toLowerCase());
  return rows.map(r => Object.fromEntries(head.map((h, k) => [h, r[k]])));
}
const tag = (blk, names) => { for (const n of names) { const m = blk.match(new RegExp(`<${n}>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?</${n}>`, 'i')); if (m) return m[1].trim(); } return ''; };
const decode = s => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');

function feedItem(o, i, feedName) {
  const text = `${o.title} ${o.category}`;
  const c = classify(text); if (!c || !o.image || !o.url) return null;
  const all = `${text} ${o.gender || ''}`;
  if (WOMEN.test(all) && !MEN.test(all)) return null;
  return {
    id: `feed:${feedName}:${o.pid || i}`, source: o.shop || feedName, brand: o.brand || o.shop || '',
    title: o.title, color: o.color || '', url: o.url, price: o.price ? Number(String(o.price).replace(',', '.')) : null, currency: o.currency || 'DKK',
    images: [o.image], cat: c.cat, sub: c.sub,
    gender: WOMEN.test(all) && !MEN.test(all) ? 'women' : MEN.test(all) ? 'men' : 'unisex', kw: `${o.title} ${o.category} ${o.color || ''}`.toLowerCase().slice(0, 300),
    family: colorFamily(o.color) || colorFamily(o.title) || null, created: null
  };
}

async function fetchFeed(url) {
  const r = await fetch(url, { headers: { 'user-agent': UA }, cache: 'no-store' });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  let text = await r.text();
  if (text.length > 40e6) text = text.slice(0, 40e6);
  const feedName = new URL(url).hostname;
  const out = [];
  if (/^\s*</.test(text)) { // Partner-ads style XML
    const blocks = text.match(/<produkt>[\s\S]*?<\/produkt>|<product>[\s\S]*?<\/product>|<item>[\s\S]*?<\/item>/gi) || [];
    blocks.slice(0, 20000).forEach((b, i) => {
      const o = {
        title: decode(tag(b, ['produktnavn', 'title', 'name', 'g:title'])), category: decode(tag(b, ['kategorinavn', 'category', 'g:product_type', 'g:google_product_category'])),
        image: decode(tag(b, ['billedurl', 'image', 'imageurl', 'g:image_link'])), url: decode(tag(b, ['vareurl', 'link', 'url', 'g:link'])),
        price: tag(b, ['nypris', 'price', 'g:price']).replace(/[^\d.,]/g, ''), shop: decode(tag(b, ['forhandler', 'shop', 'merchant'])),
        brand: decode(tag(b, ['brand', 'g:brand', 'producent'])), color: decode(tag(b, ['farve', 'color', 'colour', 'g:color'])),
        gender: decode(tag(b, ['koen', 'gender', 'g:gender'])), pid: tag(b, ['produktid', 'id', 'g:id'])
      };
      const it = feedItem(o, i, feedName); if (it) out.push(it);
    });
  } else { // Awin / generic CSV
    parseCSV(text, 20000).forEach((r, i) => {
      const o = {
        title: r.product_name || r.title || r.name, category: `${r.category_name || ''} ${r.merchant_category || ''} ${r.product_type || ''}`,
        image: r.merchant_image_url || r.aw_image_url || r.large_image || r.image_link || r.image, url: r.aw_deep_link || r.deeplink || r.link || r.url,
        price: r.search_price || r.price, currency: r.currency, shop: r.merchant_name, brand: r.brand_name || r.brand,
        color: r.colour || r.color, gender: r.gender || r.suitable_for, pid: r.aw_product_id || r.id
      };
      const it = feedItem(o, i, feedName); if (it) out.push(it);
    });
  }
  return out;
}

/* ---------------- pool ---------------- */
export async function getCatalog({ force = false } = {}) {
  if (process.env.MOCK === '1') return (await import('./mock.json')).default;
  const hit = mem.get('pool');
  if (!force && hit && Date.now() - hit.at < TTL) return hit.data;
  const stores = storesFromEnv(), feeds = feedsFromEnv();
  const jobs = [
    ...stores.map(s => fetchShopify(s).then(items => ({ name: s.name, kind: 'shop', items }), e => ({ name: s.name, kind: 'shop', items: [], error: String(e.message || e) }))),
    ...feeds.map(u => fetchFeed(u).then(items => ({ name: new URL(u).hostname, kind: 'feed', items }), e => ({ name: u, kind: 'feed', items: [], error: String(e.message || e) })))
  ];
  const results = await Promise.all(jobs.map(j => Promise.race([j, new Promise(r => setTimeout(() => r({ items: [], error: 'timeout' }), 25000))])));
  const seen = new Set(), items = [];
  for (const r of results) for (const it of r.items) if (!seen.has(it.id)) { seen.add(it.id); items.push(it); }
  const data = {
    at: new Date().toISOString(),
    sources: results.map(r => ({ name: r.name, kind: r.kind, count: r.items.length, error: r.error || null })),
    items
  };
  if (items.length) mem.set('pool', { at: Date.now(), data });
  return data;
}

export function imageHosts(pool) {
  const hosts = new Set(['cdn.shopify.com']);
  for (const it of pool.items) for (const u of it.images) { try { hosts.add(new URL(u).hostname); } catch {} }
  (process.env.IMG_HOSTS || '').split(',').map(s => s.trim()).filter(Boolean).forEach(h => hosts.add(h));
  return hosts;
}
