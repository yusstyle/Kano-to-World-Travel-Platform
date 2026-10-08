import { createInsertSchema } from "drizzle-zod";
import {
  boolean,
  index,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { z } from "zod/v4";

export const blogPostsTable = pgTable(
  "blog_posts",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    summary: text("summary").notNull(),
    content: text("content").notNull(),
    coverImageUrl: text("cover_image_url").notNull(),
    authorName: text("author_name").notNull().default("Editorial Team"),
    category: text("category").notNull().default("Heritage & History"),
    tags: text("tags").array().notNull().default([]),
    isPublished: boolean("is_published").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("blog_posts_published_idx").on(table.isPublished, table.createdAt),
  ],
);

export const galleryImagesTable = pgTable(
  "gallery_images",
  {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    location: text("location").notNull(),
    imageUrl: text("image_url").notNull(),
    category: text("category").notNull().default("Culture"),
    caption: text("caption"),
    isFeatured: boolean("is_featured").notNull().default(false),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("gallery_images_category_idx").on(table.category, table.sortOrder),
  ],
);

export const faqsTable = pgTable(
  "faqs",
  {
    id: serial("id").primaryKey(),
    question: text("question").notNull(),
    answer: text("answer").notNull(),
    category: text("category").notNull().default("General"),
    sortOrder: integer("sort_order").notNull().default(0),
    isPublished: boolean("is_published").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("faqs_category_order_idx").on(table.category, table.sortOrder),
  ],
);

export const insertBlogPostSchema = createInsertSchema(blogPostsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertGalleryImageSchema = createInsertSchema(galleryImagesTable).omit({
  id: true,
  createdAt: true,
});

export const insertFaqSchema = createInsertSchema(faqsTable).omit({
  id: true,
  createdAt: true,
});

export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogPost = typeof blogPostsTable.$inferSelect;

export type InsertGalleryImage = z.infer<typeof insertGalleryImageSchema>;
export type GalleryImage = typeof galleryImagesTable.$inferSelect;

export type InsertFaq = z.infer<typeof insertFaqSchema>;
export type Faq = typeof faqsTable.$inferSelect;

