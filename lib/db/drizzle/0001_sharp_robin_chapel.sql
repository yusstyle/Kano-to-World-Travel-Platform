CREATE TABLE "site_content" (
	"id" serial PRIMARY KEY NOT NULL,
	"founder_name" text NOT NULL,
	"founder_bio" text NOT NULL,
	"founder_image_url" text NOT NULL,
	"is_published" boolean DEFAULT true NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
