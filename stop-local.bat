@echo off
setlocal
cd /d "%~dp0"

if not exist ".runtime\dev-server.pid" (
  powershell -NoProfile -Command "$connection = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue; if (-not $connection) { exit 0 }; $process = Get-CimInstance Win32_Process -Filter ('ProcessId=' + $connection.OwningProcess); if ($process.CommandLine -like '*D:\BetPay*next*') { Stop-Process -Id $connection.OwningProcess -Force; exit 0 }; Write-Host 'Port 3000 is not owned by BetPay. Nothing was stopped.'; exit 1"
  if errorlevel 1 exit /b 1
  echo BetPay local server stopped.
  goto :end
)

set /p BETPAY_PID=<".runtime\dev-server.pid"
if "%BETPAY_PID%"=="" goto :clean

echo Stopping BetPay process %BETPAY_PID% ...
taskkill /PID %BETPAY_PID% /T /F > nul 2>&1

:clean
del ".runtime\dev-server.pid" > nul 2>&1
echo BetPay local server stopped.

:end
endlocal
exit /b 0
