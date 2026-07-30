/* ============================================================================
   TSIGOURA VERDE — shared icon, infographic & animation library
   ----------------------------------------------------------------------------
   Used by BOTH tsigoura-menu.html (guest) and tsigoura-admin.html (owner).
   Everything here is drawn in code: no photos, no image files, no © risk.

   ICONS      → ICO.draw(key)            line icon, animates itself into view
   ALLERGENS  → ICO.allergen(key)        the 14 EU allergens as line icons
   CHARTS     → VIZ.donut / VIZ.bars / VIZ.spark / VIZ.histogram
   MOTION     → MOT.reveal() / MOT.count() / MOT.ripple()
   ========================================================================== */

/* ═══════════════════════════════════ 1. ICON PATHS ═══════════════════════ */
const ICON_PATHS = {
  /* ---- dishes & categories — recognizable silhouettes ---- */
  dip:'M3 12.5h18|M5 12.5a7 7 0 0 0 14 0|M8 12.5c0-2.2 1.8-4 4-4s4 1.8 4 4|M12 6.2v1.6',   // bowl of dip (tzatziki/spread) with a mound
  bake:'M4 10h16v4.5a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4Z|M2 12h2|M20 12h2|M8 10V8a4 4 0 0 1 8 0v2',  // clay pot / baked
  cheese:'M3 15 13 6l8 9Z|M3 15h18|M8 12.4h.01|M12 13.4h.01|M15.5 11.4h.01',   // cheese wedge with holes
  chili:'M12 3c4 5 6 7 6 10a6 6 0 0 1-12 0c0-2 1-3 2-4 0 2 1 3 2 3 0-4 1-6 2-9Z',  // flame — reads as "hot" for καυτερή πιπεριά
  potato:'M7.5 16.2a4.6 4.6 0 0 0 8.7 2.6c2.9-1 3.9-4.7 2-7.8s-5.7-3.9-8.6-2.2-3.6 4.7-2.1 7.4Z|M11 12h.01|M14 15h.01|M9.6 15h.01',  // potato
  fries:'M6 10h12l-1.2 9.3a1.5 1.5 0 0 1-1.5 1.3H8.7a1.5 1.5 0 0 1-1.5-1.3Z|M8 10 7.2 4|M11 10V3.2|M15 10 16 4|M6 13h12',  // fries in a box
  fish:'M6.5 12c0-3 3-5.2 7-5.2 4 0 6.6 3 8.5 5.2-1.9 2.2-4.5 5.2-8.5 5.2-4 0-7-2.2-7-5.2Z|M6.5 12 3 8.5v7Z|M16 11h.01',  // fish body + tail fin + eye
  leaf:'M5 20C5 11 10 5 19 4c-1 9-6 15-14 16Z|M9 16c2.2-3.4 5-6.2 8-8',  // leafy greens
  salad:'M4 12h16a8 8 0 0 1-16 0Z|M2.5 12h19|M8 9a2 2 0 1 1 3 0|M13.5 8.6a2 2 0 1 1 3 0|M10.5 7l.8-1.6',  // salad bowl with veg
  meat:'M7 15.5a5 5 0 1 1 6.5-6.5|M13.5 9a5 5 0 1 1-6.5 6.5|M9 12.5h6|M12 9.5v6',  // cut of meat / steak
  shank:'M8 8a5.5 5.5 0 1 1 7.8 7.8L13 18.5|M8 8 5.2 10.8|M4.4 9.9a1.7 1.7 0 1 0 2.4 2.4Z|M13 18.5a1.7 1.7 0 1 0 2.4 2.4',  // ham shank: round meat + bone knuckle (kotsi)
  skewer:'M4 20 20 4|M7 8.5l3 3|M10 5.5l3 3|M6.4 12.6l2-2|M9.4 9.6l2-2|M12.4 6.6l2-2',  // souvlaki skewer with cubes
  burger:'M4 13.4a8 4.4 0 0 1 16 0Z|M4 15.6h16|M4.6 15.6a2 2 0 0 0 2 2.4h10.8a2 2 0 0 0 2-2.4|M8 9.6h.01|M12 8.9h.01|M15.6 9.7h.01',  // burger / bifteki
  spit:'M2 7h20|M6 7c0 4.5 2.4 7.5 6 7.5s6-3 6-7.5|M9 14.5c.6 1 2.4 1 3 0',  // roast on a horizontal spit (souvla/kontosouvli)
  drumstick:'M14 3a5.5 5.5 0 0 0-4.6 8.6l-4.6 4.6a2.6 2.6 0 0 0 3.7 3.7l4.6-4.6A5.5 5.5 0 1 0 14 3Z|M5.4 15.2 3.4 17.2|M7 16.8 5 18.8',  // chicken drumstick
  soda:'M7.5 8h9l-1 11.4a1.6 1.6 0 0 1-1.6 1.6h-3.8a1.6 1.6 0 0 1-1.6-1.6Z|M6.5 8h11|M13 8V4h3.5|M10 12v5',  // soft-drink cup + straw
  mug:'M6 6h9v13H6Z|M15 9h2.5A2.5 2.5 0 0 1 20 11.5v1A2.5 2.5 0 0 1 17.5 15H15|M8.2 3.4c0 1 1 1 1 2|M11.2 3.4c0 1 1 1 1 2',  // beer mug w/ foam
  wine:'M8 3h8l-1 6a3 3 0 0 1-6 0Z|M12 12v7|M9 21h6',  // wine glass
  tumbler:'M7.5 4h9l-1.2 16H8.7Z|M8.2 12h7.6',  // ouzo / tsipouro tumbler
  carafe:'M9.5 3h5|M10.5 3v3.5L7.6 12v7a2 2 0 0 0 2 2h4.8a2 2 0 0 0 2-2v-7l-2.9-5.5V3|M7.9 13h8.2',  // carafe (χύμα)
  bottle:'M10 2.5h4v3l2 4.5V19a1.5 1.5 0 0 1-1.5 1.5h-5A1.5 1.5 0 0 1 8 19V10l2-4.5Z|M8.5 13h7',  // bottle
  cocktail:'M4 5h16l-7.4 7.7L12 13Z|M12 13v6.4|M8.5 20h7|M14.6 8.1 18 5',  // cocktail / spirit portion
  glass:'M8 3h8v5a4 4 0 0 1-8 0Z|M12 12v7|M9 21h6',
  bowl:'M4 11.5h16a8 8 0 0 1-16 0Z|M2.5 11.5h19|M9 8.5c0-1 1-2 1-3|M14 8.5c0-1 1-2 1-3',
  olives:'M9 9a3 3 0 1 0 .01 0Z|M15 12a3 3 0 1 0 .01 0Z|M9 6c1-1.5 3-1.5 4 0',  // olives
  flame:'M12 3c4 5 6 7 6 10a6 6 0 0 1-12 0c0-2 1-3 2-4 0 2 1 3 2 3 0-4 1-6 2-9Z',
  /* aliases so older icon keys still resolve to the improved glyphs */
  get pepper(){return this.chili;}, get patty(){return this.burger;},
  get chicken(){return this.drumstick;}, get lamb(){return this.spit;}, get beer(){return this.mug;},
  get pot(){return this.bake;}, get greeksalad(){return this.salad;},

  /* ---- UI ---- */
  search:'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14Z|M20 20l-4-4',
  help:'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z|M9.5 9.5A2.5 2.5 0 0 1 14 11c0 2-2 2-2 3.5|M12 18h.01',
  info:'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z|M12 11v5|M12 8h.01',
  warn:'M12 3 2 20h20Z|M12 10v4|M12 17h.01',
  check:'M4 12.5 9.5 18 20 6',
  plus:'M12 5v14|M5 12h14',
  minus:'M5 12h14',
  close:'M6 6l12 12|M18 6 6 18',
  cart:'M3 4h2l2.5 11h10L20 7H6|M9 20a1 1 0 1 0 .01 0|M17 20a1 1 0 1 0 .01 0',
  globe:'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z|M3 12h18|M12 3c3 3.5 3 14.5 0 18|M12 3c-3 3.5-3 14.5 0 18',
  chevron:'M8 10l4 4 4-4',
  arrow:'M4 12h15|M13 6l6 6-6 6',
  clock:'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z|M12 7v5l3.5 2',
  table:'M3 9h18|M5 9v11|M19 9v11|M4 5h16v4H4Z',
  chair:'M7 4h10v8H7Z|M6 12h12|M8 12v8|M16 12v8',
  edit:'M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16Z|M14 6l4 4',
  trash:'M4 7h16|M9 7V4h6v3|M6 7l1 13h10l1-13|M10 11v6|M14 11v6',
  bolt:'M13 3 5 14h6l-1 7 8-11h-6Z',
  wrench:'M15 3a5 5 0 0 0-5 6.5L3 16.5 6.5 20l7-7A5 5 0 1 0 15 3Z',
  qr:'M4 4h6v6H4Z|M14 4h6v6h-6Z|M4 14h6v6H4Z|M14 14v2h2|M18 18v2h2|M14 20h2',
  gear:'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z|M12 2v3|M12 19v3|M4.2 4.2l2.1 2.1|M17.7 17.7l2.1 2.1|M2 12h3|M19 12h3|M4.2 19.8l2.1-2.1|M17.7 6.3l2.1-2.1',
  receipt:'M5 3h14v18l-3-2-2 2-2-2-2 2-2-2-3 2Z|M9 8h6|M9 12h6',
  print:'M7 8V3h10v5|M5 8h14v8H5Z|M7 16h10v5H7Z',
  download:'M12 4v11|M7 11l5 5 5-5|M4 20h16',
  undo:'M9 8 4 12l5 4|M4 12h9a7 7 0 0 1 7 7|M20 19v-1',
  eye:'M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z|M12 9.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z',
  lock:'M6 11h12v9H6Z|M9 11V8a3 3 0 0 1 6 0v3',
  sun:'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z|M12 2v2|M12 20v2|M4 12H2|M22 12h-2|M5 5 3.6 3.6|M20.4 20.4 19 19|M5 19l-1.4 1.4|M20.4 3.6 19 5',
  moon:'M20 14A8.5 8.5 0 0 1 10 4a8.5 8.5 0 1 0 10 10Z',
  users:'M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z|M2 20c0-3.5 3-6 7-6s7 2.5 7 6|M17 5a3 3 0 0 1 0 6|M18 20c0-2.5-1-4-2-5',
  note:'M5 3h11l3 3v15H5Z|M9 9h6|M9 13h6|M9 17h3',
  euro:'M17 6a6 6 0 1 0 0 12|M4 10h9|M4 14h9',
  layers:'M12 3 3 8l9 5 9-5Z|M3 13l9 5 9-5|M3 17l9 5 9-5',
  sparkle:'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8Z|M18 16l.8 2.2L21 19l-2.2.8L18 22l-.8-2.2L15 19l2.2-.8Z',
};

/* ═══════════════════════════ 2. THE 14 EU ALLERGEN ICONS ════════════════ */
/* Drawn as line art so they read at 14px and print cleanly in black & white. */
const ALLERGEN_PATHS = {
  gluten:   'M12 3v18|M12 7c-2-2-4-2-5-1 1 2 3 3 5 3|M12 7c2-2 4-2 5-1-1 2-3 3-5 3|M12 13c-2-2-4-2-5-1 1 2 3 3 5 3|M12 13c2-2 4-2 5-1-1 2-3 3-5 3',
  crustacea:'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z|M8 10 4 7|M16 10l4-3|M8 14l-4 3|M16 14l4 3|M10 6 8 3|M14 6l2-3',
  eggs:     'M12 3c-3.5 4-5 7-5 10a5 5 0 0 0 10 0c0-3-1.5-6-5-10Z|M10 14a2 2 0 1 0 .01 0',
  fish:     'M3 12c4-5 10-5 14 0-4 5-10 5-14 0Z|M17 12l4-3v6Z|M8 11h.01',
  peanuts:  'M9 4a4 4 0 0 0 0 8 4.5 4.5 0 0 0 0 8 4 4 0 0 0 6-3 4 4 0 0 0-1-8 4 4 0 0 0-5-5Z|M9 8h.01|M13 16h.01',
  soy:      'M6 18c0-6 4-11 12-13-1 8-5 13-12 13Z|M6 18c2-4 5-7 9-9',
  milk:     'M9 3h6v3l2 4v11H7V10l2-4Z|M7 13h10',
  nuts:     'M12 3c5 0 8 4 8 8s-3 10-8 10-8-5-8-10 3-8 8-8Z|M12 5v16|M12 9c2 1 3 2 4 4|M12 9c-2 1-3 2-4 4',
  celery:   'M8 21c0-8 1-13 4-18|M12 21c0-8 1-13 4-18|M6 8c3-1 9-1 12 0|M4 21h16',
  mustard:  'M10 3h4v3l3 4v11H7V10l3-4Z|M11 13h2v4h-2Z',
  sesame:   'M8 8a2 3 0 1 0 .01 0|M15 7a2 3 0 1 0 .01 0|M11 14a2 3 0 1 0 .01 0|M17 15a2 3 0 1 0 .01 0|M6 16a2 3 0 1 0 .01 0',
  sulphites:'M8 3h8l-1 6a3 3 0 0 1-6 0Z|M12 12v7|M9 21h6|M5 5l14 14',
  lupin:    'M12 21V9|M12 9a4 4 0 0 1 4-4 4 4 0 0 1-4 4Z|M12 12a4 4 0 0 0-4-4 4 4 0 0 0 4 4Z|M8 21h8',
  molluscs: 'M12 20c-5 0-8-4-8-8a8 8 0 0 1 16 0c0 4-3 8-8 8Z|M12 20V4|M12 20 6 9|M12 20l6-11',
};

/* ═══════════════════════════════ 3. ICON RENDERER ═══════════════════════ */
const ICO = {
  /* plain icon */
  get(key, cls){
    const d = ICON_PATHS[key] || ICON_PATHS.bowl;
    return ICO._svg(d, cls || '');
  },
  /* icon that draws itself on when it scrolls into view */
  draw(key, cls){
    return ICO.get(key, 'ico-draw ' + (cls||''));
  },
  allergen(key, cls){
    const d = ALLERGEN_PATHS[key] || ICON_PATHS.warn;
    return ICO._svg(d, cls || '');
  },
  _svg(d, cls){
    const paths = d.split('|').map(p=>`<path d="${p}"/>`).join('');
    return `<svg class="ico ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"
      xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${paths}</svg>`;
  },
  has(key){ return !!ICON_PATHS[key]; },
};

/* ═══════════════════════════════ 4. INFOGRAPHICS ════════════════════════ */
const VIZ = {
  /* animated donut — pass [{label,value,color}] */
  donut(data, opts){
    const o = Object.assign({ size:132, thickness:15, center:'', sub:'' }, opts||{});
    const total = data.reduce((s,d)=>s+d.value,0) || 1;
    const r = (o.size - o.thickness)/2, C = 2*Math.PI*r, cx = o.size/2;
    let acc = 0;
    const arcs = data.map((d,i)=>{
      const frac = d.value/total, len = frac*C, off = acc*C; acc += frac;
      return `<circle class="viz-arc" cx="${cx}" cy="${cx}" r="${r}" stroke="${d.color}"
        stroke-width="${o.thickness}" fill="none" stroke-linecap="butt"
        stroke-dasharray="${len} ${C-len}" stroke-dashoffset="${-off}"
        style="--delay:${i*90}ms;--C:${C}"/>`;
    }).join('');
    return `<div class="viz-donut" style="width:${o.size}px">
      <svg viewBox="0 0 ${o.size} ${o.size}" width="${o.size}" height="${o.size}">
        <circle cx="${cx}" cy="${cx}" r="${r}" stroke="rgba(0,0,0,.07)" stroke-width="${o.thickness}" fill="none"/>
        <g transform="rotate(-90 ${cx} ${cx})">${arcs}</g>
      </svg>
      <div class="viz-donut-mid"><b>${o.center}</b><i>${o.sub}</i></div>
    </div>`;
  },

  /* animated horizontal bars — [{label,value,icon,color}] */
  bars(data, opts){
    const o = Object.assign({ suffix:'', color:'var(--gold,#C9A227)' }, opts||{});
    const max = Math.max(...data.map(d=>d.value), 1);
    return `<div class="viz-bars">` + data.map((d,i)=>`
      <div class="viz-bar" style="--delay:${i*70}ms">
        <span class="vb-l">${d.icon?ICO.get(d.icon):''}<em>${d.label}</em></span>
        <span class="vb-track"><i style="--w:${Math.round(d.value/max*100)}%;background:${d.color||o.color}"></i></span>
        <span class="vb-v">${d.value}${o.suffix}</span>
      </div>`).join('') + `</div>`;
  },

  /* price histogram — buckets a list of numbers */
  histogram(values, opts){
    const o = Object.assign({ buckets:7, cur:'€', color:'var(--gold,#C9A227)' }, opts||{});
    if(!values.length) return '';
    const min = Math.min(...values), max = Math.max(...values);
    const span = (max-min)||1, step = span/o.buckets;
    const buck = Array.from({length:o.buckets},(_,b)=>({
      from: min + b*step, to: min + (b+1)*step,
      n: values.filter(v => b===o.buckets-1 ? v>=min+b*step : (v>=min+b*step && v<min+(b+1)*step)).length,
    }));
    const maxN = Math.max(...buck.map(b=>b.n),1);
    return `<div class="viz-hist">` + buck.map((b,i)=>`
      <div class="vh-col" style="--delay:${i*55}ms" title="${o.cur}${b.from.toFixed(0)}–${o.cur}${b.to.toFixed(0)}: ${b.n}">
        <span class="vh-n">${b.n||''}</span>
        <i style="--h:${Math.round(b.n/maxN*100)}%;background:${o.color}"></i>
        <span class="vh-x">${o.cur}${Math.round(b.from)}</span>
      </div>`).join('') + `</div>`;
  },

  /* tiny sparkline from an array of numbers */
  spark(values, opts){
    const o = Object.assign({ w:90, h:26, color:'currentColor' }, opts||{});
    if(values.length<2) return '';
    const min=Math.min(...values), max=Math.max(...values), span=(max-min)||1;
    const pts = values.map((v,i)=>[ i/(values.length-1)*o.w, o.h - ((v-min)/span)*(o.h-4) - 2 ]);
    const d = pts.map((p,i)=> (i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' ');
    return `<svg class="viz-spark" viewBox="0 0 ${o.w} ${o.h}" width="${o.w}" height="${o.h}" fill="none">
      <path d="${d}" stroke="${o.color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="${pts[pts.length-1][0].toFixed(1)}" cy="${pts[pts.length-1][1].toFixed(1)}" r="2.4" fill="${o.color}"/>
    </svg>`;
  },
};

/* ═══════════════════════════════ 5. MOTION HELPERS ══════════════════════ */
const MOT = {
  _io: null,
  /* reveal anything with .reveal / animate .ico-draw / start charts */
  reveal(root){
    if(!('IntersectionObserver' in window)){
      (root||document).querySelectorAll('.reveal,.ico-draw,.viz-donut,.viz-bars,.viz-hist')
        .forEach(el=>el.classList.add('in')); return;
    }
    if(!MOT._io){
      MOT._io = new IntersectionObserver(es=>{
        es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); MOT._io.unobserve(e.target); } });
      }, { threshold:.12, rootMargin:'0px 0px -6% 0px' });
    }
    (root||document).querySelectorAll('.reveal:not(.in),.ico-draw:not(.in),.viz-donut:not(.in),.viz-bars:not(.in),.viz-hist:not(.in)')
      .forEach(el=>MOT._io.observe(el));
  },

  /* count a number up */
  count(el, to, opts){
    const o = Object.assign({ ms:750, dec:0, prefix:'', suffix:'' }, opts||{});
    const from = parseFloat(String(el.dataset.v||0)) || 0;
    const t0 = performance.now();
    const tick = (t)=>{
      const p = Math.min(1,(t-t0)/o.ms), e = 1-Math.pow(1-p,3);
      const v = from + (to-from)*e;
      el.textContent = o.prefix + v.toFixed(o.dec) + o.suffix;
      if(p<1) requestAnimationFrame(tick); else el.dataset.v = to;
    };
    requestAnimationFrame(tick);
  },

  /* material-ish ripple on tap */
  ripple(e, el){
    const r = document.createElement('span');
    r.className = 'ripple';
    const b = el.getBoundingClientRect(), s = Math.max(b.width,b.height);
    r.style.width = r.style.height = s+'px';
    r.style.left = ((e.clientX||b.left+b.width/2)-b.left-s/2)+'px';
    r.style.top  = ((e.clientY||b.top+b.height/2)-b.top-s/2)+'px';
    el.appendChild(r); setTimeout(()=>r.remove(), 620);
  },
  bindRipples(root){
    (root||document).querySelectorAll('[data-ripple]:not([data-rb])').forEach(el=>{
      el.dataset.rb='1';
      el.style.position = el.style.position||'relative';
      el.style.overflow = 'hidden';
      el.addEventListener('pointerdown', e=>MOT.ripple(e, el));
    });
  },

  /* fly a small dot from an element to the cart bar */
  flyTo(fromEl, toEl){
    if(!fromEl||!toEl) return;
    const a = fromEl.getBoundingClientRect(), b = toEl.getBoundingClientRect();
    const d = document.createElement('span');
    d.className = 'flydot';
    d.style.left = (a.left+a.width/2)+'px';
    d.style.top  = (a.top+a.height/2)+'px';
    document.body.appendChild(d);
    requestAnimationFrame(()=>{
      d.style.transform = `translate(${b.left+b.width/2-(a.left+a.width/2)}px,${b.top+b.height/2-(a.top+a.height/2)}px) scale(.35)`;
      d.style.opacity = '0';
    });
    setTimeout(()=>d.remove(), 700);
  },
};

/* ═══════════════════════════════ 6. STYLES ══════════════════════════════ */
/* Injected once so both pages get identical motion without duplicated CSS.  */
(function injectMotionCSS(){
  if(document.getElementById('tv-motion-css')) return;
  const css = `
  .ico{width:1em;height:1em;display:block;flex:0 0 auto;}
  /* draw-on: the stroke paints itself when scrolled into view */
  .ico-draw path{stroke-dasharray:120;stroke-dashoffset:120;}
  .ico-draw.in path{animation:icoDraw .85s cubic-bezier(.4,0,.2,1) forwards;}
  .ico-draw.in path:nth-child(2){animation-delay:.09s}
  .ico-draw.in path:nth-child(3){animation-delay:.18s}
  .ico-draw.in path:nth-child(4){animation-delay:.27s}
  .ico-draw.in path:nth-child(5){animation-delay:.36s}
  @keyframes icoDraw{to{stroke-dashoffset:0;}}

  .reveal{opacity:0;transform:translateY(12px);}
  .reveal.in{animation:revealIn .55s cubic-bezier(.32,.72,0,1) forwards;
    animation-delay:var(--rd,0ms);}
  @keyframes revealIn{to{opacity:1;transform:none;}}

  /* donut */
  .viz-donut{position:relative;display:inline-block;}
  .viz-donut .viz-arc{stroke-dashoffset:0;opacity:0;transform-origin:center;}
  .viz-donut.in .viz-arc{animation:arcIn .9s cubic-bezier(.32,.72,0,1) forwards;animation-delay:var(--delay,0ms);}
  @keyframes arcIn{from{opacity:0;stroke-dasharray:0 9999;}to{opacity:1;}}
  .viz-donut-mid{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;
    justify-content:center;text-align:center;pointer-events:none;}
  .viz-donut-mid b{font-family:Fraunces,serif;font-size:24px;line-height:1;}
  .viz-donut-mid i{font-style:normal;font-size:9.5px;opacity:.62;margin-top:3px;}

  /* bars */
  .viz-bars{display:flex;flex-direction:column;gap:9px;}
  .viz-bar{display:flex;align-items:center;gap:9px;font-size:11.5px;}
  .vb-l{display:flex;align-items:center;gap:6px;width:104px;flex:0 0 auto;opacity:.85;}
  .vb-l .ico{width:13px;height:13px;}
  .vb-l em{font-style:normal;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
  .vb-track{flex:1;height:7px;border-radius:4px;background:rgba(0,0,0,.07);overflow:hidden;}
  .vb-track i{display:block;height:100%;width:0;border-radius:4px;}
  .viz-bars.in .vb-track i{animation:barGrow .8s cubic-bezier(.32,.72,0,1) forwards;animation-delay:var(--delay,0ms);}
  @keyframes barGrow{to{width:var(--w);}}
  .vb-v{width:34px;text-align:right;font-weight:700;font-size:11.5px;flex:0 0 auto;}

  /* histogram */
  .viz-hist{display:flex;align-items:flex-end;gap:5px;height:96px;}
  .vh-col{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:100%;gap:4px;}
  .vh-col i{display:block;width:100%;height:0;border-radius:5px 5px 2px 2px;min-height:2px;}
  .viz-hist.in .vh-col i{animation:colGrow .75s cubic-bezier(.32,.72,0,1) forwards;animation-delay:var(--delay,0ms);}
  @keyframes colGrow{to{height:var(--h);}}
  .vh-n{font-size:9.5px;font-weight:700;opacity:.55;}
  .vh-x{font-size:8.5px;opacity:.45;}

  .viz-spark{overflow:visible;}

  /* ripple + fly dot */
  .ripple{position:absolute;border-radius:50%;background:currentColor;opacity:.22;
    transform:scale(0);animation:rip .6s ease-out forwards;pointer-events:none;}
  @keyframes rip{to{transform:scale(2.4);opacity:0;}}
  .flydot{position:fixed;width:14px;height:14px;border-radius:50%;
    background:var(--gold,#C9A227);z-index:999;pointer-events:none;margin:-7px 0 0 -7px;
    transition:transform .62s cubic-bezier(.5,-0.2,.4,1),opacity .62s ease-in;}

  /* shared micro-interactions */
  .pressable{transition:transform .14s ease;}
  .pressable:active{transform:scale(.95);}
  @media (prefers-reduced-motion:reduce){
    .ico-draw path{stroke-dashoffset:0!important;animation:none!important;}
    .reveal{opacity:1!important;transform:none!important;animation:none!important;}
    .viz-bars .vb-track i{width:var(--w)!important;animation:none!important;}
    .viz-hist .vh-col i{height:var(--h)!important;animation:none!important;}
    .viz-donut .viz-arc{opacity:1!important;animation:none!important;}
    .flydot,.ripple{display:none!important;}
  }`;
  const s = document.createElement('style');
  s.id = 'tv-motion-css'; s.textContent = css;
  document.head.appendChild(s);
})();
