#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Découpe la planche d'icônes joueur (8x5) en 40 avatars ronds AUTO-CENTRÉS -> assets/avatars/avNN.webp

Au lieu d'un découpage en grille rigide (qui décentre si l'IA n'aligne pas parfaitement),
on détecte le médaillon dans chaque case (cercle plus sombre que le fond) et on recadre
un carré centré dessus."""
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
SRC  = Path.home() / "Downloads" / "Planche icone joueur.png"
OUT  = ROOT / "assets" / "avatars"
COLS, ROWS, SIZE = 8, 5, 128
THRESH = 205        # < ce niveau de gris = contenu (l'anneau du médaillon)
PAD    = 1.06       # marge autour du médaillon détecté

def content_bbox(cell):
    """bbox du médaillon (contenu non-blanc) dans la case."""
    g = ImageOps.grayscale(cell)
    mask = g.point(lambda v: 255 if v < THRESH else 0)
    return mask.getbbox()

def main():
    if not SRC.exists():
        print(f"Introuvable : {SRC}"); return
    OUT.mkdir(parents=True, exist_ok=True)
    img = Image.open(SRC).convert("RGB")
    W, H = img.size
    cw, ch = W / COLS, H / ROWS
    n = 0
    for r in range(ROWS):
        for c in range(COLS):
            cell = img.crop((round(c*cw), round(r*ch), round((c+1)*cw), round((r+1)*ch)))
            bb = content_bbox(cell)
            if bb:
                cx, cy = (bb[0]+bb[2])/2, (bb[1]+bb[3])/2
                half = max(bb[2]-bb[0], bb[3]-bb[1]) / 2 * PAD
            else:  # repli : centre de la case
                cx, cy, half = cell.width/2, cell.height/2, min(cell.size)/2*0.9
            x0, y0 = round(cx-half), round(cy-half)
            x1, y1 = round(cx+half), round(cy+half)
            # recadrage carré centré sur le médaillon (avec fond blanc si débordement)
            sq = Image.new("RGB", (x1-x0, y1-y0), (255, 255, 255))
            sq.paste(cell.crop((max(0,x0), max(0,y0), min(cell.width,x1), min(cell.height,y1))),
                     (max(0,-x0), max(0,-y0)))
            sq = sq.resize((SIZE, SIZE), Image.LANCZOS)
            n += 1
            sq.save(OUT / f"av{n:02d}.webp", "WEBP", quality=88, method=6)
    print(f"{n} avatars auto-centrés -> {OUT}")

if __name__ == "__main__":
    main()
