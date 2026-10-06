import { createInsertSchema } from "drizzle-zod";
import {
  index,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { z } from "zod/v4";

export const contactInquiriesTable = pgTable(
  "contact_inquiries",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    phone: text("phone"),
    subject: text("subject").notNull(),
    message: text("message").notNull(),
    status: text("status").notNull().default("new"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("contact_inquiries_status_created_idx").on(
      table.status,
      table.createdAt,
    ),
  ],
);

export const newsletterSubscribersTable = pgTable(
  "newsletter_subscribers",
  {
    id: serial("id").primaryKey(),
    email: text("email").notNull(),
    status: text("status").notNull().default("active"),
    subscribedAt: timestamp("subscribed_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("newsletter_subscribers_email_unique").on(table.email),
  ],
);

export const insertContactInquirySchema = createInsertSchema(
  contactInquiriesTable,
).omit({
  id: true,
  createdAt: true,
});

export const insertNewsletterSubscriberSchema = createInsertSchema(
  newsletterSubscribersTable,
).omit({
  id: true,
  subscribedAt: true,
});

export type InsertContactInquiry = z.infer<typeof insertContactInquirySchema>;
export type ContactInquiry = typeof contactInquiriesTable.$inferSelect;
export type InsertNewsletterSubscriber = z.infer<
  typeof insertNewsletterSubscriberSchema
>;
export type NewsletterSubscriber =
  typeof newsletterSubscribersTable.$inferSelect;
