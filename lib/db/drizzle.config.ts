import { defineConfig } from "drizzle-kit";
import path from "path";

const isLocalDatabase = !process.env.DATABASE_URL;
const schemaPath = path
  .resolve(__dirname, "./src/schema/**/*.ts")
  .replaceAll("\\", "/");

export default defineConfig({
  schema: schemaPath,
  dialect: "postgresql",
  ...(isLocalDatabase
    ? {
        driver: "pglite",
        dbCredentials: { url: process.env.PGLITE_DATA_DIR ?? "./data/pglite" },
      }
    : {
        dbCredentials: { url: process.env.DATABASE_URL! },
      }),
});
