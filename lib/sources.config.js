// Shops the app pulls products from.
// Shopify stores expose a public catalogue at /products.json. Stores that are not on
// Shopify (or block it) just show 0 products on /api/status and are skipped.
// Add more with the SHOPIFY_STORES env var on Vercel: "domain|Navn,domain2|Navn2".
export const SHOPIFY_STORES = [
  // Scandinavian menswear
  { domain: 'www.norseprojects.com', name: 'Norse Projects' },
  { domain: 'www.soulland.com', name: 'Soulland' },
  { domain: 'www.mfpen.com', name: 'mfpen' },
  { domain: 'www.nn07.com', name: 'NN07' },
  { domain: 'www.hansengarments.com', name: 'Hansen Garments' },
  { domain: 'www.myrqvist.com', name: 'Myrqvist' },
  // Streetwear / multi-brand (clean product shots)
  { domain: 'kith.com', name: 'Kith' },
  { domain: 'bdgastore.com', name: 'Bodega' },
  { domain: 'cncpts.com', name: 'Concepts' },
  { domain: 'www.stussy.com', name: 'Stüssy' },
  { domain: 'www.palaceskateboards.com', name: 'Palace' },
  { domain: 'www.colebuxton.com', name: 'Cole Buxton' },
  { domain: 'representclo.com', name: 'Represent' },
  { domain: 'undefeated.com', name: 'Undefeated' },
  { domain: 'shop.extrabutterny.com', name: 'Extra Butter' },
  { domain: 'packershoes.com', name: 'Packer' },
  // Classic / workwear
  { domain: 'www.aimeleondore.com', name: 'Aimé Leon Dore' },
  { domain: 'www.taylorstitch.com', name: 'Taylor Stitch' },
  { domain: 'www.kingsofindigo.com', name: 'Kings of Indigo' },
  { domain: 'www.universalworks.co.uk', name: 'Universal Works' },
  { domain: 'www.waxlondon.com', name: 'Wax London' },
  { domain: 'www.percivalclo.com', name: 'Percival' },
  // Loafers and boots
  { domain: 'www.blackstockandweber.com', name: 'Blackstock & Weber' },
  { domain: 'dukeanddexter.com', name: 'Duke & Dexter' },
  { domain: 'thursdayboots.com', name: 'Thursday Boots' },
  { domain: 'www.grenson.com', name: 'Grenson' }
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
