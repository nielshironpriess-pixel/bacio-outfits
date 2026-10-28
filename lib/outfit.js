// Outfit rules: the Bacio tees, the colours that go with each, and the looks ("opskrifter")
// that Copenhagen guys actually wear. Each look names the type of item, words to look for
// in the product name, and the colours that make it work.
export const TEES = [
  { id: 'blue', name: 'One Last Espresso', col: 'blå', pal: ['cream', 'beige', 'brown', 'tan', 'denim_dark', 'denim_mid', 'grey', 'charcoal', 'navy', 'white', 'black', 'olive'] },
  { id: 'red', name: 'Leisure Club', col: 'rød', pal: ['denim_light', 'denim_mid', 'denim_dark', 'black', 'cream', 'beige', 'navy', 'brown', 'white', 'grey', 'charcoal'] },
  { id: 'navy', name: 'BA CIO', col: 'navy', pal: ['cream', 'beige', 'denim_light', 'denim_mid', 'grey', 'tan', 'brown', 'olive', 'white', 'black', 'charcoal'] },
  { id: 'olive', name: 'BACIO logo', col: 'oliven', pal: ['denim_dark', 'denim_light', 'denim_mid', 'black', 'cream', 'beige', 'brown', 'tan', 'navy', 'white', 'charcoal'] },
  { id: 'burgundy', name: 'Italia', col: 'bordeaux', pal: ['cream', 'beige', 'denim_light', 'denim_mid', 'charcoal', 'brown', 'tan', 'olive', 'navy', 'white', 'black', 'grey'] },
  { id: 'white_cafe', name: 'Café', col: 'hvid', pal: ['denim_dark', 'denim_mid', 'denim_light', 'navy', 'beige', 'brown', 'grey', 'tan', 'green', 'cream', 'charcoal', 'black', 'olive', 'white'] },
  { id: 'white_stools', name: 'Vinbar', col: 'hvid', pal: ['denim_mid', 'denim_dark', 'denim_light', 'black', 'cream', 'brown', 'burgundy', 'navy', 'beige', 'charcoal', 'grey', 'tan', 'white'] }
];
export const teeById = id => TEES.find(t => t.id === id);

export const STYLES = {
  hoodie: { name: 'Hoodie' },
  overshirt: { name: 'Overshirt' },
  knit: { name: 'Strik' }
};

// Shoes: Vans only, slip-ons first.
const SHOES = { sub: 'sneakers', kw: /slip-?on/i, must: /vans|slip-?on|old skool|authentic|\bera\b|sk8-/i, fam: ['black', 'white', 'cream', 'navy', 'brown', 'beige', 'grey', 'burgundy', 'olive'] };
// Trousers from these brands are preferred.
const PANTS_BRANDS = /service works|palmes|polar|palace|pop trading|butter goods|dime|gramicci|arte|stüssy|stussy|norse/i;
const WATCH = { sub: 'watch', kw: /rolex|datejust|submariner|oyster|explorer|air-king|tudor/i };
const CAP = { sub: 'cap', kw: /6-panel|5-panel|strapback|snapback|logo cap|cap\b/i, fam: ['black', 'navy', 'brown', 'beige', 'cream', 'grey', 'olive', 'green', 'burgundy'] };

// fam = colour families that fit the look. kw = words in the product name (preferred).
export const RECIPES = [
  { id: 'hoodie-chef', style: 'hoodie', name: 'Hoodie og chef pants',
    bottom: { sub: 'trousers', kw: /chef|waiter|pleat|canvas|twill|relaxed|wide|classic/i, fam: ['beige', 'cream', 'brown', 'black', 'navy', 'grey', 'olive', 'charcoal'], brand: PANTS_BRANDS },
    outer: { sub: 'hoodie', kw: /plain|basic|blank|heavyweight|essential|zip|hood/i, fam: ['grey', 'black', 'navy', 'brown', 'cream', 'olive', 'charcoal', 'green', 'burgundy'] },
    captions: ['kaffe på Værnedamsvej', 'brunch på Nørrebro', 'bagerkø lørdag morgen'] },
  { id: 'hoodie-jeans', style: 'hoodie', name: 'Hoodie og baggy jeans',
    bottom: { sub: 'jeans', kw: /baggy|loose|wide|big boy|relaxed|skate|93|carpenter/i, fam: ['denim_light', 'denim_mid', 'denim_dark', 'black'], brand: PANTS_BRANDS },
    outer: { sub: 'hoodie', kw: /plain|basic|blank|heavyweight|essential|zip|hood/i, fam: ['grey', 'black', 'navy', 'brown', 'cream', 'olive', 'charcoal'] },
    captions: ['skate ved Fælledparken', 'fredagsbar', 'hverdagsuniform'] },
  { id: 'overshirt-work', style: 'overshirt', name: 'Overshirt og work pants',
    bottom: { sub: 'trousers', kw: /work|canvas|twill|carpenter|double knee|chino|relaxed|wide/i, fam: ['beige', 'black', 'brown', 'navy', 'grey', 'olive', 'cream'], brand: PANTS_BRANDS },
    outer: { sub: 'overshirt', kw: /overshirt|shirt jacket|flannel|corduroy|cord|wool|check|work shirt|cpo/i, fam: ['brown', 'olive', 'navy', 'grey', 'green', 'beige', 'black', 'burgundy', 'cream'] },
    captions: ['loppemarked på Ravnsborggade', 'weekend på Refshaleøen', 'morgen-espresso'] },
  { id: 'overshirt-chef', style: 'overshirt', name: 'Overshirt og chef pants',
    bottom: { sub: 'trousers', kw: /chef|waiter|pleat|wide|relaxed|classic/i, fam: ['beige', 'cream', 'black', 'brown', 'navy', 'grey'], brand: PANTS_BRANDS },
    outer: { sub: 'overshirt', kw: /overshirt|shirt jacket|flannel|corduroy|cord|wool|check|cpo/i, fam: ['brown', 'olive', 'navy', 'grey', 'green', 'black', 'burgundy'] },
    captions: ['vinbar på Vesterbro', 'galleri-runde i indre by', 'fredag efter arbejde'] },
  { id: 'overshirt-jeans', style: 'overshirt', name: 'Overshirt og jeans',
    bottom: { sub: 'jeans', kw: /baggy|loose|wide|big boy|relaxed|straight|93/i, fam: ['denim_light', 'denim_mid', 'black'], brand: PANTS_BRANDS },
    outer: { sub: 'overshirt', kw: /overshirt|shirt jacket|flannel|corduroy|cord|wool|check|work shirt/i, fam: ['brown', 'olive', 'navy', 'grey', 'green', 'beige', 'black'] },
    captions: ['søndag på Jægersborggade', 'gåtur rundt om søerne', 'kaffe og plader'] },
  { id: 'knit-chef', style: 'knit', name: 'Strik og chef pants',
    bottom: { sub: 'trousers', kw: /chef|wide|relaxed|pleat|twill|classic/i, fam: ['cream', 'beige', 'brown', 'grey', 'navy', 'black'], brand: PANTS_BRANDS },
    outer: { sub: 'knit', kw: /quarter|half[- ]zip|crew|cardigan|wool|lambswool/i, fam: ['cream', 'brown', 'navy', 'grey', 'green', 'burgundy'] },
    captions: ['date night på Christianshavn', 'middag i Kødbyen', 'padel og espresso'] }
].map(r => ({ ...r, shoes: SHOES, acc: [WATCH, CAP] }));

// Shoes and accessories may always be neutral, whatever the tee.
export const ALWAYS_OK = { shoes: ['white', 'black', 'cream', 'brown', 'tan', 'grey', 'beige', 'burgundy'], acc: ['black', 'brown', 'tan', 'cream', 'white', 'beige', 'grey', 'navy', 'mustard', 'charcoal'] };

export const rnd = a => a[Math.floor(Math.random() * a.length)];
export function shuffle(a) { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; }

export function colourOk(cat, fam, tee) {
  if (!fam) return true;
  return tee.pal.includes(fam) || (ALWAYS_OK[cat] || []).includes(fam);
}

// Looks that work with this tee: their trousers and jacket colours must fit the tee.
export function recipesFor(tee, style) {
  const fits = r => r.bottom.fam.some(f => tee.pal.includes(f)) && r.outer.fam.some(f => tee.pal.includes(f));
  const list = RECIPES.filter(r => fits(r) && (style === 'alle' || r.style === style));
  return list.length ? list : RECIPES.filter(fits);
}

/** Ranked candidates for one slot: keyword + colour of the look first, unknown colour last. */
export function candidates(pool, cat, spec, tee, used, avoidFam = []) {
  const scored = [];
  for (const it of pool) {
    if (it.cat !== cat || it.sub !== spec.sub || used.has(it.id)) continue;
    if (spec.must && !spec.must.test(`${it.brand} ${it.kw || it.title}`)) continue;
    if (it.family && !colourOk(cat, it.family, tee)) continue;
    if (it.family && avoidFam.includes(it.family) && !it.family.startsWith('denim')) continue;
    let s = Math.random() * 1.5;
    if (spec.kw && spec.kw.test(it.kw || it.title)) s += 5;
    if (spec.brand && spec.brand.test(`${it.brand} ${it.source}`)) s += 6;
    if (spec.fam && it.family && spec.fam.includes(it.family)) s += 3;
    else if (spec.fam && it.family) s -= 2;
    if (!it.family) s -= 1;
    scored.push([s, it]);
  }
  return scored.sort((a, b) => b[0] - a[0]).slice(0, 14).map(x => x[1]);
}

export const label = s => s.kind === 'product' ? `${s.item.brand} · ${shortTitle(s.item)}` : s.ill.label;
export function shortTitle(it) {
  let t = it.title.replace(new RegExp(`^${(it.brand || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*`, 'i'), '').replace(/\s+[-–|]\s+.*$/, '');
  return t.length > 30 ? t.slice(0, 29) + '…' : t;
}
