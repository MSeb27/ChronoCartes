@echo off
cd /d "%~dp0"
echo Optimisation des cartes (assets/ -> assets/cards/*.webp)...
python scripts\optimize-cards.py
echo.
pause
