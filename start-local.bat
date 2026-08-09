@echo off
setlocal
cd /d "%~dp0"

if not exist "node_modules" (
  echo Installing packages...
  call npm install
  if errorlevel 1 goto :error
)

if not exist ".runtime" mkdir ".runtime"

powershell -NoProfile -Command "if (Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue) { exit 0 } exit 1"
if not errorlevel 1 (
  echo BetPay is already running at http://localhost:3000
  start "" "http://localhost:3000"
  goto :end
)

echo Starting BetPay at http://localhost:3000 ...
powershell -NoProfile -Command "$root = (Get-Location).Path; $process = Start-Process -FilePath 'cmd.exe' -ArgumentList '/c', 'npm run dev -- --port 3000 > .runtime\dev-server.log 2>&1' -WorkingDirectory $root -WindowStyle Hidden -PassThru; $process.Id | Set-Content -NoNewline '.runtime\dev-server.pid'"
timeout /t 4 /nobreak > nul
start "" "http://localhost:3000"
echo Server log: .runtime\dev-server.log
goto :end

:error
echo Could not start BetPay. Check Node.js and npm installation.
exit /b 1

:end
endlocal
exit /b 0
