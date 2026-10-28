// Shops the app pulls products from.
// Shopify stores expose a public catalogue at /products.json. Stores that are not on
// Shopify (or block it) just show 0 products on /api/status and are skipped.
// Add more with the SHOPIFY_STORES env var on Vercel: "domain|Navn,domain2|Navn2".
export const SHOPIFY_STORES = [
  // Casual / skate brands
  { domain: 'serviceworks.co', name: 'Service Works' },
  { domain: 'palmes.co', name: 'Palmes' },
  { domain: 'www.polarskateco.com', name: 'Polar Skate Co' },
  { domain: 'poptradingcompany.com', name: 'Pop Trading Company' },
  { domain: 'buttergoods.com', name: 'Butter Goods' },
  { domain: 'dimemtl.com', name: 'Dime' },
  { domain: 'www.gramicci.com', name: 'Gramicci' },
  { domain: 'arte-antwerp.com', name: 'Arte Antwerp' },
  { domain: 'www.stussy.com', name: 'Stüssy' },
  { domain: 'www.palaceskateboards.com', name: 'Palace' },
  { domain: 'lastresortab.com', name: 'Last Resort AB' },
  // Scandinavian
  { domain: 'www.norseprojects.com', name: 'Norse Projects' },
  { domain: 'www.soulland.com', name: 'Soulland' },
  { domain: 'www.mfpen.com', name: 'mfpen' },
  // Watches (pre-owned Rolex etc.)
  { domain: 'www.analogshift.com', name: 'Analog:Shift' },
  { domain: 'craftandtailored.com', name: 'Craft & Tailored' },
  { domain: 'www.ewcwatches.com', name: 'EWC' },
  // Multi-brand shops (Vans, Adidas, New Balance, Service Works …)
  { domain: 'goodhoodstore.com', name: 'Goodhood' },
  { domain: 'www.ccs.com', name: 'CCS' },
  { domain: 'kith.com', name: 'Kith' },
  { domain: 'bdgastore.com', name: 'Bodega' },
  { domain: 'cncpts.com', name: 'Concepts' },
  { domain: 'undefeated.com', name: 'Undefeated' },
  { domain: 'shop.extrabutterny.com', name: 'Extra Butter' },
  { domain: 'packershoes.com', name: 'Packer' },
  { domain: 'www.aimeleondore.com', name: 'Aimé Leon Dore' },
  { domain: 'www.universalworks.co.uk', name: 'Universal Works' },
  { domain: 'www.kingsofindigo.com', name: 'Kings of Indigo' }
];

export function storesFromEnv() {
  const extra = (process.env.SHOPIFY_STORES || '')
    .split(',').map(s => s.trim()).filter(Boolean)
    .map(s => { const [domain, name] = s.split('|'); return { domain: domain.trim(), name: (name || domain).trim() }; });
  const only = process.env.SHOPIFY_ONLY === '1';
  return only ? extra : [...SHOPIFY_STORES, ...extra];
}

// Affiliate product feeds (Partner-ads XML or Awin CSV). Comma separated URLs.
export function feedsFromEnv() {
  return (process.env.FEED_URLS || '').split(',').map(s => s.trim()).filter(Boolean);
}
