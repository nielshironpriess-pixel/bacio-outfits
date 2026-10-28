# Bacio outfit-generator

Laver TikTok-slides (9:16, 1080×1920), hvor en Bacio-tee altid er toppen, og resten af outfittet er rigtige produkter hentet fra webshops, valgt efter farve og efterårets trends i København.

## Sådan kører den
- **Vercel:** importer repoet på vercel.com/new. Der skal ikke sættes noget op.
- Kataloget hentes fra shops i `lib/sources.config.js` og opdateres hver 6. time. Se hvilke shops der virker på `/api/status`.

## Indstillinger (Vercel → Settings → Environment Variables)
| Navn | Hvad |
|---|---|
| `SHOPIFY_STORES` | Ekstra Shopify-shops: `domæne\|Navn,domæne2\|Navn2` |
| `SHOPIFY_ONLY` | `1` = brug kun shops fra `SHOPIFY_STORES` |
| `FEED_URLS` | Affiliate-feeds (Partner-ads XML eller Awin CSV), kommasepareret |
| `IMG_HOSTS` | Ekstra billed-domæner, hvis et feed bruger et nyt billed-CDN |

## Lokalt
```
npm install
npm run dev
```
Testdata uden internet: `node scripts/mock.mjs`, derefter `MOCK=1 npm run dev`.
