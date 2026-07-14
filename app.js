/* ============================================================================
   Tempora — Le Juste Temps — prototype hotseat (1 seul appareil, on se passe le téléphone)
   Vanilla JS, machine à états. Les années sont cachées jusqu'à la révélation.
   ========================================================================== */
"use strict";

/* ------------------------------- Données --------------------------------- */
const THEME_ICON = {
  Politique:"🏛️", Guerre:"⚔️", Science:"🔬", Exploration:"🧭", Culture:"🎭", "Société":"👥"
};
let EVENTS = {};      // id -> event
let ALL_IDS = [];

// couleurs par joueur (anneau des avatars)
const PLAYER_COLORS = ["#c0532b","#2e6d8a","#2f7d5c","#a9812f","#6b4a8a","#9b3b2f","#3f7d7d","#7a5a2e"];
const pColor = i => PLAYER_COLORS[i % PLAYER_COLORS.length];

// avatars (40 icônes découpées de la planche) — le joueur choisit la sienne
const AVATARS = Array.from({length:40}, (_,i)=>"av"+String(i+1).padStart(2,"0"));
const defaultAvatar = i => AVATARS[i % AVATARS.length];
function ensureAvatars(c){
  c.avatars = c.avatars || [];
  for(let i=0;i<c.nbPlayers;i++) if(!c.avatars[i]) c.avatars[i]=defaultAvatar(i);
  c.avatars = c.avatars.slice(0, c.nbPlayers);
}
const avatarSrc = i => "assets/avatars/"+((S.config.avatars&&S.config.avatars[i])||defaultAvatar(i))+".webp";
// petite pastille avatar (anneau couleur joueur) pour listes/scores
function avatarDotHTML(i){
  return `<span class="avatar-ic" style="--pc:${pColor(i)}"><img src="${avatarSrc(i)}" alt="" onerror="this.style.visibility='hidden'"></span>`;
}
// sélecteur d'avatar plein écran (générique)
function pickAvatar(current, onPick){
  const ov=document.createElement("div"); ov.className="avatar-picker";
  ov.innerHTML=`<div class="ap-panel">
    <div class="ap-title">Choisis ton icône</div>
    <div class="ap-grid">${AVATARS.map(a=>`<button class="ap-ic ${current===a?'on':''}" data-a="${a}"><img src="assets/avatars/${a}.webp" alt="" onerror="this.remove()"></button>`).join("")}</div>
  </div>`;
  ov.addEventListener("click", e=>{
    if(e.target===ov){ ov.remove(); return; }
    const b=e.target.closest(".ap-ic"); if(!b) return;
    onPick(b.dataset.a); ov.remove();
  });
  document.body.appendChild(ov);
}
function openAvatarPicker(pi){
  pickAvatar(S.config.avatars[pi], a=>{
    S.config.avatars[pi]=a;
    const img=document.querySelector(`.pl-avatar[data-pi="${pi}"] img`);
    if(img) img.src="assets/avatars/"+a+".webp";
  });
}

// article Wikipédia (fr) par événement — pour le lien sur les cartouches de résultat
const WIKI = {
  ecriture:"Histoire de l'écriture", pyramides:"Pyramide de Khéops", hammurabi:"Code de Hammurabi",
  jo_antiques:"Jeux olympiques antiques", rome_fondation:"Fondation de Rome", democratie_athenes:"Démocratie athénienne",
  marathon:"Bataille de Marathon", alexandre:"Alexandre le Grand", muraille_chine:"Grande Muraille",
  cesar:"Assassinat de Jules César", vesuve:"Éruption du Vésuve en 79", papier_chine:"Papier",
  chute_rome:"Chute de l'Empire romain d'Occident", charlemagne:"Charlemagne", croisade1:"Première croisade",
  magna_carta:"Grande Charte", marco_polo:"Marco Polo", peste_noire:"Peste noire", jeanne_arc:"Jeanne d'Arc",
  constantinople:"Chute de Constantinople", gutenberg:"Johannes Gutenberg", amerique:"Découverte de l'Amérique",
  joconde:"La Joconde", reforme_luther:"Réforme protestante", magellan:"Fernand de Magellan",
  saint_barthelemy:"Massacre de la Saint-Barthélemy", edit_nantes:"Édit de Nantes", quebec:"Samuel de Champlain",
  galilee:"Galilée (savant)", versailles:"Château de Versailles", newton:"Isaac Newton", watt_vapeur:"Machine à vapeur",
  independance_usa:"Déclaration d'indépendance des États-Unis", montgolfiere:"Montgolfière", revolution_fr:"Révolution française",
  sacre_napoleon:"Sacre de Napoléon Ier", waterloo:"Bataille de Waterloo", locomotive:"Locomotive à vapeur",
  photographie:"Daguerréotype", abolition_esclavage:"Abolition de l'esclavage en France", telephone:"Invention du téléphone",
  ampoule:"Lampe à incandescence", tour_eiffel:"Tour Eiffel", cinema_lumiere:"Cinématographe",
  jo_modernes:"Jeux olympiques de 1896", wright:"Frères Wright", relativite:"Relativité restreinte", titanic:"Titanic",
  ww1:"Première Guerre mondiale", revolution_russe:"Révolution russe", penicilline:"Pénicilline",
  ww2:"Seconde Guerre mondiale", debarquement:"Débarquement de Normandie", vote_femmes:"Droit de vote des femmes en France",
  hiroshima:"Bombardements atomiques d'Hiroshima et Nagasaki", ddh:"Déclaration universelle des droits de l'homme",
  everest:"Mont Everest", adn:"Acide désoxyribonucléique", spoutnik:"Spoutnik 1", gagarine:"Youri Gagarine",
  lune:"Apollo 11", mur_berlin:"Chute du mur de Berlin", web:"World Wide Web", mandela:"Nelson Mandela",
  iphone:"iPhone (1re génération)",
  roue:"Roue", curie:"Marie Curie", toutankhamon:"Toutânkhamon", inde:"Indépendance de l'Inde",
  bouddha:"Siddhartha Gautama", hannibal:"Hannibal Barca", clovis:"Clovis Ier", hastings:"Bataille de Hastings",
  notredame:"Cathédrale Notre-Dame de Paris", gengis:"Gengis Khan", sixtine:"Plafond de la chapelle Sixtine",
  copernic:"Nicolas Copernic", shakespeare:"William Shakespeare", darwin:"Charles Darwin", suez:"Canal de Suez",
  liberte:"Statue de la Liberté", lascaux:"Grotte de Lascaux", concorde:"Concorde (avion)", euro:"Euro", obama:"Barack Obama"
};
function wikiUrl(id){
  // formulaire "Go" : redirige vers l'article exact s'il existe, sinon montre les résultats (jamais de 404)
  const t = WIKI[id] || (EVENTS[id] && EVENTS[id].titre) || "";
  return "https://fr.wikipedia.org/w/index.php?go=Go&search=" + encodeURIComponent(t);
}

// ---------------------------- Moteur de jeu -------------------------------
// Toute la logique de partie vit dans engine.js (partagé navigateur + serveur).
// On récupère ici quelques constantes/raccourcis pour le rendu.
const Engine = TemporaEngine;
const SPECIALS    = Engine.SPECIALS;
const SPECIAL_IDS = Engine.SPECIAL_IDS;
const isSpecial   = Engine.isSpecial;

/* --------------------------------- État ---------------------------------- */
const app = document.getElementById("app");
let S = null;         // état de partie courant

const CFG_DEFAULT = Engine.CFG_DEFAULT;

/* ------------------------------- Utilitaires ----------------------------- */
function fmtYear(y){ return y < 0 ? `${-y} av. J.-C.` : `${y}`; }
function esc(s){ return String(s).replace(/[&<>"]/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c])); }
// bascule une <img> vers la source suivante (data-srcs="a|b|c") ; retire l'img si épuisé
function cardImgError(img){
  const list=(img.dataset.srcs||"").split("|").filter(Boolean);
  const i=(parseInt(img.dataset.i||"0",10))+1;
  if(i<list.length){ img.dataset.i=String(i); img.src=list[i]; } else { img.remove(); }
}
// double-tap : agrandit la carte-cible, sinon montre le titre (toast). Tap simple = sélection.
function attachCardTooltip(){
  let lastT=0, lastCard=null;
  app.addEventListener("click", e=>{
    const card=e.target.closest(".card[data-title]"); if(!card) return;
    if(card===lastCard && e.timeStamp-lastT<400){       // 2e tap rapproché => agrandir la carte
      showCardZoom(card.dataset.id, card.closest(".mini") ? "reveal" : "hidden");
      lastT=0; lastCard=null;
    }else{                                               // 1er tap => on mémorise (sélection gérée ailleurs)
      lastT=e.timeStamp; lastCard=card;
    }
  });
}
// agrandissement plein écran d'une carte + titre en bas ; touch/clic pour fermer
function showCardZoom(id, mode="hidden"){
  const ov=document.createElement("div");
  ov.className="card-zoom";
  ov.innerHTML=`<div class="card-zoom-box">
      <div class="card-zoom-inner">${cardHTML(id,{mode})}</div>
      <div class="card-zoom-title">${esc(EVENTS[id].titre)}</div>
    </div>
    <div class="card-zoom-hint">Touchez pour fermer</div>`;
  ov.addEventListener("click", ()=>ov.remove());
  document.body.appendChild(ov);
}
let toastTimer=null;
function toast(msg){
  const t=document.getElementById("toast"); t.textContent=msg; t.classList.add("show");
  clearTimeout(toastTimer); toastTimer=setTimeout(()=>t.classList.remove("show"),1600);
}

/* --------------------------------- Audio --------------------------------- */
// Musique de fond en boucle (assets/audio/theme.*) + jingles (assets/audio/<nom>.*).
// Tolère l'absence de fichiers (play() échoue silencieusement). Bouton muet persistant.
const AUDIO = {
  muted: (()=>{ try{ return localStorage.getItem("tempora_muted")==="1"; }catch(e){ return false; } })(),
  bgm: null,
  ensureBgm(){
    if(this.bgm) return;
    const a=document.createElement("audio"); a.loop=true; a.volume=0.32; a.preload="auto";
    ["assets/audio/theme.ogg","assets/audio/theme.mp3"].forEach(src=>{
      const s=document.createElement("source"); s.src=src; a.appendChild(s);
    });
    this.bgm=a;
  },
  startBgm(){ if(this.muted) return; this.ensureBgm(); this.bgm.play().catch(()=>{}); },
  jingle(name){
    if(this.muted) return;
    const a=new Audio(); a.volume=0.7;
    a.src="assets/audio/"+name+".mp3"; a.play().catch(()=>{ a.src="assets/audio/"+name+".ogg"; a.play().catch(()=>{}); });
  },
  setMuted(m){
    this.muted=m; try{ localStorage.setItem("tempora_muted", m?"1":"0"); }catch(e){}
    if(this.bgm){ if(m) this.bgm.pause(); else this.bgm.play().catch(()=>{}); }
    updateMuteBtn();
  }
};
function updateMuteBtn(){ const b=document.getElementById("muteBtn"); if(b) b.textContent=AUDIO.muted?"🔇":"🔊"; }
function initMuteBtn(){
  if(document.getElementById("muteBtn")) return;
  const b=document.createElement("button"); b.id="muteBtn"; b.setAttribute("aria-label","Son");
  b.onclick=()=>AUDIO.setMuted(!AUDIO.muted);
  document.body.appendChild(b); updateMuteBtn();
}

/* -------------------------------- Réseau --------------------------------- */
const NET = {
  socket:null, code:null, youId:null, lobby:null, game:null, pendingCode:null,
  me:{ name:"Joueur", avatar:"av01" },
  loadIo(){
    return new Promise((res,rej)=>{
      if(typeof io==="function") return res();
      const s=document.createElement("script"); s.src="/socket.io/socket.io.js";
      s.onload=()=>res(); s.onerror=()=>rej(new Error("socket.io indisponible"));
      document.head.appendChild(s);
    });
  },
  async connect(){
    await this.loadIo();
    if(this.socket && this.socket.connected) return;
    if(!this.socket){
      this.socket = io();
      this.socket.on("lobby", st=>{        // (re)venir au salon
        this.lobby=st; this.game=null;
        if(this.code){ renderLobby(); if(st.notice) toast(st.notice); }
      });
      this.socket.on("game", view=>{       // état de partie personnel (main cachée)
        this.game=view; if(this.code) renderNetGame();
      });
    }
  },
  create(cb){ this.socket.emit("createRoom", this.me, cb); },
  join(code, cb){ this.socket.emit("joinRoom", { code, ...this.me }, cb); },
  updateMe(){ if(this.socket) this.socket.emit("updateMe", this.me); },
  setConfig(c){ if(this.socket) this.socket.emit("setConfig", c); },
  leave(){ if(this.socket) this.socket.emit("leaveRoom"); this.code=null; this.lobby=null; this.game=null; },
  // actions de partie
  start(cb){ this.socket.emit("startNet", {}, cb); },
  play(cardId, cb){ this.socket.emit("netPlay", { cardId }, cb); },
  special(spId, choice, cb){ this.socket.emit("netSpecial", { spId, choice }, cb); },
  reject(spId, cb){ this.socket.emit("netReject", { spId }, cb); },
  next(cb){ this.socket.emit("netNext", {}, cb); },
  toLobby(cb){ this.socket.emit("netToLobby", {}, cb); },
  restart(cb){ this.socket.emit("netRestart", {}, cb); }
};

/* --------------------------- Rendu d'une carte --------------------------- */
// mode: "hidden" (année masquée) | "reveal" (année affichée) | "back" (dos)
function cardHTML(id, {mode="hidden", extraClass=""}={}){
  const e = EVENTS[id];
  const frame = `var(--t-${e.theme})`;
  // illustration : essaie assets/cards/<id>.webp, puis .png, puis assets/<id>.png, sinon placeholder
  const glyph = `<span class="glyph">${THEME_ICON[e.theme]||"🕰️"}</span>`;
  const srcs = e.image ? [e.image]
    : [`assets/cards/${id}.webp`, `assets/cards/${id}.png`, `assets/${id}.png`];
  const art = glyph + `<img src="${esc(srcs[0])}" data-srcs="${esc(srcs.join("|"))}" data-i="0" alt="" onload="this.closest('.card').classList.add('has-img')" onerror="cardImgError(this)">`;
  // année affichée UNIQUEMENT à la révélation (pas d'icône ? ni de thème pendant le jeu)
  const yearBadge = mode==="reveal" ? `<div class="year">${fmtYear(e.year)}</div>` : "";
  return `<div class="card ${extraClass}" style="--frame:${frame}" data-id="${id}" title="${esc(e.titre)}" data-title="${esc(e.titre)}">
    ${yearBadge}
    <div class="art">${art}</div>
    <div class="title">${esc(e.titre)}</div>
    <div class="inner-frame"></div>
  </div>`;
}

// dos de carte (image assets/card-back.png si présente, sinon motif CSS)
function backFaceHTML(){
  return `<div class="cardback"><img src="assets/card-back.png" alt="" onerror="this.remove()"><span class="cb-motif">⏳</span></div>`;
}
// carte-cible avec animation de flip 3D (dos -> face) + éclat lumineux
function flipCardHTML(id, opts){
  return `<div class="flip"><div class="flip-inner">
    <div class="flip-face flip-front">${cardHTML(id, opts)}<img class="flip-gleam" src="assets/gleam.png" alt="" onerror="this.remove()"></div>
    <div class="flip-face flip-back">${backFaceHTML()}</div>
  </div></div>`;
}

/* ----------------- Résolution / classement (via moteur) ------------------ */
// Le rendu appelle le moteur ; ces raccourcis gardent les appels courts.
const standings = () => Engine.standings(S);
function scoreLabel(i){
  const mode = Engine.scoreModeOf(S);
  if(mode==="carte")     return `${S.cards[i].length} 🃏`;
  if(mode==="precision") return `${S.malus[i]} ans`;
  return `${S.points[i]} pts`;
}
function sbRowHTML(i, rk){
  return `<div class="sb-row">
    <span class="rank">${rk+1}</span>
    ${avatarDotHTML(i)}
    <span class="nm">${esc(S.config.names[i])}</span>
    <span class="sc">${scoreLabel(i)}</span>
  </div>`;
}

/* ============================== ÉCRANS =================================== */

function renderSplash(){
  app.innerHTML = `
  <div class="splash">
    <div class="brand splash-top">
      <span class="big">Tempora</span>
      <span class="sub">Le Juste Temps</span>
    </div>
    <div class="splash-bottom">
      <button class="btn" id="playLocal">Jouer en local</button>
      <button class="btn secondary" id="playOnline" style="margin-top:9px">Jouer en ligne</button>
      <div class="hint center" style="color:#e9dcc0;margin-top:12px">${ALL_IDS.length} événements · 1 à 8 joueurs</div>
    </div>
  </div>`;
  app.querySelector("#playLocal").onclick = () => { AUDIO.startBgm(); renderSetup(); };
  app.querySelector("#playOnline").onclick = () => { AUDIO.startBgm(); renderOnline(); };
}

/* --------------------------- Écrans réseau ------------------------------- */
function renderOnline(){
  app.innerHTML = `
  <div class="brand" style="margin:4px 0 12px"><span class="big" style="font-size:clamp(30px,9vw,44px)">Tempora</span><span class="sub">En ligne</span></div>
  <div class="setup">
    <div class="panel">
      <div class="field">
        <label>Ton pseudo & ton icône</label>
        <div class="pl-row">
          <button class="pl-avatar" id="onAvatar" style="--pc:${pColor(0)}"><img src="assets/avatars/${NET.me.avatar}.webp" alt="" onerror="this.remove()"></button>
          <input id="onName" value="${esc(NET.me.name)}" maxlength="16" placeholder="Ton pseudo">
        </div>
      </div>
    </div>
    <button class="btn" id="btnCreate">➕ Créer un salon</button>
    <div class="panel">
      <div class="field">
        <label>Rejoindre un salon</label>
        <div class="pl-row">
          <input id="onCode" maxlength="4" placeholder="CODE" style="text-transform:uppercase;letter-spacing:4px;font-weight:800;text-align:center" value="${esc(NET.pendingCode||"")}">
          <button class="btn" id="btnJoin" style="width:auto;flex:0 0 auto;padding:12px 18px">Rejoindre</button>
        </div>
        <div class="hint" id="onError" style="color:#e79">&nbsp;</div>
      </div>
    </div>
    <button class="btn ghost" id="onBack">← Retour</button>
  </div>`;
  NET.pendingCode=null;
  const nameInp=app.querySelector("#onName");
  nameInp.oninput=()=>{ NET.me.name=nameInp.value; };
  app.querySelector("#onAvatar").onclick=()=>pickAvatar(NET.me.avatar, a=>{ NET.me.avatar=a; const im=app.querySelector("#onAvatar img"); if(im) im.src="assets/avatars/"+a+".webp"; });
  app.querySelector("#onBack").onclick=()=>renderSplash();
  const showErr=m=>{ const e=app.querySelector("#onError"); if(e) e.textContent=m; };
  const go=(action)=>async()=>{
    NET.me.name=(nameInp.value||"").trim()||"Joueur";
    showErr("Connexion…");
    try{ await NET.connect(); }catch(e){ showErr("Serveur réseau indisponible."); return; }
    action();
  };
  app.querySelector("#btnCreate").onclick=go(()=>{
    NET.create(res=>{ if(res&&res.ok){ NET.code=res.code; NET.youId=res.youId; renderLobby(); } else showErr((res&&res.error)||"Erreur."); });
  });
  app.querySelector("#btnJoin").onclick=go(()=>{
    const code=(app.querySelector("#onCode").value||"").toUpperCase().trim();
    if(code.length<4){ showErr("Entre le code à 4 lettres."); return; }
    NET.join(code, res=>{ if(res&&res.ok){ NET.code=res.code; NET.youId=res.youId; renderLobby(); } else showErr((res&&res.error)||"Erreur."); });
  });
}

function renderLobby(){
  const st=NET.lobby; if(!st) return;
  const isHost = st.hostId===NET.youId;
  const joinUrl = location.origin + "/?join=" + st.code;
  const c = st.config || {};
  const roundsLbl = r => r===0 ? "∞ talon" : r;
  const modeLbl = { carte:"Carte", precision:"Précision", points:"Points" };
  // Réglages : éditables par l'hôte (segments/steppers) ; en lecture seule pour les autres.
  const settings = isHost ? `
    <div class="lobby-settings" id="lobbySettings">
      <div class="sb-title">Réglages de la partie</div>
      <div class="field">
        <label>Cartes en main</label>
        <div class="stepper">
          <button data-act="h-">−</button><span class="val" id="lbH">${c.handSize}</span><button data-act="h+">+</button>
        </div>
      </div>
      <div class="field">
        <label>Manches</label>
        <div class="seg" id="lbRounds">${[6,8,12,0].map(r=>`<button data-r="${r}" class="${c.rounds===r?'on':''}">${roundsLbl(r)}</button>`).join("")}</div>
      </div>
      <div class="field">
        <label>Décompte des points</label>
        <div class="seg" id="lbMode">${["carte","precision","points"].map(m=>`<button data-m="${m}" class="${c.scoreMode===m?'on':''}">${modeLbl[m]}</button>`).join("")}</div>
      </div>
      <div class="field">
        <label>Cartes spéciales</label>
        <div class="seg" id="lbSp">
          <button data-sp="1" class="${c.specials?'on':''}">Oui</button>
          <button data-sp="0" class="${!c.specials?'on':''}">Non</button>
        </div>
      </div>
    </div>` : `
    <div class="lobby-settings ro">
      <div class="sb-title">Réglages de la partie</div>
      <div class="ro-line">🃏 ${c.handSize} cartes · 🕐 ${roundsLbl(c.rounds)} manches</div>
      <div class="ro-line">🏅 ${modeLbl[c.scoreMode]||c.scoreMode} · ✨ Spéciales : ${c.specials?"oui":"non"}</div>
    </div>`;

  app.innerHTML=`<div class="table">
    <div class="lobby">
      <div class="lobby-code">Code du salon<br><b>${st.code}</b></div>
      <button class="btn secondary" id="shareLink">📋 Copier le lien d'invitation</button>
      <div class="lobby-players">
        <div class="sb-title">Joueurs (${st.players.length}/8)</div>
        <div class="sb-list" style="max-height:22dvh">
          ${st.players.map((p,idx)=>`<div class="sb-row">
            <span class="avatar-ic" style="--pc:${pColor(idx)}"><img src="assets/avatars/${p.avatar}.webp" alt="" onerror="this.style.visibility='hidden'"></span>
            <span class="nm">${esc(p.name)}${p.isHost?" 👑":""}${p.id===NET.youId?" (toi)":""}</span>
          </div>`).join("")}
        </div>
      </div>
      ${settings}
      ${isHost
        ? `<button class="btn" id="startNet">Commencer la partie</button>`
        : `<div class="hint center" style="color:#e9dcc0">En attente de l'hôte…</div>`}
      <button class="btn ghost" id="leaveLobby">Quitter le salon</button>
    </div>
  </div>`;
  app.querySelector("#shareLink").onclick=()=>{
    if(navigator.clipboard) navigator.clipboard.writeText(joinUrl).then(()=>toast("Lien copié !")).catch(()=>toast(joinUrl));
    else toast(joinUrl);
  };
  app.querySelector("#leaveLobby").onclick=()=>{ NET.leave(); renderSplash(); };

  // Réglages hôte → envoi du seul changement (le serveur fusionne champ par champ
  // et rediffuse le salon à tous ; éviter d'envoyer un snapshot périmé qui écraserait
  // un réglage modifié juste avant).
  if(isHost){
    const push = patch => NET.setConfig(patch);
    app.querySelectorAll("#lobbySettings [data-act]").forEach(b=>b.onclick=()=>{
      let h=st.config.handSize;
      if(b.dataset.act==="h-") h=Math.max(3,h-1);
      if(b.dataset.act==="h+") h=Math.min(8,h+1);
      document.getElementById("lbH").textContent=h; push({ handSize:h });
    });
    const seg=(sel,key,cast)=>{ const el=app.querySelector(sel); if(el) el.onclick=e=>{
      const b=e.target.closest("button[data-"+key+"]"); if(!b) return; push({ [({r:'rounds',m:'scoreMode',sp:'specials'})[key]]: cast(b.dataset[key]) }); }; };
    seg("#lbRounds","r",v=>+v);
    seg("#lbMode","m",v=>v);
    seg("#lbSp","sp",v=>v==="1");
  }

  const sb=app.querySelector("#startNet");
  if(sb) sb.onclick=()=>{
    if(st.players.length<2){ toast("Il faut au moins 2 joueurs."); return; }
    sb.disabled=true; sb.textContent="Distribution…";
    NET.start(res=>{ if(!(res&&res.ok)){ sb.disabled=false; sb.textContent="Commencer la partie"; toast((res&&res.error)||"Erreur."); } });
  };
}

/* --------------------------- Partie en réseau ---------------------------- */
// Rendu piloté par la vue personnelle reçue du serveur (NET.game). Main cachée :
// on n'affiche jamais que sa propre main ; l'année de la cible reste secrète.
function renderNetGame(){
  const v=NET.game; if(!v) return;
  if(v.phase==="play")   return renderNetPlay(v);
  if(v.phase==="reveal") return renderNetReveal(v);
  if(v.phase==="over")   return renderNetGameOver(v);
}

function netRoundBar(v){
  const total=v.rounds>0?`/${v.rounds}`:"";
  return `<div class="roundbar">
    <span class="chip">Manche <b>${v.roundNo}${total}</b></span>
    <span class="chip">Talon <b>${v.deckCount}</b></span>
  </div>`;
}
// bandeau « qui a joué » (pastilles ; coche quand la carte est posée)
function netPlayersStrip(v){
  return `<div class="net-players">${v.players.map((p,i)=>`
    <div class="np ${p.played?'done':''} ${i===v.youIndex?'you':''}">
      <span class="avatar-ic" style="--pc:${pColor(i)}"><img src="assets/avatars/${p.avatar}.webp" alt="" onerror="this.style.visibility='hidden'"></span>
      <span class="np-nm">${esc(p.name)}${i===v.youIndex?" (toi)":""}</span>
      <span class="np-tick">${p.played?"✅":"⏳"}</span>
    </div>`).join("")}</div>`;
}

function renderNetPlay(v){
  const you=v.you;
  // résoudre d'abord une éventuelle carte spéciale de ta main
  const sp=you.hand.find(isSpecial);
  if(sp) return renderNetSpecial(v, sp);
  if(you.played) return renderNetWait(v);   // tu as déjà joué → écran d'attente

  const dec=you.decalage||0;
  const targetCard=cardHTML(v.target.id,{mode:"hidden",extraClass:"is-target"});
  app.innerHTML=`<div class="table">
    ${netRoundBar(v)}
    <div class="board">
      <div class="deck">
        <div class="backcard"></div><div class="backcard"></div>
        <div class="top">${targetCard}</div>
      </div>
      <div class="cible">
        <span class="cible-lbl">Carte-cible</span>
        <div class="cible-title">${esc(EVENTS[v.target.id].titre)}</div>
        ${you.targetYear!=null?`<div class="voyance-peek">👁️ ${fmtYear(you.targetYear)}</div>`:``}
      </div>
    </div>
    <div class="handzone">
      ${dec?`<div class="dec-banner">⏳ Décalage actif : ${dec>0?'+':''}${dec} ans sur ta carte</div>`:``}
      ${you.dbl?`<div class="dec-banner">✖️ Manche doublée pour toi</div>`:``}
      <div class="hand" id="hand">${you.hand.map(id=>cardHTML(id,{mode:"hidden"})).join("")}</div>
    </div>
    <div class="footer-actions" style="flex-direction:column;gap:8px">
      ${dec?`<div class="dec-note" id="decNote">Choisis ta carte pour voir l'effet du décalage</div>`:``}
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
    if(dec){ const eff=EVENTS[selected].year+dec;
      document.getElementById("decNote").textContent=`Ta carte comptera : ${fmtYear(eff)}  (${dec>0?'+':''}${dec} ans)`; }
  };
  app.querySelector("#valider").onclick=()=>{
    if(!selected) return;
    const btn=app.querySelector("#valider"); btn.disabled=true; btn.textContent="Envoi…";
    NET.play(selected, res=>{ if(!(res&&res.ok)){ btn.disabled=false; btn.textContent="Valider mon choix"; toast((res&&res.error)||"Erreur."); } });
  };
}

// carte spéciale (réseau) — résolue en privé sur ton appareil
function renderNetSpecial(v, spId){
  const s=SPECIALS[spId];
  app.innerHTML=`<div class="table">
    ${netRoundBar(v)}
    <div class="special">
      <div class="sp-hint">Ta carte spéciale</div>
      <div class="sp-card">${specialCardHTML(spId)}</div>
      <div class="sp-name">${s.icon} ${esc(s.nom)}</div>
      <div class="sp-desc">${esc(s.desc)}</div>
      <div class="sp-actions" id="spActions">
        <button class="btn" id="spUse">Utiliser</button>
        <button class="btn secondary" id="spReject">Rejeter</button>
      </div>
    </div>
  </div>`;
  app.querySelector("#spReject").onclick=()=>NET.reject(spId);
  app.querySelector("#spUse").onclick=()=>{
    const box=app.querySelector("#spActions");
    if(spId==="sp_voyance" || spId==="sp_double"){
      NET.special(spId, null);
    } else if(spId==="sp_decalage"){
      box.innerHTML=`<div class="sp-q">Ta carte comptera&nbsp;:</div>
        <div class="btn-row"><button class="btn" data-d="-10">−10 ans</button><button class="btn" data-d="10">+10 ans</button></div>`;
      box.querySelectorAll("[data-d]").forEach(b=>b.onclick=()=>NET.special(spId, +b.dataset.d));
    } else if(spId==="sp_echange"){
      const evs=v.you.hand.filter(id=>!isSpecial(id));
      box.innerHTML=`<div class="sp-q">🔄 Touche la carte à remplacer par le dessus du talon</div>
        <div class="hand" id="swapHand">${evs.map(id=>cardHTML(id,{mode:"hidden"})).join("")}</div>
        <button class="btn secondary" id="swapKeep" style="margin-top:8px">Garder mes cartes</button>`;
      app.querySelector("#swapHand").onclick=(e)=>{ const c=e.target.closest(".card"); if(c) NET.special(spId, c.dataset.id); };
      app.querySelector("#swapKeep").onclick=()=>NET.special(spId, null);
    }
  };
}

// écran d'attente : tu as joué, on patiente que les autres valident
function renderNetWait(v){
  app.innerHTML=`<div class="table">
    ${netRoundBar(v)}
    <div class="pass">
      <div class="net-wait-ic">⏳</div>
      <div class="who">Carte jouée&nbsp;!</div>
      <div class="instr">On attend les autres joueurs…</div>
    </div>
    ${netPlayersStrip(v)}
  </div>`;
}

function renderNetReveal(v){
  const res=v.result, mode=v.scoreMode;
  const names=v.players.map(p=>p.name);
  const rows=res.scored.map((s,rankIdx)=>{
    const isWin=res.winners.some(w=>w.player===s.player) && !res.split;
    const isSplit=res.split && res.winners.some(w=>w.player===s.player);
    const medal=isWin?"🥇":(isSplit?"🤝":"");
    const sideTxt=s.eff===res.targetYear?"pile dessus":(s.before?"avant":"après");
    const decTag=s.dec?` <span class="dec-tag">${s.dec>0?'+':''}${s.dec}</span>`:'';
    const ptsTag=(mode==="points"&&s.pts!=null)?` <span class="pts-tag">+${s.pts}</span>`:'';
    return `<div class="res-row ${isWin||isSplit?'winner':''}" style="animation-delay:${rankIdx*90}ms">
      <div class="mini">${cardHTML(s.id,{mode:"reveal"})}</div>
      <div class="info">
        <div class="pname">${avatarNetDot(v,s.player)}${esc(names[s.player])} <span class="medal">${medal}</span>${ptsTag}</div>
        <div class="ptitle">${esc(EVENTS[s.id].titre)} — ${fmtYear(s.year)}${decTag}</div>
        <a class="wiki-link" href="${wikiUrl(s.id)}" target="_blank" rel="noopener noreferrer">📖 Wikipédia</a>
      </div>
      <div class="gap">${s.gap}<small>${sideTxt}</small></div>
    </div>`;
  });
  let verdict;
  if(res.split){ verdict=`Égalité entre ${res.winners.map(w=>esc(names[w.player])).join(" & ")}.`; }
  else{ const w=res.winners[0], ws=res.scored.find(s=>s.player===w.player);
    verdict = mode==="carte"?`${esc(names[w.player])} remporte la carte&nbsp;!`
            : mode==="precision"?`${esc(names[w.player])} est au plus près (${w.gap} ans).`
            :`${esc(names[w.player])} remporte la manche (+${(ws&&ws.pts)||0} pts)&nbsp;!`; }
  const isHost=v.hostId===NET.youId;
  app.innerHTML=`<div class="table">
    ${netRoundBar(v)}
    <div class="reveal">
      <div class="headline">
        <div>La carte-cible était <b>${esc(EVENTS[v.target.id].titre)}</b></div>
        <div class="target-year">${fmtYear(res.targetYear)}</div>
        <div class="muted" style="color:#e9dcc0;margin-top:4px">${verdict}</div>
      </div>
      <div class="results">${rows.join("")}</div>
      <div class="scoreboard">
        <div class="sb-title">Classement</div>
        <div class="sb-list">${v.standings.map((i,rk)=>netSbRow(v,i,rk)).join("")}</div>
      </div>
      <div class="footer-actions">
        ${isHost
          ? `<button class="btn" id="netNext">${v.canNext?"Manche suivante":"Voir le résultat final"}</button>`
          : `<div class="hint center" style="color:#e9dcc0">En attente de l'hôte…</div>`}
      </div>
    </div>
  </div>`;
  const nb=app.querySelector("#netNext");
  if(nb) nb.onclick=()=>{ nb.disabled=true; NET.next(); };
}

function renderNetGameOver(v){
  const order=v.standings, champ=order[0], names=v.players.map(p=>p.name);
  const medals=["🥇","🥈","🥉"];
  const nm=i=>esc(names[i]);
  const scoreOf=i=>netScoreLabel(v,i);
  const tiedTop=order.filter(i=>scoreOf(i)===scoreOf(champ)).length>1;
  const top=order.slice(0,3);
  const visual=[1,0,2].filter(i=>i<top.length);
  const cols=visual.map(i=>{ const pl=top[i];
    return `<div class="podium-col rank${i+1}">
      <div class="podium-avatar" style="--pc:${pColor(pl)}"><img src="assets/avatars/${v.players[pl].avatar}.webp" alt="" onerror="this.remove()"></div>
      <div class="podium-name">${nm(pl)}</div>
      <div class="podium-pedestal"><span class="medal">${medals[i]}</span><span class="podium-score">${scoreOf(pl)}</span></div>
    </div>`; }).join("");
  const bp=v.bestPlay;
  const bestHTML=bp?`<div class="go-bestplay">
      <span class="bp-label">🎯 Meilleur coup</span>
      <div class="bp-line">${avatarNetDot(v,bp.player)}<b>${nm(bp.player)}</b> — ${esc(EVENTS[bp.cardId].titre)}
        à <b>${bp.gap} an${bp.gap>1?'s':''}</b> de «&nbsp;${esc(EVENTS[bp.targetId].titre)}&nbsp;»</div>
    </div>`:"";
  const isHost=v.hostId===NET.youId;
  app.innerHTML=`<div class="table">
    <div class="gameover">
      <div class="go-confetti" id="confetti"></div>
      <div class="go-hero">
        <div class="go-crown">🏆</div>
        <div class="go-champ-avatar" style="--pc:${pColor(champ)}"><img src="assets/avatars/${v.players[champ].avatar}.webp" alt="" onerror="this.remove()"></div>
      </div>
      <div class="go-champ-label">${tiedTop?"Égalité en tête&nbsp;!":"Champion&nbsp;!"}</div>
      <div class="go-champ" style="color:${pColor(champ)}">${nm(champ)}</div>
      <div class="podium">${cols}</div>
      <div class="scoreboard" style="width:100%;max-width:420px">
        <div class="sb-title">Classement final</div>
        <div class="sb-list" style="max-height:22dvh">${order.map((i,rk)=>netSbRow(v,i,rk)).join("")}</div>
      </div>
      ${bestHTML}
      <div class="btn-row" style="width:100%;max-width:420px">
        ${isHost?`<button class="btn secondary" id="netAgain">Rejouer</button>`:``}
        <button class="btn ghost" id="netMenu">${isHost?"Retour au salon":"Salon"}</button>
      </div>
    </div>
  </div>`;
  AUDIO.jingle("victory");
  const conf=document.getElementById("confetti");
  const cfCol=["#c0532b","#2e6d8a","#2f7d5c","#d0ad5e","#6b4a8a","#9b3b2f","#3f7d7d"];
  for(let i=0;i<56;i++){ const s=document.createElement("span"); s.className="cf";
    s.style.left=(Math.random()*100)+"%"; s.style.background=cfCol[i%cfCol.length];
    s.style.animationDelay=(Math.random()*(i<28?0.4:1.6))+"s";
    s.style.animationDuration=(2.3+Math.random()*2)+"s";
    s.style.width=(6+Math.random()*7)+"px"; conf.appendChild(s); }
  const ag=app.querySelector("#netAgain"); if(ag) ag.onclick=()=>{ ag.disabled=true; NET.restart(); };
  const mn=app.querySelector("#netMenu"); if(mn) mn.onclick=()=>{ if(isHost) NET.toLobby(); else toast("En attente de l'hôte…"); };
}

// pastille avatar (réseau) à partir de la vue
function avatarNetDot(v,i){
  return `<span class="avatar-ic" style="--pc:${pColor(i)}"><img src="assets/avatars/${v.players[i].avatar}.webp" alt="" onerror="this.style.visibility='hidden'"></span>`;
}
function netScoreLabel(v,i){
  const p=v.players[i];
  if(v.scoreMode==="carte")     return `${p.cards} 🃏`;
  if(v.scoreMode==="precision") return `${p.malus} ans`;
  return `${p.points} pts`;
}
function netSbRow(v,i,rk){
  return `<div class="sb-row">
    <span class="rank">${rk+1}</span>
    ${avatarNetDot(v,i)}
    <span class="nm">${esc(v.players[i].name)}</span>
    <span class="sc">${netScoreLabel(v,i)}</span>
  </div>`;
}

function renderSetup(){
  const c = S ? S.config : {...CFG_DEFAULT};
  if(!c.names.length) c.names = defaultNames(c.nbPlayers);
  app.innerHTML = `
  <div class="brand" style="margin:2px 0 12px">
    <div class="fan" aria-hidden="true">
      <span class="fan-card"></span><span class="fan-card"></span><span class="fan-card"></span><span class="fan-card"></span><span class="fan-card"></span>
    </div>
    <span class="big">Tempora</span>
    <span class="sub">Le Juste Temps</span>
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
          <button data-m="carte" class="${c.scoreMode==='carte'?'on':''}">Carte</button>
          <button data-m="precision" class="${c.scoreMode==='precision'?'on':''}">Précision</button>
          <button data-m="points" class="${c.scoreMode==='points'?'on':''}">Points</button>
        </div>
        <div class="hint" id="modeHint"></div>
      </div>
      <div class="field">
        <label>Cartes spéciales</label>
        <div class="seg" id="spSeg">
          <button data-sp="1" class="${c.specials?'on':''}">Oui</button>
          <button data-sp="0" class="${!c.specials?'on':''}">Non</button>
        </div>
        <div class="hint">8 cartes (Voyance, Décalage, Échange, Double) mêlées au talon. Désactivées en solo.</div>
      </div>
    </div>

    <button class="btn" id="startBtn">Distribuer & commencer</button>
    <div class="hint center">Le paquet compte ${ALL_IDS.length} événements. L'année de chaque carte reste cachée jusqu'à la révélation.</div>
  </div>`;

  S = S || {}; S.config = c;
  ensureAvatars(c);
  renderNames();
  updateModeHint();

  app.querySelectorAll("[data-act]").forEach(b=>b.onclick=()=>{
    const a=b.dataset.act;
    if(a==="pl-") c.nbPlayers=Math.max(1,c.nbPlayers-1);
    if(a==="pl+") c.nbPlayers=Math.min(8,c.nbPlayers+1);
    if(a==="h-")  c.handSize=Math.max(3,c.handSize-1);
    if(a==="h+")  c.handSize=Math.min(8,c.handSize+1);
    c.names = adjustNames(c.names, c.nbPlayers);
    ensureAvatars(c);
    document.getElementById("plVal").textContent=c.nbPlayers;
    document.getElementById("hVal").textContent=c.handSize;
    renderNames();
  });
  app.querySelector("#roundsSeg").onclick=(e)=>{ const b=e.target.closest("[data-r]"); if(!b)return;
    c.rounds=+b.dataset.r; app.querySelectorAll("#roundsSeg button").forEach(x=>x.classList.toggle("on",x===b)); };
  app.querySelector("#modeSeg").onclick=(e)=>{ const b=e.target.closest("[data-m]"); if(!b)return;
    c.scoreMode=b.dataset.m; app.querySelectorAll("#modeSeg button").forEach(x=>x.classList.toggle("on",x===b)); updateModeHint(); };
  app.querySelector("#spSeg").onclick=(e)=>{ const b=e.target.closest("[data-sp]"); if(!b)return;
    c.specials=b.dataset.sp==="1"; app.querySelectorAll("#spSeg button").forEach(x=>x.classList.toggle("on",x===b)); };
  app.querySelector("#startBtn").onclick=startGame;

  function renderNames(){
    const box=document.getElementById("names");
    box.innerHTML = c.names.map((n,i)=>`<div class="pl-row">
        <button class="pl-avatar" data-pi="${i}" style="--pc:${pColor(i)}" aria-label="Choisir une icône"><img src="${avatarSrc(i)}" alt="" onerror="this.remove()"></button>
        <input data-i="${i}" value="${esc(n)}" maxlength="16" placeholder="Joueur ${i+1}">
      </div>`).join("");
    box.querySelectorAll("input").forEach(inp=>inp.oninput=()=>{ c.names[+inp.dataset.i]=inp.value; });
    box.querySelectorAll(".pl-avatar").forEach(btn=>btn.onclick=()=>openAvatarPicker(+btn.dataset.pi));
  }
  function updateModeHint(){
    const h={carte:"Le gagnant de la manche remporte la carte-cible. Score = nombre de cartes.",
             precision:"Chaque joueur cumule un malus = son écart d'années. Le plus petit total gagne.",
             points:"Chaque manche, des points selon le classement (1er = le plus). Le plus grand total gagne."}[c.scoreMode];
    document.getElementById("modeHint").textContent=h;
  }
}
function defaultNames(n){ return Array.from({length:n},(_,i)=>`Joueur ${i+1}`); }
function adjustNames(names,n){ const out=names.slice(0,n); while(out.length<n) out.push(`Joueur ${out.length+1}`); return out; }

/* ------------------------------ Démarrage -------------------------------- */
function startGame(){
  const c=S.config;
  c.names=adjustNames(c.names.map((n,i)=>n.trim()||`Joueur ${i+1}`), c.nbPlayers);
  S = Engine.newGame(c, ALL_IDS);   // le moteur construit talon/mains/scores
  nextRound();
}

/* ----------------------------- Boucle de manche -------------------------- */
function nextRound(){
  if(!Engine.startNextRound(S)){ renderGameOver(); return; }
  // solo : pas d'interstitiel de passage
  S.phase = S.config.nbPlayers>1 ? "pass" : "play";
  render();
}

function submitPlay(cardId){
  if(Engine.playCard(S, cardId)==="resolve"){ resolveAndShow(); return; }
  S.phase = S.config.nbPlayers>1 ? "pass" : "play";   // joueur suivant
  render();
}

function resolveAndShow(){
  Engine.resolve(S);   // scores, malus, points, carte attribuée, repioche → S.round.result
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
      <div class="avatar" style="--pc:${pColor(p)}"><img src="${avatarSrc(p)}" alt="" onerror="this.remove()"></div>
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
  const sp = hand.find(isSpecial);            // résoudre les cartes spéciales avant de jouer
  if(sp) return renderSpecial(p, sp);
  const dec = S.round.decalage[p]||0;         // décalage ±10 éventuel
  const flip = !S.round.targetShown;   // flip seulement au 1er affichage de la manche
  S.round.targetShown = true;
  const targetOpts = {mode:"hidden", extraClass:"is-target"};
  const targetCard = flip ? flipCardHTML(S.round.target, targetOpts) : cardHTML(S.round.target, targetOpts);
  app.innerHTML=`<div class="table">
    ${roundBarHTML()}
    <div class="board">
      <div class="deck">
        <div class="backcard"></div><div class="backcard"></div>
        <div class="top">${targetCard}</div>
        <div class="count">${S.deck.length} cartes</div>
      </div>
      <div class="cible">
        <span class="cible-lbl">Carte-cible</span>
        <div class="cible-title">${esc(EVENTS[S.round.target].titre)}</div>
      </div>
    </div>
    <div class="handzone">
      ${dec?`<div class="dec-banner">⏳ Décalage actif : ${dec>0?'+':''}${dec} ans sur ta carte</div>`:``}
      <div class="hand" id="hand">
        ${hand.map(id=>cardHTML(id,{mode:"hidden"})).join("")}
      </div>
    </div>
    <div class="footer-actions" style="flex-direction:column;gap:8px">
      ${dec?`<div class="dec-note" id="decNote">Choisis ta carte pour voir l'effet du décalage</div>`:``}
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
    if(dec){ const eff=EVENTS[selected].year+dec;
      document.getElementById("decNote").textContent=`Ta carte comptera : ${fmtYear(eff)}  (${dec>0?'+':''}${dec} ans)`; }
  };
  app.querySelector("#valider").onclick=()=>{ if(selected) submitPlay(selected); };
}

/* -------------------------- Cartes spéciales (jeu) ----------------------- */
// Opérations d'état déléguées au moteur (signatures courtes pour le rendu).
const drawReplacement = p => Engine.drawReplacement(S, p);
const consumeSpecial  = (p, spId) => Engine.consumeSpecial(S, p, spId);
function specialCardHTML(spId){
  const s=SPECIALS[spId];
  return `<div class="card sp"><div class="art"><span class="glyph">${s.icon}</span>`
       + `<img src="assets/cards/${spId}.webp" alt="" onload="this.closest('.card').classList.add('has-img')" onerror="this.remove()"></div>`
       + `<div class="inner-frame"></div></div>`;
}
// écran de résolution d'une carte spéciale (au début du tour)
function renderSpecial(p, spId){
  const s=SPECIALS[spId];
  app.innerHTML=`<div class="table">
    ${roundBarHTML()}
    <div class="special">
      <div class="sp-hint">Carte spéciale pour <b style="color:${pColor(p)}">${esc(S.config.names[p])}</b></div>
      <div class="sp-card">${specialCardHTML(spId)}</div>
      <div class="sp-name">${s.icon} ${esc(s.nom)}</div>
      <div class="sp-desc">${esc(s.desc)}</div>
      <div class="sp-actions" id="spActions">
        <button class="btn" id="spUse">Utiliser</button>
        <button class="btn secondary" id="spReject">Rejeter</button>
      </div>
    </div>
  </div>`;
  app.querySelector("#spReject").onclick=()=>{ consumeSpecial(p,spId); render(); };
  app.querySelector("#spUse").onclick=()=>useSpecial(p,spId);
}
function useSpecial(p, spId){
  const box=app.querySelector("#spActions");
  if(spId==="sp_voyance"){
    box.innerHTML=`<div class="sp-reveal">Année de la carte-cible&nbsp;:<br><b>${fmtYear(EVENTS[S.round.target].year)}</b></div>
      <button class="btn" id="spOk">Continuer</button>`;
    app.querySelector("#spOk").onclick=()=>{ consumeSpecial(p,spId); render(); };
  } else if(spId==="sp_decalage"){
    box.innerHTML=`<div class="sp-q">Ta carte comptera&nbsp;:</div>
      <div class="btn-row"><button class="btn" data-d="-10">−10 ans</button><button class="btn" data-d="10">+10 ans</button></div>`;
    box.querySelectorAll("[data-d]").forEach(b=>b.onclick=()=>{
      Engine.setDecalage(S,p,+b.dataset.d); consumeSpecial(p,spId); render();
    });
  } else if(spId==="sp_double"){
    Engine.setDouble(S,p); consumeSpecial(p,spId); toast("Manche doublée pour toi !"); render();
  } else if(spId==="sp_echange"){
    consumeSpecial(p,spId); renderSwap(p);
  }
}
// échange : choisir une carte de sa main à remplacer par le dessus du talon
function renderSwap(p){
  const hand=S.hands[p].filter(id=>!isSpecial(id));
  app.innerHTML=`<div class="table">
    ${roundBarHTML()}
    <div class="handzone">
      <div class="swap-lbl">🔄 Échange — touche la carte à remplacer par le dessus du talon</div>
      <div class="hand" id="swapHand">${hand.map(id=>cardHTML(id,{mode:"hidden"})).join("")}</div>
    </div>
    <div class="footer-actions"><button class="btn secondary" id="swapCancel">Garder mes cartes</button></div>
  </div>`;
  app.querySelector("#swapHand").onclick=(e)=>{
    const card=e.target.closest(".card"); if(!card) return;
    if(Engine.swapCard(S, p, card.dataset.id)) toast("Carte échangée");
    render();
  };
  app.querySelector("#swapCancel").onclick=()=>render();
}

function renderReveal(){
  const r=S.round, res=r.result;
  const mode = S.config.nbPlayers===1 ? "precision" : S.config.scoreMode;
  // rangée de résultats triée comme le tri de résolution (meilleur en haut)
  const rows=res.scored.map((s,rankIdx)=>{
    const isWin = res.winners.some(w=>w.player===s.player) && !res.split;
    const isSplit = res.split && res.winners.some(w=>w.player===s.player);
    const medal = isWin?"🥇":(isSplit?"🤝":"");
    const sideTxt = s.eff===res.targetYear?"pile dessus":(s.before?"avant":"après");
    const decTag = s.dec?` <span class="dec-tag">${s.dec>0?'+':''}${s.dec}</span>`:'';
    const dblTag = r.dbl[s.player]?` <span class="dbl-tag">✖️2</span>`:'';
    const ptsTag = (mode==="points" && s.pts!=null)?` <span class="pts-tag">+${s.pts}</span>`:'';
    return `<div class="res-row ${isWin||isSplit?'winner':''}" style="animation-delay:${rankIdx*90}ms">
      <div class="mini">${cardHTML(s.id,{mode:"reveal"})}</div>
      <div class="info">
        <div class="pname">${avatarDotHTML(s.player)}${esc(S.config.names[s.player])} <span class="medal">${medal}</span>${dblTag}${ptsTag}</div>
        <div class="ptitle">${esc(EVENTS[s.id].titre)} — ${fmtYear(s.year)}${decTag}</div>
        <a class="wiki-link" href="${wikiUrl(s.id)}" target="_blank" rel="noopener noreferrer">📖 Wikipédia</a>
      </div>
      <div class="gap">${s.gap}<small>${sideTxt}</small></div>
    </div>`;
  });

  let verdict;
  if(res.split){
    verdict=`Égalité entre ${res.winners.map(w=>esc(S.config.names[w.player])).join(" & ")}.`;
  }else{
    const w=res.winners[0], ws=res.scored.find(s=>s.player===w.player);
    verdict = mode==="carte"     ? `${esc(S.config.names[w.player])} remporte la carte&nbsp;!`
            : mode==="precision" ? `${esc(S.config.names[w.player])} est au plus près (${w.gap} ans).`
            :                      `${esc(S.config.names[w.player])} remporte la manche (+${(ws&&ws.pts)||0} pts)&nbsp;!`;
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
        <button class="btn" id="next">${Engine.canStartRound(S)?"Manche suivante":"Voir le résultat final"}</button>
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
  const solo = S.config.nbPlayers===1;
  const medals=["🥇","🥈","🥉"];

  const nm = i => esc(S.config.names[i]);

  let hero;
  if(solo){
    hero=`<div class="go-crown">🏁</div>
      <div class="go-champ-avatar" style="--pc:${pColor(0)}"><img src="${avatarSrc(0)}" alt="" onerror="this.remove()"></div>
      <div class="go-champ-label">Partie terminée</div>
      <div class="go-champ" style="color:${pColor(0)}">${nm(0)}</div>
      <div class="go-solo-score">${scoreLabel(0)}</div>`;
  }else{
    const top=order.slice(0,3);
    const visual=[1,0,2].filter(i=>i<top.length);   // gauche=2e, centre=1er, droite=3e
    const cols=visual.map(i=>{
      const pl=top[i];
      return `<div class="podium-col rank${i+1}">
        <div class="podium-avatar" style="--pc:${pColor(pl)}"><img src="${avatarSrc(pl)}" alt="" onerror="this.remove()"></div>
        <div class="podium-name">${nm(pl)}</div>
        <div class="podium-pedestal"><span class="medal">${medals[i]}</span><span class="podium-score">${scoreLabel(pl)}</span></div>
      </div>`;
    }).join("");
    hero=`<div class="go-hero">
        <div class="go-crown">🏆</div>
        <div class="go-champ-avatar" style="--pc:${pColor(champ)}"><img src="${avatarSrc(champ)}" alt="" onerror="this.remove()"></div>
      </div>
      <div class="go-champ-label">${tiedTop?"Égalité en tête&nbsp;!":"Champion&nbsp;!"}</div>
      <div class="go-champ" style="color:${pColor(champ)}">${nm(champ)}</div>
      <div class="podium">${cols}</div>`;
  }

  const bp=S.bestPlay;
  const bestHTML = bp ? `<div class="go-bestplay">
      <span class="bp-label">🎯 Meilleur coup</span>
      <div class="bp-line">${avatarDotHTML(bp.player)}<b>${nm(bp.player)}</b> — ${esc(EVENTS[bp.cardId].titre)}
        à <b>${bp.gap} an${bp.gap>1?'s':''}</b> de «&nbsp;${esc(EVENTS[bp.targetId].titre)}&nbsp;»</div>
    </div>` : "";

  app.innerHTML=`<div class="table">
    <div class="gameover">
      <div class="go-confetti" id="confetti"></div>
      ${hero}
      ${solo?"":`<div class="scoreboard" style="width:100%;max-width:420px">
        <div class="sb-title">Classement final</div>
        <div class="sb-list" style="max-height:22dvh">${order.map((i,rk)=>sbRowHTML(i,rk)).join("")}</div>
      </div>`}
      ${bestHTML}
      <div class="btn-row" style="width:100%;max-width:420px">
        <button class="btn secondary" id="again">Rejouer (mêmes réglages)</button>
        <button class="btn ghost" id="menu">Menu</button>
      </div>
    </div>
  </div>`;
  AUDIO.jingle("victory");   // fanfare de fin
  // confettis — salve dense au montage (synchro jingle) puis chute continue
  const conf=document.getElementById("confetti");
  const cfCol=["#c0532b","#2e6d8a","#2f7d5c","#d0ad5e","#6b4a8a","#9b3b2f","#3f7d7d"];
  for(let i=0;i<56;i++){ const s=document.createElement("span"); s.className="cf";
    s.style.left=(Math.random()*100)+"%"; s.style.background=cfCol[i%cfCol.length];
    s.style.animationDelay=(Math.random()* (i<28?0.4:1.6))+"s";     // moitié en salve immédiate
    s.style.animationDuration=(2.3+Math.random()*2)+"s";
    s.style.width=(6+Math.random()*7)+"px"; conf.appendChild(s); }
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
    Engine.init({ events:EVENTS });   // le moteur partage la même table d'événements
    attachCardTooltip();
    initMuteBtn();
    const joinCode=(new URLSearchParams(location.search).get("join")||"").toUpperCase();
    if(joinCode){ NET.pendingCode=joinCode; renderOnline(); } else renderSplash();
  }catch(err){
    app.innerHTML=`<div class="loading">Erreur de chargement des événements.<br>${esc(err.message)}</div>`;
    console.error(err);
  }
}
boot();
