import { Router, type IRouter } from "express";
import {
  asc,
  blogPostsTable,
  db,
  desc,
  eq,
  faqsTable,
  galleryImagesTable,
} from "@workspace/db";
import {
  GetBlogPostParams,
  GetBlogPostResponse,
  GetBlogPostsResponse,
  GetFaqsResponse,
  GetGalleryImagesResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

// GET /blog - List published blog posts
router.get("/blog", async (_req, res): Promise<void> => {
  const posts = await db
    .select()
    .from(blogPostsTable)
    .where(eq(blogPostsTable.isPublished, true))
    .orderBy(desc(blogPostsTable.createdAt));

  const formatted = posts.map((post) => ({
    ...post,
    createdAt: post.createdAt.toISOString(),
  }));

  res.json(GetBlogPostsResponse.parse(formatted));
});

// GET /blog/:slug - Single blog post
router.get("/blog/:slug", async (req, res): Promise<void> => {
  const { slug } = GetBlogPostParams.parse(req.params);

  const [post] = await db
    .select()
    .from(blogPostsTable)
    .where(eq(blogPostsTable.slug, slug))
    .limit(1);

  if (!post || !post.isPublished) {
    res.status(404).json({ error: "Story not found." });
    return;
  }

  res.json(
    GetBlogPostResponse.parse({
      ...post,
      createdAt: post.createdAt.toISOString(),
    }),
  );
});

// GET /gallery - List gallery images
router.get("/gallery", async (_req, res): Promise<void> => {
  const images = await db
    .select()
    .from(galleryImagesTable)
    .orderBy(asc(galleryImagesTable.sortOrder), desc(galleryImagesTable.createdAt));

  res.json(GetGalleryImagesResponse.parse(images));
});

// GET /faqs - List published FAQs
router.get("/faqs", async (_req, res): Promise<void> => {
  const faqs = await db
    .select()
    .from(faqsTable)
    .where(eq(faqsTable.isPublished, true))
    .orderBy(asc(faqsTable.sortOrder), asc(faqsTable.id));

  res.json(GetFaqsResponse.parse(faqs));
});

export default router;

