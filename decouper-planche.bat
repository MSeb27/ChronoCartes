@echo off
cd /d "%~dp0"
if "%~1"=="" (
  echo ============================================
  echo   Tempora - decouper une planche de cartes
  echo ============================================
  echo   Glisse-depose une planche PNG sur ce fichier,
  echo   en la nommant avec les ids separes par des tirets :
  echo.
  echo     roue-curie-toutankhamon-inde.png          ^(grille 2x2^)
  echo     3x2_id1-id2-id3-id4-id5-id6.png           ^(grille 3x2^)
  echo.
  echo   -^> cree assets\cards\^<id^>.webp automatiquement.
  echo ============================================
  pause
  exit /b
)
python scripts\split-plate.py "%~1"
echo.
pause
