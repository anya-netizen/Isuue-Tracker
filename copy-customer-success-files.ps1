# PowerShell Script to Copy Customer Success Dashboard Files
# Run this from the "Services Dashboard 3" folder

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "Customer Success Dashboard File Copy Script" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

$source = "Services Dashboard\src"
$dest = "Customer Success Dashboard\src"

# Create directories if they don't exist
Write-Host "Creating directories..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path "$dest\data" | Out-Null
New-Item -ItemType Directory -Force -Path "$dest\components\customer-success" | Out-Null

# Copy customer success components
Write-Host ""
Write-Host "Copying customer success components..." -ForegroundColor Green
$csFiles = @(
    "CustomerSuccessDashboard.jsx",
    "HealthScorePanel.jsx",
    "EngagementAnalytics.jsx",
    "RevenueMetrics.jsx",
    "SupportTracker.jsx",
    "ChurnRiskAnalysis.jsx",
    "ProductAdoption.jsx",
    "OnboardingProgress.jsx",
    "AccountTimeline.jsx",
    "SuccessPlans.jsx",
    "CommunicationHub.jsx"
)

foreach ($file in $csFiles) {
    $sourcePath = "$source\components\customer-success\$file"
    $destPath = "$dest\components\customer-success\$file"
    
    if (Test-Path $sourcePath) {
        Copy-Item $sourcePath -Destination $destPath -Force
        Write-Host "  ✓ Copied $file" -ForegroundColor Green
    } else {
        Write-Host "  ✗ Not found: $file" -ForegroundColor Red
    }
}

# Copy data files
Write-Host ""
Write-Host "Copying data files..." -ForegroundColor Green

if (Test-Path "$source\data\mockData.js") {
    Copy-Item "$source\data\mockData.js" -Destination "$dest\data\mockData.js" -Force
    Write-Host "  ✓ Copied mockData.js" -ForegroundColor Green
} else {
    Write-Host "  ✗ Not found: mockData.js" -ForegroundColor Red
}

if (Test-Path "$source\data\enhancedPGData.js") {
    Copy-Item "$source\data\enhancedPGData.js" -Destination "$dest\data\pgData.js" -Force
    Write-Host "  ✓ Copied enhancedPGData.js → pgData.js" -ForegroundColor Green
} else {
    Write-Host "  ✗ Not found: enhancedPGData.js" -ForegroundColor Red
}

# Summary
Write-Host ""
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "File copy completed!" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. cd 'Customer Success Dashboard'" -ForegroundColor White
Write-Host "2. npm install" -ForegroundColor White
Write-Host "3. npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "The app will open at: http://localhost:5174" -ForegroundColor Cyan
Write-Host ""

