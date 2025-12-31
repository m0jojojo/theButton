# Complete Supabase Setup Guide

## Step-by-Step Instructions

### Step 1: Create Supabase Account

1. Go to **https://supabase.com**
2. Click **"Start your project"** or **"Sign in"**
3. Sign up with:
   - GitHub (recommended)
   - Email
   - Google

### Step 2: Create a New Project

1. After logging in, click **"New Project"** (green button)
2. Fill in the project details:
   - **Name**: `thebutton` (or any name you prefer)
   - **Database Password**: 
     - ⚠️ **IMPORTANT**: Create a STRONG password
     - Save this password - you'll need it!
     - Example: `MySecurePass123!@#`
   - **Region**: Choose closest to you (e.g., `Southeast Asia (Singapore)`)
   - **Pricing Plan**: Free tier is fine for development

3. Click **"Create new project"**
4. Wait 2-3 minutes for project to initialize

### Step 3: Get Your Connection String

1. Once project is ready, go to **Settings** (gear icon in left sidebar)
2. Click **"Database"** in the settings menu
3. Scroll down to **"Connection string"** section
4. You'll see different connection options - use **"URI"** tab
5. Copy the connection string - it looks like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxxxxxx.supabase.co:5432/postgres
   ```

### Step 4: Update Your .env File

1. Open your `.env` file in the project root
2. Replace the `DATABASE_URL` line with your Supabase connection string
3. **Important**: Replace `[YOUR-PASSWORD]` with the password you created in Step 2

**Example:**
```env
# Database Connection (Supabase)
DATABASE_URL="postgresql://postgres:MySecurePass123!@#@db.oattjobjxohagcjzpazu.supabase.co:5432/postgres"

# JWT Secret
JWT_SECRET="your-secret-key-change-in-production"
```

**⚠️ Important Notes:**
- Keep the password in quotes
- Don't include spaces
- The format should be: `postgresql://postgres:PASSWORD@HOST:5432/postgres`

### Step 5: Test the Connection

1. **Generate Prisma Client:**
   ```bash
   npm run db:generate
   ```

2. **Start your dev server:**
   ```bash
   npm run dev
   ```

3. **Test the connection:**
   
   **Option A - Browser:**
   - Open: `http://localhost:3000/api/health/db`
   - You should see JSON response

   **Option B - PowerShell:**
   ```powershell
   Invoke-WebRequest http://localhost:3000/api/health/db | Select-Object -ExpandProperty Content
   ```

   **Option C - Test Script:**
   ```powershell
   .\scripts\test-db-connection.ps1
   ```

### Step 6: Verify Success

**✅ Success Response:**
```json
{
  "status": "healthy",
  "database": "connected",
  "responseTime": "50ms",
  "version": "PostgreSQL 15.0",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**❌ If you see an error:**
- Check password is correct
- Verify connection string format
- Make sure project is fully initialized
- Check Supabase dashboard shows project as "Active"

---

## Visual Guide: Finding Connection String

### In Supabase Dashboard:

1. **Left Sidebar** → Click **Settings** (⚙️ icon)
2. **Settings Menu** → Click **"Database"**
3. **Scroll Down** → Find **"Connection string"** section
4. **Click "URI" tab** → Copy the string
5. **Replace `[YOUR-PASSWORD]`** with your actual password

### Connection String Format:

```
postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

**Example (with password replaced):**
```
postgresql://postgres:MySecurePass123!@#@db.oattjobjxohagcjzpazu.supabase.co:5432/postgres
```

---

## Troubleshooting

### Error: "Authentication failed"

**Problem:** Password is incorrect or not replaced

**Solution:**
1. Go to Supabase → Settings → Database
2. Click **"Reset database password"** (if needed)
3. Copy connection string again
4. Make sure you replace `[YOUR-PASSWORD]` with actual password

### Error: "Can't reach database server"

**Problem:** Connection string format is wrong

**Solution:**
- Check you're using the **URI** format (not Session mode)
- Verify it starts with `postgresql://`
- Make sure port is `:5432`
- Check project is active in Supabase dashboard

### Error: "Connection timeout"

**Problem:** Network/firewall issue

**Solution:**
- Check internet connection
- Try from different network
- Check Supabase status page

### Error: "Database does not exist"

**Problem:** Wrong database name

**Solution:**
- Use `postgres` as database name (default)
- Don't change the database name in connection string

---

## Security Best Practices

1. **Never commit `.env` file** - Already in `.gitignore` ✅
2. **Use strong password** - Mix of letters, numbers, symbols
3. **Don't share connection string** - Keep it private
4. **Use environment variables in production** - Set in hosting platform

---

## Next Steps After Connection Works

Once health check returns `"status": "healthy"`:

1. ✅ **Connection verified**
2. ⏭️ **Proceed to DB Phase 2** - Create business schema
3. ⏭️ **Proceed to DB Phase 3** - Run migrations

---

## Quick Reference

**Supabase Dashboard:** https://supabase.com/dashboard

**Your Project URL:** https://supabase.com/dashboard/project/[YOUR-PROJECT-REF]

**Connection String Location:** Settings → Database → Connection string → URI tab

---

## Need Help?

If you're stuck:
1. Check Supabase project status (should be "Active")
2. Verify password is correct
3. Test connection string format
4. Check Supabase logs in dashboard

