# Tempora — Tests de styles (9 références × 2 événements)

But : t'aider à **choisir le style du paquet**. J'ai analysé tes 9 images de référence
(`C:\Users\SEG\Projets\Seb\Game\Reference\style1..9`) et j'en ai extrait **la technique / le
medium** (pas le sujet des références, qui sont des portraits sans rapport). Chaque style est
ensuite décliné sur **2 événements test** :

- **A. Invention de la montgolfière — 1783**
- **B. Droit de vote des femmes en France — 21 avril 1944**

> Rappel : **pas d'année ni de texte dans l'image** (voir [PROMPTS-IMAGE.md](PROMPTS-IMAGE.md), §0).
> Tous les prompts finissent par `no text, no numbers`. Format **2:3 portrait**.
> Params Midjourney indiqués ; enlève-les pour SDXL / DALL·E. Pour comparer, tu peux mettre les
> 9 versions d'un même événement sur une **planche 4** (2 planches suffisent pour 9 styles).

### Scènes de base (le « quoi », commun à tous les styles)

- **A — Montgolfière 1783** : *the Montgolfier brothers' first hot-air balloon rising into the sky,
  an elegant decorated balloon, an 18th-century French crowd in period costume watching in wonder,
  a château and formal gardens below, autumn 1783.*
- **B — Vote des femmes 1944** : *a French woman placing her paper ballot into a ballot box for the
  very first time, other women waiting in line, a French tricolour flag, 1940s clothing, a dignified
  and hopeful atmosphere, town-hall interior, 1944.*

---

## Style 1 — Caricature aquarelle & encre (éditorial)
**Retenu de la réf. :** encre nerveuse + lavis aquarelle/gouache spontanés, proportions légèrement
exagérées (tête plus grande), fond blanc avec une seule tache de couleur plate derrière le sujet.

**A — Montgolfière 1783**
```
Loose editorial caricature, energetic ink linework and spontaneous watercolor-gouache washes,
slightly exaggerated lively proportions, confident spare brush strokes, mostly white background
with a single flat ochre color swash behind the scene:
the Montgolfier brothers' first hot-air balloon rising, an 18th-century French crowd in period
costume looking up in wonder, a château and gardens hinted below, autumn 1783.
Characterful, airy, spontaneous. No text, no numbers, no signature. --ar 2:3 --style raw
```
**B — Vote des femmes 1944**
```
Loose editorial caricature, energetic ink linework and spontaneous watercolor-gouache washes,
slightly exaggerated lively proportions, confident spare brush strokes, mostly white background
with a single flat blue color swash behind the scene:
a French woman dropping her ballot into a ballot box for the first time, women waiting in line,
a tricolour flag, 1940s clothing, dignified and hopeful.
Characterful, airy, spontaneous. No text, no numbers, no signature. --ar 2:3 --style raw
```

---

## Style 2 — Ligne claire & aquarelle (BD, esprit Moebius)
**Retenu de la réf. :** trait d'encre fin et sûr, lavis d'aquarelle translucides, détail mécanique
minutieux, visages expressifs, fond clair aéré, bande dessinée franco-belge.

**A — Montgolfière 1783**
```
French bande-dessinée illustration in the spirit of Moebius, fine confident ink linework,
delicate translucent watercolor washes, intricate delicate detail, soft airy light background:
the Montgolfier brothers' ornate hot-air balloon rising into the sky, an 18th-century French crowd
in period costume watching in wonder, a château and formal gardens below, autumn 1783.
Elegant, luminous, precise. No text, no numbers, no signature. --ar 2:3 --style raw
```
**B — Vote des femmes 1944**
```
French bande-dessinée illustration in the spirit of Moebius, fine confident ink linework,
delicate translucent watercolor washes, intricate delicate detail, soft airy light background:
a French woman placing her ballot into a ballot box for the first time, other women in line,
a tricolour flag, 1940s clothing, dignified hopeful mood, town-hall interior.
Elegant, luminous, precise. No text, no numbers, no signature. --ar 2:3 --style raw
```

---

## Style 3 — Peinture numérique cinématographique
**Retenu de la réf. :** éclairage dramatique et contrasté, couleurs riches saturées, touches
picturales épaisses (huile), rendu semi-réaliste type concept-art, profondeur atmosphérique.

**A — Montgolfière 1783**
```
Cinematic digital oil painting, dramatic directional light and strong contrast, rich saturated
colors, thick expressive painterly brushstrokes, semi-realistic concept-art rendering,
atmospheric depth:
the Montgolfier brothers' first hot-air balloon rising into a vast luminous sky, an 18th-century
French crowd in period costume looking up, a château and gardens below, golden autumn light 1783.
Epic and cinematic. No text, no numbers, no signature. --ar 2:3 --style raw
```
**B — Vote des femmes 1944**
```
Cinematic digital oil painting, dramatic directional light and strong contrast, rich saturated
colors, thick expressive painterly brushstrokes, semi-realistic concept-art rendering,
atmospheric depth:
a French woman placing her ballot into a ballot box for the first time, warm shaft of light,
women in line behind, a tricolour flag, 1940s clothing, solemn hopeful mood, town-hall interior.
Epic and intimate. No text, no numbers, no signature. --ar 2:3 --style raw
```

---

## Style 4 — Croquis graphite & couleur sélective
**Retenu de la réf. :** rendu au crayon graphite très détaillé en niveaux de gris, avec **une seule
teinte vive** ressortie sur un ou deux éléments (le reste reste gris crayon), papier crème.
> Proche de ton style maître, mais avec un accent de couleur unique très graphique.

**A — Montgolfière 1783**
```
Detailed graphite pencil sketch on cream paper, meticulous greyscale hatching, with selective spot
color — ONLY the hot-air balloon rendered in vivid warm color while everything else stays pencil-grey:
the Montgolfier brothers' first balloon rising, an 18th-century French crowd in period costume
watching, a château and gardens below, autumn 1783.
Fine draughtsmanship, single color accent. No text, no numbers, no signature. --ar 2:3 --style raw
```
**B — Vote des femmes 1944**
```
Detailed graphite pencil sketch on cream paper, meticulous greyscale hatching, with selective spot
color — ONLY the tricolour flag and the ballot rendered in vivid color while everything else stays
pencil-grey:
a French woman placing her ballot into a ballot box for the first time, women in line, 1940s
clothing, town-hall interior, 1944.
Fine draughtsmanship, single color accent. No text, no numbers, no signature. --ar 2:3 --style raw
```

---

## Style 5 — Art linéaire abstrait / affiche graphique
**Retenu de la réf. :** sujet construit en lignes de contour et hachures texturées, monochrome gris
+ **accents orange** uniquement, marques techniques (pointillés, repères géométriques), fond dégradé
gris, esprit affiche éditoriale moderne, stylisation allongée.

**A — Montgolfière 1783**
```
Abstract graphic line-art, subject built from fine contour lines and dense cross-hatch texture,
monochrome grey with bold orange accents only, scattered technical marks and dotted guide lines,
smooth grey gradient background, modern editorial-poster feel, elegant elongated stylization:
a hot-air balloon rising above a stylized 18th-century crowd, château hinted below.
Minimal, graphic, striking. No text, no numbers, no signature. --ar 2:3 --style raw
```
**B — Vote des femmes 1944**
```
Abstract graphic line-art, subject built from fine contour lines and dense cross-hatch texture,
monochrome grey with bold orange accents only, scattered technical marks and dotted guide lines,
smooth grey gradient background, modern editorial-poster feel, elegant elongated stylization:
a woman's silhouette dropping a ballot into a ballot box, hint of a flag and a waiting line.
Minimal, graphic, striking. No text, no numbers, no signature. --ar 2:3 --style raw
```

---

## Style 6 — Relief empâté au couteau (impasto)
**Retenu de la réf. :** peinture très épaisse en relief au couteau, formes simplifiées et
silhouettes, rouge/jaune/vert francs, coulures et éclaboussures, surface texturée 3D, fond gris neutre.

**A — Montgolfière 1783**
```
Thick impasto palette-knife painting in high relief, bold sculpted strokes, red / yellow / green
accents, glossy paint ridges, drips and splatter, strong simplified shapes and silhouettes,
textured three-dimensional surface, neutral grey background:
a hot-air balloon rising above simplified silhouettes of an 18th-century crowd, château below.
Bold, tactile, expressive. No text, no numbers, no signature. --ar 2:3 --style raw
```
**B — Vote des femmes 1944**
```
Thick impasto palette-knife painting in high relief, bold sculpted strokes, blue / white / red
accents, glossy paint ridges, drips and splatter, strong simplified shapes and silhouettes,
textured three-dimensional surface, neutral grey background:
a woman's silhouette dropping a ballot into a ballot box, a tricolour flag, simplified figures in line.
Bold, tactile, expressive. No text, no numbers, no signature. --ar 2:3 --style raw
```

---

## Style 7 — Sculpture en papier plié (origami) rétroéclairée
**Retenu de la réf. :** scène entièrement faite de **papier plié/froissé** (kraft, washi), facettes
géométriques, **contre-jour chaud** qui traverse le papier translucide, lumière rasante dramatique,
tons crème-ambre monochromes, rendu photo d'une maquette papier.

**A — Montgolfière 1783**
```
Origami and folded-paper sculpture, entire scene built from crumpled kraft and washi paper with
sharp geometric facets, warm backlight glowing through translucent paper, dramatic rim lighting and
soft cast shadows, monochrome cream-and-amber tones, photographed paper-craft:
a folded-paper hot-air balloon rising above small folded-paper figures of an 18th-century crowd.
Delicate, sculptural, glowing. No text, no numbers, no signature. --ar 2:3 --style raw
```
**B — Vote des femmes 1944**
```
Origami and folded-paper sculpture, entire scene built from crumpled kraft and washi paper with
sharp geometric facets, warm backlight glowing through translucent paper, dramatic rim lighting and
soft cast shadows, monochrome cream-and-amber tones, photographed paper-craft:
a folded-paper woman placing a folded ballot into a folded ballot box, a folded flag, figures in line.
Delicate, sculptural, glowing. No text, no numbers, no signature. --ar 2:3 --style raw
```

---

## Style 8 — Collage cyanotype vieilli (technique mixte)
**Retenu de la réf. :** image recomposée en **rectangles de papier déchirés et décalés**, teinte
**cyanotype bleu-vert** passée, bords abîmés/vieillis, double exposition légère de feuillages,
rendu analogique et mélancolique, très texturé.

**A — Montgolfière 1783**
```
Distressed cyanotype-toned mixed-media collage, image assembled from torn and slightly shifted paper
rectangles, faded blue-green vintage tint, aged decayed paper edges, faint double-exposure of
foliage and clouds, analog and melancholic, heavily textured:
the Montgolfier brothers' first hot-air balloon rising, an 18th-century crowd below, château hinted.
Nostalgic, antique, layered. No text, no numbers, no signature. --ar 2:3 --style raw
```
**B — Vote des femmes 1944**
```
Distressed cyanotype-toned mixed-media collage, image assembled from torn and slightly shifted paper
rectangles, faded blue-green vintage tint, aged decayed paper edges, faint double-exposure of
foliage and lace, analog and melancholic, heavily textured:
a French woman dropping her ballot into a ballot box, women in line, a flag, 1940s town-hall interior.
Nostalgic, antique, layered. No text, no numbers, no signature. --ar 2:3 --style raw
```

---

## Style 9 — BD psychédélique ornementale
**Retenu de la réf. :** illustration de roman graphique très ornée, **volutes Art nouveau**, palette
de pierres précieuses saturée, contours nets et francs, arrière-plan riche et foisonnant (mécanismes,
horloges, montgolfières), fantaisiste et élaboré.

**A — Montgolfière 1783**
```
Ornate psychedelic graphic-novel illustration, swirling Art Nouveau flourishes and decorative curls,
jewel-tone saturated palette, bold clean outlines, richly detailed whimsical background:
the Montgolfier brothers' magnificent hot-air balloon rising into a swirling sky, an 18th-century
French crowd in period costume marveling, an ornate château and gardens below, autumn 1783.
Elaborate, dreamlike, decorative. No text, no numbers, no signature. --ar 2:3 --style raw
```
**B — Vote des femmes 1944**
```
Ornate psychedelic graphic-novel illustration, swirling Art Nouveau flourishes and decorative curls,
jewel-tone saturated palette, bold clean outlines, richly detailed whimsical background:
a French woman placing her ballot into an ornate ballot box, women in line, a flowing tricolour flag,
1940s clothing, a hopeful radiant mood, decorative town-hall interior.
Elaborate, dreamlike, decorative. No text, no numbers, no signature. --ar 2:3 --style raw
```

---

## Comment choisir

| Style | Ambiance | Lisibilité en petit (téléphone) | Cohérence sur 65 cartes |
|---|---|:--:|:--:|
| 1 Caricature aquarelle | vif, léger | ✅ | 🟡 (dépend du geste) |
| 2 Ligne claire / Moebius | élégant, classique | ✅ | ✅ |
| 3 Peinture cinématographique | épique, riche | 🟡 | 🟡 |
| 4 Graphite + couleur sélective | sobre, chic | ✅ | ✅ (proche du style maître) |
| 5 Line-art abstrait | moderne, graphique | ✅ | ✅ |
| 6 Impasto couteau | fort, tactile | 🟡 | 🟡 |
| 7 Origami rétroéclairé | original, doux | 🟡 | 🟡 (dur à tenir sur 65) |
| 8 Collage cyanotype | nostalgique | 🟡 | ✅ |
| 9 BD psychédélique | foisonnant | 🟡 (chargé) | 🟡 |

**Mes préférés pour un jeu de cartes lisible et cohérent :** **2 (ligne claire)**,
**4 (graphite + accent couleur)** et **5 (line-art abstrait)** — ils restent nets en petit format
et se déclinent facilement sur 65 cartes. Mais le choix t'appartient : génère les 2 événements dans
les styles qui t'attirent et compare.
