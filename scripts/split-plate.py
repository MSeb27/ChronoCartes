#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Découpe une planche 2x2 en 4 cartes -> assets/cards/<id>.webp (700px, WebP).
Ordre : haut-gauche, haut-droite, bas-gauche, bas-droite.

Usage :
  python scripts/split-plate.py <planche.png> <id_HG> <id_HD> <id_BG> <id_BD>

Exemple (cartes spéciales) :
  python scripts/split-plate.py "%USERPROFILE%/Downloads/Planche cartes speciales.png" sp_voyance sp_decalage sp_echange sp_double
"""
import sys
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
OUT  = ROOT / "assets" / "cards"
MAXW, QUALITY = 700, 85
INSET = 0.01   # petite marge rognée autour de chaque case

def main():
    if len(sys.argv) < 6:
        print(__doc__); return
    plate = Path(sys.argv[1].replace("%USERPROFILE%", str(Path.home())))
    ids = sys.argv[2:6]
    if not plate.exists():
        print(f"Introuvable : {plate}"); return
    OUT.mkdir(parents=True, exist_ok=True)
    img = Image.open(plate).convert("RGB")
    W, H = img.size
    cw, ch = W / 2, H / 2
    cells = [(0, 0), (1, 0), (0, 1), (1, 1)]   # HG, HD, BG, BD
    for (cx, cy), cid in zip(cells, ids):
        x0 = cx*cw + cw*INSET; y0 = cy*ch + ch*INSET
        x1 = (cx+1)*cw - cw*INSET; y1 = (cy+1)*ch - ch*INSET
        c = img.crop((round(x0), round(y0), round(x1), round(y1)))
        if c.width > MAXW:
            c = c.resize((MAXW, round(c.height*MAXW/c.width)), Image.LANCZOS)
        c.save(OUT / f"{cid}.webp", "WEBP", quality=QUALITY, method=6)
        print(f"  {cid}.webp  {c.width}x{c.height}")
    print("OK ->", OUT)

if __name__ == "__main__":
    main()
