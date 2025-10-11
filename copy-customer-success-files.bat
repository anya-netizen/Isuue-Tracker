@echo off
echo ==================================================
echo Customer Success Dashboard File Copy Script
echo ==================================================
echo.

REM Set source and destination paths
set SOURCE=Services Dashboard\src
set DEST=Customer Success Dashboard\src

REM Create directories
echo Creating directories...
if not exist "%DEST%\data" mkdir "%DEST%\data"
if not exist "%DEST%\components\customer-success" mkdir "%DEST%\components\customer-success"

REM Copy customer success components
echo.
echo Copying customer success components...
xcopy "%SOURCE%\components\customer-success\*.*" "%DEST%\components\customer-success\" /Y /Q
if %ERRORLEVEL% == 0 (
    echo   ^> Customer success components copied!
) else (
    echo   ^> Error copying customer success components
)

REM Copy data files
echo.
echo Copying data files...
if exist "%SOURCE%\data\mockData.js" (
    copy "%SOURCE%\data\mockData.js" "%DEST%\data\mockData.js" /Y >nul
    echo   ^> mockData.js copied!
)

if exist "%SOURCE%\data\enhancedPGData.js" (
    copy "%SOURCE%\data\enhancedPGData.js" "%DEST%\data\pgData.js" /Y >nul
    echo   ^> enhancedPGData.js copied as pgData.js!
)

REM Summary
echo.
echo ==================================================
echo File copy completed!
echo ==================================================
echo.
echo Next steps:
echo 1. cd "Customer Success Dashboard"
echo 2. npm install
echo 3. npm run dev
echo.
echo The app will open at: http://localhost:5174
echo.
pause

