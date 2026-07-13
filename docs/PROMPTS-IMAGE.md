# ChronoCartes — Prompts & production des images

Ce document contient : le **style maître** (crayon fin colorié), la **recommandation de taille**,
la **méthode de production** d'un paquet cohérent, et les **pièges** à éviter.

Pour les **tests de styles** (9 styles de référence déclinés sur 2 événements), voir
[`TEST-STYLES.md`](TEST-STYLES.md).

---

## 0. Règle d'or : PAS d'année ni de texte dans l'image

Le jeu repose sur le fait de **cacher l'année**. Il ne faut donc **pas** que l'année (ni même le
titre) soit dessinée dans l'illustration. Deux raisons :

1. **Gameplay** : impossible de masquer une année « gravée » dans le dessin.
2. **Qualité** : les générateurs d'images déforment presque toujours les chiffres et le texte
   (visible sur ta *Planche 8*). En laissant l'appli écrire le titre et l'année par-dessus,
   le texte est **net et parfaitement lisible**, et masquable d'un clic.

👉 **On génère l'illustration seule.** L'appli compose ensuite : cadre + titre (toujours visible)
+ année (révélée seulement à la fin de la manche).

---

## 1. Style maître — « crayon fin colorié »

**Ta demande :** *dessin stylisé au crayon de papier, en partie colorié finement au crayon de
couleur et au feutre.* C'est le rendu de ta *Planche 8 images.png* (le meilleur match).

**Description :** trait de graphite fin et hachures délicates ; coloriage **partiel et sélectif**
au crayon de couleur et feutre (certaines zones restent en simple croquis crayon) ; palette
historique douce et désaturée ; texture de **papier crème vieilli** légèrement taché ; lumière
douce ; la scène remplit la carte.

### Prompt maître (à copier, remplace `{SCÈNE}`)

```
Stylized hand-drawn illustration of {SCÈNE}.
Fine graphite pencil linework with delicate cross-hatching, partially colored with colored
pencils and felt-tip markers — selective coloring, some areas left as bare pencil sketch.
Muted, desaturated historical color palette. Aged cream paper texture with faint stains and
soft grain. Soft natural light, gentle shading. Full scene filling the frame, clear focal
subject. Sketchbook-meets-old-engraving look.
No text, no lettering, no numbers, no signature, no border.
--ar 2:3 --style raw
```

- `{SCÈNE}` = le champ **`scene`** de chaque événement dans [`../data/evenements.json`](../data/evenements.json).
- **Exemple (montgolfière)** : remplace `{SCÈNE}` par
  *« the Montgolfier brothers' first hot-air balloon rising into the sky, an elegant balloon,
  an 18th-century crowd in period costume watching in wonder, a French château and formal
  gardens below »*.

### Variante « carte encadrée » (si tu veux le cadre dans l'image)

Ajoute avant `--ar` :
```
..., thin decorative border frame with small ornamental corners like an antique playing card,
aged parchment margins.
```
> ⚠️ Recommandé : **génère SANS cadre** (`no border`) et laisse l'appli dessiner un cadre net
> et identique pour toutes les cartes. Plus propre et plus cohérent.

### Négatif (pour Stable Diffusion / ComfyUI)

```
text, words, letters, numbers, year, date, caption, title, watermark, signature, logo,
blurry, lowres, deformed hands, extra fingers, distorted face, jpeg artifacts, oversaturated
```

---

## 2. Taille idéale : combien d'images par génération ?

Les générateurs produisent un **budget de pixels ~fixe** par image (souvent ~1–2 Mpx). Si tu
demandes une planche de N cartes, ce budget est **divisé par N**. D'où :

| Format | Résolution / carte* | Détail du trait crayon | Texte gravé | Usage conseillé |
|---|---|:--:|:--:|---|
| **1 carte / image** | ~1,5 Mpx (ex. 1024×1536) | ✅ maximal | ✅ net (si besoin) | **Cartes finales** |
| **Planche 4** (2×2) | ~0,4 Mpx (~768×512) | 🟡 correct | 🟡 limite | **Comparer des styles** |
| **Planche 8** (4×2) | ~0,2 Mpx (~415×473) | 🔴 trait dégradé | 🔴 illisible | Vignettes / aperçu rapide |

<sub>\* estimations d'après tes fichiers : `1789…png` = 1024×1536 ; `Planche 4` = 1536×1024 ;
`Planche 8` = 1662×946.</sub>

**Réponse à ta question :** la **planche 4** reste exploitable (4 styles / 4 événements comparés
d'un coup), mais dès la **planche 8** le trait fin du crayon **et surtout le texte** décrochent.
Pour ce style, **la meilleure taille = 1 carte par image** (format **portrait 2:3**, ~1024×1536).

> Astuce : on peut aussi générer en **carré 1:1** (1024×1024) puis recadrer, mais le **2:3
> portrait** correspond mieux à une carte tenue sur téléphone.

---

## 3. Combien en générer & dans quel ordre

- Paquet de départ = **65 événements** ([`EVENEMENTS.md`](EVENEMENTS.md)) → **65 illustrations**.
- Génère **1 carte à la fois**, en **4 variations**, garde la meilleure, upscale.
- Ordre conseillé :
  1. **Verrouille le style** : génère 3–4 cartes tests (ex. Révolution, Montgolfière, Lune) et
     choisis LA variation de référence.
  2. **Récupère un `--sref`** (Midjourney) de cette carte de référence, et **réutilise-le** pour
     toutes les autres → paquet homogène.
  3. Enchaîne les 65 en gardant **exactement le même préambule de style**, seul `{SCÈNE}` change.

---

## 4. Cohérence du paquet (important)

Un paquet doit avoir l'air d'une **même main**. Pour ça :

- **Même préambule de style** mot pour mot sur toutes les cartes.
- **Même cadrage** : sujet centré, scène qui remplit la carte, même format 2:3.
- **Style reference** : Midjourney `--sref <id>` (ou `--cref`), SDXL = même modèle + LoRA + seed
  proche + IP-Adapter sur ta carte de référence.
- **Palette** : garde « muted historical palette » partout ; évite qu'une carte soit fluo et une
  autre sépia.

---

## 5. Cartes spéciales — dos & cadres

Les cartes spéciales (§7 des [règles](REGLES.md)) doivent se **distinguer d'un coup d'œil** :

- Même style crayon, mais **cadre de couleur dédié** par type (dessiné par l'appli) :
  🔄 Échange = vert · 👁️ Voyance = violet · ♻️ Résurrection = ambre · ✖️ Double = rouge ·
  ⏳ Décalage = bleu · 🎭 Sabotage = noir.
- **Dos de carte commun** : un motif unique (ex. sablier + rose des vents au crayon) pour toutes
  les cartes, généré une seule fois. Prompt suggéré :
  ```
  Card back pattern: an antique hourglass and compass rose, fine graphite pencil and light
  colored-pencil accents, aged cream paper, symmetrical, ornamental corners, seamless,
  no text. --ar 2:3 --style raw
  ```

---

## 6. Réglages par générateur

| Générateur | Réglages conseillés |
|---|---|
| **Midjourney** | `--ar 2:3 --style raw` ; verrouille le look avec `--sref` ; `--stylize 100-250`. |
| **Stable Diffusion / SDXL** | 832×1216, sampler DPM++ 2M Karras, ~30 pas, CFG 5–7, + négatif du §1, IP-Adapter pour la cohérence. |
| **DALL·E 3** | ratio portrait, insiste « **no text, no numbers** », un seul sujet clair. |

---

## 7. Récap express

1. **Illustration seule**, jamais l'année ni le titre dans l'image.
2. **1 carte / image**, **2:3 portrait**, pour le meilleur trait crayon.
3. **Même préambule + `--sref`** pour un paquet cohérent.
4. La **planche 4** sert à comparer des styles ; la **planche 8** seulement pour des vignettes.
5. Choix du style : voir les 9 candidats testés dans [`TEST-STYLES.md`](TEST-STYLES.md).
