import { getCatalog } from '../../../lib/catalog';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// Slim list the browser needs to build outfits.
export async function GET(req) {
  const force = new URL(req.url).searchParams.get('refresh') === '1';
  const pool = await getCatalog({ force });
  const items = pool.items.map(({ id, source, brand, title, color, url, price, currency, images, cat, sub, gender, family, kw }) =>
    ({ id, source, brand, title, color, url, price, currency, images, cat, sub, gender, family, kw }));
  return Response.json({ at: pool.at, sources: pool.sources, items }, { headers: { 'cache-control': 's-maxage=1800, stale-while-revalidate=21600' } });
}
