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
  yuppie: { name: 'Modern yuppie' },
  work: { name: 'Workwear' },
  sporty: { name: 'Retro sporty' }
};

const LOW_SNEAKER = /samba|spezial|gazelle|sl ?72|sl ?76|taekwondo|handball|campus|speedcat|onitsuka|mexico 66|tokuten|club c|court|old skool|bw army|army trainer|gat|achilles|stan smith/i;
const RUNNER = /1906|2002r|990|991|992|993|9060|860|1000|gel-|kayano|nimbus|vomero|xt-6|xt-4|acs|zoom|runner|trail/i;
const BOOT = /chelsea|chukka|desert|boot|støvle|clarks|wallabee/i;

// fam = colour families that fit the look. kw = words in the product name (preferred, not required).
export const RECIPES = [
  { id: 'suede-denim', style: 'casual', name: 'Ruskind og lys denim',
    bottom: { sub: 'jeans', kw: /straight|relaxed|loose|baggy|wide|90s|vintage|light|bleach/i, fam: ['denim_light', 'denim_mid'] },
    outer: { sub: 'jacket', kw: /suede|ruskind|nubuck/i, fam: ['brown', 'tan', 'beige'] },
    shoes: { sub: 'sneakers', kw: LOW_SNEAKER, fam: ['black', 'white', 'brown', 'cream'] },
    acc: [{ sub: 'cap', fam: ['navy', 'brown', 'beige', 'black', 'cream'] }, { sub: 'sunglasses' }],
    captions: ['søndag på Jægersborggade', 'kaffe på Værnedamsvej', 'brunch på Nørrebro'] },
  { id: 'detroit', style: 'work', name: 'Workwear-jakke og jeans',
    bottom: { sub: 'jeans', kw: /straight|relaxed|loose|carpenter|regular|wide/i, fam: ['denim_mid', 'denim_dark', 'black'] },
    outer: { sub: 'jacket', kw: /detroit|chore|work|canvas|carpenter|duck|michigan|trucker/i, fam: ['brown', 'tan', 'olive', 'black', 'beige'] },
    shoes: { sub: 'sneakers', kw: RUNNER, fam: ['grey', 'cream', 'beige', 'white', 'brown'] },
    acc: [{ sub: 'beanie', fam: ['brown', 'black', 'olive', 'navy', 'grey'] }, { sub: 'bag', kw: /tote|canvas/i }],
    captions: ['loppemarked på Ravnsborggade', 'weekend på Refshaleøen', 'morgen-espresso'] },
  { id: 'knit-pleats', style: 'yuppie', name: 'Strik og pressefolds',
    bottom: { sub: 'trousers', kw: /pleat|wool|tailor|trouser|wide|relaxed|flannel/i, fam: ['beige', 'brown', 'grey', 'cream', 'charcoal'] },
    outer: { sub: 'knit', kw: /cable|crew|wool|merino|cashmere|cardigan|lambswool/i, fam: ['cream', 'beige', 'brown', 'navy', 'grey'] },
    shoes: { sub: 'loafers', fam: ['brown', 'black', 'burgundy', 'tan'], alt: { sub: 'sneakers', kw: LOW_SNEAKER, fam: ['black', 'brown', 'white'] } },
    acc: [{ sub: 'socks', fam: ['white', 'cream', 'grey'] }, { sub: 'bag', kw: /leather|tote/i }],
    captions: ['vinbar på Vesterbro', 'middag i Kødbyen', 'fredag efter arbejde'] },
  { id: 'fleece-cargo', style: 'sporty', name: 'Fleece og cargo',
    bottom: { sub: 'trousers', kw: /cargo|parachute|nylon|utility/i, fam: ['black', 'olive', 'beige', 'grey', 'charcoal'] },
    outer: { sub: 'jacket', kw: /fleece|anorak|shell|nylon|gore|windbreaker|puffer|down|padded/i, fam: ['black', 'olive', 'grey', 'brown', 'charcoal', 'navy'] },
    shoes: { sub: 'sneakers', kw: RUNNER, fam: ['grey', 'black', 'beige', 'white'] },
    acc: [{ sub: 'cap', fam: ['black', 'grey', 'olive', 'navy'] }, { sub: 'bag', kw: /sling|cross|waist|shoulder|bum/i }],
    captions: ['gåtur på Islands Brygge', 'koncert på Vega', 'fredagsbar'] },
  { id: 'wax-boots', style: 'work', name: 'Voksjakke og støvler',
    bottom: { sub: 'jeans', kw: /straight|regular|selvedge|raw|rinse|indigo/i, fam: ['denim_dark', 'denim_mid'] },
    outer: { sub: 'jacket', kw: /wax|barn|field|bedale|harrington|hunting|country|waxed/i, fam: ['olive', 'brown', 'navy', 'tan'] },
    shoes: { sub: 'boots', kw: BOOT, fam: ['brown', 'tan', 'black'], alt: { sub: 'sneakers', kw: LOW_SNEAKER, fam: ['brown', 'black'] } },
    acc: [{ sub: 'scarf', fam: ['brown', 'navy', 'beige', 'olive', 'grey'] }, { sub: 'cap', fam: ['brown', 'olive', 'navy', 'beige'] }],
    captions: ['søndagstur i Dyrehaven', 'morgen-espresso', 'pladesnak i Kødbyen'] },
  { id: 'coat-loafer', style: 'yuppie', name: 'Frakke og loafers',
    bottom: { sub: 'trousers', kw: /wool|pleat|tailor|trouser|flannel|suit/i, fam: ['grey', 'charcoal', 'brown', 'navy', 'beige'] },
    outer: { sub: 'coat', kw: /wool|overcoat|car coat|mac|trench|balmacaan|topcoat/i, fam: ['tan', 'beige', 'charcoal', 'navy', 'brown', 'black'] },
    shoes: { sub: 'loafers', fam: ['black', 'brown', 'burgundy'], alt: { sub: 'boots', kw: BOOT, fam: ['black', 'brown'] } },
    acc: [{ sub: 'scarf', fam: ['grey', 'brown', 'beige', 'navy', 'cream'] }, { sub: 'bag', kw: /leather|brief|tote/i, fam: ['black', 'brown', 'tan'] }],
    captions: ['galleri-runde i indre by', 'date night på Christianshavn', 'middag i Kødbyen'] },
  { id: 'bomber-wide', style: 'casual', name: 'Bomber og wide jeans',
    bottom: { sub: 'jeans', kw: /baggy|wide|loose|skate|relaxed|90s/i, fam: ['denim_light', 'denim_mid', 'black'] },
    outer: { sub: 'jacket', kw: /bomber|varsity|blouson|ma-1|flight|leather/i, fam: ['black', 'brown', 'navy', 'olive', 'burgundy'] },
    shoes: { sub: 'sneakers', kw: LOW_SNEAKER, fam: ['black', 'white', 'cream'] },
    acc: [{ sub: 'cap', fam: ['black', 'navy', 'cream', 'brown'] }, { sub: 'sunglasses' }],
    captions: ['fredagsbar', 'koncert på Vega', 'hverdagsuniform'] },
  { id: 'quarterzip', style: 'casual', name: 'Quarter-zip og chinos',
    bottom: { sub: 'trousers', kw: /chino|cord|twill|cotton|relaxed/i, fam: ['beige', 'brown', 'navy', 'olive', 'cream'] },
    outer: { sub: 'knit', kw: /quarter|half[- ]zip|1\/4|zip/i, fam: ['brown', 'navy', 'grey', 'cream', 'green', 'olive'] },
    shoes: { sub: 'sneakers', kw: RUNNER, fam: ['grey', 'cream', 'beige', 'white', 'navy'] },
    acc: [{ sub: 'cap', fam: ['navy', 'brown', 'cream', 'beige', 'green'] }, { sub: 'socks', fam: ['white', 'grey', 'cream'] }],
    captions: ['padel og espresso', 'bagerkø lørdag morgen', 'gåtur rundt om søerne'] },
  { id: 'cord-overshirt', style: 'work', name: 'Fløjl og skjortejakke',
    bottom: { sub: 'trousers', kw: /cord|corduroy|fløjl/i, fam: ['brown', 'beige', 'olive', 'navy', 'cream'] },
    outer: { sub: 'overshirt', kw: /flannel|check|plaid|wool|overshirt|shirt jacket|cpo/i, fam: ['brown', 'olive', 'navy', 'grey', 'green', 'beige'] },
    shoes: { sub: 'boots', kw: /chukka|desert|wallabee|suede/i, fam: ['tan', 'brown', 'beige'], alt: { sub: 'sneakers', kw: LOW_SNEAKER, fam: ['brown', 'white', 'black'] } },
    acc: [{ sub: 'beanie', fam: ['brown', 'olive', 'navy', 'cream', 'grey'] }, { sub: 'bag', kw: /tote|canvas/i }],
    captions: ['kaffe og bøger', 'søndag på Jægersborggade', 'loppemarked på Ravnsborggade'] },
  { id: 'mono', style: 'yuppie', name: 'Sort og grå',
    bottom: { sub: 'trousers', kw: /wide|pleat|wool|relaxed|tailor/i, fam: ['black', 'charcoal', 'grey'] },
    outer: { sub: 'jacket', kw: /leather|wool|blouson|harrington|coach|bomber/i, fam: ['black', 'charcoal', 'grey'] },
    shoes: { sub: 'loafers', fam: ['black'], alt: { sub: 'sneakers', kw: LOW_SNEAKER, fam: ['black', 'white'] } },
    acc: [{ sub: 'cap', fam: ['black', 'grey', 'charcoal'] }, { sub: 'sunglasses' }],
    captions: ['vinbar på Vesterbro', 'date night på Christianshavn', 'koncert på Vega'] },
  { id: 'leather-denim', style: 'casual', name: 'Læderjakke og denim',
    bottom: { sub: 'jeans', kw: /straight|relaxed|loose|regular|wide/i, fam: ['denim_light', 'denim_mid', 'black', 'denim_dark'] },
    outer: { sub: 'jacket', kw: /leather|læder/i, fam: ['brown', 'black', 'tan'] },
    shoes: { sub: 'boots', kw: BOOT, fam: ['brown', 'black', 'tan'], alt: { sub: 'sneakers', kw: LOW_SNEAKER, fam: ['black', 'white'] } },
    acc: [{ sub: 'sunglasses' }, { sub: 'bag', fam: ['black', 'brown', 'tan'] }],
    captions: ['fredagsbar', 'middag i Kødbyen', 'hverdagsuniform'] },
  { id: 'track', style: 'sporty', name: 'Retro sporty',
    bottom: { sub: 'trousers', kw: /track|nylon|warm|parachute|sweat|jogger/i, fam: ['black', 'navy', 'grey', 'charcoal', 'brown'] },
    outer: { sub: 'jacket', kw: /track|windbreaker|nylon|anorak|coach|firebird/i, fam: ['black', 'navy', 'grey', 'brown', 'green', 'burgundy'] },
    shoes: { sub: 'sneakers', kw: RUNNER, fam: ['grey', 'white', 'black', 'cream'] },
    acc: [{ sub: 'cap', fam: ['black', 'navy', 'grey', 'white', 'cream'] }, { sub: 'sunglasses' }],
    captions: ['padel og espresso', 'gåtur på Islands Brygge', 'fredagsbar'] }
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
