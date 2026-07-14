# Tempora — Le Juste Temps 🕰️🃏

Jeu de cartes chronologique, jouable **chacun sur son téléphone**.

Chaque carte représente un événement historique (1ers JO, découverte de l'Amérique,
invention de la montgolfière…). L'**année est cachée**. À chaque tour, une carte-cible
est retournée du talon ; chaque joueur pose secrètement la carte de sa main qu'il pense
la **plus proche chronologiquement**. On révèle tout à la fin de la manche : le plus
proche remporte la carte.

## État du projet

- ✅ **Docs & prompts image**
  - [`docs/REGLES.md`](docs/REGLES.md) — règles complètes + cartes spéciales
  - [`docs/EVENEMENTS.md`](docs/EVENEMENTS.md) — liste d'événements proposés
  - [`data/evenements.json`](data/evenements.json) — mêmes événements, format machine (pour le jeu + génération d'images)
  - [`docs/PROMPTS-IMAGE.md`](docs/PROMPTS-IMAGE.md) — style « crayon fin colorié », taille idéale, méthode de production
  - [`docs/TEST-STYLES.md`](docs/TEST-STYLES.md) — 9 styles de référence déclinés sur 2 événements test
- ✅ **Prototype jouable (hotseat, 1 appareil)** — `index.html` + `app.js` + `style.css`
  - Solo ou 2 à 8 joueurs, passage d'appareil (mains cachées), années masquées jusqu'à la révélation
  - 3 modes de score (Collection / Précision / Mixte), classement, fin de partie
- ⏳ **Mode réseau temps réel (chacun son téléphone, salon + QR)** — étape suivante

## Lancer le jeu (hotseat)

Depuis le dossier du projet :

```powershell
python -m http.server 8935
```
Puis ouvre **http://localhost:8935** sur ce PC (ou depuis un téléphone sur le même WiFi, via
`http://<ip-du-pc>:8935`). Installable en PWA (Ajouter à l'écran d'accueil).

> Cartes actuellement en **placeholder** (titre + cadre stylisé par thème, sans illustration).
> Dès que les images sont générées, on ajoute un champ `image` par événement dans
> [`data/evenements.json`](data/evenements.json) et elles s'affichent automatiquement.

## Pile technique

- Client : HTML/CSS/JS vanilla + PWA (même approche que le projet voisin `Asteroid`). Fichiers à
  la racine : `index.html`, `app.js`, `style.css`, `manifest.json`, `assets/`.
- Réseau (étape 2, à venir) : Node + Express + Socket.IO dans `server/`, salons par code/QR,
  mains cachées côté serveur.
