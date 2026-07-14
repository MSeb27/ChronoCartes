# ChronoCartes — Règles du jeu

> **Résumé** : chaque carte est un événement historique dont **l'année est cachée**.
> Une carte-cible est retournée du talon ; chacun pose secrètement la carte de sa main
> qu'il croit **chronologiquement la plus proche** de la cible. On révèle tout : le plus
> proche gagne.

---

## 1. Matériel

- Un **paquet de cartes-événements** (60 événements proposés dans [`EVENEMENTS.md`](EVENEMENTS.md)).
  Chaque carte porte **une illustration de l'événement** et **une année cachée** (métadonnée
  révélée seulement au bon moment — dans l'appli, l'année n'est jamais affichée avant la révélation).
- (Optionnel) un lot de **cartes spéciales** — voir §7.

> ⚠️ **Point clé de conception** : l'année ne doit jamais apparaître sur l'illustration.
> C'est l'application qui affiche ou masque l'année. Voir [`PROMPTS-IMAGE.md`](PROMPTS-IMAGE.md).

## 2. Joueurs

- **1 à N joueurs** (testé pour 1 à 8).
- **Solo** : mode « précision » (voir §6) — bats ton propre record d'écart total.

## 3. Mise en place

1. Mélanger le paquet → il forme le **talon** (la pioche), posé au centre de la table.
2. Distribuer **C cartes** à chaque joueur (par défaut **C = 5** ; 4 pour parties rapides, 6 pour longues).
   Ces cartes forment la **main** du joueur : il voit ses illustrations mais **pas** leurs années.
3. Le reste du talon sert à retourner les cartes-cibles.

## 4. Déroulement d'une manche (un tour)

1. **Retourner la cible.** On retourne la carte du dessus du talon : c'est la **carte-cible**
   de la manche. Son année **reste cachée**.
2. **Jouer secrètement.** Chaque joueur choisit **une carte de sa main** — celle dont il pense
   que l'année est la **plus proche** de celle de la cible — et la pose **face illustration,
   année cachée**. (Sur téléphone : chacun valide son choix sur son écran, sans le montrer.)
3. **Révélation.** Quand **tous** ont joué, on révèle **toutes les années** : celles des cartes
   jouées **et** celle de la cible.
4. **Résolution** (voir §5) : on désigne le·la gagnant·e de la manche.
5. **Entretien.** Les cartes jouées sont **défaussées** (elles ne reviennent pas en main).
   Chaque joueur **repioche** dans le talon pour revenir à C cartes, si le talon le permet.

   > Remarque : la cible et les cartes jouées sortent du talon. Le paquet diminue donc à
   > chaque manche. C'est voulu (la partie a une fin naturelle).

6. Nouvelle manche : on retourne une nouvelle cible, etc.

## 5. Qui gagne la manche ?

On calcule pour chaque joueur son **écart** :

```
écart = | année de la carte jouée − année de la carte-cible |
```

- **Le plus petit écart gagne la manche.**
- **Égalité d'écarts (départage)** : à écart égal, la carte placée **AVANT** la cible
  (chronologiquement antérieure) l'emporte sur celle placée **APRÈS**.
  *Exemple : cible = 1789. Joueur A a joué 1780 (écart 9, avant), joueur B a joué 1798
  (écart 9, après). → A gagne.*
- **Égalité parfaite** (même écart et même position, ou années identiques) : la manche est
  **partagée** entre les joueurs à égalité (voir score partagé au §6).

## 6. Score & fin de partie

Deux façons de compter — choisis-en une avant de commencer :

### Variante A — « Collection » (par défaut, la plus simple)
- Le·la gagnant·e de la manche **remporte la carte-cible** (elle va dans sa pile de score).
- En cas d'égalité parfaite : la cible est écartée (personne ne la prend) **ou** au choix,
  départage à la carte la plus proche de tous les tours précédents.
- **Fin** : quand le talon ne permet plus de retourner une nouvelle cible **avec** au moins
  une carte jouable par joueur. **Le·la joueur·se avec le plus de cartes gagne.**

### Variante B — « Précision » (points par différence d'années)
> Correspond à ta consigne : *« le calcul des points se fait par la différence entre les années »*.
- À chaque manche, chaque joueur prend un **malus = son écart en années**.
- On cumule les malus sur toute la partie. **Le plus petit total de malus gagne** (comme au golf).
- Le·la gagnant·e de chaque manche peut, en plus, remporter la cible (bonus visuel), mais le
  classement se fait au malus cumulé.
- **Solo** : tu joues R manches et tu essaies de **minimiser ton malus total**.

> 💡 On peut mixer : *le gagnant de la manche prend la cible (variante A)* **et** *on garde
> le malus cumulé comme départage*. C'est le réglage recommandé pour l'appli (un curseur
> permettra de choisir A, B ou mixte).

## 7. Cartes spéciales (module — implémenté)

**8 cartes spéciales** (2 de chaque effet) sont **mélangées au talon** (réglage on/off dans l'appli,
**désactivées en solo**).

**Comment elles arrivent & se jouent** (pas de réserve — résolution immédiate) :
- La **carte-cible est toujours un événement** : si une spéciale sort comme cible, on l'**écarte** et
  on retourne la suivante.
- Une spéciale n'apparaît donc que **dans les mains**. **Au début de ton tour**, tu dois la traiter :
  - **Utiliser** → l'effet s'applique, puis tu **pioches une carte de remplacement** ;
  - **Rejeter** → défausse, puis tu **pioches une carte de remplacement**.
  - (Si le remplacement est encore une spéciale, tu la traites aussi.) Tu joues ensuite normalement.
- On ne **garde pas** une spéciale d'un tour à l'autre.

| Carte | Effet |
|---|---|
| 👁️ **Voyance** | Regarde **en secret** l'année de la **carte-cible** (ce tour). |
| ⏳ **Décalage** | Ta carte jouée compte **+10 ou −10 ans** (tu choisis ; l'effet t'est **affiché** avant de valider). |
| 🔄 **Échange** | Échange **une carte de ta main** contre le **dessus du talon** (à l'aveugle). |
| ✖️ **Double** | Pour **toi seul**, cette manche compte **double** (gain ×2 si tu gagnes, malus ×2 sinon). |

> Images des cartes spéciales : `assets/cards/sp_voyance|sp_decalage|sp_echange|sp_double.webp`
> (générées via la planche 2×2 — voir `docs/PROMPTS-UI.md`). Tant qu'elles n'existent pas, l'icône
> emoji sert de repli.

## 8. Conseils d'équilibrage

- **Nombre de cartes en main (C)** : plus la main est grande, plus on a de choix → parties
  plus « précises ». C = 5 est un bon point de départ.
- **Densité temporelle** : un paquet couvrant surtout le XXᵉ siècle rend les écarts serrés
  (difficile) ; un paquet très étalé (antiquité → aujourd'hui) rend les manches plus lisibles.
  Le paquet proposé mélange les deux.
- **Manches limitées** : pour une partie courte, fixer R = 8 manches plutôt que vider le talon.

---

### Ambiguïtés levées (à valider avec toi)

Ta description laissait deux points ouverts ; voici mes choix par défaut — dis-moi si tu veux les changer :

1. **« si égalité, la carte avant est gagnante, sinon points partagés »** → interprété comme :
   à **écart égal**, l'antériorité départage ; si même antériorité/année, **partage**.
2. **« le calcul des points se fait par la différence entre les années »** → interprété comme
   la **variante B (malus = écart)**. Par défaut l'appli proposera le mode **mixte**
   (gagnant prend la cible + malus cumulé en départage).
