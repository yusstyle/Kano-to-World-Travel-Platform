CREATE TABLE "bookings" (
	"id" serial PRIMARY KEY NOT NULL,
	"booking_reference" text NOT NULL,
	"tour_id" integer NOT NULL,
	"customer_name" text NOT NULL,
	"customer_email" text NOT NULL,
	"customer_phone" text,
	"travel_date" text NOT NULL,
	"travelers" integer DEFAULT 1 NOT NULL,
	"total_amount" numeric(12, 2),
	"currency" text DEFAULT 'USD' NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"special_requests" text,
	"clerk_user_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "bookings_booking_reference_unique" UNIQUE("booking_reference")
);
--> statement-breakpoint
CREATE TABLE "blog_posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"summary" text NOT NULL,
	"content" text NOT NULL,
	"cover_image_url" text NOT NULL,
	"author_name" text DEFAULT 'Editorial Team' NOT NULL,
	"category" text DEFAULT 'Heritage & History' NOT NULL,
	"tags" text[] DEFAULT '{}' NOT NULL,
	"is_published" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "blog_posts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "faqs" (
	"id" serial PRIMARY KEY NOT NULL,
	"question" text NOT NULL,
	"answer" text NOT NULL,
	"category" text DEFAULT 'General' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_published" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gallery_images" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"location" text NOT NULL,
	"image_url" text NOT NULL,
	"category" text DEFAULT 'Culture' NOT NULL,
	"caption" text,
	"is_featured" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_tour_id_tours_id_fk" FOREIGN KEY ("tour_id") REFERENCES "public"."tours"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "bookings_customer_email_idx" ON "bookings" USING btree ("customer_email");--> statement-breakpoint
CREATE INDEX "bookings_status_idx" ON "bookings" USING btree ("status");--> statement-breakpoint
CREATE INDEX "bookings_created_idx" ON "bookings" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "blog_posts_published_idx" ON "blog_posts" USING btree ("is_published","created_at");--> statement-breakpoint
CREATE INDEX "faqs_category_order_idx" ON "faqs" USING btree ("category","sort_order");--> statement-breakpoint
CREATE INDEX "gallery_images_category_idx" ON "gallery_images" USING btree ("category","sort_order");