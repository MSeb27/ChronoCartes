@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ============================================
echo   ChronoCartes - serveur local
echo ============================================
echo   Sur ce PC        : http://localhost:8935
echo   Depuis un tel.   : http://%COMPUTERNAME%:8935  (ou l'IP Wi-Fi)
echo   Trouver l'IP     : tape  ipconfig  (ligne "Adresse IPv4" du Wi-Fi)
echo   Arreter          : Ctrl+C
echo ============================================
python -m http.server 8935 --bind 0.0.0.0
pause
