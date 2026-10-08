import { createInsertSchema } from "drizzle-zod";
import {
  boolean,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { z } from "zod/v4";

export const siteContentTable = pgTable("site_content", {
  id: serial("id").primaryKey(),
  founderName: text("founder_name").notNull(),
  founderBio: text("founder_bio").notNull(),
  founderImageUrl: text("founder_image_url").notNull(),
  isPublished: boolean("is_published").notNull().default(true),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const insertSiteContentSchema = createInsertSchema(siteContentTable).omit({
  id: true,
  updatedAt: true,
});

export type InsertSiteContent = z.infer<typeof insertSiteContentSchema>;
export type SiteContent = typeof siteContentTable.$inferSelect;
