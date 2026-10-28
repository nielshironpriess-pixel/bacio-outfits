// Shops the app pulls products from.
// Shopify stores expose a public catalogue at /products.json. Stores that are not on
// Shopify (or block it) just show 0 products on /api/status and are skipped.
// Add more with the SHOPIFY_STORES env var on Vercel: "domain|Navn,domain2|Navn2".
export const SHOPIFY_STORES = [
  { domain: 'www.norseprojects.com', name: 'Norse Projects' },
  { domain: 'lesdeux.com', name: 'Les Deux' },
  { domain: 'www.woodwood.com', name: 'Wood Wood' },
  { domain: 'www.soulland.com', name: 'Soulland' },
  { domain: 'foretclothing.com', name: 'Forét' },
  { domain: 'www.mfpen.com', name: 'mfpen' },
  { domain: 'kith.com', name: 'Kith' },
  { domain: 'bdgastore.com', name: 'Bodega' },
  { domain: 'cncpts.com', name: 'Concepts' },
  { domain: 'www.drolededemonsieur.com', name: 'Drôle de Monsieur' },
  { domain: 'www.aimeleondore.com', name: 'Aimé Leon Dore' },
  { domain: 'www.buckmason.com', name: 'Buck Mason' },
  { domain: 'www.taylorstitch.com', name: 'Taylor Stitch' },
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
