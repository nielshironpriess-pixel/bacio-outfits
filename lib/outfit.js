// Outfit rules: the Bacio tees, which colours go with each, and the four styles.
export const TEES = [
  { id: 'blue', name: 'One Last Espresso', col: 'blå', pal: ['cream', 'beige', 'brown', 'tan', 'denim_dark', 'grey', 'charcoal', 'navy', 'white', 'black', 'olive', 'mustard'] },
  { id: 'red', name: 'Leisure Club', col: 'rød', pal: ['denim_light', 'denim_mid', 'denim_dark', 'black', 'cream', 'beige', 'navy', 'brown', 'white', 'grey', 'charcoal', 'tan'] },
  { id: 'navy', name: 'BA CIO', col: 'navy', pal: ['cream', 'beige', 'denim_light', 'denim_mid', 'grey', 'tan', 'brown', 'olive', 'white', 'black', 'mustard', 'green', 'charcoal'] },
  { id: 'olive', name: 'BACIO logo', col: 'oliven', pal: ['denim_dark', 'denim_light', 'denim_mid', 'black', 'cream', 'beige', 'brown', 'tan', 'navy', 'white', 'charcoal', 'mustard'] },
  { id: 'burgundy', name: 'Italia', col: 'bordeaux', pal: ['cream', 'beige', 'denim_light', 'denim_mid', 'charcoal', 'brown', 'tan', 'olive', 'navy', 'white', 'black', 'grey'] },
  { id: 'white_cafe', name: 'Café', col: 'hvid', pal: ['denim_dark', 'denim_mid', 'navy', 'beige', 'brown', 'grey', 'tan', 'green', 'burgundy', 'cream', 'charcoal', 'black', 'olive', 'white'] },
  { id: 'white_stools', name: 'Vinbar', col: 'hvid', pal: ['denim_mid', 'denim_dark', 'black', 'cream', 'brown', 'burgundy', 'navy', 'beige', 'charcoal', 'grey', 'tan', 'white', 'red'] }
];
export const teeById = id => TEES.find(t => t.id === id);

export const STYLES = {
  casual: { name: 'København casual', bottom: ['jeans', 'jeans', 'trousers'], outer: ['jacket', 'overshirt', 'knit'], shoes: ['sneakers'], acc: ['cap', 'bag', 'sunglasses', 'socks', 'beanie'],
    captions: ['søndag på Jægersborggade', 'kaffe på Værnedamsvej', 'gåtur rundt om søerne', 'brunch på Nørrebro', 'bagerkø lørdag morgen'] },
  yuppie: { name: 'Modern yuppie', bottom: ['trousers'], outer: ['coat', 'knit', 'jacket'], shoes: ['loafers', 'boots'], acc: ['scarf', 'bag', 'sunglasses', 'socks'],
    captions: ['middag i Kødbyen', 'vinbar på Vesterbro', 'galleri-runde i indre by', 'fredag efter arbejde', 'date night på Christianshavn'] },
  work: { name: 'Workwear', bottom: ['jeans', 'trousers'], outer: ['overshirt', 'jacket', 'knit'], shoes: ['boots', 'sneakers'], acc: ['beanie', 'cap', 'bag'],
    captions: ['loppemarked på Ravnsborggade', 'weekend på Refshaleøen', 'morgen-espresso', 'værkstedsdag', 'pladesnak i Kødbyen'] },
  sporty: { name: 'Retro sporty', bottom: ['jeans', 'trousers'], outer: ['jacket', 'knit'], shoes: ['sneakers'], acc: ['cap', 'sunglasses', 'bag', 'socks'],
    captions: ['fredagsbar', 'gåtur på Islands Brygge', 'koncert på Vega', 'hverdagsuniform', 'padel og espresso'] }
};

// Shoes and a few accessories may be black/white/neutral whatever the tee.
export const ALWAYS_OK = { shoes: ['white', 'black', 'cream', 'brown', 'tan', 'grey', 'beige'], acc: ['black', 'brown', 'tan', 'cream', 'white', 'beige', 'grey'] };

export const rnd = a => a[Math.floor(Math.random() * a.length)];
export function shuffle(a) { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; }

export function colourOk(cat, fam, tee, avoid = []) {
  if (!fam) return true; // unknown colour: the image check decides
  if (avoid.includes(fam) && !fam.startsWith('denim')) return false;
  return tee.pal.includes(fam) || (ALWAYS_OK[cat] || []).includes(fam);
}

export function candidates(pool, cat, sub, tee, gender, used, avoid) {
  const list = pool.filter(it => it.cat === cat && it.sub === sub && !used.has(it.id)
    && (gender === 'all' || it.gender === 'unisex' || it.gender === gender)
    && colourOk(cat, it.family, tee, avoid));
  // known colours first, otherwise random
  return shuffle(list).sort((a, b) => (b.family ? 1 : 0) - (a.family ? 1 : 0)).slice(0, 8);
}

export const label = s => s.kind === 'product'
  ? `${s.item.brand} · ${shortTitle(s.item)}`
  : s.ill.label;
export function shortTitle(it) {
  let t = it.title.replace(new RegExp(`^${(it.brand || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*`, 'i'), '').replace(/\s+[-–|]\s+.*$/, '');
  return t.length > 30 ? t.slice(0, 29) + '…' : t;
}
