// Dev only: renders the drawn items as fake "pack shots" so the pipeline can be tested offline.
import { createRequire } from 'module'; const { chromium } = createRequire(process.env.NODE_PATH + '/')('playwright');
import fs from 'fs';
const ill = await import('../lib/illustrations.js');
const subs = { bottom: ['jeans','trousers'], outer: ['coat','jacket','overshirt','knit'], shoes: ['sneakers','loafers','boots'], acc: ['cap','beanie','scarf','bag','sunglasses','socks'] };
const fams = ['black','navy','brown','tan','cream','beige','grey','olive','denim_dark','denim_mid','denim_light','burgundy','white','charcoal','green','mustard'];
const b = await chromium.launch(); const p = await b.newPage();
const items = []; let n = 0;
for (const [cat, list] of Object.entries(subs)) for (const sub of list) for (let k = 0; k < 6; k++) {
  const r = ill.illustration(sub, fams);
  const bgc = k % 3 === 0 ? '#f2f2f2' : '#ffffff';
  const busy = k === 5; // a "lifestyle" photo that should be rejected
  await p.setContent(`<body style="margin:0;background:${busy ? 'linear-gradient(45deg,#6a8,#c84,#48c)' : bgc}"><div style="width:800px;height:1000px;display:grid;place-items:center">${r.svg.replace('<svg ', '<svg style="max-width:620px;max-height:760px;width:620px;height:auto" ')}</div></body>`);
  const file = `/mock/p${n}.jpg`; await p.locator('div').first().screenshot({ path: 'public' + file, type: 'jpeg', quality: 88 });
  const img2 = `/mock/p${n}b.jpg`; if (busy) fs.copyFileSync('public' + file, 'public' + img2);
  items.push({ id: 'mock' + n, source: 'Testshop', brand: ['Norse Projects','Les Deux','Wood Wood','Adidas','New Balance','Soulland'][n % 6], title: `${r.label} test ${n}`, color: '', url: 'https://example.com/p' + n, price: 499 + n, currency: 'DKK', images: [file], cat, sub, gender: 'unisex', family: k % 2 ? r.family : null });
  n++;
}
await b.close();
fs.writeFileSync('lib/mock.json', JSON.stringify({ at: new Date().toISOString(), sources: [{ name: 'Testshop', kind: 'shop', count: items.length, error: null }], items }));
console.log('mock items', items.length);
