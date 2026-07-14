#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Découpe la planche d'icônes joueur (8x5) en 40 avatars ronds -> assets/avatars/avNN.webp"""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC  = Path.home() / "Downloads" / "Planche icone joueur.png"
OUT  = ROOT / "assets" / "avatars"
COLS, ROWS, SIZE = 8, 5, 128
INSET = 0.05   # rogne 5% de marge blanche autour de chaque icône

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
            x0, y0 = c*cw + cw*INSET, r*ch + ch*INSET
            x1, y1 = (c+1)*cw - cw*INSET, (r+1)*ch - ch*INSET
            cell = img.crop((round(x0), round(y0), round(x1), round(y1)))
            s = min(cell.size)                       # carré central
            left, top = (cell.width - s)//2, (cell.height - s)//2
            cell = cell.crop((left, top, left+s, top+s)).resize((SIZE, SIZE), Image.LANCZOS)
            n += 1
            cell.save(OUT / f"av{n:02d}.webp", "WEBP", quality=88, method=6)
    print(f"{n} avatars écrits dans {OUT}")

if __name__ == "__main__":
    main()
