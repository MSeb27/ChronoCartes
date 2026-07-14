#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Découpe la planche d'icônes joueur (8x5) en 40 avatars ronds -> assets/avatars/avNN.webp

- Chaque icône est découpée dans sa case de la grille 8x5.
- Détection du médaillon (cercle) en ignorant les bords de la case (pour ne pas attraper le
  médaillon voisin qui déborde).
- Masque circulaire final : tout ce qui est HORS du médaillon devient blanc (adieu les bouts de
  dessin voisins et l'ombre)."""
from pathlib import Path
from PIL import Image, ImageOps, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
SRC  = Path.home() / "Downloads" / "Planche icone joueur.png"
OUT  = ROOT / "assets" / "avatars"
COLS, ROWS, SIZE = 8, 5, 128
THRESH   = 215     # < ce niveau de gris = contenu (l'anneau du médaillon)
DET_INSET = 0.07   # fraction de la case ignorée aux bords lors de la DÉTECTION
MARGIN   = 1.05    # marge du carré autour du médaillon détecté

def medallion(cell):
    """Centre (cx,cy) + rayon du médaillon. Détection sur une zone rognée pour éviter les voisins.
       Largeur de la zone non-blanche = diamètre ; centre vertical = haut de l'anneau + rayon."""
    ins = round(min(cell.size) * DET_INSET)
    inner = cell.crop((ins, ins, cell.width-ins, cell.height-ins))
    bb = ImageOps.grayscale(inner).point(lambda v: 255 if v < THRESH else 0).getbbox()
    if not bb:
        return cell.width/2, cell.height/2, min(cell.size)/2*0.85
    left, top, right, _ = bb
    diam = right - left
    return ins + (left+right)/2, ins + top + diam/2, diam/2

def main():
    if not SRC.exists():
        print(f"Introuvable : {SRC}"); return
    OUT.mkdir(parents=True, exist_ok=True)
    img = Image.open(SRC).convert("RGB")
    W, H = img.size
    cw, ch = W / COLS, H / ROWS
    # masque circulaire réutilisable (rayon = médaillon dans l'espace SIZE, hors marge)
    mask = Image.new("L", (SIZE, SIZE), 0)
    inset = round(SIZE/2 * (1 - 1/MARGIN))
    ImageDraw.Draw(mask).ellipse((inset, inset, SIZE-inset, SIZE-inset), fill=255)
    white = Image.new("RGB", (SIZE, SIZE), (255, 255, 255))

    n = 0
    for r in range(ROWS):
        for c in range(COLS):
            cell = img.crop((round(c*cw), round(r*ch), round((c+1)*cw), round((r+1)*ch)))
            cx, cy, rad = medallion(cell)
            half = rad * MARGIN
            x0, y0, x1, y1 = round(cx-half), round(cy-half), round(cx+half), round(cy+half)
            sq = Image.new("RGB", (x1-x0, y1-y0), (255, 255, 255))
            sq.paste(cell.crop((max(0,x0), max(0,y0), min(cell.width,x1), min(cell.height,y1))),
                     (max(0,-x0), max(0,-y0)))
            sq = sq.resize((SIZE, SIZE), Image.LANCZOS)
            sq = Image.composite(sq, white, mask)   # blanc hors du médaillon
            n += 1
            sq.save(OUT / f"av{n:02d}.webp", "WEBP", quality=88, method=6)
    print(f"{n} avatars découpés (masque circulaire) -> {OUT}")

if __name__ == "__main__":
    main()
