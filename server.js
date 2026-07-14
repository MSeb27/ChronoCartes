// Tempora — serveur réseau (Express + Socket.IO)
// Phase 1 : sert le jeu statique + gère les salons (créer / rejoindre / lobby).
"use strict";
const path = require("path");
const fs = require("fs");
const http = require("http");
const express = require("express");
const { Server } = require("socket.io");
const Engine = require("./engine.js");   // moteur de jeu partagé (Phase 2)

// Charge les événements et injecte-les dans le moteur (le serveur pilote la partie).
const EVENTS = {};
let ALL_IDS = [];
try {
  const data = JSON.parse(fs.readFileSync(path.join(__dirname, "data", "evenements.json"), "utf8"));
  data.evenements.forEach(e => { EVENTS[e.id] = e; });
  ALL_IDS = data.evenements.map(e => e.id);
  Engine.init({ events: EVENTS });
  console.log(`Moteur prêt : ${ALL_IDS.length} événements chargés.`);
} catch (e) {
  console.error("Impossible de charger data/evenements.json :", e.message);
}

const app = express();
app.use(express.static(__dirname, { extensions: ["html"] }));   // sert index.html, app.js, assets, data…
app.get("/sante", (_req, res) => res.json({ ok: true, salons: Object.keys(rooms).length, evenements: ALL_IDS.length }));

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// -------------------------------- Salons ---------------------------------
const rooms = {};   // code -> { code, hostId, players:{ id:{id,name,avatar} }, order:[id...], config, phase }
const socketRoom = {};  // socketId -> code

const CODE_CHARS = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // sans I,L,O,0,1 ambigus
function genCode() {
  let c;
  do { c = Array.from({ length: 4 }, () => CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]).join(""); }
  while (rooms[c]);
  return c;
}
const DEFAULT_CONFIG = { handSize: 6, rounds: 8, scoreMode: "points", specials: true };

function lobbyState(code) {
  const r = rooms[code]; if (!r) return null;
  return {
    code: r.code,
    hostId: r.hostId,
    config: r.config,
    phase: r.phase,
    notice: r.notice || null,        // message ponctuel (ex. « un joueur a quitté »)
    players: r.order.map(id => ({ id, name: r.players[id].name, avatar: r.players[id].avatar, isHost: id === r.hostId }))
  };
}
function broadcastLobby(code) {
  const st = lobbyState(code); if (st) io.to(code).emit("lobby", st);
  const r = rooms[code]; if (r) r.notice = null;   // le message n'est envoyé qu'une fois
}

/* ------------------------------ Vue de partie ---------------------------- */
// Construit la vue PERSONNELLE d'un joueur : sa main seulement, jamais celle des autres.
function gameView(r, playerId) {
  const G = r.game; if (!G) return null;
  const idx = r.playerIndex[playerId];
  const view = {
    phase: r.phase,                     // "play" | "reveal" | "over"
    code: r.code,
    hostId: r.hostId,
    youIndex: idx,
    roundNo: G.roundNo,
    rounds: G.config.rounds,
    deckCount: G.deck.length,
    scoreMode: Engine.scoreModeOf(G),
    standings: Engine.standings(G),
    bestPlay: G.bestPlay,
    players: G.config.names.map((nm, i) => ({
      name: nm, avatar: G.config.avatars[i],
      played: !!(G.round && G.round.plays[i] != null),
      cards: G.cards[i].length, malus: G.malus[i], points: G.points[i]
    }))
  };
  if (r.phase === "play") {
    view.target = { id: G.round.target };   // titre/illustration côté client ; l'année reste cachée
    view.you = {
      hand: G.hands[idx].slice(),
      played: G.round.plays[idx] != null,
      decalage: G.round.decalage[idx] || 0,
      dbl: !!G.round.dbl[idx],
      gauge: (G.timeGauge && G.timeGauge[idx]) || 0    // jauge du temps (privée)
    };
    if (r.voyanceSeen && r.voyanceSeen.has(idx)) view.you.targetYear = EVENTS[G.round.target].year;
  } else {                                  // reveal / over : tout est dévoilé
    if (G.round) { view.target = { id: G.round.target }; view.result = G.round.result; }
    view.canNext = Engine.canStartRound(G);
  }
  return view;
}
function broadcastGame(code) {
  const r = rooms[code]; if (!r || !r.game) return;
  r.order.forEach(id => io.to(id).emit("game", gameView(r, id)));
}
function startNetGame(r) {
  const order = r.order;
  const config = {
    nbPlayers: order.length,
    names: order.map(id => r.players[id].name),
    avatars: order.map(id => r.players[id].avatar),
    handSize: r.config.handSize,
    rounds: r.config.rounds,
    scoreMode: r.config.scoreMode,
    specials: r.config.specials
  };
  r.game = Engine.newGame(config, ALL_IDS);
  r.playerIndex = {}; order.forEach((id, i) => { r.playerIndex[id] = i; });
  r.voyanceSeen = new Set();
  if (!Engine.startNextRound(r.game)) { r.phase = "over"; }
  else r.phase = "play";
  broadcastGame(r.code);
}
// Un joueur quitte : en lobby on l'enlève ; en partie on interrompt et on revient au salon.
function leaveRoom(socket) {
  const code = socketRoom[socket.id]; if (!code) return;
  const r = rooms[code]; delete socketRoom[socket.id];
  socket.leave(code);
  if (!r) return;
  const wasInGame = r.phase !== "lobby";
  const name = r.players[socket.id] ? r.players[socket.id].name : "Un joueur";
  delete r.players[socket.id];
  r.order = r.order.filter(id => id !== socket.id);
  if (r.order.length === 0) { delete rooms[code]; return; }      // plus personne -> on supprime
  if (r.hostId === socket.id) r.hostId = r.order[0];             // l'hôte part -> promotion
  if (wasInGame) {                                              // partie interrompue -> retour salon
    r.phase = "lobby"; r.game = null; r.playerIndex = null; r.voyanceSeen = null;
    r.notice = `${name} a quitté la partie — retour au salon.`;
  }
  broadcastLobby(code);
}

io.on("connection", (socket) => {
  socket.on("createRoom", ({ name, avatar } = {}, cb) => {
    const code = genCode();
    rooms[code] = { code, hostId: socket.id, players: {}, order: [], config: { ...DEFAULT_CONFIG }, phase: "lobby", game: null, playerIndex: null, voyanceSeen: null };
    joinInternal(socket, code, name, avatar);
    if (cb) cb({ ok: true, code, youId: socket.id });
  });

  socket.on("joinRoom", ({ code, name, avatar } = {}, cb) => {
    code = String(code || "").toUpperCase().trim();
    const r = rooms[code];
    if (!r) return cb && cb({ ok: false, error: "Salon introuvable." });
    if (r.phase !== "lobby") return cb && cb({ ok: false, error: "La partie a déjà commencé." });
    if (r.order.length >= 8) return cb && cb({ ok: false, error: "Salon complet (8 joueurs)." });
    joinInternal(socket, code, name, avatar);
    if (cb) cb({ ok: true, code, youId: socket.id });
  });

  socket.on("updateMe", ({ name, avatar } = {}) => {
    const code = socketRoom[socket.id]; const r = rooms[code]; if (!r) return;
    const p = r.players[socket.id]; if (!p) return;
    if (typeof name === "string") p.name = name.slice(0, 16);
    if (typeof avatar === "string") p.avatar = avatar;
    broadcastLobby(code);
  });

  socket.on("setConfig", (config = {}) => {
    const code = socketRoom[socket.id]; const r = rooms[code]; if (!r) return;
    if (r.hostId !== socket.id) return;                          // hôte uniquement
    const c = r.config;
    if (["carte", "precision", "points"].includes(config.scoreMode)) c.scoreMode = config.scoreMode;
    if (Number.isInteger(config.handSize)) c.handSize = Math.max(3, Math.min(8, config.handSize));
    if (Number.isInteger(config.rounds)) c.rounds = config.rounds;
    if (typeof config.specials === "boolean") c.specials = config.specials;
    broadcastLobby(code);
  });

  // ------------------------------ Partie -------------------------------
  socket.on("startNet", (_data, cb) => {
    const code = socketRoom[socket.id]; const r = rooms[code]; if (!r) return cb && cb({ ok: false, error: "Salon introuvable." });
    if (r.hostId !== socket.id) return cb && cb({ ok: false, error: "Seul l'hôte peut lancer." });
    if (r.phase !== "lobby") return cb && cb({ ok: false, error: "Partie déjà en cours." });
    if (r.order.length < 2) return cb && cb({ ok: false, error: "Il faut au moins 2 joueurs." });
    startNetGame(r);
    if (cb) cb({ ok: true });
  });

  socket.on("netPlay", ({ cardId } = {}, cb) => {
    const code = socketRoom[socket.id]; const r = rooms[code]; if (!r || !r.game || r.phase !== "play") return;
    const idx = r.playerIndex[socket.id]; if (idx == null) return;
    const res = Engine.submitPlayBy(r.game, idx, cardId);
    if (!res.ok) return cb && cb(res);
    if (res.allPlayed) { Engine.resolve(r.game); r.phase = "reveal"; }
    broadcastGame(code);
    if (cb) cb({ ok: true });
  });

  socket.on("netSpecial", ({ spId, choice } = {}, cb) => {
    const code = socketRoom[socket.id]; const r = rooms[code]; if (!r || !r.game || r.phase !== "play") return;
    const G = r.game; const idx = r.playerIndex[socket.id]; if (idx == null) return;
    if (G.hands[idx].indexOf(spId) < 0) return cb && cb({ ok: false, error: "Carte spéciale absente." });
    if (spId === "sp_voyance") {
      Engine.consumeSpecial(G, idx, spId); r.voyanceSeen.add(idx);
    } else if (spId === "sp_decalage") {
      Engine.setDecalage(G, idx, choice === -10 ? -10 : 10); Engine.consumeSpecial(G, idx, spId);
    } else if (spId === "sp_double") {
      Engine.setDouble(G, idx); Engine.consumeSpecial(G, idx, spId);
    } else if (spId === "sp_echange") {
      Engine.consumeSpecial(G, idx, spId);
      if (choice) Engine.swapCard(G, idx, choice);   // choice = id d'une carte de la main à remplacer
    } else return;
    broadcastGame(code);
    if (cb) cb({ ok: true });
  });

  socket.on("netGauge", ({ rejectId } = {}, cb) => {
    const code = socketRoom[socket.id]; const r = rooms[code]; if (!r || !r.game || r.phase !== "play") return;
    const idx = r.playerIndex[socket.id]; if (idx == null) return;
    const res = Engine.useTimeGauge(r.game, idx, rejectId);
    if (!res.ok) return cb && cb(res);
    broadcastGame(code);
    if (cb) cb({ ok: true });
  });

  socket.on("netReject", ({ spId } = {}, cb) => {
    const code = socketRoom[socket.id]; const r = rooms[code]; if (!r || !r.game || r.phase !== "play") return;
    const G = r.game; const idx = r.playerIndex[socket.id]; if (idx == null) return;
    if (G.hands[idx].indexOf(spId) < 0) return cb && cb({ ok: false, error: "Carte spéciale absente." });
    Engine.consumeSpecial(G, idx, spId);
    broadcastGame(code);
    if (cb) cb({ ok: true });
  });

  socket.on("netNext", (_data, cb) => {
    const code = socketRoom[socket.id]; const r = rooms[code]; if (!r || !r.game) return;
    if (r.hostId !== socket.id) return cb && cb({ ok: false, error: "Seul l'hôte peut continuer." });
    if (r.phase !== "reveal") return;
    if (Engine.startNextRound(r.game)) { r.voyanceSeen = new Set(); r.phase = "play"; }
    else r.phase = "over";
    broadcastGame(code);
    if (cb) cb({ ok: true });
  });

  socket.on("netToLobby", (_data, cb) => {
    const code = socketRoom[socket.id]; const r = rooms[code]; if (!r) return;
    if (r.hostId !== socket.id) return cb && cb({ ok: false, error: "Seul l'hôte peut revenir au salon." });
    r.phase = "lobby"; r.game = null; r.playerIndex = null; r.voyanceSeen = null;
    broadcastLobby(code);
    if (cb) cb({ ok: true });
  });

  socket.on("netRestart", (_data, cb) => {
    const code = socketRoom[socket.id]; const r = rooms[code]; if (!r) return;
    if (r.hostId !== socket.id) return cb && cb({ ok: false, error: "Seul l'hôte peut relancer." });
    if (r.order.length < 2) return cb && cb({ ok: false, error: "Il faut au moins 2 joueurs." });
    startNetGame(r);
    if (cb) cb({ ok: true });
  });

  socket.on("leaveRoom", () => leaveRoom(socket));
  socket.on("disconnect", () => leaveRoom(socket));
});

function joinInternal(socket, code, name, avatar) {
  const r = rooms[code];
  r.players[socket.id] = {
    id: socket.id,
    name: (name || "Joueur").toString().slice(0, 16),
    avatar: (avatar || "av01").toString()
  };
  r.order.push(socket.id);
  socket.join(code);
  socketRoom[socket.id] = code;
  broadcastLobby(code);
}

const PORT = process.env.PORT || 8935;
server.listen(PORT, () => console.log(`Tempora en écoute sur http://localhost:${PORT}`));
