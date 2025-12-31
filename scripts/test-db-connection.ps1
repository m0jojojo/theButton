# Test Database Connection Script
# Run: .\scripts\test-db-connection.ps1

Write-Host "`n=== Testing Database Connection ===" -ForegroundColor Cyan
Write-Host ""

# Check if .env exists
if (-not (Test-Path .env)) {
    Write-Host "❌ .env file not found!" -ForegroundColor Red
    Write-Host "Please create .env file first. See SETUP_DATABASE.md" -ForegroundColor Yellow
    exit 1
}

# Check if DATABASE_URL is set
$envContent = Get-Content .env -Raw
if ($envContent -notmatch "DATABASE_URL") {
    Write-Host "❌ DATABASE_URL not found in .env file!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ .env file found" -ForegroundColor Green
Write-Host ""

# Check if server is running
Write-Host "Checking if dev server is running..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/health/db" -TimeoutSec 5 -ErrorAction Stop
    $result = $response.Content | ConvertFrom-Json
    
    if ($result.status -eq "healthy") {
        Write-Host "✅ Database connection successful!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Response:" -ForegroundColor Cyan
        Write-Host "  Status: $($result.status)" -ForegroundColor White
        Write-Host "  Database: $($result.database)" -ForegroundColor White
        Write-Host "  Response Time: $($result.responseTime)" -ForegroundColor White
        Write-Host "  Version: $($result.version)" -ForegroundColor White
        Write-Host ""
        Write-Host "🎉 Your database is ready!" -ForegroundColor Green
    } else {
        Write-Host "❌ Database connection failed" -ForegroundColor Red
        Write-Host "Error: $($result.error)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Cannot connect to server" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please start the dev server first:" -ForegroundColor Yellow
    Write-Host "  npm run dev" -ForegroundColor White
    Write-Host ""
    Write-Host "Then run this script again." -ForegroundColor Yellow
}

