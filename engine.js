/* ============================================================================
   Tempora — moteur de jeu PUR (partagé navigateur + serveur Node)
   Aucune dépendance au DOM. Toute la logique de partie vit ici ; l'affichage
   (app.js) et le serveur réseau (server.js) l'appellent en lui passant l'état.

   - init({events}) : injecte la table id -> événement (avec .year).
   - L'état de partie « G » est un objet simple ; sa forme est identique à celle
     que l'ancien app.js appelait « S ». Les fonctions le mutent en place.
   ========================================================================== */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.TemporaEngine = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  /* --------------------------- Données injectées -------------------------- */
  let EVENTS = {};                       // id -> { id, titre, year, theme, ... }
  function init(opts) { EVENTS = (opts && opts.events) || {}; }
  function yearOf(id) { return EVENTS[id].year; }

  /* ------------------------------ Constantes ------------------------------ */
  const SPECIALS = {
    sp_voyance:  { nom: "Voyance",  icon: "👁️", desc: "Regarde en secret l'année de la carte-cible." },
    sp_decalage: { nom: "Décalage", icon: "⏳", desc: "Ta carte comptera +10 ou −10 ans (à toi de choisir)." },
    sp_echange:  { nom: "Échange",  icon: "🔄", desc: "Échange une carte de ta main contre le dessus du talon." },
    sp_double:   { nom: "Double",   icon: "✖️", desc: "Cette manche compte double pour toi (gain ×2 ou malus ×2)." }
  };
  const SPECIAL_IDS = Object.keys(SPECIALS);
  const isSpecial = id => Object.prototype.hasOwnProperty.call(SPECIALS, id);
  const NB_SPECIALS = 8;                 // 2 de chaque effet mélangées au talon

  // mode "points" : points gagnés selon le classement de la manche (meilleur d'abord)
  const RANK_POINTS = {
    2: [3, 1], 3: [5, 3, 1], 4: [7, 5, 3, 1], 5: [10, 7, 5, 3, 1],
    6: [12, 10, 7, 5, 3, 1], 7: [15, 12, 10, 7, 5, 3, 1], 8: [20, 15, 12, 10, 7, 5, 3, 1]
  };

  const CFG_DEFAULT = { nbPlayers: 2, names: [], avatars: [], handSize: 6, scoreMode: "points", rounds: 8, specials: true };

  // Jauge du temps : chaque manche elle gagne l'écart (en valeur absolue) du joueur ;
  // à TIME_GAUGE_MAX elle est « chargée » et peut servir à échanger une carte (piocher/rejeter).
  const TIME_GAUGE_MAX = 1000;

  /* ------------------------------ Utilitaires ----------------------------- */
  function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

  /* ------------------------------ Démarrage ------------------------------- */
  // Construit un nouvel état de partie à partir de la config et de la liste des ids d'événements.
  function newGame(config, allIds) {
    const c = config;
    const deck = shuffle(allIds.slice());          // distribution : événements uniquement
    const hands = c.names.map(() => []);
    for (let k = 0; k < c.handSize; k++)
      for (let p = 0; p < c.nbPlayers; p++) { const d = deck.pop(); if (d !== undefined) hands[p].push(d); }
    // les cartes spéciales entrent APRÈS la distribution → aucune spéciale au 1er tour
    if (c.specials && c.nbPlayers > 1) {
      const per = Math.max(1, Math.round(NB_SPECIALS / SPECIAL_IDS.length));
      SPECIAL_IDS.forEach(id => { for (let k = 0; k < per; k++) deck.push(id); });
      shuffle(deck);
    }
    return {
      config: c, deck, hands, discard: [],
      cards: c.names.map(() => []),   // cartes remportées (mode carte)
      malus: c.names.map(() => 0),    // malus cumulé (mode précision)
      points: c.names.map(() => 0),   // points cumulés (mode points)
      timeGauge: c.names.map(() => 0),// jauge du temps (cumul des écarts absolus)
      bestPlay: null,                 // meilleur coup de la partie (plus petit écart)
      roundNo: 0,
      phase: null, round: null
    };
  }

  /* --------------------------- Boucle de manche --------------------------- */
  function canStartRound(G) {
    if (!G.deck.some(id => !isSpecial(id))) return false;               // besoin d'un événement pour la cible
    if (G.hands.some(h => !h.some(id => !isSpecial(id)))) return false; // chaque main a au moins un événement
    if (G.config.rounds > 0 && G.roundNo >= G.config.rounds) return false;
    return true;
  }
  // retourne un événement du talon comme cible ; écarte les spéciales qui sortiraient
  function drawTarget(G) {
    while (G.deck.length) {
      const t = G.deck.pop();
      if (isSpecial(t)) { G.discard.push(t); continue; }
      return t;
    }
    return null;
  }
  // Prépare la manche suivante. Renvoie true si une manche a démarré, false si la partie est finie.
  function startNextRound(G) {
    if (!canStartRound(G)) return false;
    const target = drawTarget(G);
    if (target == null) return false;
    G.roundNo++;
    G.round = { target, plays: G.config.names.map(() => null), current: 0, decalage: {}, dbl: {} };
    return true;
  }

  // Enregistre la carte jouée par le joueur courant. Renvoie "next" (au suivant) ou "resolve".
  // (mode hotseat : les joueurs jouent l'un après l'autre sur le même appareil)
  function playCard(G, cardId) {
    const r = G.round, p = r.current;
    r.plays[p] = cardId;
    const h = G.hands[p]; h.splice(h.indexOf(cardId), 1);   // retirer la carte de la main
    const next = p + 1;
    if (next < G.config.nbPlayers) { r.current = next; return "next"; }
    return "resolve";
  }

  // Enregistre la carte d'un joueur donné (mode réseau : jeu simultané et secret).
  // Renvoie { ok, allPlayed, error }. On ne peut jouer qu'un événement, une seule fois.
  function submitPlayBy(G, playerIndex, cardId) {
    const r = G.round;
    if (!r || r.plays[playerIndex] != null) return { ok: false, error: "Déjà joué." };
    if (isSpecial(cardId)) return { ok: false, error: "Carte spéciale non jouable." };
    const h = G.hands[playerIndex]; const i = h.indexOf(cardId);
    if (i < 0) return { ok: false, error: "Carte absente de ta main." };
    h.splice(i, 1);
    r.plays[playerIndex] = cardId;
    return { ok: true, allPlayed: r.plays.every(x => x != null) };
  }
  function allPlayed(G) { return !!(G.round && G.round.plays.every(x => x != null)); }

  /* ------------------------- Résolution d'une manche ---------------------- */
  // plays: [{player, id}] ; renvoie {scored[], winners[]}
  function resolveRound(G, targetYear, plays) {
    const scored = plays.map(p => {
      const real = yearOf(p.id);
      const dec = (G.round.decalage && G.round.decalage[p.player]) || 0;  // ±10 éventuel
      const y = real + dec;                                                // année effective
      return { ...p, year: real, dec, eff: y, gap: Math.abs(y - targetYear), before: y <= targetYear };
    });
    // tri : écart croissant, puis « avant » prioritaire sur « après »
    scored.sort((a, b) => a.gap - b.gap || (a.before === b.before ? 0 : (a.before ? -1 : 1)));
    const best = scored[0];
    // gagnants = même écart ET même côté que le meilleur (=> égalité parfaite)
    const winners = scored.filter(p => p.gap === best.gap && p.before === best.before);
    return { scored, winners };
  }

  // Résout la manche courante : calcule scores/malus/points, attribue la carte,
  // repioche jusqu'à handSize, et pose G.round.result. Renvoie le result.
  function resolve(G) {
    const r = G.round;
    const targetYear = yearOf(r.target);
    const plays = r.plays.map((id, player) => ({ player, id }));
    const { scored, winners } = resolveRound(G, targetYear, plays);
    const dbl = p => r.dbl[p] ? 2 : 1;   // Double : ×2 pour ce joueur
    // malus (mode précision) + jauge du temps + meilleur coup de la partie (plus petit écart)
    scored.forEach(s => {
      G.malus[s.player] += s.gap * dbl(s.player);
      if (G.timeGauge) G.timeGauge[s.player] += s.gap;   // la jauge accumule l'écart absolu
      if (!G.bestPlay || s.gap < G.bestPlay.gap)
        G.bestPlay = { player: s.player, gap: s.gap, cardId: s.id, targetId: r.target, round: G.roundNo };
    });
    // carte remportée (mode carte)
    let awarded = null;
    if (winners.length === 1) {
      awarded = winners[0].player; G.cards[awarded].push(r.target);
      if (r.dbl[awarded]) G.cards[awarded].push(r.target);   // gain ×2 (Double)
    }
    // points par rang (mode points) — scored est trié du meilleur au pire ; ex æquo = même rang
    const table = RANK_POINTS[G.config.nbPlayers];
    if (table) {
      let pos = 0;
      scored.forEach((s, k) => {
        if (k > 0 && !(s.gap === scored[k - 1].gap && s.before === scored[k - 1].before)) pos = k;
        const pts = (table[pos] || 1) * dbl(s.player);
        G.points[s.player] += pts; s.pts = pts;
      });
    }
    r.result = { scored, winners, targetYear, awarded, split: winners.length > 1 };
    // repioche pour revenir à handSize (si possible)
    for (let p = 0; p < G.config.nbPlayers; p++) {
      while (G.hands[p].length < G.config.handSize && G.deck.length > 0) G.hands[p].push(G.deck.pop());
    }
    return r.result;
  }

  /* --------------------------- Classement -------------------------------- */
  function scoreModeOf(G) { return G.config.nbPlayers === 1 ? "precision" : G.config.scoreMode; }  // solo = précision
  function standings(G) {
    const idx = G.config.names.map((_, i) => i);
    const mode = scoreModeOf(G);
    idx.sort((a, b) => {
      if (mode === "carte")     return G.cards[b].length - G.cards[a].length;
      if (mode === "precision") return G.malus[a] - G.malus[b];
      return G.points[b] - G.points[a];   // points : plus grand total gagne
    });
    return idx;
  }

  /* ---------------------------- Cartes spéciales -------------------------- */
  function drawReplacement(G, p) { const d = G.deck.pop(); if (d !== undefined) G.hands[p].push(d); }
  function consumeSpecial(G, p, spId) {
    const i = G.hands[p].indexOf(spId); if (i > -1) G.hands[p].splice(i, 1);
    G.discard.push(spId); drawReplacement(G, p);
  }
  function setDecalage(G, p, delta) { G.round.decalage[p] = delta; }
  function setDouble(G, p) { G.round.dbl[p] = true; }
  // échange : remplace la carte `id` de la main par le dessus du talon. Renvoie true si fait.
  function swapCard(G, p, id) {
    const i = G.hands[p].indexOf(id);
    if (i > -1) { G.hands[p].splice(i, 1); G.discard.push(id); drawReplacement(G, p); return true; }
    return false;
  }
  // Jauge du temps : si chargée (≥ MAX) et talon non vide, rejette `rejectId`, pioche le
  // dessus du talon, et décrémente la jauge de MAX. Renvoie { ok, error }.
  function timeGaugeReady(G, p) { return (G.timeGauge && G.timeGauge[p] || 0) >= TIME_GAUGE_MAX; }
  function useTimeGauge(G, p, rejectId) {
    if (!timeGaugeReady(G, p)) return { ok: false, error: "Jauge non chargée." };
    if (!G.deck.length) return { ok: false, error: "Talon vide." };
    if (isSpecial(rejectId) || G.hands[p].indexOf(rejectId) < 0) return { ok: false, error: "Carte invalide." };
    swapCard(G, p, rejectId);
    G.timeGauge[p] -= TIME_GAUGE_MAX;
    return { ok: true };
  }

  return {
    init,
    // constantes
    SPECIALS, SPECIAL_IDS, isSpecial, NB_SPECIALS, RANK_POINTS, CFG_DEFAULT, TIME_GAUGE_MAX,
    // utilitaires
    shuffle,
    // cycle de partie
    newGame, canStartRound, drawTarget, startNextRound, playCard,
    submitPlayBy, allPlayed, resolveRound, resolve, standings, scoreModeOf,
    // cartes spéciales
    drawReplacement, consumeSpecial, setDecalage, setDouble, swapCard,
    // jauge du temps
    timeGaugeReady, useTimeGauge
  };
});
