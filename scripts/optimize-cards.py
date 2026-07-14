#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Optimise les illustrations de cartes Tempora.

Pour chaque evenement (id lu dans data/evenements.json), cherche une image source
nommee <id>.(png|jpg|jpeg|webp) dans  assets/_src/  puis  assets/  (racine),
la redimensionne (largeur max 700 px) et la convertit en WebP dans  assets/cards/.
L'original trouve a la racine assets/ est ensuite deplace vers assets/_originals/
(conserve mais hors du depot) pour alleger le projet.

Usage :  python scripts/optimize-cards.py       (ou double-clic sur optimize-cards.bat)
"""
import json
from pathlib import Path
from PIL import Image

ROOT      = Path(__file__).resolve().parent.parent
ASSETS    = ROOT / "assets"
SRC_DIR   = ASSETS / "_src"        # stash optionnel (non versionne)
CARDS_DIR = ASSETS / "cards"       # sortie servie par le jeu (versionnee)
ORIG_DIR  = ASSETS / "_originals"  # originaux conserves (non versionnes)

MAX_W   = 700          # largeur cible (une carte fait ~130 px a l'ecran)
QUALITY = 85           # qualite WebP
EXTS    = (".png", ".jpg", ".jpeg", ".webp")
CREAM   = (244, 232, 207)


def load_ids():
    data = json.loads((ROOT / "data" / "evenements.json").read_text(encoding="utf-8"))
    return [e["id"] for e in data["evenements"]]


def find_source(cid):
    for base in (SRC_DIR, ASSETS):          # _src prioritaire, sinon racine assets/
        for ext in EXTS:
            p = base / f"{cid}{ext}"
            if p.exists():
                return p
    return None


def human(n):
    n = float(n)
    for u in ("o", "Ko", "Mo"):
        if n < 1024:
            return f"{n:.0f} {u}"
        n /= 1024
    return f"{n:.1f} Go"


def main():
    CARDS_DIR.mkdir(parents=True, exist_ok=True)
    ids = load_ids()
    done = skipped = 0
    tot_before = tot_after = 0

    for cid in ids:
        src = find_source(cid)
        if not src:
            continue
        out = CARDS_DIR / f"{cid}.webp"
        # idempotent : si le webp est deja au moins aussi recent que la source, on saute
        if out.exists() and out.stat().st_mtime >= src.stat().st_mtime:
            skipped += 1
            continue

        before = src.stat().st_size
        img = Image.open(src)
        if img.width > MAX_W:
            h = round(img.height * MAX_W / img.width)
            img = img.resize((MAX_W, h), Image.LANCZOS)
        if img.mode == "RGBA":              # aplatir l'alpha eventuel sur fond creme
            bg = Image.new("RGB", img.size, CREAM)
            bg.paste(img, mask=img.split()[-1])
            img = bg
        elif img.mode != "RGB":
            img = img.convert("RGB")
        img.save(out, "WEBP", quality=QUALITY, method=6)

        after = out.stat().st_size
        tot_before += before
        tot_after += after
        done += 1
        print(f"  {cid:<22} {human(before):>9}  ->  {human(after):>9}")

        # ranger l'original s'il etait a la racine assets/ (pour alleger le depot)
        if src.parent == ASSETS:
            ORIG_DIR.mkdir(parents=True, exist_ok=True)
            src.replace(ORIG_DIR / src.name)

    print("-" * 50)
    print(f"{done} carte(s) optimisee(s), {skipped} deja a jour.")
    if done:
        pct = 100 * tot_after / tot_before if tot_before else 0
        print(f"Total : {human(tot_before)}  ->  {human(tot_after)}  ({pct:.0f} % du poids d'origine)")
    if done == 0 and skipped == 0:
        print("Aucune source trouvee.")
        print("Depose tes images nommees <id>.png dans  assets/  ou  assets/_src/.")


if __name__ == "__main__":
    main()
