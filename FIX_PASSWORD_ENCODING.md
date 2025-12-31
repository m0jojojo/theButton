# Fix Database Password Encoding Issue

## Problem

Your password contains special characters (`@` and `[]`) that need to be URL-encoded in the PostgreSQL connection string.

**Current (broken):**
```
postgresql://postgres:[abhi@26061997@]@db.oattjobjxohagcjzpazu.supabase.co:5432/postgres
```

**Issue:** The `@` symbol in your password conflicts with the `@` delimiter in the connection string.

## Solution

URL-encode the special characters in your password:

- `@` → `%40`
- `[` → `%5B`
- `]` → `%5D`

**Your password:** `abhi@26061997@`  
**URL-encoded:** `abhi%4026061997%40`

## Fix Your .env File

Update your `.env` file with the URL-encoded password:

**Before:**
```env
DATABASE_URL="postgresql://postgres:[abhi@26061997@]@db.oattjobjxohagcjzpazu.supabase.co:5432/postgres"
```

**After:**
```env
DATABASE_URL="postgresql://postgres:abhi%4026061997%40@db.oattjobjxohagcjzpazu.supabase.co:5432/postgres"
```

**Note:** Remove the square brackets `[]` around the password - they're not needed.

## Quick Fix Script

Run this PowerShell command to get the encoded password:

```powershell
function Encode-Url { param([string]$text) [System.Uri]::EscapeDataString($text) }
$password = "abhi@26061997@"
$encoded = Encode-Url $password
Write-Host "Encoded password: $encoded"
```

Then manually update your `.env` file with:
```
DATABASE_URL="postgresql://postgres:abhi%4026061997%40@db.oattjobjxohagcjzpazu.supabase.co:5432/postgres"
```

## After Fixing

1. **Save the .env file**
2. **Restart your dev server**
3. **Test connection:** http://localhost:3000/api/health/db

You should now see:
```json
{
  "status": "healthy",
  "database": "connected"
}
```

