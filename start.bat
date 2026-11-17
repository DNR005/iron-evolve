@echo off
title FORGE AI - Systems Launcher
color 0C
cls

echo ================================================================
echo               FORGE AI - TACTICAL FITNESS CORE
echo ================================================================
echo.
echo [1/5] Checking Ollama Local Neural Core...
curl -s http://localhost:11434/api/tags >nul 2>&1
if %errorlevel% neq 0 (
    echo [!] Ollama service not detected on localhost:11434. Starting Ollama...
    start "Ollama Core" ollama serve
    timeout /t 2 >nul
) else (
    echo [*] Ollama service active: hf.co/Qwen/Qwen3-1.7B-GGUF:Q8_0 calibrated.
)

echo.
echo [2/5] Checking Python backend environment...
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
echo [3/5] Checking Frontend dependencies...
if not exist "%~dp0node_modules\" (
    echo [!] Frontend node_modules not found. Installing packages...
    call npm install
)

echo.
echo [4/5] Launching Django Backend Core (Port 8000)...
start "FORGE AI [Django Backend :8000]" cmd /k "cd /d %~dp0 && backend\venv\Scripts\python.exe backend\manage.py runserver 127.0.0.1:8000"

echo.
echo [5/5] Launching React + Tailwind Frontend Core...
start "FORGE AI [React Frontend]" cmd /k "cd /d %~dp0 && npm run dev"

echo.
echo ================================================================
echo                ALL SYSTEMS ENGAGED & DEPLOYED
echo ================================================================
echo  * AI Model:       hf.co/Qwen/Qwen3-1.7B-GGUF:Q8_0 (Ollama Local)
echo  * Backend API:    http://127.0.0.1:8000/api/
echo  * Admin Console:  http://127.0.0.1:8000/admin/
echo  * React Frontend: http://localhost:3000
echo ================================================================
echo Opening application in default browser in 3 seconds...
timeout /t 3 >nul
start http://localhost:3000

echo.
echo Press any key to close this launcher monitor (servers remain running)...
pause >nul
