# Supabase Setup Helper Script
# Run: .\scripts\setup-supabase.ps1

Write-Host "`n=== Supabase Database Setup ===" -ForegroundColor Cyan
Write-Host ""

# Check if .env exists
if (-not (Test-Path .env)) {
    Write-Host "Creating .env file..." -ForegroundColor Yellow
    New-Item -Path .env -ItemType File | Out-Null
}

Write-Host "Follow these steps:" -ForegroundColor Green
Write-Host ""
Write-Host "1. Go to: https://supabase.com" -ForegroundColor White
Write-Host "2. Sign in / Create account" -ForegroundColor White
Write-Host "3. Click 'New Project'" -ForegroundColor White
Write-Host "4. Fill in:" -ForegroundColor White
Write-Host "   - Name: thebutton" -ForegroundColor Gray
Write-Host "   - Database Password: [CREATE STRONG PASSWORD]" -ForegroundColor Gray
Write-Host "   - Region: [Choose closest]" -ForegroundColor Gray
Write-Host "5. Wait for project to initialize (2-3 minutes)" -ForegroundColor White
Write-Host ""
Write-Host "6. After project is ready:" -ForegroundColor Yellow
Write-Host "   - Go to Settings (gear icon)" -ForegroundColor White
Write-Host "   - Click 'Database'" -ForegroundColor White
Write-Host "   - Scroll to 'Connection string'" -ForegroundColor White
Write-Host "   - Click 'URI' tab" -ForegroundColor White
Write-Host "   - Copy the connection string" -ForegroundColor White
Write-Host ""

$continue = Read-Host "Have you created the project and copied the connection string? (y/N)"
if ($continue -ne "y" -and $continue -ne "Y") {
    Write-Host "`nPlease complete the steps above and run this script again." -ForegroundColor Yellow
    exit
}

Write-Host ""
Write-Host "Paste your Supabase connection string below." -ForegroundColor Cyan
Write-Host "It should look like: postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres" -ForegroundColor Gray
Write-Host ""

$connectionString = Read-Host "Connection String"

# Validate format
if ($connectionString -notmatch "^postgresql://") {
    Write-Host "`n⚠️  Warning: Connection string should start with 'postgresql://'" -ForegroundColor Yellow
    $proceed = Read-Host "Continue anyway? (y/N)"
    if ($proceed -ne "y" -and $proceed -ne "Y") {
        exit
    }
}

# Check if password placeholder exists
if ($connectionString -match "\[YOUR-PASSWORD\]") {
    Write-Host "`n⚠️  Warning: You need to replace [YOUR-PASSWORD] with your actual password!" -ForegroundColor Red
    Write-Host "Example: postgresql://postgres:MyPassword123@db.xxxxx.supabase.co:5432/postgres" -ForegroundColor Yellow
    $proceed = Read-Host "`nHave you replaced [YOUR-PASSWORD]? (y/N)"
    if ($proceed -ne "y" -and $proceed -ne "Y") {
        Write-Host "Please update the connection string with your password and try again." -ForegroundColor Yellow
        exit
    }
}

# Get JWT secret
Write-Host ""
$jwtSecret = Read-Host "Enter JWT secret (or press Enter to keep existing)"
if ([string]::IsNullOrWhiteSpace($jwtSecret)) {
    # Try to read existing JWT_SECRET
    if (Test-Path .env) {
        $envContent = Get-Content .env -Raw
        if ($envContent -match 'JWT_SECRET="([^"]+)"') {
            $jwtSecret = $matches[1]
            Write-Host "Keeping existing JWT_SECRET" -ForegroundColor Gray
        } else {
            $jwtSecret = "your-secret-key-change-in-production"
        }
    } else {
        $jwtSecret = "your-secret-key-change-in-production"
    }
}

# Create/Update .env file
$envContent = @"
# Database Connection (Supabase)
DATABASE_URL="$connectionString"

# JWT Secret
JWT_SECRET="$jwtSecret"
"@

$envContent | Out-File -FilePath .env -Encoding utf8 -Force

Write-Host ""
Write-Host "✅ .env file updated!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Generate Prisma Client: npm run db:generate" -ForegroundColor White
Write-Host "2. Start dev server: npm run dev" -ForegroundColor White
Write-Host "3. Test connection: Visit http://localhost:3000/api/health/db" -ForegroundColor White
Write-Host "   OR run: .\scripts\test-db-connection.ps1" -ForegroundColor White
Write-Host ""

