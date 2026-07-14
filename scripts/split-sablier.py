# Decoupe assets/sablier.png (planche 4x4 : lignes=couleurs, colonnes=remplissage)
# en 4 bandes horizontales -> assets/sablier-<couleur>.webp, chacune sprite 4 niveaux.
# La bande est rognee verticalement au plus pres des sabliers (le halo de la 4e colonne compris).
from PIL import Image
import numpy as np, os

SRC = os.path.join(os.path.dirname(__file__), "..", "assets", "sablier.png")
OUT = os.path.join(os.path.dirname(__file__), "..", "assets")
COLORS = ["amber", "blue", "green", "purple"]

im = Image.open(SRC).convert("RGB")
a = np.asarray(im).astype(int)
W, H = im.size
cell = W / 4.0
bright = a.sum(2)
thr = 140 * 3               # pixel "contenu" si somme RVB > seuil (fond ~ #151515 => 63)

bands = []
for r in range(4):
    y0 = int(round(r * cell)); y1 = int(round((r + 1) * cell))
    band = bright[y0:y1, :]
    rows_with = np.where((band > thr).sum(1) > 25)[0]
    top = y0 + rows_with.min(); bot = y0 + rows_with.max()
    bands.append((top, bot))
    print("row", r, COLORS[r], "content y[", top, bot, "] h=", bot - top)

# hauteur de bande commune (max) + un peu de marge pour le halo
pad = 14
h = max(b - t for t, b in bands) + 2 * pad
for r, (t, b) in enumerate(bands):
    cy = (t + b) // 2
    y0 = max(0, cy - h // 2); y1 = min(H, y0 + h)
    strip = im.crop((0, y0, W, y1))          # pleine largeur (4 niveaux), bande rognee
    dst = os.path.join(OUT, "sablier-%s.webp" % COLORS[r])
    strip.save(dst, "WEBP", quality=88, method=6)
    print("=>", os.path.basename(dst), strip.size)
print("bande commune h=", h, "  cellule=", round(cell, 1))
