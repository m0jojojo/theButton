# Database Setup Guide

## Overview

This project uses **PostgreSQL** with **Prisma ORM** for database management.

## Prerequisites

- PostgreSQL database (local or cloud)
- Node.js 18+
- npm or yarn

## Initial Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Database Connection

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and set your `DATABASE_URL`:

```env
DATABASE_URL="postgresql://user:password@host:port/database?schema=public"
```

#### Connection String Examples

**Supabase:**
```
postgresql://postgres:[YOUR-PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres
```

**Neon:**
```
postgresql://[USER]:[PASSWORD]@[HOST]/[DATABASE]?sslmode=require
```

**Railway:**
```
postgresql://postgres:[PASSWORD]@[HOST]:[PORT]/railway
```

**Local PostgreSQL:**
```
postgresql://postgres:postgres@localhost:5432/thebutton?schema=public
```

### 3. Generate Prisma Client

```bash
npm run db:generate
```

This generates the Prisma Client based on your schema.

## Database Health Check

Test your database connection:

```bash
curl http://localhost:3000/api/health/db
```

Or visit: `http://localhost:3000/api/health/db`

Expected response:
```json
{
  "status": "healthy",
  "database": "connected",
  "responseTime": "5ms",
  "version": "PostgreSQL 15.0",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Available Scripts

- `npm run db:generate` - Generate Prisma Client
- `npm run db:push` - Push schema changes to database (dev only)
- `npm run db:migrate` - Create and apply migrations
- `npm run db:migrate:deploy` - Apply migrations (production)
- `npm run db:studio` - Open Prisma Studio (database GUI)
- `npm run db:seed` - Seed database with sample data

## Development Workflow

1. **Modify Schema**: Edit `prisma/schema.prisma`
2. **Create Migration**: `npm run db:migrate`
3. **Generate Client**: Automatically runs with migrate
4. **Test**: Use Prisma Studio or API endpoints

## Prisma Studio

Visual database browser:

```bash
npm run db:studio
```

Opens at: `http://localhost:5555`

## Troubleshooting

### Connection Issues

1. Verify `DATABASE_URL` in `.env`
2. Check database is running
3. Verify network/firewall settings
4. Test connection: `npm run db:studio`

### Migration Issues

1. Check migration files in `prisma/migrations/`
2. Review error messages
3. Use `prisma migrate resolve` to mark migrations as applied
4. In dev: `npm run db:push` (bypasses migrations)

## Security Notes

- Never commit `.env` file
- Use strong passwords in production
- Enable SSL for cloud databases
- Use connection pooling in production

## Next Steps

After setting up the database connection, proceed to:
- **DB Phase 2**: Create core business schema
- **DB Phase 3**: Migrations & data safety

