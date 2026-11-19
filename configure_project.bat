@echo off
title PRRP Environment & Diagnostics Tool
color 0E

echo ========================================================
echo       PRRP Full-Stack Environment Diagnostics
echo ========================================================
echo.

echo [1/4] Checking Java Development Kit (JDK 17+)...
java -version 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Java is not recognized in system PATH.
    echo Please install JDK 17 or JDK 21 and add it to PATH.
) else (
    echo [OK] Java is properly configured.
)

echo.
echo [2/4] Checking Node.js (v18+)...
node -v 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not recognized in system PATH.
    echo Please install Node.js from https://nodejs.org/
) else (
    echo [OK] Node.js is installed.
)

echo.
echo [3/4] Checking Apache Maven...
mvn -v 2>nul
if %errorlevel% neq 0 (
    echo [WARNING] 'mvn' command is not in system PATH.
    echo If using a custom Maven folder, set MAVEN_BIN inside run_project.bat.
) else (
    echo [OK] Maven is installed and detected in PATH.
)

echo.
echo [4/4] Checking MySQL Database Service...
netstat -ano | findstr :3306 >nul
if %errorlevel% neq 0 (
    echo [NOTICE] MySQL is not currently running on port 3306.
    echo Start your MySQL Service (or XAMPP/MySQL Workbench).
) else (
    echo [OK] MySQL Server is actively listening on port 3306.
)

echo.
echo ========================================================
echo Diagnostics Complete!
echo To run the full project, simply launch: run_project.bat
echo ========================================================
echo.
pause
