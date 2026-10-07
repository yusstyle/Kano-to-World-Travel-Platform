import { PGlite } from "@electric-sql/pglite";
import {
  and,
  asc,
  count,
  desc,
  eq,
  gte,
  ilike,
  isNotNull,
  lte,
  or,
  sql,
} from "drizzle-orm";
import { migrate as migratePglite } from "drizzle-orm/pglite/migrator";
import { drizzle as drizzlePglite } from "drizzle-orm/pglite";
import { migrate as migratePostgres } from "drizzle-orm/node-postgres/migrator";
import { drizzle as drizzlePostgres } from "drizzle-orm/node-postgres";
import { existsSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;
const databaseUrl = process.env.DATABASE_URL;
const migrationsFolder =
  process.env.PGLITE_MIGRATIONS_DIR ??
  [
    resolve(process.cwd(), "lib/db/drizzle"),
    resolve(process.cwd(), "../../lib/db/drizzle"),
    resolve(process.cwd(), "../lib/db/drizzle"),
  ].find((candidate) => existsSync(candidate)) ??
  "";

if (!migrationsFolder) {
  throw new Error("Could not locate the Drizzle migration folder.");
}

export const pool = databaseUrl
  ? new Pool({ connectionString: databaseUrl })
  : undefined;

const pgliteDataDir = process.env.PGLITE_DATA_DIR ?? "./data/pglite";
const pglite = databaseUrl
  ? undefined
  : new PGlite({ dataDir: pgliteDataDir });
const localDb = pglite ? drizzlePglite(pglite, { schema }) : undefined;
const pgDb = databaseUrl
  ? drizzlePostgres(pool!, { schema })
  : undefined;

if (localDb) {
  mkdirSync(pgliteDataDir, { recursive: true });
  await migratePglite(localDb, { migrationsFolder });
} else if (pgDb) {
  await migratePostgres(pgDb, { migrationsFolder });
}

type Database = NonNullable<typeof pgDb>;
export const db = (databaseUrl ? pgDb : localDb)! as Database;

export {
  and,
  asc,
  count,
  desc,
  eq,
  gte,
  ilike,
  isNotNull,
  lte,
  or,
  sql,
} from "drizzle-orm";
export * from "./schema";
