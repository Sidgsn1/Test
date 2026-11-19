@echo off
title PRRP MySQL Database Inspector
color 0B

echo ========================================================
echo       PRRP - Live MySQL Database Record Viewer
echo ========================================================
echo.

set MYSQL_BIN=C:\Program Files\MySQL\MySQL Server 8.4\bin

echo 1. Showing all users in prrp_db (with BCrypt password hashing):
echo ------------------------------------------------------------------------------------------------------------------------
"%MYSQL_BIN%\mysql.exe" -u root -e "USE prrp_db; SELECT user_id, full_name, email, role, password_hash FROM users ORDER BY user_id ASC;"
echo ------------------------------------------------------------------------------------------------------------------------

echo.
echo 2. Showing newly created users:
echo ------------------------------------------------------------------------------------------------------------------------
"%MYSQL_BIN%\mysql.exe" -u root -e "USE prrp_db; SELECT user_id, full_name, email, role, created_at, password_hash FROM users WHERE user_id >= 15;"
echo ------------------------------------------------------------------------------------------------------------------------

echo.
echo 3. Showing latest products in catalog:
echo ------------------------------------------------------------------------------------------------------------------------
"%MYSQL_BIN%\mysql.exe" -u root -e "USE prrp_db; SELECT product_id, seller_id, name, price, sku FROM products ORDER BY product_id DESC LIMIT 5;"
echo ------------------------------------------------------------------------------------------------------------------------

echo.
echo Tip for Teacher Demo:
echo - Open CMD or MySQL Workbench and run:
echo   USE prrp_db;
echo   SELECT user_id, full_name, email, role, password_hash FROM users;
echo.
pause
