# Supabase Setup - Quick Steps

## Your Current Status

You have: `DATABASE_URL="https://oattjobjxohagcjzpazu.supabase.co"`

This is the project URL, but we need the **PostgreSQL connection string**.

---

## Step-by-Step Instructions

### Step 1: Open Supabase Dashboard

1. Go to: **https://supabase.com/dashboard**
2. Log in to your account
3. Find your project (should be named something like "thebutton" or similar)

### Step 2: Get Connection String

1. In your project dashboard, click **Settings** (⚙️ gear icon) in the left sidebar
2. Click **"Database"** in the settings menu
3. Scroll down to find **"Connection string"** section
4. Click on the **"URI"** tab (not "Session mode" or "Transaction")
5. You'll see a connection string like:
   ```
   postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
   ```
   
   OR the simpler format:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```

### Step 3: Copy and Replace Password

**IMPORTANT:** The connection string will have `[YOUR-PASSWORD]` placeholder.

1. Copy the entire connection string
2. Replace `[YOUR-PASSWORD]` with the password you created when setting up the project
3. If you forgot the password:
   - Go to Settings → Database
   - Click "Reset database password"
   - Create a new password
   - Copy the connection string again

### Step 4: Update Your .env File

Open your `.env` file and replace the `DATABASE_URL` line:

**Before:**
```env
DATABASE_URL="https://oattjobjxohagcjzpazu.supabase.co"
```

**After (example):**
```env
DATABASE_URL="postgresql://postgres:YourPassword123@db.oattjobjxohagcjzpazu.supabase.co:5432/postgres"
```

**⚠️ Important:**
- Use the **URI** format (starts with `postgresql://`)
- Replace `[YOUR-PASSWORD]` with your actual password
- Keep the entire string in quotes
- Don't include spaces

### Step 5: Test Connection

```bash
# 1. Generate Prisma Client
npm run db:generate

# 2. Start dev server
npm run dev

# 3. Test in browser:
# http://localhost:3000/api/health/db
```

---

## Visual Guide: Where to Find Connection String

```
Supabase Dashboard
├── Your Project
│   ├── Settings (⚙️ icon) ← Click here
│   │   ├── Database ← Click here
│   │   │   └── Connection string ← Scroll down
│   │   │       └── URI tab ← Click this tab
│   │   │           └── Copy this string
```

---

## Quick Setup Script

Or use the automated script:

```powershell
.\scripts\setup-supabase.ps1
```

This will guide you through the process interactively.

---

## Common Issues

### "I can't find the connection string"
- Make sure you're in **Settings → Database**
- Scroll down - it's below the connection pooling section
- Look for **"Connection string"** heading

### "The password doesn't work"
- You need to replace `[YOUR-PASSWORD]` with your actual password
- If you forgot it, reset it in Settings → Database

### "Connection string format looks wrong"
- Make sure you're using the **URI** tab (not Session mode)
- Should start with `postgresql://`
- Should include `:5432` (port number)

---

## Need Help?

1. Check full guide: `SUPABASE_SETUP_GUIDE.md`
2. Run setup script: `.\scripts\setup-supabase.ps1`
3. Test connection: `.\scripts\test-db-connection.ps1`

