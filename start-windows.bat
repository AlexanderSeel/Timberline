@echo off
setlocal
cd /d "%~dp0"
start "TIMBERLINE browser" powershell -NoProfile -WindowStyle Hidden -Command "Start-Sleep -Seconds 2; Start-Process 'http://localhost:8797'"
where node >nul 2>nul
if %errorlevel% equ 0 (
  echo Starting TIMBERLINE with Node.js on http://localhost:8797
  node server.cjs
) else (
  where py >nul 2>nul
  if %errorlevel% equ 0 (
    echo Starting TIMBERLINE with Python on http://localhost:8797
    py -3 -m http.server 8797
  ) else (
    echo Node.js or Python 3 is required to serve local files.
    pause
  )
)
