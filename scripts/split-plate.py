#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Découpe une planche en grille -> assets/cards/<id>.webp (max 700px large, WebP).
Ordre : ligne par ligne, de gauche à droite, de haut en bas.

3 façons de l'appeler :

1) Noms DANS le nom du fichier (le plus simple — voir decouper-planche.bat) :
     python scripts/split-plate.py "roue-curie-toutankhamon-inde.png"
     python scripts/split-plate.py "3x2_pyramide-lune-eiffel-titanic-jo-newton.png"
   -> ids séparés par des tirets "-", préfixe de grille optionnel "CxR_" (défaut 2x2).

2) Grille + ids en arguments :
     python scripts/split-plate.py plate.png 2x2 a b c d
     python scripts/split-plate.py plate.png 3x2 a b c d e f

3) Rétro-compat 2x2 :
     python scripts/split-plate.py plate.png a b c d
"""
import sys, re
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
OUT  = ROOT / "assets" / "cards"
MAXW, QUALITY = 700, 85
INSET = 0.01

def parse_filename(stem):
    """'3x2_a-b-c' -> ('3x2', ['a','b','c']) ; 'a-b-c-d' -> (None, [...]) (défaut 2x2)."""
    m = re.match(r"^(\d+x\d+)_(.+)$", stem)
    grid, idpart = (m.group(1), m.group(2)) if m else (None, stem)
    return grid, [t for t in idpart.split("-") if t]

def main():
    args = sys.argv[1:]
    if not args:
        print(__doc__); return
    plate = Path(args[0].replace("%USERPROFILE%", str(Path.home())))
    rest = args[1:]

    if not rest:                                   # 1) tout depuis le nom du fichier
        grid, ids = parse_filename(plate.stem)
    elif re.fullmatch(r"\d+x\d+", rest[0]):        # 2) grille explicite
        grid, ids = rest[0], rest[1:]
    else:                                          # 3) rétro-compat 2x2
        grid, ids = None, rest
    cols, rows = (map(int, grid.split("x")) if grid else (2, 2))
    cols, rows = int(cols), int(rows)

    if not plate.exists():
        print(f"Introuvable : {plate}"); return
    if len(ids) < cols*rows:
        print(f"Il faut {cols*rows} identifiants pour une grille {cols}x{rows} (reçu {len(ids)}: {ids})."); return

    OUT.mkdir(parents=True, exist_ok=True)
    img = Image.open(plate).convert("RGB")
    W, H = img.size
    cw, ch = W / cols, H / rows
    print(f"Planche {W}x{H} -> grille {cols}x{rows}")
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
