@echo off
title PRRP Full-Stack Runner
color 0A

echo ========================================================
echo       Product Review and Rating Platform (PRRP)
echo            One-Click Full-Stack Launcher
echo ========================================================
echo.

set ROOT_DIR=%~dp0
cd /d "%ROOT_DIR%"

echo [1/2] Checking Frontend...
if not exist "%ROOT_DIR%frontend\node_modules\" (
    echo Installing frontend dependencies...
    cd "%ROOT_DIR%frontend"
    call npm install
)

echo [2/2] Launching Frontend (React + Vite)...
start "PRRP Frontend (Vite)" cmd /k "cd /d "%ROOT_DIR%frontend" && npm run dev"

echo.
echo Launching Spring Boot Backend...
start "PRRP Backend (Spring Boot)" cmd /k "cd /d "%ROOT_DIR%backend" && mvn spring-boot:run"

echo.
echo ========================================================
echo  All services are launching in separate windows!
echo  Frontend URL : http://localhost:5173
echo  Backend API  : http://localhost:8080/api/v1
echo  Swagger UI   : http://localhost:8080/swagger-ui.html
echo ========================================================
echo.
pause
