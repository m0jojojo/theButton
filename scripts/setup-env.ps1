# PowerShell script to help create .env file
# Run: .\scripts\setup-env.ps1

Write-Host "=== Database Connection Setup ===" -ForegroundColor Cyan
Write-Host ""

# Check if .env already exists
if (Test-Path .env) {
    Write-Host "⚠️  .env file already exists!" -ForegroundColor Yellow
    $overwrite = Read-Host "Do you want to overwrite it? (y/N)"
    if ($overwrite -ne "y" -and $overwrite -ne "Y") {
        Write-Host "Cancelled." -ForegroundColor Yellow
        exit
    }
}

Write-Host "Choose your database option:" -ForegroundColor Green
Write-Host "1. Supabase (Cloud - Free)"
Write-Host "2. Neon (Cloud - Free)"
Write-Host "3. Railway (Cloud - Free)"
Write-Host "4. Local PostgreSQL"
Write-Host "5. Manual entry"
Write-Host ""

$choice = Read-Host "Enter choice (1-5)"

$databaseUrl = ""

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "Supabase Setup:" -ForegroundColor Cyan
        Write-Host "1. Go to https://supabase.com"
        Write-Host "2. Create a project"
        Write-Host "3. Go to Settings → Database"
        Write-Host "4. Copy the Connection string (URI)"
        Write-Host ""
        $databaseUrl = Read-Host "Paste your Supabase connection string"
    }
    "2" {
        Write-Host ""
        Write-Host "Neon Setup:" -ForegroundColor Cyan
        Write-Host "1. Go to https://neon.tech"
        Write-Host "2. Create a project"
        Write-Host "3. Copy the connection string"
        Write-Host ""
        $databaseUrl = Read-Host "Paste your Neon connection string"
    }
    "3" {
        Write-Host ""
        Write-Host "Railway Setup:" -ForegroundColor Cyan
        Write-Host "1. Go to https://railway.app"
        Write-Host "2. Create project → Add PostgreSQL"
        Write-Host "3. Copy DATABASE_URL from variables"
        Write-Host ""
        $databaseUrl = Read-Host "Paste your Railway connection string"
    }
    "4" {
        Write-Host ""
        Write-Host "Local PostgreSQL:" -ForegroundColor Cyan
        $username = Read-Host "Enter PostgreSQL username (default: postgres)"
        if ([string]::IsNullOrWhiteSpace($username)) { $username = "postgres" }
        
        $password = Read-Host "Enter PostgreSQL password" -AsSecureString
        $passwordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
            [Runtime.InteropServices.Marshal]::SecureStringToBSTR($password)
        )
        
        $host = Read-Host "Enter host (default: localhost)"
        if ([string]::IsNullOrWhiteSpace($host)) { $host = "localhost" }
        
        $port = Read-Host "Enter port (default: 5432)"
        if ([string]::IsNullOrWhiteSpace($port)) { $port = "5432" }
        
        $database = Read-Host "Enter database name (default: thebutton)"
        if ([string]::IsNullOrWhiteSpace($database)) { $database = "thebutton" }
        
        $databaseUrl = "postgresql://${username}:${passwordPlain}@${host}:${port}/${database}?schema=public"
    }
    "5" {
        Write-Host ""
        $databaseUrl = Read-Host "Enter your full PostgreSQL connection string"
    }
    default {
        Write-Host "Invalid choice. Exiting." -ForegroundColor Red
        exit
    }
}

# Get JWT secret
Write-Host ""
$jwtSecret = Read-Host "Enter JWT secret (or press Enter for default)"
if ([string]::IsNullOrWhiteSpace($jwtSecret)) {
    $jwtSecret = "your-secret-key-change-in-production"
}

# Create .env file
$envContent = @"
# Database Connection
DATABASE_URL="$databaseUrl"

# JWT Secret
JWT_SECRET="$jwtSecret"
"@

$envContent | Out-File -FilePath .env -Encoding utf8

Write-Host ""
Write-Host "✅ .env file created successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Run: npm run db:generate"
Write-Host "2. Start server: npm run dev"
Write-Host "3. Test: curl http://localhost:3000/api/health/db"
Write-Host ""

