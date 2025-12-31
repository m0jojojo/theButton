# Fix Database URL - URL Encode Password
# This script helps fix connection strings with special characters

Write-Host "`n=== Fixing Database Connection String ===" -ForegroundColor Cyan
Write-Host ""

# Read current .env
if (-not (Test-Path .env)) {
    Write-Host "❌ .env file not found!" -ForegroundColor Red
    exit 1
}

$envContent = Get-Content .env -Raw

# Extract current DATABASE_URL
if ($envContent -match 'DATABASE_URL="([^"]+)"') {
    $currentUrl = $matches[1]
    Write-Host "Current DATABASE_URL:" -ForegroundColor Yellow
    Write-Host $currentUrl -ForegroundColor Gray
    Write-Host ""
    
    # Check if password needs encoding
    if ($currentUrl -match 'postgresql://postgres:([^@]+)@') {
        $password = $matches[1]
        Write-Host "Detected password: $password" -ForegroundColor Yellow
        
        # Check for special characters
        if ($password -match '@|\[|\]|#|\?|&|%') {
            Write-Host "⚠️  Password contains special characters that need URL encoding!" -ForegroundColor Yellow
            Write-Host ""
            
            # URL encode the password
            $encodedPassword = [System.Web.HttpUtility]::UrlEncode($password)
            
            Write-Host "URL-encoded password: $encodedPassword" -ForegroundColor Green
            Write-Host ""
            
            # Replace password in connection string
            $newUrl = $currentUrl -replace "postgresql://postgres:[^@]+@", "postgresql://postgres:$encodedPassword@"
            
            Write-Host "New DATABASE_URL:" -ForegroundColor Green
            Write-Host $newUrl -ForegroundColor White
            Write-Host ""
            
            # Update .env file
            $newEnvContent = $envContent -replace 'DATABASE_URL="[^"]+"', "DATABASE_URL=`"$newUrl`""
            $newEnvContent | Out-File -FilePath .env -Encoding utf8 -Force
            
            Write-Host "✅ .env file updated!" -ForegroundColor Green
            Write-Host ""
            Write-Host "Next steps:" -ForegroundColor Cyan
            Write-Host "1. Restart your dev server" -ForegroundColor White
            Write-Host "2. Test: http://localhost:3000/api/health/db" -ForegroundColor White
        } else {
            Write-Host "✅ Password doesn't need encoding" -ForegroundColor Green
        }
    }
} else {
    Write-Host "❌ DATABASE_URL not found in .env file" -ForegroundColor Red
}

