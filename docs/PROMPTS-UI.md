# ChronoCartes — Prompts des visuels d'interface

Prompts pour les **assets d'habillage** (hors cartes-événements) : fond de table, dos de carte,
animation de flip, écran d'accueil. Même logique que [`PROMPTS-IMAGE.md`](PROMPTS-IMAGE.md) :

- **Cohérence** : garde le **style crayon** du paquet (graphite + crayon de couleur + feutre,
  papier crème vieilli) pour le **dos de carte** et l'**écran d'accueil**. Le **fond de table**
  peut être une surface plus texturée (feutrine + bois), toujours dessinée main.
- **Aucun texte** dans l'image (le titre est ajouté par l'appli).
- Verrouille le rendu avec un `--sref` issu de ta carte de référence → tout le jeu s'accorde.
- Format **téléphone portrait** ≈ 1080×1920 pour les plein écran (`--ar 9:16`), **2:3** pour la carte.

> **Où déposer les fichiers** : dans `assets/`. Une fois générés, préviens-moi et je les câble
> dans le jeu (noms suggérés indiqués à chaque section). Rien d'autre à coder de ton côté.

---

## 1. Fond de table

L'appli a **deux couches** : l'ambiance extérieure (bois, derrière la table) et la **feutrine**
(le tapis vert où l'on pose le talon). Tu peux ne générer que la feutrine si tu veux aller vite.

### 1a. Feutrine (la principale) — `assets/table.png` (portrait, centre dégagé)
```
Top-down view of an antique game table: a large rectangle of deep green felt framed by a warm
carved wood border, soft warm light from above, gentle vignette darkening the edges, a clear
empty area in the center to place a deck of cards, subtle aged fabric grain, a faint compass-rose
watermark embossed in the felt, cozy candle-lit mood.
No cards, no text. Hand-drawn colored-pencil and ink style. --ar 9:16 --style raw
```
> Garde le **centre vide et un peu plus sombre** : c'est là que se posent le talon et la carte-cible,
> et les cartes claires doivent bien ressortir.

### 1b. Ambiance bois extérieure (optionnel) — `assets/bg-wood.png`
```
Dark carved walnut wood surface, warm candle-lit tavern ambiance, subtle grain and soft
highlights, strong vignette, cozy and intimate. Hand-drawn colored-pencil and ink style,
no objects, no text. --ar 9:16 --style raw
```

### 1c. Variante texture répétable (si tu préfères un motif que l'appli étire) — `assets/felt-tile.png`
```
Seamless tileable green billiard-felt texture, subtle fibre grain, faint darker vignette, warm
and slightly aged, hand-drawn colored-pencil feel. No objects, no text. --ar 1:1 --tile
```

---

## 2. Dos de carte illustré — `assets/card-back.png` (2:3)

Sert au **talon**, à l'**éventail d'accueil** et au **dos des cartes cachées**. Il doit être
**plus sombre / mi-teinte** que les faces (claires) pour bien se distinguer.
```
Ornate playing-card back, antique style: a symmetrical central medallion combining an hourglass,
a compass rose and laurel branches, delicate filigree border with ornamental corners, aged cream
parchment turning to sepia, muted palette of deep green, sepia and old gold, fine graphite pencil
linework partially colored with colored pencils and felt-tip markers, perfectly symmetrical,
seamless ornamental pattern, slightly darker mid-tone overall.
No text, no numbers, no lettering. --ar 2:3 --style raw
```
> Astuce : demande **2–3 variations** et garde celle dont le motif reste lisible en tout petit
> (le dos apparaît aussi en vignette de 46 px sur l'accueil).

---

## 3. Animation de flip de la carte-cible

**Recommandation d'abord (le plus simple et le plus propre) :** un « flip » de carte se fait très
bien en **CSS 3D** (rotation `rotateY`) avec **seulement 2 images : le dos (§2) et la face**
(que l'appli dessine déjà). **Pas besoin de séquence d'images.** Dis-moi et je l'implémente : la
carte-cible arrivera dos visible, puis se retournera d'un quart de tour pour révéler l'illustration.

Si tu veux **malgré tout** une séquence d'images (rendu « peint » du mouvement), voici les options.
⚠️ En text-to-image, garder un design **identique** d'une frame à l'autre est difficile : utilise
le **même `--sref`** et, si possible, la même seed.

### 3a. Planche de sprites (une seule génération) — `assets/flip-sheet.png`
```
A horizontal sprite sheet, 6 evenly spaced frames of ONE ornate card flipping around its vertical
axis: frame 1 fully facing the viewer showing the decorated card back, rotating progressively to
frame 6 seen edge-on as a thin vertical sliver — angles 0°, 18°, 36°, 54°, 72°, 90°. Identical card
design, identical lighting across all frames, flat plain background. Hand-drawn colored-pencil
style. No text. --ar 3:1
```
(Le code affiche ensuite dos → tranche, puis enchaîne tranche → face de la vraie carte.)

### 3b. Frames séparées (si la planche est trop petite) — `assets/flip-1.png` … `flip-4.png`
Génère 3–4 fois le **dos de la carte** vu sous un angle croissant, en gardant le même prompt de base
que le §2 et en ajoutant, à chaque fois, l'une de ces lignes :
```
..., seen at a slight 3D angle rotating to the left, about 20 degrees.   (flip-1)
..., seen at a steep 3D angle, about 55 degrees, foreshortened.          (flip-2)
..., seen almost edge-on, about 80 degrees, a thin sliver.               (flip-3)
```

### 3c. Reflet lumineux (facultatif, superposé par l'appli) — `assets/gleam.png`
```
A soft diagonal specular light streak, white fading to transparent, on a fully transparent
background, subtle glossy highlight for a card surface. --ar 2:3
```

> Mon conseil : pars sur le **flip CSS** (2 images). C'est fluide, léger, et ça marche sur tous les
> téléphones sans planche de sprites.

---

## 4. Écran d'accueil plus travaillé — `assets/home.png` (9:16)

Illustration plein écran derrière le titre. **Haut de l'image plus sombre/dégagé** pour poser
« ChronoCartes ».
```
Vertical splash illustration for a history card game: a grand ornate hourglass (or antique clock)
glowing at the center, surrounded by a swirling collage of iconic historical scenes floating like
memories — a rising hot-air balloon, an Egyptian pyramid, a caravel ship, the Eiffel tower, a
rocket, a medieval knight — warm golden light, aged parchment and sepia tones with selective color
accents, darker calmer space at the very top reserved for a title.
Hand-drawn graphite pencil partially colored with colored pencils and felt-tip markers.
No text, no lettering, no numbers. --ar 9:16 --style raw
```
> Variante plus sobre : remplace le collage par **une seule grande montgolfière au-dessus d'un
> paysage brumeux**, hublot de temps, etc.

---

## 5. Cartes spéciales — planche 2×2 → `assets/cards/sp_*.webp`

Ordre des cases : **HG = Voyance, HD = Décalage, BG = Échange, BD = Double** (le découpeur suit cet ordre).
Sert aussi de **test de résolution** (si ~512×768 par case suffit, on générera les événements 4-par-planche).
```
A 2x2 grid of four separate ornate emblem cards, each a vertical card on aged cream parchment with a
thin decorative border, same technique for all four: detailed graphite pencil sketch, meticulous
greyscale hatching, with ONE selective spot color per card, hand-drawn feel.
Top-left: a mystical all-seeing eye inside a glowing crystal ball — spot color a violet-blue glow.
Top-right: an ornate hourglass entwined with clock hands and small gears, sand flowing — spot color warm amber on the sand.
Bottom-left: two hands exchanging playing cards encircled by two swirling arrows — spot color emerald green on the arrows.
Bottom-right: a single card splitting into two identical cards, a bold doubling motif — spot color vivid red.
Four clearly separated cards, equal size, no text, no numbers, no lettering. --ar 2:3 --style raw
```
**Découpage** (renomme ta planche `Planche cartes speciales.png` dans Téléchargements, puis) :
```
python scripts/split-plate.py "%USERPROFILE%/Downloads/Planche cartes speciales.png" sp_voyance sp_decalage sp_echange sp_double
```
→ crée `assets/cards/sp_voyance.webp`, `sp_decalage.webp`, `sp_echange.webp`, `sp_double.webp` (le jeu les charge tout seul).

## Récap des fichiers attendus dans `assets/`

| Fichier | Usage dans l'appli | Format |
|---|---|---|
| `table.png` | fond de la table de jeu | 9:16 |
| `bg-wood.png` *(opt.)* | ambiance extérieure | 9:16 |
| `card-back.png` | talon, dos des cartes, éventail | 2:3 |
| `home.png` | écran d'accueil | 9:16 |
| `flip-sheet.png` *(opt.)* | animation de flip | 3:1 |
| `gleam.png` *(opt.)* | reflet du flip | 2:3 |

Dépose-les, et je les intègre (+ j'ajoute le flip CSS de la carte-cible).
