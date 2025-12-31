# Quick Database Setup

## Current Status

You already have a `.env` file with a DATABASE_URL. It appears to be using Prisma's local development database.

## Option 1: Use Current Setup (Quick Test)

Your current `.env` has a Prisma local database connection. To test it:

```bash
# 1. Generate Prisma Client
npm run db:generate

# 2. Start the dev server
npm run dev

# 3. Test connection (in another terminal)
curl http://localhost:3000/api/health/db
```

## Option 2: Set Up Your Own Database

### A. Free Cloud Database (Recommended)

**Supabase (Easiest):**
1. Go to https://supabase.com → Sign up
2. Create new project
3. Settings → Database → Copy connection string
4. Update `.env`:
   ```env
   DATABASE_URL="postgresql://postgres:[PASSWORD]@[PROJECT].supabase.co:5432/postgres"
   ```

**Neon:**
1. Go to https://neon.tech → Sign up
2. Create project
3. Copy connection string
4. Update `.env`:
   ```env
   DATABASE_URL="postgresql://[USER]:[PASSWORD]@[HOST]/[DB]?sslmode=require"
   ```

### B. Local PostgreSQL

**Windows:**
1. Download: https://www.postgresql.org/download/windows
2. Install (remember password)
3. Update `.env`:
   ```env
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/thebutton?schema=public"
   ```

**macOS:**
```bash
brew install postgresql@15
brew services start postgresql@15
createdb thebutton
```

Then update `.env`:
```env
DATABASE_URL="postgresql://postgres@localhost:5432/thebutton?schema=public"
```

## Test Your Connection

After updating `.env`:

```bash
# 1. Generate Prisma Client
npm run db:generate

# 2. Start server
npm run dev

# 3. Test (PowerShell)
Invoke-WebRequest http://localhost:3000/api/health/db

# Or visit in browser:
# http://localhost:3000/api/health/db
```

**Success looks like:**
```json
{
  "status": "healthy",
  "database": "connected",
  "responseTime": "5ms"
}
```

## Need Help?

Run the setup script:
```powershell
.\scripts\setup-env.ps1
```

Or see full guide: `SETUP_DATABASE.md`

