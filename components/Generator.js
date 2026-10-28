'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import JSZip from 'jszip';
import { TEES, teeById, STYLES } from '../lib/outfit';
import { BGS, buildOutfit, renderSlide, slideBlob } from '../lib/render';

const SLOT_NAMES = { outer: 'Overdel', bottom: 'Bukser', shoes: 'Sko', acc0: 'Ur', acc1: 'Cap' };

function SlideCanvas({ slide, scale, opts, label }) {
  const ref = useRef(null);
  useEffect(() => { if (ref.current && slide) renderSlide(ref.current, slide, scale, opts); }, [slide, scale, opts]);
  return <canvas ref={ref} className="view" width={Math.round(1080 * scale)} height={Math.round(1920 * scale)} role="img" aria-label={label} />;
}

function Products({ o }) {
  return (
    <ul className="prods">
      <li><span className="k">Tee</span><span>BACIO {teeById(o.tee).name}</span></li>
      {Object.entries(o.slots).map(([k, s]) => (
        <li key={k}><span className="k">{SLOT_NAMES[k]}</span>
          {s.kind === 'product'
            ? <a href={s.item.url} target="_blank" rel="noopener noreferrer" title={`${s.item.brand} ${s.item.title}`}>{s.item.brand} · {s.item.title}{s.item.price ? ` · ${Math.round(s.item.price)} ${s.item.currency || ''}` : ''}</a>
            : <span title="Tegnet, intet produkt fundet">{s.ill.label} (tegnet)</span>}
        </li>
      ))}
    </ul>
  );
}

async function save(blob, name) {
  const url = URL.createObjectURL(blob); const a = document.createElement('a');
  a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 4000);
}

export default function Generator() {
  const [pool, setPool] = useState(null);
  const [info, setInfo] = useState(null);
  const [err, setErr] = useState(null);
  const [style, setStyle] = useState('alle');
  const [tees, setTees] = useState(TEES.map(t => t.id));
  const [bg, setBg] = useState('sand');
  const [labels, setLabels] = useState(true);
  const [extra, setExtra] = useState(true);
  const [cover, setCover] = useState('');
  const [slides, setSlides] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [busy, setBusy] = useState('');
  const [fontsOk, setFontsOk] = useState(0);
  const opts = useMemo(() => ({ bg, labels, fontsOk }), [bg, labels, fontsOk]);

  async function loadPool(refresh) {
    setErr(null); setBusy('Henter produkter fra shops…');
    try {
      const r = await fetch('/api/products' + (refresh ? '?refresh=1' : ''));
      const j = await r.json(); setPool(j.items); setInfo({ at: j.at, sources: j.sources, n: j.items.length });
      return j.items;
    } catch (e) { setErr('Kunne ikke hente produkter. Outfits bruger tegnede varer indtil videre.'); setPool([]); return []; }
    finally { setBusy(''); }
  }

  async function generate(p = pool, ids = tees, st = style) {
    if (!p) return;
    const used = new Set();
    const list = ids.length === 1 ? Array.from({ length: 6 }, () => ids[0]) : ids;
    const keys = Object.keys(STYLES);
    const out = [];
    for (let i = 0; i < list.length; i++) {
      setBusy(`Bygger outfit ${i + 1} af ${list.length}…`);
      const s = ids.length === 1 && st === 'alle' ? keys[i % keys.length] : st;
      out.push(await buildOutfit(p, list[i], s, used));
    }
    setSlides(out.map((o, i) => ({ kind: 'outfit', o, num: `${i + 1}/${out.length}` })));
    setBusy('Bygger outfit-væg…');
    const gal = [];
    for (let i = 0; i < 12; i++) gal.push(await buildOutfit(p, ids[i % ids.length], st, used));
    setGallery(gal); setBusy('');
  }

  useEffect(() => {
    Promise.race([Promise.all([document.fonts.load('800 60px "Bricolage Grotesque"'), document.fonts.load('600 30px "Bricolage Grotesque"'), document.fonts.load('700 60px "Gluten"')]), new Promise(r => setTimeout(r, 3000))])
      .finally(() => setFontsOk(1));
    loadPool(false).then(p => generate(p));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const outfits = slides.map(s => s.o);
  const allSlides = useMemo(() => {
    const l = [...slides];
    if (extra && slides.length) {
      const used = [...new Set(slides.map(s => s.o.tee))];
      l.unshift({ kind: 'cover', tees: used, title: cover.trim() || `${slides.length} outfits til efteråret i kbh` });
      l.push({ kind: 'cta', tees: slides.map(s => s.o.tee) });
    }
    return l;
  }, [slides, extra, cover]);

  const caption = useMemo(() => {
    if (!outfits.length) return '';
    const lines = outfits.map((o, i) => {
      const p = Object.values(o.slots).filter(s => s.kind === 'product').map(s => `${s.item.brand} ${s.item.title}`);
      return `${i + 1}. BACIO ${teeById(o.tee).name} tee${p.length ? ' + ' + p.slice(0, 3).join(' + ') : ''}`;
    });
    return `${cover.trim() || `${outfits.length} outfits til efteråret i kbh`} 🍂\n\n${lines.join('\n')}\n\nHvilket nummer tager du? 👇\n\n#bacio #københavn #cphstyle #outfitinspo #efterår #ootd #herremode #streetstyle`;
  }, [outfits, cover]);

  async function reroll(i) {
    setBusy('Blander outfit…');
    const used = new Set(slides.flatMap(s => Object.values(s.o.slots).filter(x => x.kind === 'product').map(x => x.item.id)));
    const o = await buildOutfit(pool || [], slides[i].o.tee, style, used);
    setSlides(s => s.map((x, j) => j === i ? { ...x, o } : x)); setBusy('');
  }
  async function more() {
    setBusy('Bygger flere outfits…'); const used = new Set(); const add = [];
    for (let i = 0; i < 12; i++) add.push(await buildOutfit(pool || [], tees[(gallery.length + i) % tees.length], style, used));
    setGallery(g => [...g, ...add]); setBusy('');
  }
  async function saveAll() {
    setBusy('Laver zip med slides…'); const z = new JSZip();
    for (let i = 0; i < allSlides.length; i++) z.file(`bacio-slide-${String(i + 1).padStart(2, '0')}.png`, await slideBlob(allSlides[i], opts));
    z.file('caption.txt', caption);
    await save(await z.generateAsync({ type: 'blob' }), 'bacio-tiktok-slides.zip'); setBusy('');
  }
  const toggleTee = id => setTees(cur => cur.includes(id) ? (cur.length === 1 ? cur : cur.filter(x => x !== id)) : TEES.map(t => t.id).filter(x => x === id || cur.includes(x)));
  const nShops = info ? info.sources.filter(s => s.count > 0).length : 0;

  return (
    <div className="wrap">
      <header>
        <div className="brand">BACIO</div>
        <h1>Outfit-generator til TikTok</h1>
        <p className="lede">Simple casual outfits rundt om jeres tees: en enkel hoodie eller et overshirt, bukser fra bl.a. Palmes, Polar, Palace og Service Works, Vans, et ur og nogle gange en cap. Kun rigtige herre-produkter og rene produktbilleder. Kataloget opdateres automatisk hver 6. time.</p>
      </header>

      <section className="panel" aria-label="Indstillinger">
        <div className="row"><span className="lab">Stil</span><div className="chips">
          {[['alle', 'Bland alle stile'], ...Object.entries(STYLES).map(([k, v]) => [k, v.name])].map(([k, n]) =>
            <button key={k} type="button" className="chip" aria-pressed={style === k} onClick={() => setStyle(k)}>{n}</button>)}
        </div></div>
        <div className="row"><span className="lab">Trøjer</span><div className="chips">
          {TEES.map(t => <button key={t.id} type="button" className="chip tee" aria-pressed={tees.includes(t.id)} onClick={() => toggleTee(t.id)} title={`${t.name} · ${t.col}`}>
            <img src={`/tees/${t.id}.webp`} alt={`${t.name} (${t.col})`} /></button>)}
        </div></div>
        <div className="row"><span className="lab">Baggrund</span><div className="chips">
          {Object.entries(BGS).map(([k, v]) => <button key={k} type="button" className="sw" aria-pressed={bg === k} onClick={() => setBg(k)} style={{ background: v.bg }} title={v.n} aria-label={`Baggrund: ${v.n}`} />)}
        </div></div>
        <div className="row"><label className="lab" htmlFor="cover">Forside-tekst</label><input id="cover" type="text" value={cover} onChange={e => setCover(e.target.value)} placeholder="fx 7 outfits til efteråret i kbh" /></div>
        <div className="row"><span className="lab">Tekst</span><div className="actions">
          <label className="toggle"><input type="checkbox" checked={labels} onChange={e => setLabels(e.target.checked)} /> Vis brand og navn på slides</label>
          <label className="toggle"><input type="checkbox" checked={extra} onChange={e => setExtra(e.target.checked)} /> Forside og afslutning</label>
        </div></div>
        <div className="actions">
          <button className="btn primary" disabled={!!busy || !pool} onClick={() => generate()}>Lav nye outfits</button>
          <button className="btn" disabled={!!busy} onClick={() => loadPool(true).then(p => generate(p))}>Hent nyt katalog</button>
          <span className="status" aria-live="polite">{busy || (info ? `${info.n} produkter fra ${nShops} shops · opdateret ${new Date(info.at).toLocaleString('da-DK', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}` : '')}{err ? ` · ${err}` : ''}</span>
          <a className="status" href="/api/status" target="_blank" rel="noopener">Se kilder</a>
        </div>
      </section>

      <section className="sec">
        <div className="sec-head">
          <div><h2>TikTok-slides · 9:16</h2><p>Klar til en foto-slideshow i 1080×1920. Under hvert slide står produkterne med links. Tryk “Bland” for et nyt outfit på netop det slide.</p></div>
          <button className="btn" disabled={!!busy || !slides.length} onClick={saveAll}>Gem alle slides (.zip)</button>
        </div>
        <div className="strip">
          {!allSlides.length && Array.from({ length: 5 }, (_, i) => <div key={i} className="slide"><div className="ph">{busy || 'Bygger outfits…'}</div></div>)}
          {allSlides.map((sl, i) => {
            const oi = sl.kind === 'outfit' ? slides.indexOf(sl) : -1;
            return (
              <div key={i} className="slide">
                <SlideCanvas slide={sl} scale={0.5} opts={opts} label={sl.kind === 'outfit' ? `Outfit med ${teeById(sl.o.tee).name} tee` : sl.kind === 'cover' ? 'Forside' : 'Afslutning'} />
                <div className="meta"><span>{String(i + 1).padStart(2, '0')} · {sl.kind === 'cover' ? 'forside' : sl.kind === 'cta' ? 'afslutning' : teeById(sl.o.tee).name}</span>
                  <span className="actions" style={{ gap: 6 }}>
                    {oi >= 0 && <button className="btn sm" disabled={!!busy} onClick={() => reroll(oi)}>Bland</button>}
                    <button className="btn sm" onClick={async () => save(await slideBlob(sl, opts), `bacio-slide-${String(i + 1).padStart(2, '0')}.png`)}>Gem</button>
                  </span></div>
                {sl.kind === 'outfit' && <Products o={sl.o} />}
              </div>
            );
          })}
        </div>
      </section>

      <section className="sec">
        <div className="sec-head"><div><h2>Caption til opslaget</h2><p>Lister produkterne i samme rækkefølge som slides. Ligger også i zip-filen.</p></div>
          <button className="btn" onClick={() => navigator.clipboard?.writeText(caption)}>Kopiér</button></div>
        <textarea readOnly value={caption} aria-label="Caption" />
      </section>

      <section className="sec">
        <div className="sec-head">
          <div><h2>Alle outfits</h2><p>En væg af looks med rigtige produkter. Hvert kort kan gemmes som sit eget 9:16 billede eller lægges ind i slideshowet.</p></div>
          <button className="btn" disabled={!!busy || !pool} onClick={more}>Vis 12 flere</button>
        </div>
        <div className="grid">
          {gallery.map((o, i) => (
            <div key={i} className="card">
              <SlideCanvas slide={{ kind: 'outfit', o }} scale={1 / 3} opts={opts} label={`Outfit med ${teeById(o.tee).name} tee`} />
              <b>{teeById(o.tee).name} · {o.look}</b>
              <Products o={o} />
              <div className="actions" style={{ gap: 6 }}>
                <button className="btn sm" onClick={async () => save(await slideBlob({ kind: 'outfit', o }, opts), `bacio-outfit-${i + 1}.png`)}>Gem</button>
                <button className="btn sm" onClick={() => setSlides(s => [...s, { kind: 'outfit', o }].map((x, j, a) => ({ ...x, num: `${j + 1}/${a.length}` })))}>Brug som slide</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
