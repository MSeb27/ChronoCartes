@echo off
setlocal
cd /d "%~dp0"

rem --- Libere le port 8935 si un serveur y tourne deja ---
for /f "tokens=5" %%p in ('netstat -ano ^| findstr :8935 ^| findstr LISTENING') do taskkill /F /PID %%p >nul 2>&1

rem --- Dependances (1re fois) ---
if not exist node_modules (
  echo Installation des dependances Node...
  call npm install
)

rem --- Detecte l'IP du reseau local (Wi-Fi en priorite) ---
set "LANIP="
for /f "usebackq delims=" %%i in (`powershell -NoProfile -Command "$ip=(Get-NetIPAddress -AddressFamily IPv4 ^| ?{$_.InterfaceAlias -like '*Wi-Fi*' -and $_.IPAddress -notlike '169.*'} ^| select -First 1 -Expand IPAddress); if(-not $ip){$ip=(Get-NetIPAddress -AddressFamily IPv4 ^| ?{$_.IPAddress -notlike '127.*' -and $_.IPAddress -notlike '169.*'} ^| select -First 1 -Expand IPAddress)}; $ip"`) do set "LANIP=%%i"

echo ============================================
echo   Tempora - Le Juste Temps  (serveur Node)
echo ============================================
echo   Sur ce PC      : http://localhost:8935
if defined LANIP (
  echo   Sur telephone  : http://%LANIP%:8935     ^(meme Wi-Fi^)
) else (
  echo   Sur telephone  : lance "ipconfig" et lis "Adresse IPv4" du Wi-Fi
)
echo   ( sert le jeu + le mode reseau / Ctrl+C pour arreter )
echo ============================================
echo.

node server.js
pause
