@echo off
title FORGE AI - Systems Launcher
color 0C
cls

echo ================================================================
echo               FORGE AI - TACTICAL FITNESS CORE
echo ================================================================
echo.
echo [1/4] Checking Ollama Local Neural Core...
curl -s http://localhost:11434/api/tags >nul 2>&1
if errorlevel 1 (
    echo [!] Ollama service not detected on localhost:11434. Starting Ollama...
    start "Ollama Core" ollama serve
    ping 127.0.0.1 -n 3 >nul
) else (
    echo [*] Ollama service active: hf.co/Qwen/Qwen3-1.7B-GGUF:Q8_0 calibrated.
)

echo.
echo [2/4] Initializing Django Backend...
if not exist "%~dp0backend\venv\Scripts\python.exe" (
    echo [!] Virtual environment not found. Creating backend\venv...
    python -m venv "%~dp0backend\venv"
    "%~dp0backend\venv\Scripts\pip" install -r "%~dp0backend\requirements.txt"
)

echo [*] Applying database migrations...
"%~dp0backend\venv\Scripts\python.exe" "%~dp0backend\manage.py" migrate --no-input

echo [*] Ensuring database seed...
"%~dp0backend\venv\Scripts\python.exe" "%~dp0backend\manage.py" seed_data

echo.
echo [3/4] Launching Django REST API on http://127.0.0.1:8000 ...
start "FORGE AI - Django Backend" cmd /k "cd /d "%~dp0backend" && venv\Scripts\python.exe manage.py runserver 127.0.0.1:8000"

echo.
echo [4/4] Launching React Frontend and opening browser...
if not exist "%~dp0frontend\node_modules\" (
    echo [!] Frontend dependencies not found. Installing packages...
    cd /d "%~dp0frontend" && call npm install && cd /d "%~dp0"
)
start "FORGE AI - React Frontend" cmd /k "cd /d "%~dp0frontend" && npm run dev -- --open"

echo.
echo ================================================================
echo             ALL SYSTEMS ENGAGED AND RUNNING
echo ================================================================
echo  * AI Model:       hf.co/Qwen/Qwen3-1.7B-GGUF:Q8_0 (Ollama Local)
echo  * Backend API:    http://127.0.0.1:8000/api/
echo  * Admin Console:  http://127.0.0.1:8000/admin/
echo  * React Frontend: Opening in browser automatically...
echo ================================================================
echo Keep this window or minimize it. Press any key to exit launcher monitor.
pause >nul
