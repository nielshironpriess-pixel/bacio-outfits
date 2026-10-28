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
  casual: { name: 'København casual' },
  skate: { name: 'Skate' },
  sporty: { name: 'Sporty' },
  clean: { name: 'Clean' }
};

const VANS = /vans|old skool|sk8-|half cab|knu skool|authentic|\bera\b|lampin|style 36/i;
const LOW_SNEAKER = /samba|spezial|gazelle|sl ?72|taekwondo|handball|campus|speedcat|onitsuka|mexico 66|club c|court|bw army|achilles|stan smith/i;
const RUNNER = /1906|2002r|990|9060|860|gel-|kayano|nimbus|vomero|xt-6|runner/i;
const CASUAL_PANTS = /service works|palmes|polar|dickies|carhartt|gramicci|pop trading|butter goods|stüssy|stussy|dime|arte|quasi|obey|by parra|aimé leon dore|norse/i;

// fam = colour families that fit the look. kw = words in the product name (preferred, not required).
// brand = brands that make the look feel right (preferred).
export const RECIPES = [
  { id: 'baggy-vans', style: 'skate', name: 'Baggy jeans og Vans',
    bottom: { sub: 'jeans', kw: /baggy|loose|wide|big boy|relaxed|skate|90s|93|carpenter/i, fam: ['denim_light', 'denim_mid'], brand: CASUAL_PANTS },
    outer: { sub: 'hoodie', kw: /zip|hood|plain|basic|heavyweight/i, fam: ['grey', 'black', 'navy', 'brown', 'cream', 'olive', 'charcoal'] },
    shoes: { sub: 'sneakers', kw: VANS, fam: ['black', 'white', 'navy', 'brown', 'cream'] },
    acc: [{ sub: 'cap', fam: ['black', 'navy', 'brown', 'beige', 'cream'] }, { sub: 'socks', fam: ['white', 'grey', 'black'] }],
    captions: ['skate ved Fælledparken', 'fredagsbar', 'hverdagsuniform'] },
  { id: 'chef-quarterzip', style: 'clean', name: 'Chef pants og quarter-zip',
    bottom: { sub: 'trousers', kw: /chef|waiter|pleat|canvas|twill|relaxed|wide/i, fam: ['beige', 'cream', 'brown', 'black', 'navy', 'grey', 'olive'], brand: /service works|palmes|pop trading|arte|norse|aimé leon dore/i },
    outer: { sub: 'knit', kw: /quarter|half[- ]zip|1\/4|zip/i, fam: ['navy', 'grey', 'brown', 'cream', 'green', 'olive'] },
    shoes: { sub: 'sneakers', kw: LOW_SNEAKER, fam: ['black', 'white', 'cream', 'brown'] },
    acc: [{ sub: 'cap', fam: ['navy', 'brown', 'cream', 'beige', 'black'] }, { sub: 'sunglasses' }],
    captions: ['kaffe på Værnedamsvej', 'brunch på Nørrebro', 'bagerkø lørdag morgen'] },
  { id: 'carpenter-fleece', style: 'skate', name: 'Carpenter pants og fleece',
    bottom: { sub: 'trousers', kw: /carpenter|work pant|double knee|874|canvas|painter|utility/i, fam: ['beige', 'brown', 'black', 'olive', 'grey'], brand: CASUAL_PANTS },
    outer: { sub: 'jacket', kw: /fleece|polar|sherpa|pile|boa/i, fam: ['cream', 'brown', 'black', 'grey', 'navy', 'green', 'olive'] },
    shoes: { sub: 'sneakers', kw: VANS, fam: ['black', 'brown', 'white', 'navy'] },
    acc: [{ sub: 'cap', fam: ['black', 'brown', 'olive', 'navy', 'cream'] }, { sub: 'bag', kw: /tote|canvas|shoulder/i }],
    captions: ['loppemarked på Ravnsborggade', 'weekend på Refshaleøen', 'kaffe og plader'] },
  { id: 'hoodie-cargo', style: 'sporty', name: 'Hoodie og cargo',
    bottom: { sub: 'trousers', kw: /cargo|parachute|nylon|utility|track/i, fam: ['black', 'olive', 'beige', 'grey', 'charcoal', 'brown'], brand: CASUAL_PANTS },
    outer: { sub: 'hoodie', kw: /zip|hood|heavyweight|plain/i, fam: ['grey', 'black', 'brown', 'navy', 'olive', 'cream'] },
    shoes: { sub: 'sneakers', kw: RUNNER, fam: ['grey', 'black', 'white', 'cream', 'beige'] },
    acc: [{ sub: 'cap', fam: ['black', 'grey', 'olive', 'navy'] }, { sub: 'bag', kw: /sling|cross|waist|shoulder/i }],
    captions: ['gåtur på Islands Brygge', 'koncert på Vega', 'fredagsbar'] },
  { id: 'suede-denim', style: 'casual', name: 'Ruskind og lys denim',
    bottom: { sub: 'jeans', kw: /straight|relaxed|loose|baggy|wide|90s|vintage|light/i, fam: ['denim_light', 'denim_mid'] },
    outer: { sub: 'jacket', kw: /suede|ruskind|nubuck/i, fam: ['brown', 'tan', 'beige'] },
    shoes: { sub: 'sneakers', kw: LOW_SNEAKER, fam: ['black', 'white', 'brown', 'cream'] },
    acc: [{ sub: 'cap', fam: ['navy', 'brown', 'beige', 'black', 'cream'] }, { sub: 'sunglasses' }],
    captions: ['søndag på Jægersborggade', 'kaffe på Værnedamsvej', 'brunch på Nørrebro'] },
  { id: 'coach-vans', style: 'skate', name: 'Coach jacket og Vans',
    bottom: { sub: 'trousers', kw: /chino|work|twill|874|loose|relaxed|wide/i, fam: ['beige', 'black', 'navy', 'brown', 'grey', 'olive'], brand: CASUAL_PANTS },
    outer: { sub: 'jacket', kw: /coach|windbreaker|nylon|harrington|track/i, fam: ['black', 'navy', 'olive', 'brown', 'green', 'burgundy'] },
    shoes: { sub: 'sneakers', kw: VANS, fam: ['black', 'white', 'navy', 'burgundy', 'green'] },
    acc: [{ sub: 'cap', fam: ['black', 'navy', 'cream', 'brown'] }, { sub: 'socks', fam: ['white', 'grey'] }],
    captions: ['skate ved Fælledparken', 'gåtur rundt om søerne', 'hverdagsuniform'] },
  { id: 'knit-wide', style: 'clean', name: 'Strik og vide bukser',
    bottom: { sub: 'trousers', kw: /wide|relaxed|pleat|twill|chef|canvas/i, fam: ['cream', 'beige', 'brown', 'grey', 'navy'], brand: /service works|palmes|pop trading|norse|aimé leon dore|arte/i },
    outer: { sub: 'knit', kw: /cable|crew|cardigan|wool|lambswool|mohair/i, fam: ['cream', 'brown', 'navy', 'grey', 'green', 'burgundy'] },
    shoes: { sub: 'sneakers', kw: LOW_SNEAKER, fam: ['black', 'white', 'brown', 'cream'] },
    acc: [{ sub: 'cap', fam: ['brown', 'navy', 'cream', 'beige'] }, { sub: 'bag', kw: /tote|canvas|shoulder/i }],
    captions: ['vinbar på Vesterbro', 'galleri-runde i indre by', 'fredag efter arbejde'] },
  { id: 'bomber-wide', style: 'casual', name: 'Bomber og wide jeans',
    bottom: { sub: 'jeans', kw: /baggy|wide|loose|skate|relaxed|90s/i, fam: ['denim_light', 'denim_mid', 'black'], brand: CASUAL_PANTS },
    outer: { sub: 'jacket', kw: /bomber|varsity|blouson|ma-1|flight/i, fam: ['black', 'brown', 'navy', 'olive', 'burgundy'] },
    shoes: { sub: 'sneakers', kw: VANS, fam: ['black', 'white', 'cream'] },
    acc: [{ sub: 'cap', fam: ['black', 'navy', 'cream', 'brown'] }, { sub: 'sunglasses' }],
    captions: ['fredagsbar', 'koncert på Vega', 'hverdagsuniform'] },
  { id: 'workjacket-jeans', style: 'casual', name: 'Workjakke og jeans',
    bottom: { sub: 'jeans', kw: /loose|baggy|relaxed|carpenter|wide|straight/i, fam: ['denim_mid', 'denim_light', 'black'], brand: CASUAL_PANTS },
    outer: { sub: 'jacket', kw: /detroit|chore|work|canvas|carpenter|trucker|denim/i, fam: ['brown', 'tan', 'black', 'beige', 'olive'] },
    shoes: { sub: 'sneakers', kw: VANS, fam: ['black', 'white', 'brown'] },
    acc: [{ sub: 'cap', fam: ['brown', 'black', 'cream', 'navy'] }, { sub: 'bag', kw: /tote|canvas/i }],
    captions: ['morgen-espresso', 'weekend på Refshaleøen', 'loppemarked på Ravnsborggade'] },
  { id: 'track', style: 'sporty', name: 'Track jacket og runners',
    bottom: { sub: 'jeans', kw: /baggy|loose|wide|relaxed/i, fam: ['denim_light', 'denim_mid', 'black'], brand: CASUAL_PANTS },
    outer: { sub: 'jacket', kw: /track|firebird|windbreaker|nylon|anorak/i, fam: ['black', 'navy', 'grey', 'brown', 'green', 'burgundy'] },
    shoes: { sub: 'sneakers', kw: RUNNER, fam: ['grey', 'white', 'black', 'cream'] },
    acc: [{ sub: 'cap', fam: ['black', 'navy', 'grey', 'white', 'cream'] }, { sub: 'sunglasses' }],
    captions: ['padel og espresso', 'gåtur på Islands Brygge', 'fredagsbar'] },
  { id: 'mono', style: 'clean', name: 'Sort og grå',
    bottom: { sub: 'trousers', kw: /wide|relaxed|baggy|loose|chef|work/i, fam: ['black', 'charcoal', 'grey'], brand: CASUAL_PANTS },
    outer: { sub: 'hoodie', kw: /zip|hood|heavyweight/i, fam: ['black', 'charcoal', 'grey'] },
    shoes: { sub: 'sneakers', kw: VANS, fam: ['black', 'white'] },
    acc: [{ sub: 'cap', fam: ['black', 'grey', 'charcoal'] }, { sub: 'sunglasses' }],
    captions: ['vinbar på Vesterbro', 'koncert på Vega', 'hverdagsuniform'] }
];

// Shoes and accessories may always be neutral, whatever the tee.
export const ALWAYS_OK = { shoes: ['white', 'black', 'cream', 'brown', 'tan', 'grey', 'beige', 'burgundy'], acc: ['black', 'brown', 'tan', 'cream', 'white', 'beige', 'grey', 'navy'] };

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
    if (it.family && !colourOk(cat, it.family, tee)) continue;
    if (it.family && avoidFam.includes(it.family) && !it.family.startsWith('denim')) continue;
    let s = Math.random() * 1.5;
    if (spec.kw && spec.kw.test(it.kw || it.title)) s += 5;
    if (spec.brand && spec.brand.test(`${it.brand} ${it.source}`)) s += 3;
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
