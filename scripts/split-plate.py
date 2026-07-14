#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Découpe une planche en grille -> assets/cards/<id>.webp (max 700px large, WebP).
Ordre : ligne par ligne, de gauche à droite, de haut en bas.

Usage :
  python scripts/split-plate.py <planche.png> <ColsxRows> <id1> <id2> ... <idN>
  (N = Cols*Rows)

Exemples :
  python scripts/split-plate.py "%USERPROFILE%/Downloads/plate.png" 2x2 a b c d
  python scripts/split-plate.py "%USERPROFILE%/Downloads/plate.png" 3x2 a b c d e f

Rétro-compat : si le 2e argument n'est pas une grille (ex. "sp_voyance"), on suppose 2x2.
"""
import sys, re
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
OUT  = ROOT / "assets" / "cards"
MAXW, QUALITY = 700, 85
INSET = 0.01   # petite marge rognée autour de chaque case

def main():
    if len(sys.argv) < 4:
        print(__doc__); return
    plate = Path(sys.argv[1].replace("%USERPROFILE%", str(Path.home())))
    m = re.fullmatch(r"(\d+)x(\d+)", sys.argv[2])
    if m:
        cols, rows = int(m.group(1)), int(m.group(2)); ids = sys.argv[3:]
    else:
        cols, rows = 2, 2; ids = sys.argv[2:]          # rétro-compat (2x2)
    if not plate.exists():
        print(f"Introuvable : {plate}"); return
    if len(ids) < cols*rows:
        print(f"Il faut {cols*rows} identifiants pour une grille {cols}x{rows} (reçu {len(ids)})."); return

    OUT.mkdir(parents=True, exist_ok=True)
    img = Image.open(plate).convert("RGB")
    W, H = img.size
    cw, ch = W / cols, H / rows
    for r in range(rows):
        for c in range(cols):
            cid = ids[r*cols + c]
            x0 = c*cw + cw*INSET; y0 = r*ch + ch*INSET
            x1 = (c+1)*cw - cw*INSET; y1 = (r+1)*ch - ch*INSET
            cell = img.crop((round(x0), round(y0), round(x1), round(y1)))
            if cell.width > MAXW:
                cell = cell.resize((MAXW, round(cell.height*MAXW/cell.width)), Image.LANCZOS)
            cell.save(OUT / f"{cid}.webp", "WEBP", quality=QUALITY, method=6)
            print(f"  {cid}.webp  {cell.width}x{cell.height}")
    print("OK ->", OUT)

if __name__ == "__main__":
    main()
