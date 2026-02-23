const API  = 'https://api.github.com/repos/FlopperSir/arcraiders-data/contents/items';
const RAW  = 'https://raw.githubusercontent.com/FlopperSir/arcraiders-data/main/items/';
const CDN  = 'https://cdn.arctracker.io/items/';
const SYNC_INTERVAL = 2000;

const GROUND_TYPES = [
  'Launcher','Rifle','Consumable','Launcher Ammo','Launcher Ammo','Rifle Ammo',
  'Throwable','Deployable','Modification','Gadget','Armor','Crafting Reagent',
  'Backpack','Crafting Part','Misc','Melee','Generator','Currency','Recipe',
  'MetaItem','Unarmed','Augment'
];

const rarityOrd = {Common:0,Uncommon:1,Rare:2,Epic:3,Legendary:4};
const rarityCol = {Common:'#8b95a5',Uncommon:'#34d399',Rare:'#60a5fa',Epic:'#c084fc',Legendary:'#fbbf24'};
const benchNames = {weapon_bench:'Weapon Bench',refiner:'Refiner',armor_bench:'Armor Bench',consumable_bench:'Consumable Bench',mod_bench:'Mod Bench'};

let allItems=[], enabled={}, legacyCategories=[], globalDistance=500, activeType='All', currentMode='items';
let connected = false, syncTimer = null;

for(let i=0;i<22;i++) legacyCategories[i]=true;

function nm(item){ return (item.name && (item.name.en || item.name.es)) || item.id.replace(/_/g,' '); }
function desc(item){ return (item.description && (item.description.en || item.description.es)) || ''; }
function esc(s){ const d=document.createElement('div'); d.textContent=s; return d.innerHTML; }
function fmtMat(s){ return s.replace(/_/g,' ').replace(/\b\w/g,c=>c.toUpperCase()); }

function icon(item){
  if(item.imageFilename && item.imageFilename.startsWith('http')) return item.imageFilename;
  const b=item.id.replace(/_iv$/,'').replace(/_iii$/,'').replace(/_ii$/,'').replace(/_i$/,'');
  return CDN+b+'.png';
}

function switchMode(mode){
  currentMode=mode;
  document.getElementById('tabItems').classList.toggle('active',mode==='items');
  document.getElementById('tabLegacy').classList.toggle('active',mode==='legacy');
  document.getElementById('itemsView').style.display=mode==='items'?'':'none';
  document.getElementById('legacyView').style.display=mode==='legacy'?'':'none';
  syncToServer();
}
window.switchMode=switchMode;

function updateConnection(ok){
  connected=ok;
  const dot=document.getElementById('connDot');
  const sub=document.getElementById('heroSub');
  if(ok){
    dot.style.background='var(--green)';
    sub.innerHTML='<span class="conn-dot" style="background:var(--green)"></span>Connected to cheat &middot; '+allItems.length+' items loaded';
  } else {
    dot.style.background='var(--red)';
    sub.innerHTML='<span class="conn-dot" style="background:var(--red)"></span>Not connected to cheat';
  }
}

async function syncToServer(){
  if(typeof SERVER==='undefined') return;
  try{
    const payload={
      mode: currentMode,
      globalDistance: globalDistance,
      legacyCategories: legacyCategories,
      enabled: enabled
    };
    const res=await fetch(SERVER+'/config',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify(payload)
    });
    if(res.ok) updateConnection(true);
    else updateConnection(false);
  }catch(e){
    updateConnection(false);
  }
}

async function pingServer(){
  if(typeof SERVER==='undefined') return;
  try{
    const res=await fetch(SERVER+'/ping',{method:'GET'});
    updateConnection(res.ok);
  }catch(e){
    updateConnection(false);
  }
}

function buildPills(){
  const types=['All'];
  const seen=new Set();
  for(const it of allItems) if(it.type && !seen.has(it.type)){seen.add(it.type);types.push(it.type);}
  types.sort((a,b)=>a==='All'?-1:b==='All'?1:a.localeCompare(b));
  const box=document.getElementById('filterPills');
  box.innerHTML='';
  for(const tp of types){
    const el=document.createElement('div');
    el.className='pill'+(tp===activeType?' active':'');
    el.textContent=tp==='All'?'All':tp;
    el.addEventListener('click',()=>{activeType=tp;buildPills();render();});
    box.appendChild(el);
  }
}

function getFiltered(){
  const q=document.getElementById('searchInput').value.toLowerCase().trim();
  const sort=document.getElementById('sortSelect').value;
  let list=allItems.filter(it=>{
    if(activeType!=='All' && it.type!==activeType) return false;
    if(!q) return true;
    const n=nm(it).toLowerCase();
    return n.includes(q)||it.id.includes(q)||(it.type||'').toLowerCase().includes(q)||(it.rarity||'').toLowerCase().includes(q);
  });
  list.sort((a,b)=>{
    const na=nm(a),nb=nm(b);
    switch(sort){
      case 'name':return na.localeCompare(nb);
      case 'name-desc':return nb.localeCompare(na);
      case 'price-desc':return(b.value||0)-(a.value||0);
      case 'price-asc':return(a.value||0)-(b.value||0);
      case 'rarity':return(rarityOrd[b.rarity]||0)-(rarityOrd[a.rarity]||0)||na.localeCompare(nb);
      case 'type':return(a.type||'').localeCompare(b.type||'')||na.localeCompare(nb);
      default:return 0;
    }
  });
  return list;
}

function render(){
  const items=getFiltered();
  const grid=document.getElementById('grid');
  const noR=document.getElementById('noRes');

  const totalOn=Object.values(enabled).filter(Boolean).length;
  document.getElementById('sTotal').textContent=allItems.length;
  document.getElementById('sOn').textContent=totalOn;
  document.getElementById('sOff').textContent=allItems.length-totalOn;

  if(!items.length){grid.style.display='none';noR.style.display='';return;}
  grid.style.display='';noR.style.display='none';

  grid.innerHTML='';
  const frag=document.createDocumentFragment();

  for(const it of items){
    const on=enabled[it.id]!==false;
    const name=esc(nm(it));
    const card=document.createElement('div');
    card.className='card r-'+(it.rarity||'Common')+(on?'':' off');

    let meta=esc(it.type||'Unknown');
    if(it.weightKg) meta+=' &middot; '+it.weightKg+'kg';

    card.innerHTML=
      '<div class="rb"></div>'+
      '<img class="card-img ld" data-src="'+icon(it)+'" alt="'+name+'" loading="lazy">'+
      '<div class="card-name">'+name+'</div>'+
      '<div class="card-meta">'+meta+'</div>'+
      (it.value?'<div class="card-price">$'+it.value.toLocaleString()+'</div>':'')+
      '<div class="sw '+(on?'on':'')+'" data-id="'+it.id+'"><div class="sw-k"></div></div>';

    const img=card.querySelector('img');
    img.onload=function(){this.classList.remove('ld');};
    img.onerror=function(){this.classList.remove('ld');this.style.background='var(--bg)';this.removeAttribute('src');};
    img.src=img.dataset.src;

    card.querySelector('.sw').addEventListener('click',function(e){e.stopPropagation();toggle(this.dataset.id);});
    card.addEventListener('click',showModal.bind(null,it));
    frag.appendChild(card);
  }
  grid.appendChild(frag);
}

function toggle(id){enabled[id]=!enabled[id];save();render();syncToServer();}
function toggleAll(state){for(const it of getFiltered())enabled[it.id]=state;save();render();syncToServer();}
window.toggleAll=toggleAll;
function save(){localStorage.setItem('arc-item-filter',JSON.stringify(enabled));}

function doExport(){
  const data={mode:currentMode,enabled,globalDistance,legacyCategories};
  const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='arc-item-filter.json';a.click();URL.revokeObjectURL(a.href);
}
window.doExport=doExport;

function doImport(){
  const inp=document.createElement('input');inp.type='file';inp.accept='.json';
  inp.addEventListener('change',async function(){
    const f=this.files[0];if(!f)return;
    try{
      const data=JSON.parse(await f.text());
      if(data.enabled) Object.assign(enabled,data.enabled); else Object.assign(enabled,data);
      if(typeof data.globalDistance==='number'){globalDistance=data.globalDistance;document.getElementById('globalDist').value=globalDistance;document.getElementById('distVal').textContent=globalDistance+'m';}
      if(Array.isArray(data.legacyCategories)){for(let i=0;i<22&&i<data.legacyCategories.length;i++)legacyCategories[i]=data.legacyCategories[i];renderLegacy();}
      if(data.mode) switchMode(data.mode);
      save();render();syncToServer();
    }catch(_){alert('Invalid file');}
  });inp.click();
}
window.doImport=doImport;

function renderLegacy(){
  const grid=document.getElementById('legacyGrid');
  grid.innerHTML='';
  for(let i=0;i<GROUND_TYPES.length;i++){
    const on=legacyCategories[i];
    const card=document.createElement('div');
    card.className='leg-card'+(on?'':' off');
    card.innerHTML='<span class="leg-name">'+esc(GROUND_TYPES[i])+'</span>'+
      '<div class="sw '+(on?'on':'')+'" data-idx="'+i+'"><div class="sw-k"></div></div>';
    card.addEventListener('click',function(){
      legacyCategories[i]=!legacyCategories[i];
      localStorage.setItem('arc-legacy-cats',JSON.stringify(legacyCategories));
      renderLegacy();
      syncToServer();
    });
    grid.appendChild(card);
  }
}

function legacyAll(state){
  for(let i=0;i<22;i++) legacyCategories[i]=state;
  localStorage.setItem('arc-legacy-cats',JSON.stringify(legacyCategories));
  renderLegacy();
  syncToServer();
}
window.legacyAll=legacyAll;

function showModal(item){
  const bg=document.getElementById('modalBg');
  const body=document.getElementById('modalBody');
  const foot=document.getElementById('modalFoot');
  const name=esc(nm(item));
  const d=desc(item);
  const on=enabled[item.id]!==false;
  const rc=rarityCol[item.rarity]||'#8b95a5';

  let html='<div class="m-head">'+
    '<img class="m-icon" src="'+icon(item)+'" onerror="this.style.background=\'var(--bg)\';this.removeAttribute(\'src\')">'+
    '<div class="m-info"><h2>'+name+'</h2>'+
    '<div class="m-type">'+esc(item.type||'Unknown')+'</div>'+
    '<div class="m-badges">'+
    '<span class="m-badge" style="background:'+rc+'18;color:'+rc+';border:1px solid '+rc+'35">'+(item.rarity||'Common')+'</span>'+
    (item.isWeapon?'<span class="m-badge" style="background:#f8717118;color:#f87171;border:1px solid #f8717135">Weapon</span>':'')+
    '</div></div></div>';

  if(d) html+='<div class="m-desc">'+esc(d)+'</div>';

  html+='<div class="m-section"><div class="m-section-title"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/></svg>Value & Info</div>';
  if(item.value) html+='<div class="m-row"><span class="lbl">Value</span><span class="vl" style="color:var(--gold)">$'+item.value.toLocaleString()+'</span></div>';
  html+='<div class="m-row"><span class="lbl">ESP Visible</span><span class="vl" style="color:'+(on?'var(--green)':'var(--red)')+'">'+(on?'Enabled':'Disabled')+'</span></div>';
  if(item.weightKg) html+='<div class="m-row"><span class="lbl">Weight</span><span class="vl">'+item.weightKg+' kg</span></div>';
  if(item.stackSize) html+='<div class="m-row"><span class="lbl">Stack Size</span><span class="vl">'+item.stackSize+'</span></div>';
  if(item.foundIn) html+='<div class="m-row"><span class="lbl">Found In</span><span class="vl">'+esc(item.foundIn)+'</span></div>';
  if(item.craftBench) html+='<div class="m-row"><span class="lbl">Craft Bench</span><span class="vl">'+esc(benchNames[item.craftBench]||fmtMat(item.craftBench))+'</span></div>';
  if(item.updatedAt) html+='<div class="m-row"><span class="lbl">Updated</span><span class="vl">'+esc(item.updatedAt)+'</span></div>';
  html+='</div>';

  if(item.effects && Object.keys(item.effects).length){
    html+='<div class="m-section"><div class="m-section-title"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>Effects</div>';
    for(const[key,eff] of Object.entries(item.effects)){
      const label=eff.en||key;
      html+='<div class="m-row"><span class="lbl">'+esc(label)+'</span><span class="vl">'+esc(String(eff.value))+'</span></div>';
    }
    html+='</div>';
  }

  if(item.recipe && Object.keys(item.recipe).length){
    html+='<div class="m-section"><div class="m-section-title"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M12 12h.01"/></svg>Recipe</div><div class="m-chips">';
    for(const[mat,qty] of Object.entries(item.recipe)) html+='<span class="m-chip">'+fmtMat(mat)+' x'+qty+'</span>';
    html+='</div></div>';
  }

  if(item.recyclesInto && Object.keys(item.recyclesInto).length){
    html+='<div class="m-section"><div class="m-section-title"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>Recycle Into</div><div class="m-chips">';
    for(const[mat,qty] of Object.entries(item.recyclesInto)) html+='<span class="m-chip">'+fmtMat(mat)+' x'+qty+'</span>';
    html+='</div></div>';
  }

  if(item.salvagesInto && Object.keys(item.salvagesInto).length){
    html+='<div class="m-section"><div class="m-section-title"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>Salvage Into</div><div class="m-chips">';
    for(const[mat,qty] of Object.entries(item.salvagesInto)) html+='<span class="m-chip">'+fmtMat(mat)+' x'+qty+'</span>';
    html+='</div></div>';
  }

  if(item.upgradeCost && Object.keys(item.upgradeCost).length){
    html+='<div class="m-section"><div class="m-section-title"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>Upgrade Cost</div><div class="m-chips">';
    for(const[mat,qty] of Object.entries(item.upgradeCost)) html+='<span class="m-chip">'+fmtMat(mat)+' x'+qty+'</span>';
    html+='</div></div>';
  }

  body.innerHTML=html;
  foot.innerHTML='<button class="btn btn-p" id="mToggle">'+(on?'Disable in ESP':'Enable in ESP')+'</button>';

  document.getElementById('mToggle').addEventListener('click',function(){toggle(item.id);showModal(item);});
  document.getElementById('modalX').addEventListener('click',closeModal);
  bg.classList.add('open');
}

function closeModal(){document.getElementById('modalBg').classList.remove('open');}

async function init(){
  const savedCats=localStorage.getItem('arc-legacy-cats');
  if(savedCats) try{const arr=JSON.parse(savedCats);for(let i=0;i<22&&i<arr.length;i++)legacyCategories[i]=arr[i];}catch(_){}

  renderLegacy();
  switchMode('items');

  pingServer();

  const res=await fetch(API,{headers:{Accept:'application/vnd.github.v3+json'}});
  const files=(await res.json()).filter(f=>f.name.endsWith('.json'));
  const total=files.length;
  const prog=document.getElementById('ldProg');
  prog.textContent='0 / '+total;

  const BATCH=20;
  let loaded=0;
  for(let i=0;i<files.length;i+=BATCH){
    const batch=files.slice(i,i+BATCH);
    const results=await Promise.allSettled(batch.map(f=>fetch(RAW+f.name).then(r=>r.json())));
    for(const r of results) if(r.status==='fulfilled'&&r.value&&r.value.id) allItems.push(r.value);
    loaded+=batch.length;
    prog.textContent=Math.min(loaded,total)+' / '+total;
  }

  const saved=localStorage.getItem('arc-item-filter');
  if(saved) try{enabled=JSON.parse(saved);}catch(_){}
  const savedDist=localStorage.getItem('arc-global-distance');
  if(savedDist){const v=parseInt(savedDist);if(v>=1&&v<=1000) globalDistance=v;}
  document.getElementById('globalDist').value=globalDistance;
  document.getElementById('distVal').textContent=globalDistance+'m';
  for(const it of allItems) if(!(it.id in enabled)) enabled[it.id]=true;

  buildPills();
  render();
  document.getElementById('ldScreen').style.display='none';
  document.getElementById('grid').style.display='';

  syncToServer();

  syncTimer=setInterval(pingServer, SYNC_INTERVAL);
}

document.getElementById('globalDist').addEventListener('input',function(){
  globalDistance=parseInt(this.value);
  document.getElementById('distVal').textContent=globalDistance+'m';
  localStorage.setItem('arc-global-distance',String(globalDistance));
  syncToServer();
});
document.getElementById('searchInput').addEventListener('input',render);
document.getElementById('sortSelect').addEventListener('change',render);
document.getElementById('modalBg').addEventListener('click',function(e){if(e.target===this)closeModal();});
document.addEventListener('keydown',function(e){if(e.key==='Escape')closeModal();});

init();
