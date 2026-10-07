CREATE TYPE "public"."user_role" AS ENUM('customer', 'admin');--> statement-breakpoint
CREATE TABLE "contact_inquiries" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"subject" text NOT NULL,
	"message" text NOT NULL,
	"status" text DEFAULT 'new' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "newsletter_subscribers" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"subscribed_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "destinations" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"country" text NOT NULL,
	"region" text,
	"description" text NOT NULL,
	"image_url" text NOT NULL,
	"gallery" text[] DEFAULT '{}' NOT NULL,
	"best_time_to_visit" text,
	"languages" text[] DEFAULT '{}' NOT NULL,
	"currency_code" text,
	"travel_notes" text,
	"is_featured" boolean DEFAULT false NOT NULL,
	"is_demo" boolean DEFAULT true NOT NULL,
	"is_published" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "destinations_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "tours" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"destination_id" integer NOT NULL,
	"duration_days" integer NOT NULL,
	"category" text NOT NULL,
	"tour_type" text DEFAULT 'flexible' NOT NULL,
	"price_amount" numeric(12, 2),
	"price_currency" text,
	"availability_status" text DEFAULT 'inquiry_only' NOT NULL,
	"image_url" text NOT NULL,
	"summary" text NOT NULL,
	"description" text NOT NULL,
	"highlights" text[] DEFAULT '{}' NOT NULL,
	"itinerary" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"included" text[] DEFAULT '{}' NOT NULL,
	"not_included" text[] DEFAULT '{}' NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"is_demo" boolean DEFAULT true NOT NULL,
	"is_published" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "tours_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "user_profiles" (
	"clerk_user_id" text PRIMARY KEY NOT NULL,
	"role" "user_role" DEFAULT 'customer' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "tours" ADD CONSTRAINT "tours_destination_id_destinations_id_fk" FOREIGN KEY ("destination_id") REFERENCES "public"."destinations"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "contact_inquiries_status_created_idx" ON "contact_inquiries" USING btree ("status","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "newsletter_subscribers_email_unique" ON "newsletter_subscribers" USING btree ("email");--> statement-breakpoint
CREATE INDEX "destinations_public_order_idx" ON "destinations" USING btree ("is_published","sort_order");--> statement-breakpoint
CREATE INDEX "tours_public_destination_idx" ON "tours" USING btree ("is_published","destination_id");--> statement-breakpoint
CREATE INDEX "tours_public_category_idx" ON "tours" USING btree ("is_published","category");--> statement-breakpoint
CREATE INDEX "tours_public_featured_idx" ON "tours" USING btree ("is_published","is_featured");