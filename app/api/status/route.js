import { getCatalog } from '../../../lib/catalog';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET(req) {
  const pool = await getCatalog();
  const q = new URL(req.url).searchParams.get('q');
  if (q) {
    const re = new RegExp(q, 'i'); const hits = pool.items.filter(it => re.test(`${it.brand} ${it.kw || it.title}`));
    return new Response(`${hits.length} produkter matcher "${q}"\n` + hits.slice(0, 60).map(it => `${it.source} | ${it.sub} | ${it.brand} | ${it.title} | ${it.family || '?'}`).join('\n'), { headers: { 'content-type': 'text/plain; charset=utf-8' } });
  }
  const byCat = {};
  for (const it of pool.items) { const k = `${it.cat}/${it.sub}`; byCat[k] = (byCat[k] || 0) + 1; }
  return Response.json({ updated: pool.at, total: pool.items.length, sources: pool.sources, categories: byCat });
}
