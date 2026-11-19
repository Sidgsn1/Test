@echo off
title PRRP Full-Stack Runner
color 0A

echo ========================================================
echo       Product Review and Rating Platform (PRRP)
echo            One-Click Full-Stack Launcher
echo ========================================================
echo.

set ROOT_DIR=%~dp0

:: ============================================================================
:: CONFIGURATION: Change ports or paths here if needed on your computer
:: ============================================================================
set BACKEND_PORT=8085
set FRONTEND_PORT=5173
set MYSQL_PORT=3306

:: Optional: specify exact Maven bin folder if 'mvn' is not in your system PATH
set MAVEN_BIN=C:\Users\adity\maven\apache-maven-3.9.6\bin

:: Optional: specify exact MySQL bin folder if 'mysqld' is not in system PATH
set MYSQL_BIN=C:\Program Files\MySQL\MySQL Server 8.4\bin
set MYSQL_DATA=C:\Users\adity\mysql_data
:: ============================================================================

:: 1. Detect Maven executable
where mvn >nul 2>&1
if %errorlevel% equ 0 (
    set MVN_CMD=mvn
) else if exist "%MAVEN_BIN%\mvn.cmd" (
    set MVN_CMD="%MAVEN_BIN%\mvn.cmd"
) else if exist "C:\Program Files\apache-maven\bin\mvn.cmd" (
    set MVN_CMD="C:\Program Files\apache-maven\bin\mvn.cmd"
) else (
    set MVN_CMD=mvn
)

:: 2. Check & Start MySQL Server
echo [1/3] Checking MySQL Database Server (Port %MYSQL_PORT%)...
netstat -ano | findstr :%MYSQL_PORT% >nul
if %errorlevel% neq 0 (
    echo Starting MySQL Database Server...
    if exist "%MYSQL_BIN%\mysqld.exe" (
        start "PRRP MySQL Server" "%MYSQL_BIN%\mysqld.exe" --datadir="%MYSQL_DATA%" --console
    ) else (
        start "PRRP MySQL Server" mysqld --console
    )
    timeout /t 3 /nobreak >nul
) else (
    echo [OK] MySQL Database Server is already active on port %MYSQL_PORT%.
)

:: 3. Check & Start Spring Boot Backend
echo.
echo [2/3] Checking Spring Boot Backend (Port %BACKEND_PORT%)...
netstat -ano | findstr :%BACKEND_PORT% >nul
if %errorlevel% neq 0 (
    echo Launching Spring Boot Backend on Port %BACKEND_PORT%...
    start "PRRP Spring Boot Backend" cmd /k "cd /d "%ROOT_DIR%backend" && %MVN_CMD% spring-boot:run"
    timeout /t 5 /nobreak >nul
) else (
    echo [OK] Spring Boot Backend is already active on port %BACKEND_PORT%.
)

:: 4. Check & Start React Frontend
echo.
echo [3/3] Checking React Frontend (Port %FRONTEND_PORT%)...
netstat -ano | findstr :%FRONTEND_PORT% >nul
if %errorlevel% neq 0 (
    echo Launching React Frontend on Port %FRONTEND_PORT%...
    start "PRRP React Frontend" cmd /k "cd /d "%ROOT_DIR%frontend" && npm run dev"
    timeout /t 2 /nobreak >nul
) else (
    echo [OK] React Frontend is already active on port %FRONTEND_PORT%.
)

echo.
echo Opening PRRP Marketplace in browser...
start "" "http://localhost:%FRONTEND_PORT%"

echo.
echo ========================================================
echo  All 3 tiers (DB + Backend + Frontend) are RUNNING!
echo  
echo  Frontend UI   : http://localhost:%FRONTEND_PORT%
echo  Backend API   : http://localhost:%BACKEND_PORT%/api/v1/products
echo  Swagger UI    : http://localhost:%BACKEND_PORT%/swagger-ui.html
echo  Database Port : %MYSQL_PORT% (prrp_db)
echo ========================================================
echo.
pause
