# Database Connection Setup Guide

## Quick Setup Options

Choose one of the following options based on your preference:

### Option 1: Free Cloud Database (Recommended for Quick Start)

#### A. Supabase (Free Tier)
1. Go to [supabase.com](https://supabase.com)
2. Sign up / Log in
3. Create a new project
4. Go to **Settings** → **Database**
5. Copy the **Connection string** (URI format)
6. It looks like: `postgresql://postgres:[YOUR-PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres`

#### B. Neon (Free Tier)
1. Go to [neon.tech](https://neon.tech)
2. Sign up / Log in
3. Create a new project
4. Copy the **Connection string**
5. It looks like: `postgresql://[USER]:[PASSWORD]@[HOST]/[DATABASE]?sslmode=require`

#### C. Railway (Free Tier)
1. Go to [railway.app](https://railway.app)
2. Sign up / Log in
3. Create a new project → Add PostgreSQL
4. Copy the **DATABASE_URL** from the variables tab

### Option 2: Local PostgreSQL

#### Install PostgreSQL Locally

**Windows:**
1. Download from [postgresql.org/download/windows](https://www.postgresql.org/download/windows)
2. Install with default settings
3. Remember the password you set for `postgres` user
4. Default connection: `postgresql://postgres:YOUR_PASSWORD@localhost:5432/postgres`

**macOS:**
```bash
brew install postgresql@15
brew services start postgresql@15
createdb thebutton
```

**Linux:**
```bash
sudo apt-get install postgresql postgresql-contrib
sudo -u postgres createdb thebutton
```

---

## Step-by-Step Setup

### Step 1: Create `.env` File

Create a file named `.env` in the project root (same folder as `package.json`).

**Windows (PowerShell):**
```powershell
New-Item -Path .env -ItemType File
```

**macOS/Linux:**
```bash
touch .env
```

### Step 2: Add Database URL

Open `.env` and add your connection string:

```env
# Database Connection
DATABASE_URL="postgresql://user:password@host:port/database?schema=public"

# JWT Secret (keep your existing one or generate new)
JWT_SECRET="your-secret-key-change-in-production"
```

**Replace with your actual connection string:**

**Example - Supabase:**
```env
DATABASE_URL="postgresql://postgres:yourpassword@db.abcdefghijklmnop.supabase.co:5432/postgres"
JWT_SECRET="your-secret-key-change-in-production"
```

**Example - Local:**
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/thebutton?schema=public"
JWT_SECRET="your-secret-key-change-in-production"
```

### Step 3: Generate Prisma Client

```bash
npm run db:generate
```

You should see:
```
✔ Generated Prisma Client (v6.19.1)
```

### Step 4: Test Connection

**Start your dev server:**
```bash
npm run dev
```

**In another terminal, test the connection:**
```bash
# Windows PowerShell
Invoke-WebRequest -Uri http://localhost:3000/api/health/db | Select-Object -ExpandProperty Content

# macOS/Linux
curl http://localhost:3000/api/health/db
```

**Or open in browser:**
Visit: `http://localhost:3000/api/health/db`

**Expected Success Response:**
```json
{
  "status": "healthy",
  "database": "connected",
  "responseTime": "5ms",
  "version": "PostgreSQL 15.0",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**If you see an error**, check:
- Database is running
- Connection string is correct
- Firewall/network allows connection
- Password is correct

---

## Troubleshooting

### Error: "Can't reach database server"
- **Check:** Database is running
- **Local:** Start PostgreSQL service
- **Cloud:** Verify connection string

### Error: "Authentication failed"
- **Check:** Username and password are correct
- **Cloud:** Regenerate password if needed

### Error: "Database does not exist"
- **Create database:** `createdb thebutton` (local)
- **Cloud:** Database should auto-exist

### Error: "Connection timeout"
- **Check:** Firewall settings
- **Cloud:** Verify IP whitelist (if applicable)
- **Check:** Port 5432 is open

---

## Next Steps After Connection Works

Once the health check returns `"status": "healthy"`:

1. ✅ **Connection verified**
2. ⏭️ **Proceed to DB Phase 2** - Create business schema
3. ⏭️ **Proceed to DB Phase 3** - Run migrations

---

## Quick Test Commands

```bash
# Generate Prisma Client
npm run db:generate

# Test connection (requires server running)
curl http://localhost:3000/api/health/db

# Open Prisma Studio (visual database browser)
npm run db:studio
```

---

## Need Help?

If you're stuck:
1. Check the error message in the health check response
2. Verify your `.env` file has the correct `DATABASE_URL`
3. Test connection with Prisma Studio: `npm run db:studio`
4. Check database logs for connection attempts

