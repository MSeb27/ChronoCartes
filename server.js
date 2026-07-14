// Tempora — serveur réseau (Express + Socket.IO)
// Phase 1 : sert le jeu statique + gère les salons (créer / rejoindre / lobby).
"use strict";
const path = require("path");
const http = require("http");
const express = require("express");
const { Server } = require("socket.io");

const app = express();
app.use(express.static(__dirname, { extensions: ["html"] }));   // sert index.html, app.js, assets, data…
app.get("/sante", (_req, res) => res.json({ ok: true, salons: Object.keys(rooms).length }));

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
    players: r.order.map(id => ({ id, name: r.players[id].name, avatar: r.players[id].avatar, isHost: id === r.hostId }))
  };
}
function broadcastLobby(code) {
  const st = lobbyState(code); if (st) io.to(code).emit("lobby", st);
}
function leaveRoom(socket) {
  const code = socketRoom[socket.id]; if (!code) return;
  const r = rooms[code]; delete socketRoom[socket.id];
  socket.leave(code);
  if (!r) return;
  delete r.players[socket.id];
  r.order = r.order.filter(id => id !== socket.id);
  if (r.order.length === 0) { delete rooms[code]; return; }      // plus personne -> on supprime
  if (r.hostId === socket.id) r.hostId = r.order[0];             // l'hôte part -> promotion
  broadcastLobby(code);
}

io.on("connection", (socket) => {
  socket.on("createRoom", ({ name, avatar } = {}, cb) => {
    const code = genCode();
    rooms[code] = { code, hostId: socket.id, players: {}, order: [], config: { ...DEFAULT_CONFIG }, phase: "lobby" };
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
