@echo off
title FORGE AI - Systems Launcher
color 0C
cls

echo ================================================================
echo               FORGE AI - TACTICAL FITNESS CORE
echo ================================================================
echo.
echo [1/3] Checking environment & initializing database...

if not exist "%~dp0backend\venv\Scripts\python.exe" (
    echo [!] Virtual environment not found. Creating backend\venv...
    python -m venv "%~dp0backend\venv"
    "%~dp0backend\venv\Scripts\pip" install -r "%~dp0backend\requirements.txt"
)

echo [*] Applying Django migrations...
"%~dp0backend\venv\Scripts\python.exe" "%~dp0backend\manage.py" migrate --no-input

echo [*] Ensuring initial database seed...
"%~dp0backend\venv\Scripts\python.exe" "%~dp0backend\manage.py" seed_data

echo.
echo [2/3] Launching Django Backend Core (Port 8000)...
start "FORGE AI [Django Backend :8000]" cmd /k "cd /d %~dp0 && backend\venv\Scripts\python.exe backend\manage.py runserver 127.0.0.1:8000"

echo.
echo [3/3] Launching React + Tailwind Frontend Core...
start "FORGE AI [React Frontend]" cmd /k "cd /d %~dp0 && npm run dev"

echo.
echo ================================================================
echo                ALL SYSTEMS ENGAGED & DEPLOYED
echo ================================================================
echo  * Backend API:    http://127.0.0.1:8000/api/
echo  * Admin Console:  http://127.0.0.1:8000/admin/
echo  * React Frontend: Check the frontend terminal window (default :3000)
echo ================================================================
echo Press any key to close this launcher monitor (servers remain running)...
pause >nul
