@echo off
setlocal
cd /d "%~dp0"

if not exist ".runtime\dev-server.pid" (
  echo No BetPay server PID file was found.
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
