/* Readable flow layouts derived from the original scene. Used through tablet width. */
window.TotokFlow=(()=>{
 const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const primary={'2073:602':['Investigación','research'],'2030:6086':['Producción','production'],'2030:6284':['Marca','brand'],'2084:394':['Empaque','packaging']};
 const productIds=['2075:4691','2075:4116','2075:3969'];
 const nav=[['2073:602','Investigación'],['2030:6086','Producción'],['2030:6284','Marca'],['2084:394','Empaque']];
 let data={};const autoplayCleanups=[];const compact=matchMedia('(max-width:1100px), (pointer:coarse) and (max-width:1400px)');
 const ready=fetch('responsive.json?v=20261019-brand-8').then(r=>{if(!r.ok)throw new Error('No se pudo cargar el contenido responsivo.');return r.json();}).then(d=>data=d);
 const route=(id,label,cls='flow-button')=>`<a class="${cls}" href="#screen=${id}" data-target="${id}" data-mode="NAVIGATE">${escape(label)}</a>`;
 const meaningful=t=>t&&!/^(Frame|Group|Component|MacBook|informaci[oó]n|Property)/i.test(t);
 const flat=id=>(data[id]?.sections||[]).flatMap(s=>s.texts);
 const mediaFor=id=>(data[id]?.sections||[]).flatMap(s=>s.media);
 function image(item,title='',cls=''){
  if(item.type==='video')return `<video class="flow-media ${cls}" controls playsinline preload="metadata" poster="${item.poster}"><source src="${item.src}" type="video/mp4"></video>`;
  return `<img class="flow-media ${cls}" src="${item.src}" alt="${escape(title)}" loading="lazy" decoding="async" width="${Math.max(1,item.width)}" height="${Math.max(1,item.height)}">`;
 }
 function actionCard(a,index){
  const texts=flat(a.target),media=mediaFor(a.target);let label=a.label.replace(/\s+/g,' ').trim();
  if(!meaningful(label))label=texts.find(t=>meaningful(t.text)&&t.text.length<100)?.text||`Ver imagen ${index+1}`;
  if(label.length>100)label=`Ver ${index+1===1?'primer':'segundo'} prompt`;
  return `<button class="flow-detail ${media.length?'has-image':''}" data-target="${a.target}" data-mode="OVERLAY" aria-label="${escape(label)}">${media[0]?image(media[0],''):''}<span>${escape(label)} <b aria-hidden="true">↗</b></span></button>`;
 }
 function carousel(slides,label,kind,automatic=false){
  const key=`flow-carousel-${kind}`;
  return `<div class="flow-carousel flow-carousel-${kind} ${automatic?'flow-carousel-auto':''}" data-carousel ${automatic?'data-autoplay="4000"':''} role="region" aria-roledescription="carrusel" aria-label="${escape(label)}">
   <div class="flow-carousel-track" id="${key}" data-carousel-track tabindex="0" aria-label="${escape(label)}. Usa las flechas del teclado o desliza para explorar.">${slides.join('')}</div>
   <div class="flow-carousel-controls"><button type="button" data-carousel-step="-1" aria-controls="${key}" aria-label="Anterior: ${escape(label)}" disabled>←</button><output data-carousel-count ${automatic?'':'aria-live="polite"'} aria-atomic="true">1 / ${slides.length}</output><button type="button" data-carousel-step="1" aria-controls="${key}" aria-label="Siguiente: ${escape(label)}">→</button>${automatic?`<button type="button" class="flow-carousel-pause" data-carousel-pause aria-controls="${key}" aria-label="Pausar ${escape(label)}">Pausar</button>`:''}</div>
  </div>`;
 }
 function snackGallery(media){
  const captions=['Grecia','Egipto','Roma','Deporte','Bienestar','Viajes'];
  return carousel(media.map((m,i)=>`<figure class="flow-carousel-slide">${image(m,captions[i]||'Cultura y convivencia')}<figcaption>${escape(captions[i]||'Cultura y convivencia')}</figcaption></figure>`),'Galería de snacks','snacks');
 }
 function insectGallery(s){
  // One card per insect. The former loose photographs and empty card are merged here.
  const targets=['2075:3209','2075:3213','2075:3218','2075:3226','2075:3227','2075:3228'];
  const slides=targets.map((target,index)=>{
   const text=flat(target).map(t=>t.text).join(' ').replace(/\s+/g,' ').trim();
   const colon=text.indexOf(':');const name=colon>=0?text.slice(0,colon):text;
   const description=(colon>=0?text.slice(colon+1):'').trim().replace('Saltamonestes','Saltamontes');
   const picture=mediaFor(target)[0]||(index===0?s.media[0]:null);
   return `<button class="flow-carousel-slide flow-detail flow-insect-card has-image" type="button" data-target="${target}" data-mode="OVERLAY" aria-label="${escape(name+': '+description)}">${picture?image(picture,name):''}<span class="flow-insect-caption"><strong>${escape(name)}</strong><span>${escape(description)}</span><b aria-hidden="true">↗</b></span></button>`;
  });
  return carousel(slides,'Insectos de América Latina','insects');
 }
 function wormSection(s,id){
  const title=s.texts.find(t=>t.size>=38)?.text||'SNACK DE GUSANO';
  const paragraphs=s.texts.filter(t=>t.text!==title);
  const groups=[
   {key:'a',label:'Galería de tradición y sabor',indices:[5,4,3],alts:['Platillo mexicano','Vestimenta tradicional de México','Artesanía mexicana']},
   {key:'b',label:'Galería de vida y gastronomía',indices:[2,1,0],alts:['Música y bienestar','Ingredientes de la gastronomía mexicana','Compra de alimentos']}
  ];
  return `<section class="flow-section flow-light" aria-labelledby="flow-heading-${id.replace(':','-')}-3"><div class="flow-wrap"><div class="flow-section-head"><span class="flow-kicker">TOTOK · 03</span><h2 id="flow-heading-${id.replace(':','-')}-3">${escape(title)}</h2></div><div class="flow-worm-groups">${groups.map((group,i)=>`<div class="flow-worm-group">${paragraphs[i]?`<div class="flow-copy"><p>${escape(paragraphs[i].text)}</p></div>`:''}${carousel(group.indices.map((index,j)=>`<figure class="flow-carousel-slide" data-photo-code="${group.key.toUpperCase()}0${j+1}">${image(s.media[index],group.alts[j])}</figure>`),group.label,'worm-'+group.key,true)}</div>`).join('')}</div></div></section>`;
 }
 function brandSection(s){
  const title=s.texts.find(t=>t.size>=38)?.text||'';
  const paragraphs=s.texts.filter(t=>t.size<38&&t.text.length>75);
  let slides=[];
  if([7,8].includes(s.index)){
   slides=s.actions.map((a,i)=>actionCard(a,i).replace('class="flow-detail ', 'class="flow-carousel-slide flow-brand-card flow-detail '));
  }else{
   const personality=['2075:3332','2075:3333','2075:3334'];
   const traits=['Amigable','Orgullosos','Auténtica'];
   slides=s.media.map((m,i)=>{
    let caption='',label='';
    if(s.index===3){label=traits[i]||'';caption=flat(personality[i]).map(t=>t.text).join(' ');}
    if(s.index===5){const a=s.actions[i];label=a?.label||'';caption=flat(a?.target).filter(t=>t.text!==label&&!/^\d+$/.test(t.text.trim())).map(t=>t.text).join('\n');}
    if(s.index===9)label=['Publicidad en exteriores','Publicidad en valla','Publicidad digital'][i]||'';
    return `<figure class="flow-carousel-slide flow-brand-card">${image(m,label||title)}${label||caption?`<figcaption>${label?`<strong>${escape(label)}</strong>`:''}${caption?`<p>${escape(caption)}</p>`:''}</figcaption>`:''}</figure>`;
   });
  }
  return `<section class="flow-section ${s.index%2?'flow-light':'flow-tint'}" aria-labelledby="brand-heading-${s.index}"><div class="flow-wrap"><div class="flow-section-head"><span class="flow-kicker">TOTOK · ${String(s.index).padStart(2,'0')}</span><h2 id="brand-heading-${s.index}">${escape(title)}</h2></div>${paragraphs.length?`<div class="flow-copy">${paragraphs.map(t=>`<p>${escape(t.text)}</p>`).join('')}</div>`:''}${carousel(slides,title,'brand-'+s.index)}</div></section>`;
 }
 function productionSection(s){
  const ids=['2068:9463','2068:9511','2068:9559','2068:9607','2068:9655'];
  const slides=ids.map((id,i)=>{const caption=flat(id).map(t=>t.text).join(' ');const picture=mediaFor(id)[0];return `<figure class="flow-carousel-slide flow-process-card">${image(picture,caption)}<figcaption><span class="flow-kicker">PASO ${String(i+1).padStart(2,'0')}</span><p>${escape(caption)}</p></figcaption></figure>`;});
  return `<section class="flow-section flow-light" aria-labelledby="process-heading"><div class="flow-wrap"><div class="flow-section-head"><span class="flow-kicker">TOTOK · 01</span><h2 id="process-heading">PROCESO DE CREACIÓN DEL SNACK</h2></div>${carousel(slides,'Proceso de creación del snack','process')}<div class="flow-copy flow-process-intro"><p>${escape(s.texts.find(t=>t.text.length>100)?.text||'')}</p></div></div></section>`;
 }
 function venn(){
  return `<figure class="flow-venn"><svg viewBox="0 0 620 520" role="img" aria-labelledby="venn-title venn-desc"><title id="venn-title">Diagrama de Venn del concepto TOTOK</title><desc id="venn-desc">Endémico, atractivo y dinámico se intersectan. Auténtico, emergente y carismático dan como resultado: genuino.</desc><g fill-opacity=".7"><circle cx="310" cy="165" r="150" fill="#9bc271"/><circle cx="210" cy="315" r="150" fill="#dfb15f"/><circle cx="410" cy="315" r="150" fill="#df7066"/></g><g fill="#30271f" text-anchor="middle" font-family="Montserrat,Arial,sans-serif" font-weight="650" font-size="23"><text x="310" y="112">ENDÉMICO</text><text x="170" y="350">ATRACTIVO</text><text x="450" y="350">DINÁMICO</text></g><circle cx="248" cy="228" r="16" fill="#8ad12d"/><circle cx="372" cy="228" r="16" fill="#ee604e"/><circle cx="310" cy="350" r="16" fill="#e98d30"/></svg><figcaption><ul class="flow-venn-legend"><li>Auténtico</li><li>Emergente</li><li>Carismático</li></ul><p class="flow-venn-result">Resultado: <strong>Genuino</strong></p></figcaption></figure>`;
 }
 function promptCards(s){
  return `<div class="flow-details-grid flow-prompt-cards">${s.actions.map((a,i)=>{const m=mediaFor(a.target)[0];const label=`Ver ${i===0?'primer':'segundo'} prompt`;const preview=m?.type==='video'?{...m,type:'image',src:m.poster}:m;return `<button type="button" class="flow-detail has-image" data-prompt="${i}" aria-haspopup="dialog">${preview?image(preview,'Vista previa del resultado del prompt'):''}<span>${label}<b aria-hidden="true">↗</b></span></button>`;}).join('')}</div>`;
 }
 function promptMarkup(index){
  const s=data['2073:602'].sections.find(s=>s.index===6);const text=s.actions[index]?.label;if(!text)return null;
  return `<article class="flow-page flow-dialog"><section class="flow-section"><div class="flow-wrap"><div class="flow-section-head"><span class="flow-kicker">TOTOK · Prompts</span><h2>${index===0?'Primer':'Segundo'} prompt</h2></div><div class="flow-copy"><p>${escape(text)}</p></div></div></section></article>`;
 }
 function updateCarousel(box){
  const track=box.querySelector('[data-carousel-track]');if(!track?.firstElementChild)return;
  const max=Math.max(0,track.scrollWidth-track.clientWidth);
  const step=track.firstElementChild.getBoundingClientRect().width+(parseFloat(getComputedStyle(track).columnGap)||0);
  const index=step?Math.round(track.scrollLeft/step):0;
  const visible=Math.max(1,Math.floor((track.clientWidth+(parseFloat(getComputedStyle(track).columnGap)||0))/step+.01));
  box.querySelector('[data-carousel-count]').value=`${index+1}${visible>1?'–'+Math.min(track.children.length,index+visible):''} / ${track.children.length}`;
  box.querySelector('[data-carousel-step="-1"]').disabled=track.scrollLeft<2;
  box.querySelector('[data-carousel-step="1"]').disabled=track.scrollLeft>=max-2;
 }
 function moveCarousel(box,delta){
  const track=box.querySelector('[data-carousel-track]');if(!track?.firstElementChild)return;
  const step=track.firstElementChild.getBoundingClientRect().width+(parseFloat(getComputedStyle(track).columnGap)||0);
  const index=Math.round(track.scrollLeft/step)+delta;
  const max=Math.max(0,track.scrollWidth-track.clientWidth);
  track.scrollTo({left:Math.max(0,Math.min(max,index*step)),behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'});
 }
 function autoplay(box){
  const button=box.querySelector('[data-carousel-pause]');const reduced=matchMedia('(prefers-reduced-motion:reduce)');
  let paused=reduced.matches,hovered=false,visible=false;
  const sync=()=>{button.textContent=paused?'Reanudar':'Pausar';button.setAttribute('aria-label',`${paused?'Reanudar':'Pausar'} ${box.getAttribute('aria-label')}`);button.setAttribute('aria-pressed',String(paused));};
  box.addEventListener('pointerenter',()=>hovered=true);box.addEventListener('pointerleave',()=>hovered=false);
  box.addEventListener('focusin',event=>{if(event.target!==button){paused=true;sync();}});
  button.addEventListener('click',()=>{paused=!paused;sync();});
  const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;},{threshold:.2});observer.observe(box);
  const timer=setInterval(()=>{
   if(paused||hovered||!visible||document.hidden)return;
   const track=box.querySelector('[data-carousel-track]');
   if(track.scrollLeft>=track.scrollWidth-track.clientWidth-2)track.scrollTo({left:0,behavior:reduced.matches?'instant':'smooth'});
   else moveCarousel(box,1);
  },Number(box.dataset.autoplay));
  const motionChange=()=>{if(reduced.matches){paused=true;sync();}};reduced.addEventListener('change',motionChange);sync();
  autoplayCleanups.push(()=>{clearInterval(timer);observer.disconnect();reduced.removeEventListener('change',motionChange);});
 }
 function cleanup(){autoplayCleanups.splice(0).forEach(stop=>stop());}
 function enhance(root){
  root.querySelectorAll('[data-carousel]').forEach(box=>{
   const track=box.querySelector('[data-carousel-track]');
   track.addEventListener('scroll',()=>updateCarousel(box),{passive:true});
   box.querySelectorAll('[data-carousel-step]').forEach(button=>button.addEventListener('click',()=>moveCarousel(box,Number(button.dataset.carouselStep))));
   track.addEventListener('keydown',event=>{
    if(event.target!==track)return;
    if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();moveCarousel(box,event.key==='ArrowRight'?1:-1);}
    if(event.key==='Home'||event.key==='End'){event.preventDefault();moveCarousel(box,event.key==='Home'?-track.children.length:track.children.length);}
   });
   updateCarousel(box);
   if(box.hasAttribute('data-autoplay'))autoplay(box);
  });
 }
 window.addEventListener('resize',()=>document.querySelectorAll('[data-carousel]').forEach(updateCarousel));
 function section(s,id){
  if(id==='2030:6284'&&[1,2,3,5,7,8,9].includes(s.index))return brandSection(s);
  if(id==='2030:6086'&&s.index===1)return productionSection(s);
  if(id==='2073:602'&&s.index===3)return wormSection(s,id);
  const items=s.texts.filter(t=>t.text.trim()!=='Ver más');
  if(!items.length&&!s.media.length&&!s.actions.length)return '';
  const heading=items.find(t=>t.size>=38&&t.text.length<120)||(!primary[id]?items.find(t=>t.text.length<100&&!/^\d+$/.test(t.text.trim())):null);
  const title=heading?.text.replace(/\s+/g,' ').trim()||'';
  const paragraphs=items.filter(t=>t!==heading);
  const promptSection=id==='2073:602'&&s.index===6;
  const vennSection=id==='2073:602'&&s.index===5;
  const sketchSection=id==='2073:602'&&s.index===7;
  const long=promptSection?[]:paragraphs.filter(t=>t.text.length>75);
  const short=paragraphs.filter(t=>t.text.length<=75&&!/^\d+$/.test(t.text.trim()));
  let media=s.media.filter(m=>m.width>60&&m.height>60);
  const actions=s.actions.filter(a=>a.mode!=='SWAP_STATE'||meaningful(a.label));
  if(/MOODBOARD|CONCEPTBOARD/.test(title)&&actions.some(a=>mediaFor(a.target).length))media=[];
  if(title.includes('PALETA'))actions.forEach((a,i)=>{if(short[i])a.label=short[i].text;});
  const actionLabels=new Set(actions.map(a=>a.label.replace(/\s+/g,' ').trim()));
  const labels=short.filter(t=>!actionLabels.has(t.text.replace(/\s+/g,' ').trim()));
  const insectSection=id==='2073:602'&&s.index===2;
  const snackSection=id==='2073:602'&&s.index===1;
  return `<section class="flow-section ${s.index%2?'flow-light':'flow-tint'}" aria-labelledby="flow-heading-${id.replace(':','-')}-${s.index}"><div class="flow-wrap">
   <div class="flow-section-head"><span class="flow-kicker">TOTOK · ${String(s.index||1).padStart(2,'0')}</span>${title?`<h2 id="flow-heading-${id.replace(':','-')}-${s.index}">${escape(title)}</h2>`:`<h2 class="sr" id="flow-heading-${id.replace(':','-')}-${s.index}">${escape(data[id].name)}</h2>`}</div>
   ${long.length?`<div class="flow-copy ${long.length>1?'flow-copy-columns':''}">${long.map(t=>`<p>${escape(t.text)}</p>`).join('')}</div>`:''}
   ${!vennSection&&labels.length?`<ul class="flow-labels">${labels.map(t=>`<li>${escape(t.text)}</li>`).join('')}</ul>`:''}
   ${title.includes('PALETA')?`<div class="flow-palette" aria-label="Paleta de colores TOTOK"><span style="--swatch:#ab2c2d"></span><span style="--swatch:#dd7d2a"></span><span style="--swatch:#a97858"></span><span style="--swatch:#9ab75e"></span></div>`:''}
   ${vennSection?venn():promptSection?promptCards(s):sketchSection?carousel(media.map(m=>`<figure class="flow-carousel-slide">${image(m,"Boceto del proyecto TOTOK")}</figure>`),"Galería de bocetaje","sketches"):insectSection?insectGallery(s):snackSection?snackGallery(media):media.length?`<div class="flow-gallery ${media.length===1?'flow-gallery-single':''}">${media.map(m=>image(m, title?`Recurso visual: ${title}`:'')).join('')}</div>`:''}
   ${!insectSection&&!vennSection&&!promptSection&&actions.length?`<div class="flow-details-grid">${actions.map(actionCard).join('')}</div>`:''}
  </div></section>`;
 }
 function productCard(id,index){
  const name=data[id]?.name||'TOTOK',texts=flat(id);const picture=mediaFor(id).sort((a,b)=>b.width*b.height-a.width*a.height)[0];
  const flavors=['Pimienta rosa y limón','Mango y habanero','Chipotle y cacao'];
  return `<article class="flow-product ${['pink','fuego','choco'][index]}"><span class="flow-kicker">0${index+1}</span>${picture?image(picture,`Empaque ${name}`,'flow-package'):''}<div><h2>${escape(name)}</h2><p>${flavors[index]}</p>${route(id,'Ver más →')}</div></article>`;
 }
 function product(id){
  const info=data[id],texts=flat(id);const picture=mediaFor(id).sort((a,b)=>b.width*b.height-a.width*a.height)[0];
  const description=texts.find(t=>t.text.length>80)?.text||'';const stats=texts.filter(t=>/Proteína|Cont.neto|Picor/.test(t.text));
  const index=productIds.indexOf(id);
  return `<article class="flow-page flow-product-page ${['pink','fuego','choco'][index]}"><div class="flow-product-layout flow-wrap"><div class="flow-product-copy"><span class="flow-kicker">TOTOK · Nuestros sabores</span><h1>${escape(info.name)}</h1><p>${escape(description)}</p><ul class="flow-stats">${stats.map(t=>`<li>${escape(t.text)}</li>`).join('')}</ul>${route('2084:394','← Todos los empaques')}</div>${picture?image(picture,`Empaque ${info.name}`,'flow-package'):''}</div><nav class="flow-other-products" aria-label="Otros sabores">${productIds.filter(p=>p!==id).map(p=>route(p,data[p].name)).join('')}</nav></article>`;
 }
 function home(){
  const v=mediaFor('2048:6997').find(m=>m.type==='video');
  return `<article class="flow-home"><div class="flow-home-film">${v?`<video autoplay loop muted playsinline poster="${v.poster}" aria-label="Video de presentación TOTOK"><source src="${v.src}" type="video/mp4"></video>`:''}</div><div class="flow-wrap flow-home-content"><span class="flow-kicker">TOTOK · Equipo 4</span><h1>Naturalmente<br>atrevido.</h1><nav class="flow-home-nav" aria-label="Explorar proyecto">${nav.map(([id,name],i)=>route(id,`${String(i+1).padStart(2,'0')} · ${name}`,'flow-nav-card')).join('')}</nav></div></article>`;
 }
 function markup(id,dialog=false){
  if(!data[id])return null;
  if(!primary[id]&&id!=='2048:6997'&&!data[id].sections.some(s=>s.texts.length||s.media.length))return null;
  if(id==='2048:6997')return home();
  if(productIds.includes(id))return product(id);
  const meta=primary[id],all=data[id].sections;
  if(meta){
   const body=all.filter(s=>s.index>0);
   return `<article class="flow-page flow-${meta[1]}"><header class="flow-hero"><span class="flow-kicker">TOTOK · Equipo 4</span><h1>${meta[0]}</h1><a class="flow-jump" href="#flow-content">Explorar sección <span aria-hidden="true">↓</span></a></header><div id="flow-content">${id==='2084:394'?`<div class="flow-products flow-wrap">${productIds.map(productCard).join('')}</div>`:body.map(s=>section(s,id)).join('')}</div><nav class="flow-next flow-wrap" aria-label="Continuar explorando">${nav.filter(([p])=>p!==id).map(([p,name])=>route(p,name+' →')).join('')}</nav></article>`;
  }
  const title=flat(id).find(t=>t.size>=38&&t.text.length<120)?.text||flat(id).find(t=>t.text.length<100&&!/^\d+$/.test(t.text.trim()))?.text||data[id].name;
  return `<article class="flow-page flow-generic ${dialog?'flow-dialog':''}">${!dialog?`<header class="flow-small-hero"><span class="flow-kicker">TOTOK · Proyecto</span><h1>${escape(title)}</h1>${route('2073:602','← Volver al proyecto')}</header>`:''}${all.map(s=>section(s,id)).join('')}</article>`;
 }
 return {ready,compact,markup,enhance,cleanup,promptMarkup};
})();
