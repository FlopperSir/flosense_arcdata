const API  = 'https://api.github.com/repos/FlopperSir/arcraiders-data/contents/items';
const RAW  = 'https://raw.githubusercontent.com/FlopperSir/arcraiders-data/main/items/';
const CDN  = 'https://cdn.arctracker.io/items/';

const LANGS = {
  en:'English',es:'Español',de:'Deutsch',fr:'Français',pt:'Português','pt-BR':'Português (BR)',
  it:'Italiano',ja:'日本語','ko-KR':'한국어','zh-CN':'中文(简)','zh-TW':'中文(繁)',
  ru:'Русский',uk:'Українська',pl:'Polski',tr:'Türkçe',da:'Dansk',no:'Norsk',
  hr:'Hrvatski',sr:'Srpski',he:'עברית'
};

const UI = {
  en:{search:'Search items by name, type, rarity...',sortName:'Name A-Z',sortNameD:'Name Z-A',sortPriceH:'Price: High to Low',sortPriceL:'Price: Low to High',sortRarity:'Rarity',sortType:'Type',items:'items',enabled:'enabled',disabled:'disabled',shown:'shown',enableAll:'Enable All',disableAll:'Disable All',export:'Export',import:'Import',all:'All',loading:'Loading items from GitHub...',noResults:'No items match your search.',value:'Value',espVis:'ESP Visible',on:'Enabled',off:'Disabled',weight:'Weight',stack:'Stack Size',foundIn:'Found In',craftBench:'Craft Bench',recipe:'Recipe',recycle:'Recycle Into',salvage:'Salvage Into',upgrade:'Upgrade Cost',effects:'Effects',enableEsp:'Enable in ESP',disableEsp:'Disable in ESP',badge:'ESP ITEM MANAGER',heroSub:'Toggle items on/off to control ESP visibility',updated:'Updated',distance:'Distance',meters:'m'},
  es:{search:'Buscar items por nombre, tipo, rareza...',sortName:'Nombre A-Z',sortNameD:'Nombre Z-A',sortPriceH:'Precio: Mayor a Menor',sortPriceL:'Precio: Menor a Mayor',sortRarity:'Rareza',sortType:'Tipo',items:'items',enabled:'activos',disabled:'inactivos',shown:'mostrados',enableAll:'Activar Todo',disableAll:'Desactivar Todo',export:'Exportar',import:'Importar',all:'Todos',loading:'Cargando items desde GitHub...',noResults:'No se encontraron items.',value:'Valor',espVis:'ESP Visible',on:'Activado',off:'Desactivado',weight:'Peso',stack:'Cantidad Max',foundIn:'Encontrado En',craftBench:'Mesa de Crafteo',recipe:'Receta',recycle:'Reciclar En',salvage:'Desguazar En',upgrade:'Costo de Mejora',effects:'Efectos',enableEsp:'Activar en ESP',disableEsp:'Desactivar en ESP',badge:'GESTOR DE ITEMS ESP',heroSub:'Activa o desactiva items para controlar la visibilidad del ESP',updated:'Actualizado',distance:'Distancia',meters:'m'},
  de:{search:'Items nach Name, Typ, Seltenheit suchen...',sortName:'Name A-Z',sortNameD:'Name Z-A',sortPriceH:'Preis: Hoch-Niedrig',sortPriceL:'Preis: Niedrig-Hoch',sortRarity:'Seltenheit',sortType:'Typ',items:'Items',enabled:'aktiv',disabled:'inaktiv',shown:'angezeigt',enableAll:'Alle aktivieren',disableAll:'Alle deaktivieren',export:'Exportieren',import:'Importieren',all:'Alle',loading:'Lade Items von GitHub...',noResults:'Keine passenden Items.',value:'Wert',espVis:'ESP Sichtbar',on:'Aktiviert',off:'Deaktiviert',weight:'Gewicht',stack:'Stapelgröße',foundIn:'Fundort',craftBench:'Werkbank',recipe:'Rezept',recycle:'Recyceln zu',salvage:'Verwerten zu',upgrade:'Upgrade-Kosten',effects:'Effekte',enableEsp:'Im ESP aktivieren',disableEsp:'Im ESP deaktivieren',badge:'ESP ITEM MANAGER',heroSub:'Items ein/ausschalten um ESP-Sichtbarkeit zu steuern',updated:'Aktualisiert',distance:'Entfernung',meters:'m'},
  fr:{search:'Rechercher par nom, type, rareté...',sortName:'Nom A-Z',sortNameD:'Nom Z-A',sortPriceH:'Prix: Décroissant',sortPriceL:'Prix: Croissant',sortRarity:'Rareté',sortType:'Type',items:'objets',enabled:'activés',disabled:'désactivés',shown:'affichés',enableAll:'Tout activer',disableAll:'Tout désactiver',export:'Exporter',import:'Importer',all:'Tous',loading:'Chargement depuis GitHub...',noResults:'Aucun objet trouvé.',value:'Valeur',espVis:'ESP Visible',on:'Activé',off:'Désactivé',weight:'Poids',stack:'Taille pile',foundIn:'Trouvé dans',craftBench:'Établi',recipe:'Recette',recycle:'Recycler en',salvage:'Récupérer en',upgrade:'Coût amélioration',effects:'Effets',enableEsp:'Activer ESP',disableEsp:'Désactiver ESP',badge:'GESTIONNAIRE ESP',heroSub:'Activez/désactivez les objets pour contrôler la visibilité ESP',updated:'Mis à jour',distance:'Distance',meters:'m'},
  ru:{search:'Поиск по названию, типу, редкости...',sortName:'Имя А-Я',sortNameD:'Имя Я-А',sortPriceH:'Цена: по убыванию',sortPriceL:'Цена: по возрастанию',sortRarity:'Редкость',sortType:'Тип',items:'предметов',enabled:'включено',disabled:'выключено',shown:'показано',enableAll:'Включить все',disableAll:'Выключить все',export:'Экспорт',import:'Импорт',all:'Все',loading:'Загрузка предметов с GitHub...',noResults:'Ничего не найдено.',value:'Цена',espVis:'ESP Видимость',on:'Включено',off:'Выключено',weight:'Вес',stack:'Размер стопки',foundIn:'Найдено в',craftBench:'Верстак',recipe:'Рецепт',recycle:'Переработка',salvage:'Утилизация',upgrade:'Стоимость улучшения',effects:'Эффекты',enableEsp:'Включить в ESP',disableEsp:'Выключить в ESP',badge:'МЕНЕДЖЕР ПРЕДМЕТОВ ESP',heroSub:'Включайте/выключайте предметы для управления видимостью ESP',updated:'Обновлено',distance:'Дистанция',meters:'м'},
  ja:{search:'名前、タイプ、レアリティで検索...',sortName:'名前 A-Z',sortNameD:'名前 Z-A',sortPriceH:'価格: 高い順',sortPriceL:'価格: 安い順',sortRarity:'レアリティ',sortType:'タイプ',items:'アイテム',enabled:'有効',disabled:'無効',shown:'表示中',enableAll:'全て有効',disableAll:'全て無効',export:'エクスポート',import:'インポート',all:'全て',loading:'GitHubからアイテムを読み込み中...',noResults:'該当するアイテムがありません。',value:'価値',espVis:'ESP表示',on:'有効',off:'無効',weight:'重量',stack:'スタック数',foundIn:'入手先',craftBench:'作業台',recipe:'レシピ',recycle:'リサイクル',salvage:'解体',upgrade:'アップグレード費用',effects:'効果',enableEsp:'ESPで有効化',disableEsp:'ESPで無効化',badge:'ESP アイテム管理',heroSub:'アイテムのオン/オフでESP表示を制御',updated:'更新日',distance:'距離',meters:'m'}
};

const rarityOrd = {Common:0,Uncommon:1,Rare:2,Epic:3,Legendary:4};
const rarityCol = {Common:'#8b95a5',Uncommon:'#34d399',Rare:'#60a5fa',Epic:'#c084fc',Legendary:'#fbbf24'};
const benchNames = {weapon_bench:'Weapon Bench',refiner:'Refiner',armor_bench:'Armor Bench',consumable_bench:'Consumable Bench',mod_bench:'Mod Bench'};

let allItems=[], enabled={}, globalDistance=500, activeType='All', lang='en';

function t(k){ return (UI[lang] && UI[lang][k]) || UI.en[k] || k; }
function nm(item){ return (item.name && (item.name[lang] || item.name.en)) || item.id.replace(/_/g,' '); }
function desc(item){ return (item.description && (item.description[lang] || item.description.en)) || ''; }
function esc(s){ const d=document.createElement('div'); d.textContent=s; return d.innerHTML; }

function icon(item){
  if(item.imageFilename && item.imageFilename.startsWith('http')) return item.imageFilename;
  const b=item.id.replace(/_iv$/,'').replace(/_iii$/,'').replace(/_ii$/,'').replace(/_i$/,'');
  return CDN+b+'.png';
}

function fmtMat(s){ return s.replace(/_/g,' ').replace(/\b\w/g,c=>c.toUpperCase()); }

function initLangSelect(){
  const sel=document.getElementById('langSelect');
  sel.innerHTML='';
  for(const[code,label] of Object.entries(LANGS)){
    const o=document.createElement('option');
    o.value=code; o.textContent=label;
    if(code===lang) o.selected=true;
    sel.appendChild(o);
  }
}

function initSortSelect(){
  const sel=document.getElementById('sortSelect');
  sel.innerHTML='';
  const opts=[['name',t('sortName')],['name-desc',t('sortNameD')],['price-desc',t('sortPriceH')],['price-asc',t('sortPriceL')],['rarity',t('sortRarity')],['type',t('sortType')]];
  for(const[v,l] of opts){
    const o=document.createElement('option');
    o.value=v; o.textContent=l;
    sel.appendChild(o);
  }
}

function updateUI(){
  document.getElementById('searchInput').placeholder=t('search');
  document.getElementById('heroBadgeText').textContent=t('badge');
  document.getElementById('heroSub').textContent=t('heroSub');
  document.getElementById('lblTotal').textContent=t('items');
  document.getElementById('lblOn').textContent=t('enabled');
  document.getElementById('lblOff').textContent=t('disabled');
  document.getElementById('lblShown').textContent=t('shown');
  document.getElementById('btnOn').textContent=t('enableAll');
  document.getElementById('btnOff').textContent=t('disableAll');
  document.getElementById('btnExp').textContent=t('export');
  document.getElementById('btnImp').textContent=t('import');
  document.getElementById('noRes').textContent=t('noResults');
  document.getElementById('distLabel').textContent=t('distance')+' (ESP)';
  document.getElementById('distVal').textContent=globalDistance+t('meters');
  initSortSelect();
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
    el.textContent=tp==='All'?t('all'):tp;
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
  const isFilt=items.length<allItems.length;
  document.getElementById('sFilterWrap').style.display=isFilt?'':'none';
  document.getElementById('sFilter').textContent=items.length;

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

function toggle(id){enabled[id]=!enabled[id];save();render();}
function toggleAll(state){for(const it of getFiltered())enabled[it.id]=state;save();render();}
function save(){localStorage.setItem('arc-item-filter',JSON.stringify(enabled));}
function saveGlobalDist(){localStorage.setItem('arc-global-distance',String(globalDistance));}

function doExport(){
  const data={enabled,globalDistance};
  const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='arc-item-filter.json';a.click();URL.revokeObjectURL(a.href);
}
function doImport(){
  const inp=document.createElement('input');inp.type='file';inp.accept='.json';
  inp.addEventListener('change',async function(){
    const f=this.files[0];if(!f)return;
    try{
      const data=JSON.parse(await f.text());
      if(data.enabled) Object.assign(enabled,data.enabled); else Object.assign(enabled,data);
      if(typeof data.globalDistance==='number'){globalDistance=data.globalDistance;document.getElementById('globalDist').value=globalDistance;document.getElementById('distVal').textContent=globalDistance+t('meters');saveGlobalDist();}
      save();render();
    }catch(_){alert('Invalid file');}
  });inp.click();
}

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

  html+='<div class="m-section"><div class="m-section-title"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/></svg>'+t('value')+' & Info</div>';
  if(item.value) html+='<div class="m-row"><span class="lbl">'+t('value')+'</span><span class="vl" style="color:var(--gold)">$'+item.value.toLocaleString()+'</span></div>';
  html+='<div class="m-row"><span class="lbl">'+t('espVis')+'</span><span class="vl" style="color:'+(on?'var(--green)':'var(--red)')+'">'+(on?t('on'):t('off'))+'</span></div>';
  if(item.weightKg) html+='<div class="m-row"><span class="lbl">'+t('weight')+'</span><span class="vl">'+item.weightKg+' kg</span></div>';
  if(item.stackSize) html+='<div class="m-row"><span class="lbl">'+t('stack')+'</span><span class="vl">'+item.stackSize+'</span></div>';
  if(item.foundIn) html+='<div class="m-row"><span class="lbl">'+t('foundIn')+'</span><span class="vl">'+esc(item.foundIn)+'</span></div>';
  if(item.craftBench) html+='<div class="m-row"><span class="lbl">'+t('craftBench')+'</span><span class="vl">'+esc(benchNames[item.craftBench]||fmtMat(item.craftBench))+'</span></div>';
  if(item.updatedAt) html+='<div class="m-row"><span class="lbl">'+t('updated')+'</span><span class="vl">'+esc(item.updatedAt)+'</span></div>';
  html+='</div>';

  if(item.effects && Object.keys(item.effects).length){
    html+='<div class="m-section"><div class="m-section-title"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>'+t('effects')+'</div>';
    for(const[key,eff] of Object.entries(item.effects)){
      const label=eff[lang]||eff.en||key;
      html+='<div class="m-row"><span class="lbl">'+esc(label)+'</span><span class="vl">'+esc(String(eff.value))+'</span></div>';
    }
    html+='</div>';
  }

  if(item.recipe && Object.keys(item.recipe).length){
    html+='<div class="m-section"><div class="m-section-title"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M12 12h.01"/></svg>'+t('recipe')+'</div><div class="m-chips">';
    for(const[mat,qty] of Object.entries(item.recipe)) html+='<span class="m-chip">'+fmtMat(mat)+' x'+qty+'</span>';
    html+='</div></div>';
  }

  if(item.recyclesInto && Object.keys(item.recyclesInto).length){
    html+='<div class="m-section"><div class="m-section-title"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>'+t('recycle')+'</div><div class="m-chips">';
    for(const[mat,qty] of Object.entries(item.recyclesInto)) html+='<span class="m-chip">'+fmtMat(mat)+' x'+qty+'</span>';
    html+='</div></div>';
  }

  if(item.salvagesInto && Object.keys(item.salvagesInto).length){
    html+='<div class="m-section"><div class="m-section-title"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>'+t('salvage')+'</div><div class="m-chips">';
    for(const[mat,qty] of Object.entries(item.salvagesInto)) html+='<span class="m-chip">'+fmtMat(mat)+' x'+qty+'</span>';
    html+='</div></div>';
  }

  if(item.upgradeCost && Object.keys(item.upgradeCost).length){
    html+='<div class="m-section"><div class="m-section-title"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>'+t('upgrade')+'</div><div class="m-chips">';
    for(const[mat,qty] of Object.entries(item.upgradeCost)) html+='<span class="m-chip">'+fmtMat(mat)+' x'+qty+'</span>';
    html+='</div></div>';
  }

  body.innerHTML=html;
  foot.innerHTML='<button class="btn btn-p" id="mToggle">'+(on?t('disableEsp'):t('enableEsp'))+'</button>';

  document.getElementById('mToggle').addEventListener('click',function(){toggle(item.id);showModal(item);});
  document.getElementById('modalX').addEventListener('click',closeModal);
  bg.classList.add('open');
}

function closeModal(){document.getElementById('modalBg').classList.remove('open');}

async function init(){
  const savedLang=localStorage.getItem('arc-lang');
  if(savedLang && LANGS[savedLang]) lang=savedLang;
  initLangSelect();
  updateUI();

  document.getElementById('ldText').textContent=t('loading');

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
  document.getElementById('distVal').textContent=globalDistance+t('meters');
  for(const it of allItems) if(!(it.id in enabled)) enabled[it.id]=true;

  document.getElementById('heroSub').innerHTML=allItems.length+' '+t('items')+' &middot; '+t('heroSub');

  buildPills();
  render();
  document.getElementById('ldScreen').style.display='none';
  document.getElementById('grid').style.display='';
}

document.getElementById('globalDist').addEventListener('input',function(){
  globalDistance=parseInt(this.value);
  document.getElementById('distVal').textContent=globalDistance+t('meters');
  saveGlobalDist();
});
document.getElementById('searchInput').addEventListener('input',render);
document.getElementById('sortSelect').addEventListener('change',render);
document.getElementById('langSelect').addEventListener('change',function(){
  lang=this.value;
  localStorage.setItem('arc-lang',lang);
  updateUI();
  buildPills();
  render();
  document.getElementById('heroSub').innerHTML=allItems.length+' '+t('items')+' &middot; '+t('heroSub');
});
document.getElementById('btnOn').addEventListener('click',function(){toggleAll(true);});
document.getElementById('btnOff').addEventListener('click',function(){toggleAll(false);});
document.getElementById('btnExp').addEventListener('click',doExport);
document.getElementById('btnImp').addEventListener('click',doImport);
document.getElementById('modalBg').addEventListener('click',function(e){if(e.target===this)closeModal();});
document.addEventListener('keydown',function(e){if(e.key==='Escape')closeModal();});

init();

