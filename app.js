/* ============================================================================
   ChronoCartes — prototype hotseat (1 seul appareil, on se passe le téléphone)
   Vanilla JS, machine à états. Les années sont cachées jusqu'à la révélation.
   ========================================================================== */
"use strict";

/* ------------------------------- Données --------------------------------- */
const THEME_ICON = {
  Politique:"🏛️", Guerre:"⚔️", Science:"🔬", Exploration:"🧭", Culture:"🎭", "Société":"👥"
};
let EVENTS = {};      // id -> event
let ALL_IDS = [];

// couleurs par joueur (pastilles, avatars)
const PLAYER_COLORS = ["#c0532b","#2e6d8a","#2f7d5c","#a9812f","#6b4a8a","#9b3b2f","#3f7d7d","#7a5a2e"];
const pColor = i => PLAYER_COLORS[i % PLAYER_COLORS.length];

/* --------------------------------- État ---------------------------------- */
const app = document.getElementById("app");
let S = null;         // état de partie courant

const CFG_DEFAULT = { nbPlayers:2, names:[], handSize:6, scoreMode:"mixte", rounds:8 };

/* ------------------------------- Utilitaires ----------------------------- */
function fmtYear(y){ return y < 0 ? `${-y} av. J.-C.` : `${y}`; }
function shuffle(a){ for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }
function esc(s){ return String(s).replace(/[&<>"]/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c])); }
let toastTimer=null;
function toast(msg){
  const t=document.getElementById("toast"); t.textContent=msg; t.classList.add("show");
  clearTimeout(toastTimer); toastTimer=setTimeout(()=>t.classList.remove("show"),1600);
}

/* --------------------------- Rendu d'une carte --------------------------- */
// mode: "hidden" (année masquée) | "reveal" (année affichée) | "back" (dos)
function cardHTML(id, {mode="hidden", extraClass=""}={}){
  const e = EVENTS[id];
  const frame = `var(--t-${e.theme})`;
  const yearCls = mode==="reveal" ? "" : "hidden";
  const yearTxt = mode==="reveal" ? fmtYear(e.year) : "";
  // illustration : utilise assets/cards/<id>.png si présent, sinon placeholder (glyphe)
  const imgSrc = e.image || `assets/cards/${id}.png`;
  const art = `<span class="glyph">${THEME_ICON[e.theme]||"🕰️"}</span>`
            + `<img src="${esc(imgSrc)}" alt="" onerror="this.remove()">`;
  return `<div class="card ${extraClass}" style="--frame:${frame}" data-id="${id}">
    <div class="year ${yearCls}">${yearTxt}</div>
    <span class="theme">${THEME_ICON[e.theme]||""}</span>
    <div class="art">${art}</div>
    <div class="title">${esc(e.titre)}</div>
    <div class="inner-frame"></div>
  </div>`;
}

/* ------------------------- Résolution d'une manche ----------------------- */
// plays: [{player, id}] ; renvoie {scored[], winners[]}
function resolveRound(targetYear, plays){
  const scored = plays.map(p=>{
    const y = EVENTS[p.id].year;
    return { ...p, year:y, gap:Math.abs(y-targetYear), before:y<=targetYear };
  });
  // tri : écart croissant, puis « avant » prioritaire sur « après »
  scored.sort((a,b)=> a.gap-b.gap || (a.before===b.before?0:(a.before?-1:1)));
  const best = scored[0];
  // gagnants = même écart ET même côté que le meilleur (=> égalité parfaite)
  const winners = scored.filter(p=> p.gap===best.gap && p.before===best.before);
  return { scored, winners };
}

/* -------------------------- Classement (standings) ----------------------- */
function standings(){
  const idx = S.config.names.map((_,i)=>i);
  const mode = S.config.scoreMode;
  idx.sort((a,b)=>{
    if(mode==="collection") return S.cards[b].length - S.cards[a].length;
    if(mode==="precision")  return S.malus[a] - S.malus[b];
    // mixte : cartes desc, puis malus asc
    return (S.cards[b].length - S.cards[a].length) || (S.malus[a] - S.malus[b]);
  });
  return idx;
}
function scoreLabel(i){
  const mode=S.config.scoreMode;
  if(mode==="collection") return `${S.cards[i].length} 🃏`;
  if(mode==="precision")  return `${S.malus[i]} ans`;
  return `${S.cards[i].length} 🃏 · ${S.malus[i]} ans`;
}
function sbRowHTML(i, rk){
  return `<div class="sb-row">
    <span class="rank">${rk+1}</span>
    <span class="dot" style="background:${pColor(i)}"></span>
    <span class="nm">${esc(S.config.names[i])}</span>
    <span class="sc">${scoreLabel(i)}</span>
  </div>`;
}

/* ============================== ÉCRANS =================================== */

function renderSetup(){
  const c = S ? S.config : {...CFG_DEFAULT};
  if(!c.names.length) c.names = defaultNames(c.nbPlayers);
  app.innerHTML = `
  <div class="brand" style="margin:2px 0 12px">
    <div class="fan" aria-hidden="true">
      <span class="fan-card" style="--i:-2">🏛️</span>
      <span class="fan-card" style="--i:-1">🧭</span>
      <span class="fan-card" style="--i:0">🕰️</span>
      <span class="fan-card" style="--i:1">🔬</span>
      <span class="fan-card" style="--i:2">🎭</span>
    </div>
    <span class="big">ChronoCartes</span>
    <span class="sub">place l'histoire dans le temps</span>
  </div>
  <div class="setup">
    <div class="panel">
      <div class="field">
        <label>Nombre de joueurs</label>
        <div class="stepper">
          <button data-act="pl-">−</button>
          <span class="val" id="plVal">${c.nbPlayers}</span>
          <button data-act="pl+">+</button>
          <span class="hint" style="margin:0 0 0 6px">1 à 8 · sur un seul appareil</span>
        </div>
      </div>
      <div class="field">
        <label>Noms</label>
        <div class="names" id="names"></div>
      </div>
    </div>

    <div class="panel">
      <div class="field">
        <label>Cartes en main</label>
        <div class="stepper">
          <button data-act="h-">−</button>
          <span class="val" id="hVal">${c.handSize}</span>
          <button data-act="h+">+</button>
          <span class="hint" style="margin:0 0 0 6px">4 rapide · 6 tactique</span>
        </div>
      </div>
      <div class="field">
        <label>Manches</label>
        <div class="seg" id="roundsSeg">
          ${[6,8,12,0].map(r=>`<button data-r="${r}" class="${c.rounds===r?'on':''}">${r===0?'∞ talon':r}</button>`).join("")}
        </div>
        <div class="hint">« ∞ talon » : on joue jusqu'à épuisement de la pioche.</div>
      </div>
      <div class="field">
        <label>Décompte des points</label>
        <div class="seg" id="modeSeg">
          <button data-m="collection" class="${c.scoreMode==='collection'?'on':''}">Collection</button>
          <button data-m="precision" class="${c.scoreMode==='precision'?'on':''}">Précision</button>
          <button data-m="mixte" class="${c.scoreMode==='mixte'?'on':''}">Mixte</button>
        </div>
        <div class="hint" id="modeHint"></div>
      </div>
    </div>

    <button class="btn" id="startBtn">Distribuer & commencer</button>
    <div class="hint center">Le paquet compte ${ALL_IDS.length} événements. L'année de chaque carte reste cachée jusqu'à la révélation.</div>
  </div>`;

  S = S || {}; S.config = c;
  renderNames();
  updateModeHint();

  app.querySelectorAll("[data-act]").forEach(b=>b.onclick=()=>{
    const a=b.dataset.act;
    if(a==="pl-") c.nbPlayers=Math.max(1,c.nbPlayers-1);
    if(a==="pl+") c.nbPlayers=Math.min(8,c.nbPlayers+1);
    if(a==="h-")  c.handSize=Math.max(3,c.handSize-1);
    if(a==="h+")  c.handSize=Math.min(8,c.handSize+1);
    c.names = adjustNames(c.names, c.nbPlayers);
    document.getElementById("plVal").textContent=c.nbPlayers;
    document.getElementById("hVal").textContent=c.handSize;
    renderNames();
  });
  app.querySelector("#roundsSeg").onclick=(e)=>{ const b=e.target.closest("[data-r]"); if(!b)return;
    c.rounds=+b.dataset.r; app.querySelectorAll("#roundsSeg button").forEach(x=>x.classList.toggle("on",x===b)); };
  app.querySelector("#modeSeg").onclick=(e)=>{ const b=e.target.closest("[data-m]"); if(!b)return;
    c.scoreMode=b.dataset.m; app.querySelectorAll("#modeSeg button").forEach(x=>x.classList.toggle("on",x===b)); updateModeHint(); };
  app.querySelector("#startBtn").onclick=startGame;

  function renderNames(){
    const box=document.getElementById("names");
    box.innerHTML = c.names.map((n,i)=>`<input data-i="${i}" value="${esc(n)}" maxlength="16" placeholder="Joueur ${i+1}">`).join("");
    box.querySelectorAll("input").forEach(inp=>inp.oninput=()=>{ c.names[+inp.dataset.i]=inp.value; });
  }
  function updateModeHint(){
    const h={collection:"Le gagnant de la manche remporte la carte-cible. Score = nb de cartes.",
             precision:"Chaque joueur cumule un malus égal à son écart d'années. Le plus petit total gagne.",
             mixte:"Le gagnant prend la carte ; le malus cumulé départage les ex æquo."}[c.scoreMode];
    document.getElementById("modeHint").textContent=h;
  }
}
function defaultNames(n){ return Array.from({length:n},(_,i)=>`Joueur ${i+1}`); }
function adjustNames(names,n){ const out=names.slice(0,n); while(out.length<n) out.push(`Joueur ${out.length+1}`); return out; }

/* ------------------------------ Démarrage -------------------------------- */
function startGame(){
  const c=S.config;
  c.names=adjustNames(c.names.map((n,i)=>n.trim()||`Joueur ${i+1}`), c.nbPlayers);
  const deck=shuffle(ALL_IDS.slice());
  const hands=c.names.map(()=>[]);
  for(let k=0;k<c.handSize;k++) for(let p=0;p<c.nbPlayers;p++) hands[p].push(deck.pop());
  S = {
    config:c, deck, hands,
    cards:c.names.map(()=>[]),   // cartes remportées (collection)
    malus:c.names.map(()=>0),    // malus cumulé (précision)
    roundNo:0,
    phase:null, round:null
  };
  nextRound();
}

/* ----------------------------- Boucle de manche -------------------------- */
function canStartRound(){
  if(S.deck.length<1) return false;
  if(S.hands.some(h=>h.length<1)) return false;
  if(S.config.rounds>0 && S.roundNo>=S.config.rounds) return false;
  return true;
}
function nextRound(){
  if(!canStartRound()){ renderGameOver(); return; }
  S.roundNo++;
  const target=S.deck.pop();
  S.round={ target, plays:S.config.names.map(()=>null), current:0 };
  // solo : pas d'interstitiel de passage
  S.phase = S.config.nbPlayers>1 ? "pass" : "play";
  render();
}

function submitPlay(cardId){
  const r=S.round, p=r.current;
  r.plays[p]=cardId;
  // retirer la carte de la main
  const h=S.hands[p]; h.splice(h.indexOf(cardId),1);
  // joueur suivant ?
  const next=p+1;
  if(next<S.config.nbPlayers){
    r.current=next;
    S.phase = S.config.nbPlayers>1 ? "pass" : "play";
  }else{
    resolveAndShow();
    return;
  }
  render();
}

function resolveAndShow(){
  const r=S.round;
  const targetYear=EVENTS[r.target].year;
  const plays=r.plays.map((id,player)=>({player,id}));
  const {scored,winners}=resolveRound(targetYear,plays);
  // maj scores
  scored.forEach(s=>{ S.malus[s.player]+=s.gap; });
  let awarded=null;
  if(winners.length===1 && S.config.scoreMode!=="precision"){
    awarded=winners[0].player; S.cards[awarded].push(r.target);
  }
  r.result={scored,winners,targetYear,awarded,split:winners.length>1};
  // repioche pour revenir à handSize (si possible)
  for(let p=0;p<S.config.nbPlayers;p++){
    while(S.hands[p].length<S.config.handSize && S.deck.length>0) S.hands[p].push(S.deck.pop());
  }
  S.phase="reveal";
  render();
}

/* ------------------------------ Rendu global ----------------------------- */
function render(){
  if(S.phase==="pass")   return renderPass();
  if(S.phase==="play")   return renderPlay();
  if(S.phase==="reveal") return renderReveal();
}

function roundBarHTML(){
  const total=S.config.rounds>0?`/${S.config.rounds}`:"";
  return `<div class="roundbar">
    <span class="chip">Manche <b>${S.roundNo}${total}</b></span>
    <span class="chip">Talon <b>${S.deck.length}</b></span>
  </div>`;
}

function renderPass(){
  const p=S.round.current, name=S.config.names[p];
  app.innerHTML=`<div class="table">
    ${roundBarHTML()}
    <div class="pass">
      <div class="avatar" style="--pc:${pColor(p)}">${esc((name.trim()[0]||"?").toUpperCase())}</div>
      <div>À toi de jouer,</div>
      <div class="who" style="color:${pColor(p)}">${esc(name)}</div>
      <div class="instr">Prends l'appareil (que les autres ne regardent pas 🙈), puis dévoile ta main.</div>
      <button class="btn" id="ready">Voir ma main</button>
    </div>
  </div>`;
  app.querySelector("#ready").onclick=()=>{ S.phase="play"; render(); };
}

function renderPlay(){
  const p=S.round.current, name=S.config.names[p];
  const hand=S.hands[p];
  app.innerHTML=`<div class="table">
    ${roundBarHTML()}
    <div class="board">
      <div class="deck">
        <div class="backcard"></div><div class="backcard"></div><div class="backcard"></div>
        <div class="count">${S.deck.length} cartes</div>
      </div>
      <div class="target-wrap">
        <span class="lbl">Carte-cible</span>
        <div class="target">${cardHTML(S.round.target,{mode:"hidden"})}</div>
      </div>
    </div>
    <div class="handzone">
      <div class="lbl">${esc(name)} — quelle carte est la plus proche&nbsp;?</div>
      <div class="hand" id="hand">
        ${hand.map(id=>cardHTML(id,{mode:"hidden"})).join("")}
      </div>
    </div>
    <div class="footer-actions">
      <button class="btn" id="valider" disabled>Valider mon choix</button>
    </div>
  </div>`;

  let selected=null;
  const handEl=app.querySelector("#hand");
  handEl.onclick=(e)=>{
    const card=e.target.closest(".card"); if(!card)return;
    handEl.querySelectorAll(".card").forEach(c=>c.classList.remove("sel"));
    card.classList.add("sel"); selected=card.dataset.id;
    app.querySelector("#valider").disabled=false;
  };
  app.querySelector("#valider").onclick=()=>{ if(selected) submitPlay(selected); };
}

function renderReveal(){
  const r=S.round, res=r.result;
  // rangée de résultats triée comme le tri de résolution (meilleur en haut)
  const rows=res.scored.map((s,rankIdx)=>{
    const isWin = res.winners.some(w=>w.player===s.player) && !res.split;
    const isSplit = res.split && res.winners.some(w=>w.player===s.player);
    const medal = isWin?"🥇":(isSplit?"🤝":"");
    const sideTxt = s.year===res.targetYear?"pile dessus":(s.before?"avant":"après");
    return `<div class="res-row ${isWin||isSplit?'winner':''}" style="animation-delay:${rankIdx*90}ms">
      <div class="mini">${cardHTML(s.id,{mode:"reveal"})}</div>
      <div class="info">
        <div class="pname"><span class="dot" style="background:${pColor(s.player)}"></span>${esc(S.config.names[s.player])} <span class="medal">${medal}</span></div>
        <div class="ptitle">${esc(EVENTS[s.id].titre)} — ${fmtYear(s.year)}</div>
      </div>
      <div class="gap">${s.gap}<small>${sideTxt}</small></div>
    </div>`;
  });

  let verdict;
  if(res.split){
    verdict=`Égalité entre ${res.winners.map(w=>esc(S.config.names[w.player])).join(" & ")} — carte non attribuée.`;
  }else{
    const w=res.winners[0];
    verdict = S.config.scoreMode==="precision"
      ? `${esc(S.config.names[w.player])} est au plus près (${w.gap} ans).`
      : `${esc(S.config.names[w.player])} remporte la carte&nbsp;!`;
  }

  const order=standings();
  app.innerHTML=`<div class="table">
    ${roundBarHTML()}
    <div class="reveal">
      <div class="headline">
        <div>La carte-cible était <b>${esc(EVENTS[r.target].titre)}</b></div>
        <div class="target-year">${fmtYear(res.targetYear)}</div>
        <div class="muted" style="color:#e9dcc0;margin-top:4px">${verdict}</div>
      </div>
      <div class="results">${rows.join("")}</div>
      <div class="scoreboard">
        <div class="sb-title">Classement</div>
        <div class="sb-list">
          ${order.map((i,rk)=>sbRowHTML(i,rk)).join("")}
        </div>
      </div>
      <div class="footer-actions">
        <button class="btn" id="next">${canStartRound()?"Manche suivante":"Voir le résultat final"}</button>
      </div>
    </div>
  </div>`;
  app.querySelector("#next").onclick=()=>nextRound();
}

/* ------------------------------ Fin de partie ---------------------------- */
function renderGameOver(){
  const order=standings();
  const champ=order[0];
  const tiedTop = order.filter(i=>scoreLabel(i)===scoreLabel(champ)).length>1;
  app.innerHTML=`<div class="table">
    <div class="gameover">
      <div class="trophy">🏆</div>
      <div>${tiedTop?"Égalité en tête":"Vainqueur"}</div>
      <div class="champ">${esc(S.config.names[champ])}</div>
      <div class="scoreboard" style="width:100%;max-width:420px">
        <div class="sb-title">Classement final</div>
        <div class="sb-list" style="max-height:42dvh">
          ${order.map((i,rk)=>sbRowHTML(i,rk)).join("")}
        </div>
      </div>
      <div class="btn-row" style="width:100%;max-width:420px">
        <button class="btn secondary" id="again">Rejouer (mêmes réglages)</button>
        <button class="btn ghost" id="menu">Menu</button>
      </div>
    </div>
  </div>`;
  app.querySelector("#again").onclick=()=>{ startGame(); };
  app.querySelector("#menu").onclick=()=>{ renderSetup(); };
}

/* -------------------------------- Boot ----------------------------------- */
async function boot(){
  app.innerHTML=`<div class="loading">Chargement du paquet…</div>`;
  try{
    const res=await fetch("data/evenements.json",{cache:"no-store"});
    const data=await res.json();
    data.evenements.forEach(e=>{ EVENTS[e.id]=e; });
    ALL_IDS=data.evenements.map(e=>e.id);
    renderSetup();
  }catch(err){
    app.innerHTML=`<div class="loading">Erreur de chargement des événements.<br>${esc(err.message)}</div>`;
    console.error(err);
  }
}
boot();
