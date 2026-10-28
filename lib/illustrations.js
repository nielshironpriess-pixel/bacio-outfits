// Drawn fallback items, used when no real product fits a slot.
/* ---------- colours ---------- */
const C={
  denim_dark:['#2b3752','mørk denim'], denim_mid:['#4d6488','blå denim'], denim_light:['#93a9c3','lys denim'],
  black:['#1f1f21','sort'], chocolate:['#4a3025','chokoladebrun'], tobacco:['#8a5a36','tobaksbrun'], camel:['#b68b5d','camel'],
  cream:['#e8e0cf','creme'], oat:['#d6cab3','havre'], stone:['#bdb2a0','sten'], charcoal:['#3a3b3f','koksgrå'], grey:['#8e8f90','grå'],
  olive:['#5d6343','oliven'], khaki:['#a39a76','khaki'], navy:['#25304a','navy'], burgundy:['#5e2331','bordeaux'],
  forest:['#2f4a3a','skovgrøn'], mustard:['#c4952e','sennep'], white:['#f3f2ee','hvid'], silver:['#c4c7cb','sølv']
};
const op=k=>({k,n:C[k][1],c:C[k][0]});
const ops=(...ks)=>ks.map(op);

function sh(hex,a){let n=parseInt(hex.slice(1),16),r=n>>16,g=n>>8&255,b=n&255;const t=Math.abs(a),f=a<0?0:255;
  r=Math.round(r+(f-r)*t);g=Math.round(g+(f-g)*t);b=Math.round(b+(f-b)*t);return'#'+((1<<24)|(r<<16)|(g<<8)|b).toString(16).slice(1)}

/* ---------- svg helpers ---------- */
function svg(w,h,c,body,defs=''){return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${sh(c,.10)}"/><stop offset="1" stop-color="${sh(c,-.13)}"/></linearGradient><filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="7"/><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .22 0"/><feComposite in2="SourceGraphic" operator="in"/></filter><filter id="dk"><feComponentTransfer><feFuncR type="linear" slope=".84"/><feFuncG type="linear" slope=".84"/><feFuncB type="linear" slope=".84"/></feComponentTransfer></filter>${defs}</defs>${body}</svg>`}
const f=(d,fill,x='')=>`<path d="${d}" fill="${fill}" ${x}/>`;
const st=(d,col,w=2,dash)=>`<path d="${d}" fill="none" stroke="${col}" stroke-width="${w}" ${dash?`stroke-dasharray="${dash}"`:''} stroke-linecap="round" stroke-linejoin="round"/>`;
const tex=(d,o=1)=>`<path d="${d}" fill="#000" filter="url(#n)" opacity="${o}"/>`;
const ol=c=>`stroke="${sh(c,-.3)}" stroke-width="1.5"`;
const circ=(x,y,r,fill,x2='')=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" ${x2}/>`;

/* ---------- bottoms ---------- */
function dJeans(o){const c=o.c,s=o.k==='black'?'#77777a':'#c9a46c',d=sh(c,-.28),L='M38 52 H262 L284 520 H168 L150 190 L132 520 H16 Z';
  return svg(300,540,c,f(L,'url(#g)',ol(c))+tex(L)+f('M40 18 H260 L262 54 H38 Z',sh(c,-.04),ol(c))+
  f('M16 486 H132 V520 H16Z',sh(c,.08),ol(c))+f('M168 486 H284 V520 H168Z',sh(c,.08),ol(c))+
  st('M58 56 Q72 118 120 114',s,2,'5 4')+st('M242 56 Q228 118 180 114',s,2,'5 4')+st('M164 54 V156 Q162 176 150 186',s,2,'5 4')+
  st('M44 60 L22 482',s,2,'5 4')+st('M256 60 L278 482',s,2,'5 4')+
  [66,112,188,234].map(x=>f(`M${x} 12 h10 v46 h-10z`,sh(c,-.06),ol(c))).join('')+circ(150,36,7,'#b08a4a','stroke="#7a5a2a"'))}
function dTrousers(o,cord){const c=o.c,d=sh(c,-.3),l=sh(c,.16),L='M42 48 H258 L270 545 H160 L150 200 L140 545 H30 Z';
  const p=`<pattern id="p" width="8" height="10" patternUnits="userSpaceOnUse"><rect width="3" height="10" fill="${sh(c,-.2)}"/></pattern>`;
  return svg(300,560,c,f(L,'url(#g)',ol(c))+(cord?f(L,'url(#p)','opacity=".5"'):'')+tex(L)+
  (cord?'':st('M100 56 L88 540',l,3)+st('M103 56 L91 540',d,1.2)+st('M200 56 L212 540',l,3)+st('M197 56 L209 540',d,1.2))+
  f('M42 16 H258 V50 H42Z',sh(c,-.05),ol(c))+st('M112 50 L116 104',d,2)+st('M188 50 L184 104',d,2)+
  st('M50 54 L74 132',d,2)+st('M250 54 L226 132',d,2)+st('M162 50 V160 Q160 180 150 190',d,1.5)+
  [70,120,180,230].map(x=>f(`M${x} 12 h9 v42 h-9z`,sh(c,-.08),ol(c))).join('')+circ(160,33,5,d),cord?p:'')}
function dCargo(o){const c=o.c,d=sh(c,-.3),L='M44 50 H276 L292 515 Q292 545 266 545 H172 L160 205 L148 545 H54 Q28 545 28 515 Z';
  const pk=(x)=>f(`M${x} 262 H${x+70} V368 Q${x+70} 378 ${x+62} 378 H${x+8} Q${x} 378 ${x} 368Z`,'url(#g)',ol(c))+st(`M${x+6} 290 V370 H${x+64} V290`,sh(c,.18),1.4,'4 3')+f(`M${x-2} 250 H${x+72} V284 H${x-2}Z`,sh(c,-.07),ol(c))+circ(x+35,272,4,d);
  return svg(320,560,c,f(L,'url(#g)',ol(c))+tex(L)+f('M44 16 H276 V52 H44Z',sh(c,-.05),ol(c))+pk(32)+pk(218)+
  st('M54 424 Q96 434 140 424',d,1.6)+st('M180 424 Q224 434 266 424',d,1.6)+st('M56 56 L80 128',d,2)+st('M264 56 L240 128',d,2)+
  st('M170 52 V164 Q168 184 160 196',d,1.5)+circ(70,544,6,'#2a2a2a')+circ(250,544,6,'#2a2a2a'))}
function dChinos(o){const c=o.c,d=sh(c,-.3),L='M48 48 H252 L254 545 H158 L150 200 L142 545 H46 Z';
  return svg(300,560,c,f(L,'url(#g)',ol(c))+tex(L)+f('M46 504 H142 V545 H46Z',sh(c,.07),ol(c))+f('M158 504 H254 V545 H158Z',sh(c,.07),ol(c))+
  f('M48 16 H252 V50 H48Z',sh(c,-.05),ol(c))+st('M56 54 L76 128',d,2)+st('M244 54 L224 128',d,2)+st('M160 50 V158 Q158 178 150 188',d,1.5)+
  [74,122,178,226].map(x=>f(`M${x} 12 h9 v42 h-9z`,sh(c,-.08),ol(c))).join('')+circ(160,33,5,d))}

/* ---------- outerwear ---------- */
const BODY='M150 40 L200 28 Q230 46 260 28 L310 40 L420 100 Q440 110 442 140 L455 360 L400 368 L382 180 L378 480 L82 480 L78 180 L60 368 L5 360 L18 140 Q20 110 40 100 Z';
const COLL_L='M200 28 Q214 40 230 58 L206 128 L148 44 Z', COLL_R='M260 28 Q246 40 230 58 L254 128 L312 44 Z';
function jBase(c,texO=1){const d=sh(c,-.3);return f(BODY,'url(#g)',ol(c))+tex(BODY,texO)+st('M150 40 Q118 120 80 180',d,1.5)+st('M310 40 Q342 120 380 180',d,1.5)+st('M10 330 L62 338',d,2)+st('M450 330 L398 338',d,2)}
function btns(c,ys,x=240){const b=sh(c,-.45);return ys.map(y=>circ(x,y,7,b,`stroke="${sh(c,-.6)}"`)).join('')}
function dChore(o){const c=o.c,d=sh(c,-.3),s=sh(c,.2),pk=(x,y,w,h)=>f(`M${x} ${y} H${x+w} V${y+h} H${x}Z`,'url(#g)',ol(c))+st(`M${x+6} ${y+6} H${x+w-6} V${y+h-6} H${x+6}Z`,s,1.3,'4 3');
  return svg(460,500,c,jBase(c)+st('M230 58 V480',d,2)+pk(260,150,70,72)+pk(100,300,100,110)+pk(260,300,100,110)+
  f(COLL_L,sh(c,-.06),ol(c))+f(COLL_R,sh(c,-.06),ol(c))+btns(c,[100,160,220,280,340,400,450]))}
function dSuede(o){const c=o.c,d=sh(c,-.3),fl=(x)=>f(`M${x} 150 H${x+80} V206 H${x}Z`,'url(#g)',ol(c))+f(`M${x-4} 144 H${x+84} V170 H${x-4}Z`,sh(c,-.08),ol(c))+circ(x+40,160,5,sh(c,-.45));
  return svg(460,500,c,jBase(c,1.6)+st('M230 58 V480',d,2)+fl(100)+fl(280)+f('M82 448 H378 V480 H82Z',sh(c,-.06),ol(c))+
  f(COLL_L,sh(c,-.08),ol(c))+f(COLL_R,sh(c,-.08),ol(c))+btns(c,[110,180,250,320,390]))}
function dBarn(o){const c=o.c,cc=o.k==='chocolate'?'#2a1d17':'#4a3025',d=sh(c,-.3);
  const p=`<pattern id="p" width="6" height="10" patternUnits="userSpaceOnUse"><rect width="6" height="10" fill="${cc}"/><rect width="2" height="10" fill="${sh(cc,.18)}"/></pattern>`;
  const pk=(x)=>f(`M${x} 300 H${x+100} V410 H${x}Z`,'url(#g)',ol(c))+f(`M${x-4} 292 H${x+104} V322 H${x-4}Z`,sh(c,-.08),ol(c))+circ(x+50,308,5,'#b9a27a');
  return svg(460,500,c,jBase(c)+st('M230 58 V480',d,2)+pk(100)+pk(260)+f('M392 360 L456 352 L458 372 L394 380Z',cc)+f('M68 360 L4 352 L2 372 L66 380Z',cc)+
  f(COLL_L,'url(#p)')+f(COLL_R,'url(#p)')+btns(c,[110,170,230,290,350,410]).replaceAll(sh(c,-.45),'#b9a27a'),p)}
function dBomber(o){const c=o.c,d=sh(c,-.3),r=sh(c,-.22);
  const p=`<pattern id="p" width="6" height="10" patternUnits="userSpaceOnUse"><rect width="6" height="10" fill="${r}"/><rect width="2" height="10" fill="${sh(r,.15)}"/></pattern>`;
  return svg(460,500,c,jBase(c,.7)+f('M196 26 Q230 52 264 26 L270 46 Q230 78 190 46Z','url(#p)')+f('M82 450 H378 V482 H82Z','url(#p)')+
  f('M5 352 L60 360 L58 390 L3 382Z','url(#p)')+f('M455 352 L400 360 L402 390 L457 382Z','url(#p)')+
  st('M230 60 V450','#c9c9c9',4)+f('M404 150 H430 V198 H404Z',sh(c,-.06),ol(c))+st('M112 250 L150 330',d,2)+st('M348 250 L310 330',d,2),p)}
function dKnit(o){const c=o.c,d=sh(c,-.17),hl=sh(c,.14);let cab='';
  for(const x of [118,172,288,342])for(let y=70;y<440;y+=40){cab+=st(`M${x-12} ${y} C${x+12} ${y+12} ${x+12} ${y+26} ${x-12} ${y+40}`,d,5)+st(`M${x+12} ${y} C${x-12} ${y+12} ${x-12} ${y+26} ${x+12} ${y+40}`,hl,3)}
  const p=`<pattern id="p" width="8" height="10" patternUnits="userSpaceOnUse"><rect width="8" height="10" fill="${sh(c,-.05)}"/><rect width="3" height="10" fill="${sh(c,-.18)}"/></pattern>`;
  return svg(460,500,c,jBase(c,1.3)+cab+f('M82 446 H378 V480 H82Z','url(#p)')+f('M5 340 L62 348 L60 380 L3 372Z','url(#p)')+f('M455 340 L398 348 L400 380 L457 372Z','url(#p)')+
  f('M198 30 L220 160 L220 480 L240 480 L240 160 L262 30 L252 28 L230 140 L208 28Z','url(#p)')+btns(c,[200,260,320,380,430],230),p)}
function dCoat(o){const c=o.c,d=sh(c,-.3),B='M150 40 L200 28 Q230 46 260 28 L310 40 L420 100 Q440 110 442 140 L455 400 L400 408 L384 180 L384 620 L76 620 L76 180 L60 408 L5 400 L18 140 Q20 110 40 100 Z';
  return svg(460,640,c,f(B,'url(#g)',ol(c))+tex(B,.9)+st('M150 40 Q118 120 78 180',d,1.5)+st('M310 40 Q342 120 382 180',d,1.5)+st('M230 250 V620',d,2)+
  f('M200 28 L232 252 L196 196 L184 120 L156 110 L172 78 L152 42 Z',sh(c,-.06),ol(c))+f('M260 28 L228 252 L264 196 L276 120 L304 110 L288 78 L308 42 Z',sh(c,-.06),ol(c))+
  f('M100 420 H190 V444 H100Z',sh(c,-.07),ol(c))+f('M270 420 H360 V444 H270Z',sh(c,-.07),ol(c))+f('M282 200 H340 V210 H282Z',sh(c,-.07),ol(c))+
  st('M10 370 L62 378',d,2)+st('M450 370 L398 378',d,2)+btns(c,[300,380,460],246))}

/* ---------- shoes (pair) ---------- */
function pair(w,shoe){return svg(440,250,w.c||w.up||'#888',`<g transform="translate(36 2)" filter="url(#dk)">${shoe}</g><g transform="translate(0 72)">${shoe}</g>`)}
const UP='M14 142 L12 62 Q12 34 40 32 L110 36 Q140 40 160 62 L232 86 Q330 96 380 112 Q398 120 396 142 Z';
const SOLE='M8 140 H392 Q402 141 400 152 L396 162 Q393 169 384 169 H22 Q8 169 6 156 Z';
function dSneaker(o){const s=f(SOLE,o.so,`stroke="${sh(o.so,-.25)}"`)+f(UP,o.up,ol(o.up))+tex(UP,o.suede?1.4:.5)+
  f('M292 98 Q350 100 380 112 Q398 120 396 142 H300 Q284 120 292 98Z',sh(o.up,-.07))+
  [0,1,2].map(i=>{const x=176+i*26;return f(`M${x} 72 L${x+14} 76 L${x-24} 140 L${x-38} 140 Z`,o.ac)}).join('')+
  f('M12 64 L12 128 L36 128 L38 60Z',o.ac)+f('M30 36 Q74 60 134 46 Q120 36 100 36 L40 34 Z','#231d19','opacity=".85"')+
  [0,1,2,3].map(i=>st(`M${168+i*22} ${68+i*6} l10 -9`,o.lace||'#f4f2ee',4)).join('')+st('M10 150 H396',sh(o.so,-.2),1.5);
  return pair(o,s)}
function dGat(o){const g='#b9b4ac';const s=f(SOLE,'#b98a57',`stroke="#8a6238"`)+f(UP,'#f3f2ee',ol('#f3f2ee'))+
  f('M262 92 Q350 98 382 112 Q398 120 396 142 H262 Z',g)+tex('M262 92 Q350 98 382 112 Q398 120 396 142 H262 Z',1.3)+
  f('M12 62 L12 142 L86 142 Q76 100 62 36 L40 32 Q12 34 12 62Z',g)+f('M150 58 L242 86 L238 98 L146 70Z','#cfcac2')+
  f('M30 36 Q74 60 134 46 Q120 36 100 36 L40 34 Z','#2a2420','opacity=".85"')+[0,1,2,3].map(i=>st(`M${168+i*22} ${68+i*6} l10 -9`,'#f7f6f2',4)).join('');
  return pair({c:'#f3f2ee'},s)}
function dRunner(o){const U='M14 128 L14 58 Q14 34 42 32 L104 36 Q140 40 160 62 L232 82 Q330 92 382 110 Q400 118 398 128 Z';
  const s=f('M8 124 H394 Q404 126 402 146 L398 168 H18 Q6 168 6 150 Z','#f2f0ec',`stroke="#c9c6c0"`)+f('M8 152 H401 L398 168 H18 Q8 168 8 160Z','#7d8086')+
  f(U,o.up,ol(o.up))+tex(U,.6)+f('M14 98 Q120 58 222 82 L218 100 Q120 80 14 116Z',o.ac)+st('M60 116 Q170 70 330 100',sh(o.ac,-.15),10)+
  f('M300 94 Q360 96 384 110 Q398 117 398 128 H302 Z',sh(o.up,-.1))+f('M30 36 Q74 58 134 46 Q120 36 100 36 L40 34 Z','#2a2420','opacity=".85"')+
  [0,1,2,3].map(i=>st(`M${168+i*22} ${66+i*5} l10 -9`,'#f4f2ee',4)).join('');
  return pair(o,s)}
function dLoafer(o){const c=o.c,U='M14 136 L14 84 Q16 66 38 66 L150 72 Q222 72 300 84 Q376 96 394 120 Q399 130 394 136 Z';
  let lug='';for(let x=28;x<380;x+=30)lug+=f(`M${x} 160 h14 v8 h-14z`,'#0d0b0a');
  const s=f('M8 134 H392 Q403 136 401 148 L397 168 H20 Q8 168 8 152 Z','#1e1a18')+lug+f(U,'url(#g)',ol(c))+
  f('M30 68 Q112 100 214 74 Q132 84 38 66Z','#160f0c','opacity=".9"')+f('M208 76 Q258 68 304 86 L298 106 Q256 92 214 98 Z',sh(c,-.1),ol(c))+
  `<ellipse cx="256" cy="91" rx="15" ry="4" fill="${sh(c,-.45)}"/>`+st('M204 78 Q336 74 386 116',sh(c,.22),1.6,'4 3')+
  `<ellipse cx="335" cy="104" rx="40" ry="7" fill="#fff" opacity=".2"/>`+st('M14 134 H394','#3a302a',2);
  return pair(o,s)}
function dChukka(o){const c=o.c,U='M20 142 L22 22 Q24 8 42 8 L118 10 Q138 12 146 32 L172 84 Q282 94 370 112 Q395 120 394 142 Z';
  const s=f('M12 140 H396 V168 H18 Q10 168 12 152 Z','#c99e66',`stroke="#a07a48"`)+f(U,'url(#g)',ol(c))+tex(U,1.6)+
  st('M118 12 Q116 92 172 86',sh(c,-.28),1.6,'4 3')+[[148,38],[158,56],[166,74]].map(([x,y])=>circ(x,y,4,'#2a2420')).join('')+
  st('M148 38 L126 26',sh(c,-.4),3)+st('M158 56 L134 48',sh(c,-.4),3);
  return pair(o,s)}

/* ---------- accessories ---------- */
function dCap(o){const c=o.c,d=sh(c,-.3),Cr='M28 170 Q22 58 140 36 Q240 30 252 160 L252 172 Q140 182 28 172 Z';
  return svg(330,210,c,f(Cr,'url(#g)',ol(c))+tex(Cr)+f('M236 148 Q300 146 322 176 Q300 190 240 182 Z',sh(c,-.08),ol(c))+
  st('M140 36 Q154 100 150 176',d,1.5)+st('M86 50 Q96 110 90 176',d,1.5)+st('M200 44 Q212 110 210 176',d,1.5)+circ(140,37,7,sh(c,-.1))+st('M30 162 Q140 172 250 160',sh(c,.2),1.5,'4 3'))}
function dBeanie(o){const c=o.c,B='M34 236 L34 118 Q34 22 140 22 Q246 22 246 118 L246 236 Z',K='M26 150 H254 V238 Q140 246 26 238 Z';
  const p=`<pattern id="p" width="10" height="10" patternUnits="userSpaceOnUse"><rect width="4" height="10" fill="${sh(c,-.18)}"/></pattern>`;
  return svg(280,260,c,f(B,'url(#g)',ol(c))+f(B,'url(#p)','opacity=".45"')+f(K,sh(c,-.04),ol(c))+f(K,'url(#p)','opacity=".6"')+tex(B,1.2),p)}
function dScarf(o){const p=`<pattern id="ck" width="44" height="44" patternUnits="userSpaceOnUse"><rect width="44" height="44" fill="${o.a}"/><rect width="22" height="44" fill="${o.b}" opacity=".45"/><rect width="44" height="22" fill="${o.b}" opacity=".45"/><rect x="31" width="3" height="44" fill="${sh(o.a,.5)}" opacity=".5"/></pattern>`;
  let fr='';for(let x=68;x<=192;x+=8)fr+=st(`M${x} 480 l${(x%3)-1} 34`,o.a,3)+st(`M${x} 30 l${(x%3)-1} -24`,o.a,3);
  const S='M70 30 H190 L196 480 H64 Z';return svg(260,540,o.a,fr+f(S,'url(#ck)',ol(o.a))+tex(S,1.2)+f('M66 230 L194 262 L194 280 L66 248Z','#000','opacity=".09"'),p)}
function dTote(o){const c=o.c,d=sh(c,-.25),B='M28 120 H272 L264 360 H36 Z';
  return svg(300,380,c,st('M92 130 Q92 18 150 18 Q208 18 208 130',sh(c,-.1),16)+f(B,'url(#g)',ol(c))+tex(B,1.3)+st('M34 132 H266',d,1.5,'5 4'))}
function dBag(o){const c=o.c,B='M40 150 Q40 128 62 128 H238 Q260 128 260 150 V272 Q260 294 238 294 H62 Q40 294 40 272 Z',F='M40 150 Q40 128 62 128 H238 Q260 128 260 150 V214 Q150 238 40 214 Z';
  return svg(300,320,c,st('M58 150 Q150 -24 242 150',sh(c,-.1),10)+f(B,'url(#g)',ol(c))+f(F,sh(c,-.08),ol(c))+st('M48 150 Q48 136 62 136 H238 Q252 136 252 150 V208 Q150 230 48 208Z',sh(c,.2),1.3,'4 3')+
  f('M140 214 h20 v18 h-20z','#c8a96a','stroke="#8a6d38"')+`<ellipse cx="200" cy="160" rx="34" ry="6" fill="#fff" opacity=".18"/>`)}
function dGlasses(o){const L='M18 38 Q18 24 36 24 H128 Q144 24 142 44 L136 84 Q130 106 106 106 H58 Q30 106 24 84 Z';
  const d=`<linearGradient id="lg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a4038"/><stop offset="1" stop-color="#110f0d"/></linearGradient><pattern id="tt" width="18" height="18" patternUnits="userSpaceOnUse"><rect width="18" height="18" fill="#5a3a1e"/><circle cx="5" cy="5" r="4" fill="#2a170a"/><circle cx="14" cy="12" r="3" fill="#8a5a2a"/></pattern>`;
  const fr=o.k==='tort'?'url(#tt)':o.c,lens=f(L,'url(#lg)',`stroke="${fr}" stroke-width="10"`)+`<path d="M40 40 L70 40" stroke="#fff" stroke-width="5" opacity=".25" stroke-linecap="round"/>`;
  return svg(320,130,'#333',lens+`<g transform="translate(320 0) scale(-1 1)">${lens}</g>`+st('M142 46 Q160 30 178 46',fr,9),d)}
function dWatch(o){const c=o.c;let t='';for(let i=0;i<12;i++){const a=i*Math.PI/6;t+=st(`M${100+44*Math.sin(a)} ${190-44*Math.cos(a)} L${100+50*Math.sin(a)} ${190-50*Math.cos(a)}`,'#3a332c',i%3?1.5:3)}
  return svg(200,380,c,f('M70 6 H130 V374 H70Z','url(#g)',ol(c))+tex('M70 6 H130 V374 H70Z',1.2)+[300,322,344].map(y=>circ(100,y,3,sh(c,-.5))).join('')+f('M64 270 H136 V282 H64Z',sh(c,-.1))+
  f('M166 182 h10 v16 h-10z','#b8b4ab')+circ(100,190,66,'#d9d6cf','stroke="#a8a49c" stroke-width="3"')+circ(100,190,54,'#f2ede1')+t+st('M100 190 L100 154','#2a2420',4)+st('M100 190 L126 202','#2a2420',3)+circ(100,190,4,'#2a2420'))}
function dSocks(o){const c=o.c,S='M40 16 H124 V196 Q124 240 168 240 H236 Q276 240 276 276 Q276 306 242 306 H118 Q40 306 40 226 Z';
  const p=`<pattern id="p" width="9" height="10" patternUnits="userSpaceOnUse"><rect width="9" height="10" fill="${c}"/><rect width="3" height="10" fill="${sh(c,-.16)}"/></pattern>`;
  const one=f(S,'url(#g)',ol(c))+f('M40 16 H124 V128 H40Z','url(#p)')+f('M236 240 Q276 240 276 276 Q276 306 242 306 H222 V240Z',sh(c,-.08))+tex(S,1.1);
  return svg(320,320,c,`<g transform="translate(30 0)" filter="url(#dk)">${one}</g>`+`<g transform="translate(0 8)">${one}</g>`,p)}

/* ---------- catalogue ---------- */
const ITEMS={
  jeans:{cat:'bottom',n:'wide-leg jeans',d:dJeans,o:ops('denim_dark','denim_mid','denim_light','black')},
  trousers:{cat:'bottom',n:'pressefolds-bukser',d:o=>dTrousers(o,false),o:ops('chocolate','charcoal','grey','cream','stone','navy','olive','oat')},
  cords:{cat:'bottom',n:'fløjlsbukser',d:o=>dTrousers(o,true),o:ops('chocolate','olive','cream','tobacco','stone','navy','burgundy')},
  cargo:{cat:'bottom',n:'cargobukser',d:dCargo,o:ops('khaki','olive','black','stone','chocolate','charcoal')},
  chinos:{cat:'bottom',n:'chinos',d:dChinos,o:ops('stone','navy','cream','olive','khaki','oat')},
  chore:{cat:'outer',n:'chore coat',d:dChore,o:ops('olive','navy','chocolate','khaki','black','forest','tobacco')},
  suede:{cat:'outer',n:'ruskindsjakke',d:dSuede,o:ops('tobacco','chocolate','camel','burgundy')},
  barn:{cat:'outer',n:'barn jacket',d:dBarn,o:ops('camel','olive','khaki','stone','chocolate')},
  bomber:{cat:'outer',n:'bomberjakke',d:dBomber,o:ops('black','olive','navy','chocolate','burgundy')},
  knit:{cat:'outer',n:'kabelstrik-cardigan',d:dKnit,o:ops('cream','oat','chocolate','mustard','forest','grey','navy','burgundy')},
  coat:{cat:'outer',n:'uldfrakke',d:dCoat,o:ops('camel','charcoal','chocolate','navy','black')},
  sneaker:{cat:'shoes',n:'low-profile sneakers',d:dSneaker,o:[
    {k:'black',n:'sort/hvid',up:'#1f1f21',ac:'#f2f0ea',so:'#b98a57'},{k:'white',n:'hvid/grøn',up:'#f3f2ee',ac:'#2f5a3e',so:'#b98a57',lace:'#e9e6df'},
    {k:'chocolate',n:'brun ruskind',up:'#5a3a28',ac:'#efe7d6',so:'#b98a57',suede:1},{k:'burgundy',n:'bordeaux',up:'#5e2331',ac:'#efe7d6',so:'#efe9dd',suede:1},
    {k:'navy',n:'navy/hvid',up:'#25304a',ac:'#f2f0ea',so:'#efe9dd',suede:1},{k:'cream',n:'creme/brun',up:'#ece4d2',ac:'#4a3025',so:'#b98a57',lace:'#e6dccb'}]},
  gat:{cat:'shoes',n:'army trainers',d:dGat,o:[{k:'white',n:'hvid/grå'}],neutral:1},
  runner:{cat:'shoes',n:'retro runners',d:dRunner,o:[
    {k:'silver',n:'sølv/grå',up:'#c9ccd0',ac:'#8d9096',so:'#eee'},{k:'grey',n:'grå/navy',up:'#a7a9ac',ac:'#25304a',so:'#eee'},
    {k:'cream',n:'creme/brun',up:'#e8e0cf',ac:'#6a4a34',so:'#eee'},{k:'black',n:'sort/sølv',up:'#2a2a2c',ac:'#b9bcc0',so:'#eee'}]},
  loafer:{cat:'shoes',n:'chunky loafers',d:dLoafer,o:ops('chocolate','black','burgundy','tobacco')},
  chukka:{cat:'shoes',n:'ruskinds-chukka',d:dChukka,o:ops('tobacco','chocolate','stone','camel')},
  cap:{cat:'acc',n:'cap',d:dCap,o:ops('chocolate','navy','cream','burgundy','olive','black','forest','mustard','stone')},
  beanie:{cat:'acc',n:'hue',d:dBeanie,o:ops('chocolate','navy','cream','burgundy','olive','grey','oat','mustard','forest')},
  scarf:{cat:'acc',n:'ternet tørklæde',d:dScarf,o:[{k:'camel',n:'camel',a:'#b68b5d',b:'#4a3025'},{k:'navy',n:'navy',a:'#25304a',b:'#8a5a36'},{k:'burgundy',n:'bordeaux',a:'#5e2331',b:'#d6cab3'},{k:'forest',n:'grønt',a:'#2f4a3a',b:'#c4952e'},{k:'oat',n:'lyst',a:'#d6cab3',b:'#3a3b3f'},{k:'chocolate',n:'brunt',a:'#4a3025',b:'#c4952e'}]},
  tote:{cat:'acc',n:'mulepose',d:dTote,o:ops('cream','oat','black','olive','navy')},
  bag:{cat:'acc',n:'læder-crossbody',d:dBag,o:ops('chocolate','black','tobacco','burgundy')},
  glasses:{cat:'acc',n:'solbriller',d:dGlasses,o:[{k:'tort',n:'skildpadde'},{k:'black',n:'sorte',c:'#1b1b1c'}],neutral:1},
  watch:{cat:'acc',n:'vintage-ur',d:dWatch,o:ops('chocolate','black','tobacco'),neutral:1},
  socks:{cat:'acc',n:'ribstrikkede strømper',d:dSocks,o:ops('cream','grey','burgundy','forest','white','navy','oat')}
};

const KEYFAM={denim_dark:'denim_dark',denim_mid:'denim_mid',denim_light:'denim_light',black:'black',chocolate:'brown',tobacco:'tan',camel:'tan',cream:'cream',oat:'cream',stone:'beige',charcoal:'charcoal',grey:'grey',olive:'olive',khaki:'beige',navy:'navy',burgundy:'burgundy',forest:'green',mustard:'mustard',white:'white',silver:'grey',tort:null};
const SUBTYPES={jeans:['jeans'],trousers:['trousers','cords','cargo','chinos'],sneakers:['sneaker','runner','gat'],loafers:['loafer'],boots:['chukka'],coat:['coat'],jacket:['suede','bomber','barn'],overshirt:['chore'],knit:['knit'],cap:['cap'],beanie:['beanie'],scarf:['scarf'],bag:['bag','tote'],sunglasses:['glasses'],socks:['socks']};
export function illustration(sub, palette, avoid=[]){
  const types=SUBTYPES[sub]||['cap']; const t=types[Math.floor(Math.random()*types.length)]; const item=ITEMS[t];
  let c=item.o.filter(o=>{const f=KEYFAM[o.k];return item.neutral||f==null||(palette.includes(f)&&!avoid.includes(f))});
  if(!c.length)c=item.o; const o=c[Math.floor(Math.random()*c.length)];
  return {t,o,family:KEYFAM[o.k]||null,label:`${o.n} ${item.n}`,svg:item.d(o)};
}
