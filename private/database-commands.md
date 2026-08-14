# Database Migration Commands

This document contains the exact commands you need to manage your Cloudflare D1 database migrations within this monorepo structure.

## 1. Generating a New Migration

When you make changes to your database schema (located in `database/schema/`), you need to generate a new SQL migration file.

```bash
# First, navigate to the database package
cd database

# Generate the migration file (this uses Drizzle Kit)
npx drizzle-kit generate
```
*This will create a new `.sql` file inside `database/migrations/`.*

## 2. Applying Migrations Locally (Development)

To test your database changes locally, you need to apply the newly generated migration to your local D1 database. 
Since the `wrangler.toml` file is located in the `services/api` directory, you **must** run the command from there.

```bash
# Navigate to the API service directory (where wrangler.toml lives)
cd ../services/api

# Apply the migration to the local database
pnpm dlx wrangler@latest d1 migrations apply ethsltd_db --local
```
*(Press `y` if it prompts you to confirm the migration).*

## 3. Applying Migrations to Production (Cloudflare)

When you are ready to update the live production database on Cloudflare, run the exact same command but **without** the `--local` flag.

```bash
# Ensure you are still in the API service directory
cd services/api

# Apply the migration to the live production database
pnpm dlx wrangler@latest d1 migrations apply ethsltd_db --remote
```
*(Press `y` if it prompts you to confirm the migration).*

---

### Quick One-Liners (From Root Directory)

If you are at the root of the project (`C:\Users\abdur\Downloads\Clients\Ethsltd`) and want to do everything without manually changing directories, you can copy/paste these:

**Generate Migration:**
```bash
cd database && npx drizzle-kit generate && cd ..
```

**Apply Locally:**
```bash
cd services/api && pnpm dlx wrangler@latest d1 migrations apply ethsltd_db --local && cd ../..
```

**Apply to Production:**
```bash
cd services/api && pnpm dlx wrangler@latest d1 migrations apply ethsltd_db --remote && cd ../..
```
