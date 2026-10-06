import { createInsertSchema } from "drizzle-zod";
import {
  boolean,
  index,
  integer,
  jsonb,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { z } from "zod/v4";

export type ItineraryDayRecord = {
  day: number;
  title: string;
  description: string;
  location: string;
};

export const destinationsTable = pgTable(
  "destinations",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    country: text("country").notNull(),
    region: text("region"),
    description: text("description").notNull(),
    imageUrl: text("image_url").notNull(),
    gallery: text("gallery").array().notNull().default([]),
    bestTimeToVisit: text("best_time_to_visit"),
    languages: text("languages").array().notNull().default([]),
    currencyCode: text("currency_code"),
    travelNotes: text("travel_notes"),
    isFeatured: boolean("is_featured").notNull().default(false),
    isDemo: boolean("is_demo").notNull().default(true),
    isPublished: boolean("is_published").notNull().default(false),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("destinations_public_order_idx").on(
      table.isPublished,
      table.sortOrder,
    ),
  ],
);

export const toursTable = pgTable(
  "tours",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    destinationId: integer("destination_id")
      .notNull()
      .references(() => destinationsTable.id, { onDelete: "restrict" }),
    durationDays: integer("duration_days").notNull(),
    category: text("category").notNull(),
    tourType: text("tour_type").notNull().default("flexible"),
    priceAmount: numeric("price_amount", {
      precision: 12,
      scale: 2,
      mode: "number",
    }),
    priceCurrency: text("price_currency"),
    availabilityStatus: text("availability_status")
      .notNull()
      .default("inquiry_only"),
    imageUrl: text("image_url").notNull(),
    summary: text("summary").notNull(),
    description: text("description").notNull(),
    highlights: text("highlights").array().notNull().default([]),
    itinerary: jsonb("itinerary")
      .$type<ItineraryDayRecord[]>()
      .notNull()
      .default([]),
    included: text("included").array().notNull().default([]),
    notIncluded: text("not_included").array().notNull().default([]),
    isFeatured: boolean("is_featured").notNull().default(false),
    isDemo: boolean("is_demo").notNull().default(true),
    isPublished: boolean("is_published").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("tours_public_destination_idx").on(
      table.isPublished,
      table.destinationId,
    ),
    index("tours_public_category_idx").on(
      table.isPublished,
      table.category,
    ),
    index("tours_public_featured_idx").on(
      table.isPublished,
      table.isFeatured,
    ),
  ],
);

export const insertDestinationSchema = createInsertSchema(
  destinationsTable,
).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTourSchema = createInsertSchema(toursTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertDestination = z.infer<typeof insertDestinationSchema>;
export type Destination = typeof destinationsTable.$inferSelect;
export type InsertTour = z.infer<typeof insertTourSchema>;
export type Tour = typeof toursTable.$inferSelect;
