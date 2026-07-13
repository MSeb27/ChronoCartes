# ChronoCartes 🕰️🃏

Jeu de cartes chronologique, jouable **chacun sur son téléphone**.

Chaque carte représente un événement historique (1ers JO, découverte de l'Amérique,
invention de la montgolfière…). L'**année est cachée**. À chaque tour, une carte-cible
est retournée du talon ; chaque joueur pose secrètement la carte de sa main qu'il pense
la **plus proche chronologiquement**. On révèle tout à la fin de la manche : le plus
proche remporte la carte.

## État du projet

- ✅ **Docs & prompts image** (cette première salve)
  - [`docs/REGLES.md`](docs/REGLES.md) — règles complètes + cartes spéciales
  - [`docs/EVENEMENTS.md`](docs/EVENEMENTS.md) — liste d'événements proposés
  - [`data/evenements.json`](data/evenements.json) — mêmes événements, format machine (pour le jeu + génération d'images)
  - [`docs/PROMPTS-IMAGE.md`](docs/PROMPTS-IMAGE.md) — style « crayon fin colorié », taille idéale, méthode de production
  - [`docs/TEST-STYLES.md`](docs/TEST-STYLES.md) — 9 styles de référence déclinés sur 2 événements test
- ⏳ **Prototype jouable (hotseat, 1 appareil)** — à suivre
- ⏳ **Mode réseau temps réel (chacun son téléphone, salon + QR)** — étape suivante

## Pile technique (prévue)

- Client : HTML/CSS/JS vanilla (même approche que le projet `Asteroid`), PWA installable.
- Réseau (étape 2) : Node + Express + Socket.IO, salons par code/QR, mains cachées côté serveur.

## Développement

Voir les docs ci-dessus. Le code du jeu arrivera dans `public/` (client) et `server/` (réseau).
