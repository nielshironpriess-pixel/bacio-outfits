import { getCatalog } from '../../../lib/catalog';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET() {
  const pool = await getCatalog();
  const byCat = {};
  for (const it of pool.items) { const k = `${it.cat}/${it.sub}`; byCat[k] = (byCat[k] || 0) + 1; }
  return Response.json({ updated: pool.at, total: pool.items.length, sources: pool.sources, categories: byCat });
}
