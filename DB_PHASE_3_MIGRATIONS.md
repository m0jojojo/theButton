# DB Phase 3: Migrations & Data Safety

## Overview

This phase covers:
1. Creating the initial migration
2. Applying migration to database
3. Seeding sample data (dev only)
4. Rollback instructions

## Step 1: Stop Dev Server

**IMPORTANT:** The dev server must be stopped before running migrations.

```bash
# Stop the server (Ctrl+C in server window)
# Or kill process on port 3000
```

## Step 2: Generate Prisma Client

```bash
npm run db:generate
```

This generates the Prisma Client based on your schema.

## Step 3: Create Migration

```bash
npm run db:migrate
```

When prompted, name it: `init_schema`

This will:
- Create migration files in `prisma/migrations/`
- Apply the migration to your database
- Create all tables, indexes, and constraints

**Expected output:**
```
✔ Migration created and applied successfully.
```

## Step 4: Verify Migration

### Option A: Prisma Studio (Visual)
```bash
npm run db:studio
```

Opens at: http://localhost:5555

You should see all tables:
- users
- products
- orders
- order_items
- reviews
- review_votes
- whatsapp_events

### Option B: Supabase Dashboard
1. Go to your Supabase project
2. Click **"Table Editor"** in left sidebar
3. Verify all tables are created

### Option C: SQL Query
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

## Step 5: Seed Sample Data (Optional - Dev Only)

**⚠️ WARNING:** This will clear existing data and add sample data.

```bash
npm run db:seed
```

This creates:
- 1 admin user (admin@thebutton.com / admin123)
- 1 customer user (customer@example.com / password123)
- 3 sample products
- 1 sample order
- 1 sample review

## Rollback Instructions

### Rollback Last Migration

```bash
# Reset database (WARNING: Deletes all data!)
npm run db:reset

# Or manually:
# 1. Delete migration files from prisma/migrations/
# 2. Drop tables in database
# 3. Re-run migration
```

### Manual Rollback (Supabase)

1. Go to Supabase Dashboard
2. Click **"SQL Editor"**
3. Run:
```sql
DROP TABLE IF EXISTS whatsapp_events CASCADE;
DROP TABLE IF EXISTS review_votes CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop enums
DROP TYPE IF EXISTS "ReviewStatus" CASCADE;
DROP TYPE IF EXISTS "PaymentStatus" CASCADE;
DROP TYPE IF EXISTS "PaymentMethod" CASCADE;
DROP TYPE IF EXISTS "OrderStatus" CASCADE;
DROP TYPE IF EXISTS "UserRole" CASCADE;
```

## Troubleshooting

### Error: "Migration already applied"
- Check if tables already exist
- Use `prisma migrate resolve` to mark as applied
- Or reset: `npm run db:reset`

### Error: "Table already exists"
- Database already has tables
- Either drop tables manually or use `db:reset`

### Error: "Connection timeout"
- Check database is accessible
- Verify DATABASE_URL in .env
- Check Supabase project status

### Error: "Permission denied"
- Check database user has CREATE TABLE permissions
- Verify connection string uses correct user

## Safety Checklist

Before running migration:
- [ ] Dev server is stopped
- [ ] DATABASE_URL is correct in .env
- [ ] Database connection works (test with health check)
- [ ] Backup database (if production data exists)

After migration:
- [ ] All tables created
- [ ] Indexes created
- [ ] Foreign keys working
- [ ] Can query tables in Prisma Studio

## Next Steps

After successful migration:
- ✅ **Phase 3 Complete**
- ⏭️ **Proceed to Phase 4** - Read Integration (Safe)

---

## Commands Reference

```bash
# Generate Prisma Client
npm run db:generate

# Create and apply migration
npm run db:migrate

# Apply migrations (production)
npm run db:migrate:deploy

# Reset database (dev only - deletes all data!)
npm run db:reset

# Seed sample data (dev only)
npm run db:seed

# Open Prisma Studio
npm run db:studio
```

