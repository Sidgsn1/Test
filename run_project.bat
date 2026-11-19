@echo off
title PRRP Full-Stack Runner
color 0A

echo ========================================================
echo       Product Review and Rating Platform (PRRP)
echo            One-Click Full-Stack Launcher
echo ========================================================
echo.

set ROOT_DIR=%~dp0
set MAVEN_BIN=C:\Users\adity\maven\apache-maven-3.9.6\bin
set MYSQL_BIN=C:\Program Files\MySQL\MySQL Server 8.4\bin
set PATH=%MAVEN_BIN%;%MYSQL_BIN%;%PATH%

echo [1/3] Checking MySQL Server...
netstat -ano | findstr :3306 >nul
if %errorlevel% neq 0 (
    echo Starting MySQL Database Server...
    start "PRRP MySQL Server" "%MYSQL_BIN%\mysqld.exe" --datadir="C:\Users\adity\mysql_data" --console
    timeout /t 3 /nobreak >nul
) else (
    echo MySQL Database Server is already running.
)

echo [2/3] Launching Spring Boot Backend (Port 8085)...
start "PRRP Spring Boot Backend" cmd /k "cd /d "%ROOT_DIR%backend" && "%MAVEN_BIN%\mvn.cmd" spring-boot:run"

echo [3/3] Launching React Frontend (Port 5173)...
start "PRRP React Frontend" cmd /k "cd /d "%ROOT_DIR%frontend" && npm run dev"

echo.
echo ========================================================
echo  All 3 tiers (DB + Backend + Frontend) are RUNNING!
echo  
echo  Frontend UI   : http://localhost:5173
echo  Backend API   : http://localhost:8085/api/v1/products
echo  Swagger UI    : http://localhost:8085/swagger-ui.html
echo  Database Port : 3306 (prrp_db)
echo ========================================================
echo.
pause
