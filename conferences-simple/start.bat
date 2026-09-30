@echo off
rem Start the site: double-click this file (Windows)
chcp 65001 > nul
cd /d "%~dp0"
node server.js
pause


Начало работы