import { getCatalog, imageHosts } from '../../../lib/catalog';
export const dynamic = 'force-dynamic';

// Same-origin image proxy, so product photos can be cut out and exported from a canvas.
// Only hosts that appear in the current catalogue are allowed.
export async function GET(req) {
  const u = new URL(req.url).searchParams.get('u');
  let target;
  try { target = new URL(u); } catch { return new Response('bad url', { status: 400 }); }
  if (target.protocol !== 'https:') return new Response('https only', { status: 400 });
  const hosts = imageHosts(await getCatalog());
  if (!hosts.has(target.hostname)) return new Response('host not allowed', { status: 403 });
  if (target.hostname === 'cdn.shopify.com' || target.pathname.includes('/cdn/shop/')) target.searchParams.set('width', '900');
  const r = await fetch(target, { headers: { 'user-agent': 'Mozilla/5.0 BacioOutfitBot' } });
  const type = r.headers.get('content-type') || '';
  if (!r.ok || !type.startsWith('image/')) return new Response('not an image', { status: 502 });
  return new Response(r.body, { headers: { 'content-type': type, 'cache-control': 'public, max-age=86400, s-maxage=604800, immutable' } });
}
