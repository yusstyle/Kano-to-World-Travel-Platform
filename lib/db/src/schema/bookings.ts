import { createInsertSchema } from "drizzle-zod";
import {
  index,
  integer,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { z } from "zod/v4";
import { toursTable } from "./travel";

export const bookingsTable = pgTable(
  "bookings",
  {
    id: serial("id").primaryKey(),
    bookingReference: text("booking_reference").notNull().unique(),
    tourId: integer("tour_id")
      .notNull()
      .references(() => toursTable.id, { onDelete: "restrict" }),
    customerName: text("customer_name").notNull(),
    customerEmail: text("customer_email").notNull(),
    customerPhone: text("customer_phone"),
    travelDate: text("travel_date").notNull(),
    travelers: integer("travelers").notNull().default(1),
    totalAmount: numeric("total_amount", {
      precision: 12,
      scale: 2,
      mode: "number",
    }),
    currency: text("currency").notNull().default("USD"),
    status: text("status").notNull().default("pending"), // pending, confirmed, cancelled
    specialRequests: text("special_requests"),
    clerkUserId: text("clerk_user_id"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("bookings_customer_email_idx").on(table.customerEmail),
    index("bookings_status_idx").on(table.status),
    index("bookings_created_idx").on(table.createdAt),
  ],
);

export const insertBookingSchema = createInsertSchema(bookingsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookingsTable.$inferSelect;

