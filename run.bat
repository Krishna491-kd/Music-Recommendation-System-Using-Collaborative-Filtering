@echo off
echo Starting AI Recommendation Engine (Backend)...
cd Backend
start cmd /k "..\venv\Scripts\activate.bat && python api.py"

echo Starting React User Interface (Frontend)...
cd ..\Frontend
start cmd /k "npm run dev"

echo.
echo ==========================================================
echo Music Recommendation System is starting up!
echo.
echo - The Backend AI Engine is running on port 5000
echo - The Frontend UI is running on port 5173
echo.
echo Please wait 5-10 seconds for the servers to initialize, 
echo then open your browser to:
echo http://localhost:5173
echo ==========================================================
pause
