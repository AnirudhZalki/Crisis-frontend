@echo off
echo Starting CrisisMind AI Backend...
cd /d "%~dp0backend"
.venv\Scripts\uvicorn.exe main:app --reload --host 127.0.0.1 --port 8000
