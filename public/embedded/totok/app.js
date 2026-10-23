/* Local SVG screens are generated from the original Figma scene by build.py. */
const $=s=>document.querySelector(s);
const names={'2048:6997':'Inicio','2073:602':'Investigación','2030:6086':'Producción','2030:6284':'Marca','2084:394':'Empaque'};
const cache=new Map(); let screens=[],current='',request=0;
const safeId=id=>/^\d+:\d+$/.test(id);
async function screenMarkup(id,dialog=false){
  if(window.TotokFlow?.compact.matches||['2030:6086','2030:6284'].includes(id)){const flow=TotokFlow.markup(id,dialog);if(flow)return flow;}
  const item=screens.find(s=>s.id===id);if(!item)throw new Error('No se encontró la pantalla.');
  if(!cache.has(id)){
    const response=await fetch(item.file);if(!response.ok)throw new Error('No se pudo cargar la pantalla.');
    cache.set(id,await response.text());
  }return cache.get(id);
}
async function navigate(){
  const seq=++request;let id=new URLSearchParams(location.hash.slice(1)).get('screen')||'2048:6997';
  if(!safeId(id)||!screens.some(s=>s.id===id))id='2048:6997';
  try{const markup=await screenMarkup(id);if(seq!==request)return;
    TotokFlow.cleanup();$('#stage').innerHTML=markup;TotokFlow.enhance($('#stage'));current=id;
    document.body.classList.toggle('flow-active',TotokFlow.compact.matches||['2030:6086','2030:6284'].includes(id));document.body.classList.toggle('production-active',['2030:6086','2030:6284'].includes(id));
    document.querySelectorAll('#mobile-links a').forEach(a=>{if(a.hash===`#screen=${id}`)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});window.scrollTo({top:0,left:0,behavior:'instant'});closeDialogs();
    document.title=`TOTOK · ${names[id]||screens.find(s=>s.id===id).name}`;
    $('#mobile-links').hidden=true;$('#menu').setAttribute('aria-expanded','false');
  }catch(error){$('#stage').textContent=error.message;}
}
function closeDialogs(){document.querySelectorAll('dialog[open]').forEach(d=>d.close());document.body.classList.remove('modal');}
function showDialog(d){d.showModal();document.body.classList.add('modal');}
async function follow(event){
  const jump=event.target.closest('.flow-jump,a[href="#stage"]');if(jump){event.preventDefault();const section=document.querySelector(jump.classList.contains('flow-jump')?'#flow-content':'#stage');section?.scrollIntoView({behavior:'smooth',block:'start'});if(!jump.classList.contains('flow-jump'))section?.focus();return;}
  const prompt=event.target.closest('[data-prompt]');if(prompt){const markup=TotokFlow.promptMarkup(Number(prompt.dataset.prompt));if(markup){$('#overlay-content').innerHTML=markup;showDialog($('#overlay'));$('#overlay').scrollTop=0;}return;}
  const link=event.target.closest('[data-target]');if(!link)return;
  event.preventDefault();const target=link.dataset.target,mode=link.dataset.mode;
  if(target==='top'&&mode==='SCROLL_TO'){window.scrollTo({top:0,behavior:'smooth'});return;}
  if(!safeId(target))return;
  if(mode==='OVERLAY'||(mode==='SWAP_STATE'&&TotokFlow.compact.matches)){
    try{$('#overlay-content').innerHTML=await screenMarkup(target,true);if(!$('#overlay').open)showDialog($('#overlay'));$('#overlay').scrollTop=0;}
    catch(e){$('#status').textContent=e.message;}return;
  }
  if(mode==='SCROLL_TO'){
    const node=document.querySelector(`[data-node="${target}"]`);if(node){node.scrollIntoView({behavior:'smooth',block:'start'});return;}
  }
  if(mode==='SWAP_STATE'){
    const host=link.closest('g[data-node]');try{const markup=await screenMarkup(target);const temp=new DOMParser().parseFromString(markup,'image/svg+xml');const svg=temp.documentElement;const root=svg.querySelector(':scope > g');const defs=svg.querySelector('defs');if(defs)document.querySelector('#stage svg defs').append(...Array.from(defs.children).map(n=>document.importNode(n,true)));if(host&&root){root.setAttribute('transform',host.getAttribute('transform')||'');host.replaceWith(document.importNode(root,true));}}catch(e){$('#status').textContent=e.message;}return;
  }
  if(location.hash===`#screen=${target}`)navigate();else location.hash=`screen=${target}`;
}
document.addEventListener('click',follow);
document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>{document.getElementById(b.dataset.close).close();if(!document.querySelector('dialog[open]'))document.body.classList.remove('modal');}));
document.querySelectorAll('dialog').forEach(d=>{d.addEventListener('cancel',()=>document.body.classList.remove('modal'));d.addEventListener('click',e=>{if(e.target===d){d.close();document.body.classList.remove('modal');}});});
$('#menu').onclick=()=>{const open=$('#mobile-links').hidden;$('#mobile-links').hidden=!open;$('#menu').setAttribute('aria-expanded',String(open));};
window.addEventListener('hashchange',navigate);
Promise.all([fetch('screens.json').then(r=>{if(!r.ok)throw new Error('No se pudo cargar el proyecto.');return r.json();}),TotokFlow.ready]).then(([data])=>{screens=data;navigate();}).catch(e=>$('#stage').textContent=e.message);
TotokFlow.compact.addEventListener('change',()=>{if(screens.length)navigate();});
