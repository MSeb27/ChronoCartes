# ChronoCartes — Prompts des 65 événements (Style 4)

Style **croquis graphite + couleur sélective** (ton choix), un prompt prêt à copier par événement.

**Principe :** tout est dessiné au crayon graphite en niveaux de gris, **sauf un seul élément** mis en couleur vive (indiqué en gras). Scènes en anglais (meilleur rendu). Format **2:3 portrait**. **Aucun texte** dans l'image (l'année reste cachée par le jeu).

## Méthode
1. **Verrouille le style d'abord** : génère 2-3 cartes (ex. Montgolfière, Révolution, Lune), choisis LA meilleure, récupère son `--sref`.
2. Ajoute ce **même `--sref`** à toutes les autres → paquet homogène.
3. **Nommage** : enregistre chaque image sous `assets/cards/<id>.png` (l'`id` est donné à chaque carte). Je les câble ensuite automatiquement dans le jeu.
4. Params Midjourney indiqués (`--ar 2:3 --style raw`) ; retire-les pour SDXL/DALL·E.

> Tu peux changer la couleur d'accent si tu préfères (ex. tout en bleu pour une charte unifiée) — remplace juste la teinte dans « rendered in vivid colour ».

### Gabarit réutilisable
```
Detailed graphite pencil sketch on cream paper, meticulous greyscale hatching, with selective spot color — ONLY {ÉLÉMENT} rendered in vivid colour while everything else stays pencil-grey:
{SCÈNE}.
Fine draughtsmanship, single colour accent. No text, no numbers, no signature. --ar 2:3 --style raw
```

---

## Antiquité (12)

### 3300 av. J.-C. — Invention de l'écriture (Sumer)  ·  `ecriture.png`
```
Detailed graphite pencil sketch on cream paper, meticulous greyscale hatching, with selective spot color — ONLY the wet clay tablet in warm terracotta rendered in vivid colour while everything else stays pencil-grey:
a Sumerian scribe carving cuneiform marks into a wet clay tablet inside a Mesopotamian temple.
Fine draughtsmanship, single colour accent. No text, no numbers, no signature. --ar 2:3 --style raw
```

### 2560 av. J.-C. — Grande Pyramide de Gizeh  ·  `pyramides.png`
```
Detailed graphite pencil sketch on cream paper, meticulous greyscale hatching, with selective spot color — ONLY the setting sun and the pyramid's sunlit face in warm amber rendered in vivid colour while everything else stays pencil-grey:
workers hauling massive limestone blocks to build the Great Pyramid of Giza, the sphinx and desert dunes.
Fine draughtsmanship, single colour accent. No text, no numbers, no signature. --ar 2:3 --style raw
```

### 1750 av. J.-C. — Code de Hammurabi  ·  `hammurabi.png`
```
Detailed graphite pencil sketch on cream paper, meticulous greyscale hatching, with selective spot color — ONLY the radiant sun-disk of the god in glowing gold rendered in vivid colour while everything else stays pencil-grey:
a towering carved basalt stele, a Babylonian king receiving the laws from the sun-god Shamash.
Fine draughtsmanship, single colour accent. No text, no numbers, no signature. --ar 2:3 --style raw
```

### 776 av. J.-C. — Premiers Jeux Olympiques antiques  ·  `jo_antiques.png`
```
Detailed graphite pencil sketch on cream paper, meticulous greyscale hatching, with selective spot color — ONLY the victor's olive wreath in vivid green rendered in vivid colour while everything else stays pencil-grey:
athletes racing in the ancient stadium of Olympia, spectators in togas, marble columns.
Fine draughtsmanship, single colour accent. No text, no numbers, no signature. --ar 2:3 --style raw
```

### 753 av. J.-C. — Fondation de Rome  ·  `rome_fondation.png`
```
Detailed graphite pencil sketch on cream paper, meticulous greyscale hatching, with selective spot color — ONLY the she-wolf's fur in warm russet rendered in vivid colour while everything else stays pencil-grey:
the she-wolf suckling the infants Romulus and Remus on the banks of the Tiber, a nascent city.
Fine draughtsmanship, single colour accent. No text, no numbers, no signature. --ar 2:3 --style raw
```

### 508 av. J.-C. — Naissance de la démocratie à Athènes  ·  `democratie_athenes.png`
```
Detailed graphite pencil sketch on cream paper, meticulous greyscale hatching, with selective spot color — ONLY the blue himation cloaks of the citizens rendered in vivid colour while everything else stays pencil-grey:
citizens raising their hands to vote on the agora, the Parthenon on the Acropolis behind.
Fine draughtsmanship, single colour accent. No text, no numbers, no signature. --ar 2:3 --style raw
```

### 490 av. J.-C. — Bataille de Marathon  ·  `marathon.png`
```
Detailed graphite pencil sketch on cream paper, meticulous greyscale hatching, with selective spot color — ONLY the crimson cloaks of the Greek hoplites rendered in vivid colour while everything else stays pencil-grey:
Greek hoplites in phalanx charging the Persians, shields and spears, a coastal plain.
Fine draughtsmanship, single colour accent. No text, no numbers, no signature. --ar 2:3 --style raw
```

### 323 av. J.-C. — Mort d'Alexandre le Grand  ·  `alexandre.png`
```
Detailed graphite pencil sketch on cream paper, meticulous greyscale hatching, with selective spot color — ONLY Alexander's purple royal mantle rendered in vivid colour while everything else stays pencil-grey:
Alexander the Great dying in Babylon, generals gathered, a map of a vast empire, oriental splendour.
Fine draughtsmanship, single colour accent. No text, no numbers, no signature. --ar 2:3 --style raw
```

### 221 av. J.-C. — Unification de la Chine et Grande Muraille  ·  `muraille_chine.png`
```
Detailed graphite pencil sketch on cream paper, meticulous greyscale hatching, with selective spot color — ONLY the emperor's imperial-yellow robe rendered in vivid colour while everything else stays pencil-grey:
the first Qin emperor overseeing workers building the Great Wall along mountain ridges.
Fine draughtsmanship, single colour accent. No text, no numbers, no signature. --ar 2:3 --style raw
```

### 44 av. J.-C. — Assassinat de Jules César  ·  `cesar.png`
```
Detailed graphite pencil sketch on cream paper, meticulous greyscale hatching, with selective spot color — ONLY the blood-red stains on Caesar's toga rendered in vivid colour while everything else stays pencil-grey:
Julius Caesar stabbed by senators in the Roman Senate, white togas, the Ides of March.
Fine draughtsmanship, single colour accent. No text, no numbers, no signature. --ar 2:3 --style raw
```

### 79 — Éruption du Vésuve (Pompéi)  ·  `vesuve.png`
```
Detailed graphite pencil sketch on cream paper, meticulous greyscale hatching, with selective spot color — ONLY the fiery orange-red eruption rendered in vivid colour while everything else stays pencil-grey:
Mount Vesuvius erupting, the people of Pompeii fleeing under falling ash, columns.
Fine draughtsmanship, single colour accent. No text, no numbers, no signature. --ar 2:3 --style raw
```

### 105 — Invention du papier (Chine)  ·  `papier_chine.png`
```
Detailed graphite pencil sketch on cream paper, meticulous greyscale hatching, with selective spot color — ONLY the green bamboo stalks rendered in vivid colour while everything else stays pencil-grey:
Cai Lun making the first sheet of paper, screen frames and pulp, a Chinese workshop with bamboo.
Fine draughtsmanship, single colour accent. No text, no numbers, no signature. --ar 2:3 --style raw
```

---

## Moyen Âge (8)

### 476 — Chute de l'Empire romain d'Occident  ·  `chute_rome.png`
```
Detailed graphite pencil sketch on cream paper, meticulous greyscale hatching, with selective spot color — ONLY the barbarian chieftain's red cloak rendered in vivid colour while everything else stays pencil-grey:
the last Roman emperor deposed, a victorious barbarian chieftain, ancient ruins, the end of an era.
Fine draughtsmanship, single colour accent. No text, no numbers, no signature. --ar 2:3 --style raw
```

### 800 — Couronnement de Charlemagne  ·  `charlemagne.png`
```
Detailed graphite pencil sketch on cream paper, meticulous greyscale hatching, with selective spot color — ONLY the golden crown rendered in vivid colour while everything else stays pencil-grey:
the Pope crowning Charlemagne emperor in a basilica, Frankish nobility, gold and purple.
Fine draughtsmanship, single colour accent. No text, no numbers, no signature. --ar 2:3 --style raw
```

### 1096 — Première croisade  ·  `croisade1.png`
```
Detailed graphite pencil sketch on cream paper, meticulous greyscale hatching, with selective spot color — ONLY the red crusader crosses on the white surcoats rendered in vivid colour while everything else stays pencil-grey:
armoured crusader knights marching toward Jerusalem, banners, an arid hill.
Fine draughtsmanship, single colour accent. No text, no numbers, no signature. --ar 2:3 --style raw
```

### 1215 — Grande Charte (Magna Carta)  ·  `magna_carta.png`
```
Detailed graphite pencil sketch on cream paper, meticulous greyscale hatching, with selective spot color — ONLY the red wax seal rendered in vivid colour while everything else stays pencil-grey:
King John of England sealing the Magna Carta, barons in mail, parchment and seal.
Fine draughtsmanship, single colour accent. No text, no numbers, no signature. --ar 2:3 --style raw
```

### 1271 — Marco Polo part pour la Chine  ·  `marco_polo.png`
```
Detailed graphite pencil sketch on cream paper, meticulous greyscale hatching, with selective spot color — ONLY the bales of crimson silk on the camels rendered in vivid colour while everything else stays pencil-grey:
Marco Polo and a camel caravan on the Silk Road, Asian mountains, trade goods.
Fine draughtsmanship, single colour accent. No text, no numbers, no signature. --ar 2:3 --style raw
```

### 1348 — La Grande Peste (peste noire)  ·  `peste_noire.png`
```
Detailed graphite pencil sketch on cream paper, meticulous greyscale hatching, with selective spot color — ONLY the warm amber glow of the lantern rendered in vivid colour while everything else stays pencil-grey:
a plague doctor with a long beaked mask in a desolate medieval town, holding a lantern, mist.
Fine draughtsmanship, single colour accent. No text, no numbers, no signature. --ar 2:3 --style raw
```

### 1431 — Jeanne d'Arc sur le bûcher  ·  `jeanne_arc.png`
```
Detailed graphite pencil sketch on cream paper, meticulous greyscale hatching, with selective spot color — ONLY the orange flames of the pyre rendered in vivid colour while everything else stays pencil-grey:
Joan of Arc at the stake in Rouen, a medieval crowd, smoke, armour on the ground.
Fine draughtsmanship, single colour accent. No text, no numbers, no signature. --ar 2:3 --style raw
```

### 1453 — Chute de Constantinople  ·  `constantinople.png`
```
Detailed graphite pencil sketch on cream paper, meticulous greyscale hatching, with selective spot color — ONLY the orange muzzle-fire of the cannons rendered in vivid colour while everything else stays pencil-grey:
giant Ottoman cannons before the walls of Constantinople, the assault, Hagia Sophia.
Fine draughtsmanship, single colour accent. No text, no numbers, no signature. --ar 2:3 --style raw
```

---

## Temps modernes (11)

### 1455 — Imprimerie de Gutenberg  ·  `gutenberg.png`
```
Detailed graphite pencil sketch on cream paper, meticulous greyscale hatching, with selective spot color — ONLY the warm glow of the candle flame rendered in vivid colour while everything else stays pencil-grey:
Gutenberg at his press composing the Bible, type cases, a printer's workshop, candlelight.
Fine draughtsmanship, single colour accent. No text, no numbers, no signature. --ar 2:3 --style raw
```

### 1492 — Découverte de l'Amérique  ·  `amerique.png`
```
Detailed graphite pencil sketch on cream paper, meticulous greyscale hatching, with selective spot color — ONLY the red crosses on the caravel sails rendered in vivid colour while everything else stays pencil-grey:
Columbus's caravels at anchor, sailors landing on a tropical beach, a planted cross.
Fine draughtsmanship, single colour accent. No text, no numbers, no signature. --ar 2:3 --style raw
```

### 1503 — Léonard de Vinci peint la Joconde  ·  `joconde.png`
```
Detailed graphite pencil sketch on cream paper, meticulous greyscale hatching, with selective spot color — ONLY the Mona Lisa on the easel, in warm sepia-gold colour rendered in vivid colour while everything else stays pencil-grey:
Leonardo da Vinci painting the Mona Lisa in his Renaissance studio, brushes and sketches.
Fine draughtsmanship, single colour accent. No text, no numbers, no signature. --ar 2:3 --style raw
```

### 1517 — Réforme de Luther (95 thèses)  ·  `reforme_luther.png`
```
Detailed graphite pencil sketch on cream paper, meticulous greyscale hatching, with selective spot color — ONLY the parchment of the theses and its red wax seal rendered in vivid colour while everything else stays pencil-grey:
Luther nailing his theses to the church door in Wittenberg, a gathering crowd.
Fine draughtsmanship, single colour accent. No text, no numbers, no signature. --ar 2:3 --style raw
```

### 1519 — Premier tour du monde (Magellan)  ·  `magellan.png`
```
Detailed graphite pencil sketch on cream paper, meticulous greyscale hatching, with selective spot color — ONLY the storm-lit sails in warm amber rendered in vivid colour while everything else stays pencil-grey:
Magellan's fleet passing through a stormy strait, billowing sails, a globe and compass.
Fine draughtsmanship, single colour accent. No text, no numbers, no signature. --ar 2:3 --style raw
```

### 1572 — Nuit de la Saint-Barthélemy  ·  `saint_barthelemy.png`
```
Detailed graphite pencil sketch on cream paper, meticulous greyscale hatching, with selective spot color — ONLY the orange torch flames rendered in vivid colour while everything else stays pencil-grey:
Paris at night, torch-lit alleys, the massacre of the Protestants, dramatic shadows.
Fine draughtsmanship, single colour accent. No text, no numbers, no signature. --ar 2:3 --style raw
```

### 1598 — Édit de Nantes  ·  `edit_nantes.png`
```
Detailed graphite pencil sketch on cream paper, meticulous greyscale hatching, with selective spot color — ONLY Henri IV's royal-blue mantle and the red seal rendered in vivid colour while everything else stays pencil-grey:
Henri IV signing the edict of tolerance, the royal court, quills and parchment.
Fine draughtsmanship, single colour accent. No text, no numbers, no signature. --ar 2:3 --style raw
```

### 1608 — Fondation de Québec  ·  `quebec.png`
```
Detailed graphite pencil sketch on cream paper, meticulous greyscale hatching, with selective spot color — ONLY the blue-and-gold fleur-de-lys banner rendered in vivid colour while everything else stays pencil-grey:
Champlain founding Quebec, a wooden palisade, the Saint Lawrence river, a vast forest.
Fine draughtsmanship, single colour accent. No text, no numbers, no signature. --ar 2:3 --style raw
```

### 1610 — Galilée observe le ciel à la lunette  ·  `galilee.png`
```
Detailed graphite pencil sketch on cream paper, meticulous greyscale hatching, with selective spot color — ONLY the golden stars in the night sky rendered in vivid colour while everything else stays pencil-grey:
Galileo pointing his telescope at the stars from an Italian terrace, the night sky.
Fine draughtsmanship, single colour accent. No text, no numbers, no signature. --ar 2:3 --style raw
```

### 1682 — Louis XIV s'installe à Versailles  ·  `versailles.png`
```
Detailed graphite pencil sketch on cream paper, meticulous greyscale hatching, with selective spot color — ONLY the gold ornaments of the hall rendered in vivid colour while everything else stays pencil-grey:
Louis XIV and his court in the Hall of Mirrors, baroque splendour, mirrors and gilding.
Fine draughtsmanship, single colour accent. No text, no numbers, no signature. --ar 2:3 --style raw
```

### 1687 — Newton et la gravitation  ·  `newton.png`
```
Detailed graphite pencil sketch on cream paper, meticulous greyscale hatching, with selective spot color — ONLY the single red apple rendered in vivid colour while everything else stays pencil-grey:
Newton sitting thoughtfully under an apple tree, a falling apple, sketches of planetary orbits.
Fine draughtsmanship, single colour accent. No text, no numbers, no signature. --ar 2:3 --style raw
```

---

## Époque contemporaine (34)

### 1769 — Machine à vapeur de Watt  ·  `watt_vapeur.png`
```
Detailed graphite pencil sketch on cream paper, meticulous greyscale hatching, with selective spot color — ONLY the orange furnace glow rendered in vivid colour while everything else stays pencil-grey:
James Watt and his steam engine, pistons and flywheel, a smoky workshop, the industrial revolution.
Fine draughtsmanship, single colour accent. No text, no numbers, no signature. --ar 2:3 --style raw
```

### 1776 — Indépendance des États-Unis  ·  `independance_usa.png`
```
Detailed graphite pencil sketch on cream paper, meticulous greyscale hatching, with selective spot color — ONLY the red and blue of the thirteen-star flag rendered in vivid colour while everything else stays pencil-grey:
the signing of the Declaration of Independence, the founding fathers, a thirteen-star flag.
Fine draughtsmanship, single colour accent. No text, no numbers, no signature. --ar 2:3 --style raw
```

### 1783 — Invention de la montgolfière  ·  `montgolfiere.png`
```
Detailed graphite pencil sketch on cream paper, meticulous greyscale hatching, with selective spot color — ONLY the blue-and-gold hot-air balloon rendered in vivid colour while everything else stays pencil-grey:
the Montgolfier brothers' first hot-air balloon rising, an amazed 18th-century crowd in period costume, a château and formal gardens.
Fine draughtsmanship, single colour accent. No text, no numbers, no signature. --ar 2:3 --style raw
```

### 1789 — Révolution française  ·  `revolution_fr.png`
```
Detailed graphite pencil sketch on cream paper, meticulous greyscale hatching, with selective spot color — ONLY the blue-white-red tricolour flag rendered in vivid colour while everything else stays pencil-grey:
the storming of the Bastille, a raised tricolour flag, an armed crowd, the fortress and smoke.
Fine draughtsmanship, single colour accent. No text, no numbers, no signature. --ar 2:3 --style raw
```

### 1804 — Sacre de Napoléon  ·  `sacre_napoleon.png`
```
Detailed graphite pencil sketch on cream paper, meticulous greyscale hatching, with selective spot color — ONLY Napoleon's crimson-and-gold robe and laurel crown rendered in vivid colour while everything else stays pencil-grey:
Napoleon crowning himself emperor at Notre-Dame, a laurel crown, imperial splendour.
Fine draughtsmanship, single colour accent. No text, no numbers, no signature. --ar 2:3 --style raw
```

### 1815 — Bataille de Waterloo  ·  `waterloo.png`
```
Detailed graphite pencil sketch on cream paper, meticulous greyscale hatching, with selective spot color — ONLY the red military coats rendered in vivid colour while everything else stays pencil-grey:
the battlefield of Waterloo, a cavalry charge, cannon smoke, Napoleonic uniforms.
Fine draughtsmanship, single colour accent. No text, no numbers, no signature. --ar 2:3 --style raw
```

### 1830 — Essor du chemin de fer  ·  `locomotive.png`
```
Detailed graphite pencil sketch on cream paper, meticulous greyscale hatching, with selective spot color — ONLY the red locomotive and its orange firebox glow rendered in vivid colour while everything else stays pencil-grey:
an early steam locomotive pulling carriages, a Victorian station, a plume of smoke, a crowd.
Fine draughtsmanship, single colour accent. No text, no numbers, no signature. --ar 2:3 --style raw
```

### 1839 — Invention de la photographie  ·  `photographie.png`
```
Detailed graphite pencil sketch on cream paper, meticulous greyscale hatching, with selective spot color — ONLY the warm sepia tone of the captured image rendered in vivid colour while everything else stays pencil-grey:
Daguerre and his daguerreotype on a tripod, a dark room, the first latent image on a plate.
Fine draughtsmanship, single colour accent. No text, no numbers, no signature. --ar 2:3 --style raw
```

### 1848 — Abolition de l'esclavage en France  ·  `abolition_esclavage.png`
```
Detailed graphite pencil sketch on cream paper, meticulous greyscale hatching, with selective spot color — ONLY the golden sunrise and the tricolour cockades rendered in vivid colour while everything else stays pencil-grey:
freed people celebrating liberty, broken chains, a French tropical island, the 1848 decree.
Fine draughtsmanship, single colour accent. No text, no numbers, no signature. --ar 2:3 --style raw
```

### 1876 — Invention du téléphone  ·  `telephone.png`
```
Detailed graphite pencil sketch on cream paper, meticulous greyscale hatching, with selective spot color — ONLY the brass telephone apparatus in warm gold rendered in vivid colour while everything else stays pencil-grey:
Alexander Graham Bell at the first telephone, a Victorian office, wires and receiver.
Fine draughtsmanship, single colour accent. No text, no numbers, no signature. --ar 2:3 --style raw
```

### 1879 — Invention de l'ampoule électrique  ·  `ampoule.png`
```
Detailed graphite pencil sketch on cream paper, meticulous greyscale hatching, with selective spot color — ONLY the warm golden glow of the lightbulb rendered in vivid colour while everything else stays pencil-grey:
Edison holding his first glowing lightbulb, a dark laboratory, wires.
Fine draughtsmanship, single colour accent. No text, no numbers, no signature. --ar 2:3 --style raw
```

### 1889 — Construction de la Tour Eiffel  ·  `tour_eiffel.png`
```
Detailed graphite pencil sketch on cream paper, meticulous greyscale hatching, with selective spot color — ONLY the golden sunset sky behind the iron tower rendered in vivid colour while everything else stays pencil-grey:
the Eiffel Tower under construction, workers on the iron girders, Paris below, the World's Fair.
Fine draughtsmanship, single colour accent. No text, no numbers, no signature. --ar 2:3 --style raw
```

### 1895 — Cinématographe des frères Lumière  ·  `cinema_lumiere.png`
```
Detailed graphite pencil sketch on cream paper, meticulous greyscale hatching, with selective spot color — ONLY the warm beam of the projector rendered in vivid colour while everything else stays pencil-grey:
the first Lumière film projection, spectators seen from behind, a beam of light, a screen, a train at the platform.
Fine draughtsmanship, single colour accent. No text, no numbers, no signature. --ar 2:3 --style raw
```

### 1896 — Premiers Jeux Olympiques modernes  ·  `jo_modernes.png`
```
Detailed graphite pencil sketch on cream paper, meticulous greyscale hatching, with selective spot color — ONLY the blue and red national flags rendered in vivid colour while everything else stays pencil-grey:
the Panathenaic stadium in Athens in 1896, athletes in period kit, a crowd, white marble.
Fine draughtsmanship, single colour accent. No text, no numbers, no signature. --ar 2:3 --style raw
```

### 1903 — Premier vol des frères Wright  ·  `wright.png`
```
Detailed graphite pencil sketch on cream paper, meticulous greyscale hatching, with selective spot color — ONLY the warm ochre dune sand rendered in vivid colour while everything else stays pencil-grey:
the Wright brothers' biplane taking off, a Kitty Hawk dune, blowing sand, a running man.
Fine draughtsmanship, single colour accent. No text, no numbers, no signature. --ar 2:3 --style raw
```

### 1905 — Théorie de la relativité (Einstein)  ·  `relativite.png`
```
Detailed graphite pencil sketch on cream paper, meticulous greyscale hatching, with selective spot color — ONLY the golden stars and swirling cosmos rendered in vivid colour while everything else stays pencil-grey:
young Einstein at a blackboard covered with chalk equations, clocks and stars around him.
Fine draughtsmanship, single colour accent. No text, no numbers, no signature. --ar 2:3 --style raw
```

### 1912 — Naufrage du Titanic  ·  `titanic.png`
```
Detailed graphite pencil sketch on cream paper, meticulous greyscale hatching, with selective spot color — ONLY the warm orange portholes and a red distress flare rendered in vivid colour while everything else stays pencil-grey:
the Titanic sinking in the icy night, an iceberg, lifeboats, the stern rising.
Fine draughtsmanship, single colour accent. No text, no numbers, no signature. --ar 2:3 --style raw
```

### 1914 — Première Guerre mondiale  ·  `ww1.png`
```
Detailed graphite pencil sketch on cream paper, meticulous greyscale hatching, with selective spot color — ONLY a single red poppy rendered in vivid colour while everything else stays pencil-grey:
the trenches of the First World War, helmeted soldiers, no man's land, barbed wire, a leaden sky.
Fine draughtsmanship, single colour accent. No text, no numbers, no signature. --ar 2:3 --style raw
```

### 1917 — Révolution russe  ·  `revolution_russe.png`
```
Detailed graphite pencil sketch on cream paper, meticulous greyscale hatching, with selective spot color — ONLY the red revolutionary flags rendered in vivid colour while everything else stays pencil-grey:
a revolutionary crowd in Petrograd, waving flags, the Winter Palace, snow.
Fine draughtsmanship, single colour accent. No text, no numbers, no signature. --ar 2:3 --style raw
```

### 1928 — Découverte de la pénicilline  ·  `penicilline.png`
```
Detailed graphite pencil sketch on cream paper, meticulous greyscale hatching, with selective spot color — ONLY the green-blue mould in the petri dish rendered in vivid colour while everything else stays pencil-grey:
Fleming examining a mouldy petri dish, a laboratory bench, a microscope, test tubes.
Fine draughtsmanship, single colour accent. No text, no numbers, no signature. --ar 2:3 --style raw
```

### 1939 — Seconde Guerre mondiale  ·  `ww2.png`
```
Detailed graphite pencil sketch on cream paper, meticulous greyscale hatching, with selective spot color — ONLY the orange fires on the horizon rendered in vivid colour while everything else stays pencil-grey:
Europe at war in 1939, tanks and planes, a dark sky, columns of soldiers.
Fine draughtsmanship, single colour accent. No text, no numbers, no signature. --ar 2:3 --style raw
```

### 1944 — Débarquement de Normandie  ·  `debarquement.png`
```
Detailed graphite pencil sketch on cream paper, meticulous greyscale hatching, with selective spot color — ONLY the warm muzzle-fire against the grey sea and sky rendered in vivid colour while everything else stays pencil-grey:
landing craft opening their ramps on a Normandy beach, soldiers wading through the surf, June 1944.
Fine draughtsmanship, single colour accent. No text, no numbers, no signature. --ar 2:3 --style raw
```

### 1944 — Droit de vote des femmes en France  ·  `vote_femmes.png`
```
Detailed graphite pencil sketch on cream paper, meticulous greyscale hatching, with selective spot color — ONLY the blue-white-red tricolour flag and the ballot paper rendered in vivid colour while everything else stays pencil-grey:
a French woman placing her ballot into a ballot box for the first time, women waiting in line, 1940s clothing, a town-hall interior.
Fine draughtsmanship, single colour accent. No text, no numbers, no signature. --ar 2:3 --style raw
```

### 1945 — Bombe atomique et fin de la Seconde Guerre  ·  `hiroshima.png`
```
Detailed graphite pencil sketch on cream paper, meticulous greyscale hatching, with selective spot color — ONLY the orange-red glow of the atomic cloud rendered in vivid colour while everything else stays pencil-grey:
a towering atomic mushroom cloud on the horizon, the silhouette of a city, 1945.
Fine draughtsmanship, single colour accent. No text, no numbers, no signature. --ar 2:3 --style raw
```

### 1948 — Déclaration universelle des droits de l'homme  ·  `ddh.png`
```
Detailed graphite pencil sketch on cream paper, meticulous greyscale hatching, with selective spot color — ONLY the pale-blue assembly and the coloured world flags rendered in vivid colour while everything else stays pencil-grey:
the United Nations assembly adopting the Declaration, delegates from around the world, a solemn document, flags.
Fine draughtsmanship, single colour accent. No text, no numbers, no signature. --ar 2:3 --style raw
```

### 1953 — Première ascension de l'Everest  ·  `everest.png`
```
Detailed graphite pencil sketch on cream paper, meticulous greyscale hatching, with selective spot color — ONLY the climbers' red jackets and the summit flags rendered in vivid colour while everything else stays pencil-grey:
Hillary and Tenzing on the snowy summit of Everest, ice axe and rope, a flag, a high-altitude sky.
Fine draughtsmanship, single colour accent. No text, no numbers, no signature. --ar 2:3 --style raw
```

### 1953 — Structure de l'ADN (double hélice)  ·  `adn.png`
```
Detailed graphite pencil sketch on cream paper, meticulous greyscale hatching, with selective spot color — ONLY the coloured spheres of the double-helix model rendered in vivid colour while everything else stays pencil-grey:
Watson and Crick before their large metal double-helix model, a laboratory, sketches.
Fine draughtsmanship, single colour accent. No text, no numbers, no signature. --ar 2:3 --style raw
```

### 1957 — Spoutnik, premier satellite  ·  `spoutnik.png`
```
Detailed graphite pencil sketch on cream paper, meticulous greyscale hatching, with selective spot color — ONLY the blue curve of the Earth rendered in vivid colour while everything else stays pencil-grey:
the small antennaed Sputnik satellite floating in space above the blue Earth, stars.
Fine draughtsmanship, single colour accent. No text, no numbers, no signature. --ar 2:3 --style raw
```

### 1961 — Premier homme dans l'espace (Gagarine)  ·  `gagarine.png`
```
Detailed graphite pencil sketch on cream paper, meticulous greyscale hatching, with selective spot color — ONLY the blue Earth through the porthole rendered in vivid colour while everything else stays pencil-grey:
Gagarin in his spacesuit inside the Vostok capsule, the curved Earth through the window.
Fine draughtsmanship, single colour accent. No text, no numbers, no signature. --ar 2:3 --style raw
```

### 1969 — Premier pas sur la Lune  ·  `lune.png`
```
Detailed graphite pencil sketch on cream paper, meticulous greyscale hatching, with selective spot color — ONLY the blue Earth rising over the grey lunar horizon rendered in vivid colour while everything else stays pencil-grey:
an astronaut stepping onto the Moon, the lunar module, a footprint, Earth on the black horizon.
Fine draughtsmanship, single colour accent. No text, no numbers, no signature. --ar 2:3 --style raw
```

### 1989 — Chute du mur de Berlin  ·  `mur_berlin.png`
```
Detailed graphite pencil sketch on cream paper, meticulous greyscale hatching, with selective spot color — ONLY the colourful spray-paint graffiti rendered in vivid colour while everything else stays pencil-grey:
a jubilant crowd standing on the Berlin Wall, hammers and picks, graffiti, November 1989.
Fine draughtsmanship, single colour accent. No text, no numbers, no signature. --ar 2:3 --style raw
```

### 1991 — Naissance du Web  ·  `web.png`
```
Detailed graphite pencil sketch on cream paper, meticulous greyscale hatching, with selective spot color — ONLY the glowing blue network of connection lines rendered in vivid colour while everything else stays pencil-grey:
Tim Berners-Lee at a 1990s computer, the first web pages, a web of glowing connections.
Fine draughtsmanship, single colour accent. No text, no numbers, no signature. --ar 2:3 --style raw
```

### 1994 — Fin de l'apartheid, Mandela président  ·  `mandela.png`
```
Detailed graphite pencil sketch on cream paper, meticulous greyscale hatching, with selective spot color — ONLY the colours of the South African flag rendered in vivid colour while everything else stays pencil-grey:
Nelson Mandela voting then greeting the crowd, a long line of South African voters, jubilation.
Fine draughtsmanship, single colour accent. No text, no numbers, no signature. --ar 2:3 --style raw
```

### 2007 — Premier smartphone tactile (iPhone)  ·  `iphone.png`
```
Detailed graphite pencil sketch on cream paper, meticulous greyscale hatching, with selective spot color — ONLY the bright glowing screen rendered in vivid colour while everything else stays pencil-grey:
the unveiling of the first touchscreen smartphone, a bright glowing screen held in a hand, a dark stage, a spotlight.
Fine draughtsmanship, single colour accent. No text, no numbers, no signature. --ar 2:3 --style raw
```
