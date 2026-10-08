import path from "node:path";
import fs from "node:fs";
import { Router, type IRouter } from "express";
import {
  asc,
  blogPostsTable,
  bookingsTable,
  contactInquiriesTable,
  db,
  desc,
  destinationsTable,
  eq,
  faqsTable,
  galleryImagesTable,
  toursTable,
} from "@workspace/db";
import {
  CreateAdminBlogPostResponse,
  CreateAdminDestinationResponse,
  CreateAdminFaqResponse,
  CreateAdminGalleryImageResponse,
  CreateAdminTourResponse,
  GetAdminBookingsResponse,
  GetAdminDestinationsResponse,
  GetAdminInquiriesResponse,
  GetAdminToursResponse,
  UpdateAdminBookingStatusResponse,
  UpdateAdminDestinationResponse,
  UpdateAdminInquiryStatusResponse,
  UpdateAdminTourResponse,
} from "@workspace/api-zod";
import { requireAdmin } from "../middlewares/authorization";

const router: IRouter = Router();

// Apply requireAdmin to all /admin routes
router.use("/admin", requireAdmin);

// ==================== IMAGE UPLOAD ====================
router.post("/admin/upload", async (req, res): Promise<void> => {
  try {
    const { filename, data } = req.body ?? {};

    if (!data || typeof data !== "string") {
      res.status(400).json({ error: "Missing image data payload." });
      return;
    }

    let base64Data = data;
    let ext = ".jpg";

    const match = data.match(/^data:image\/([a-zA-Z0-9+.-]+);base64,(.+)$/);
    if (match) {
      const mimeSub = match[1].toLowerCase();
      if (mimeSub === "png") ext = ".png";
      else if (mimeSub === "webp") ext = ".webp";
      else if (mimeSub === "gif") ext = ".gif";
      else if (mimeSub === "svg+xml") ext = ".svg";
      else ext = ".jpg";
      base64Data = match[2];
    } else if (filename && typeof filename === "string") {
      const parsedExt = path.extname(filename).toLowerCase();
      if ([".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"].includes(parsedExt)) {
        ext = parsedExt === ".jpeg" ? ".jpg" : parsedExt;
      }
    }

    const buffer = Buffer.from(base64Data, "base64");
    if (buffer.length === 0) {
      res.status(400).json({ error: "Uploaded image content is empty." });
      return;
    }

    if (buffer.length > 25 * 1024 * 1024) {
      res.status(400).json({ error: "Image size exceeds the 25MB limit." });
      return;
    }

    const safeBaseName = (filename ? path.basename(filename, path.extname(filename)) : "upload")
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, "-")
      .slice(0, 40) || "upload";

    const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const finalFilename = `${safeBaseName}-${uniqueId}${ext}`;

    const uploadsDir = path.resolve(process.cwd(), "artifacts/travel-platform/public/uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const targetFilePath = path.join(uploadsDir, finalFilename);
    await fs.promises.writeFile(targetFilePath, buffer);

    const publicUrl = `/uploads/${finalFilename}`;
    res.status(201).json({
      url: publicUrl,
      filename: finalFilename,
      size: buffer.length,
    });
  } catch (error) {
    req.log.error({ err: error }, "Failed to process image upload");
    res.status(500).json({ error: "Image could not be saved." });
  }
});

// ==================== TOURS CMS ====================
router.get("/admin/tours", async (_req, res): Promise<void> => {
  const tours = await db
    .select({
      tour: toursTable,
      destinationName: destinationsTable.name,
      destinationCountry: destinationsTable.country,
      destinationRegion: destinationsTable.region,
    })
    .from(toursTable)
    .innerJoin(destinationsTable, eq(toursTable.destinationId, destinationsTable.id))
    .orderBy(desc(toursTable.createdAt));

  const items = tours.map(({ tour, destinationName, destinationCountry, destinationRegion }) => ({
    id: tour.id,
    slug: tour.slug,
    title: tour.title,
    destination: destinationName,
    country: destinationCountry,
    region: destinationRegion,
    durationDays: tour.durationDays,
    category: tour.category,
    tourType: tour.tourType as "private" | "group" | "flexible",
    priceAmount: tour.priceAmount,
    priceCurrency: tour.priceCurrency,
    availabilityStatus: tour.availabilityStatus as "inquiry_only" | "scheduled" | "unavailable",
    imageUrl: tour.imageUrl,
    summary: tour.summary,
    description: tour.description,
    highlights: tour.highlights,
    itinerary: tour.itinerary,
    included: tour.included,
    notIncluded: tour.notIncluded,
    isFeatured: tour.isFeatured,
    isDemo: tour.isDemo,
    isPublished: tour.isPublished,
  }));

  res.json(GetAdminToursResponse.parse(items));
});

router.post("/admin/tours", async (req, res): Promise<void> => {
  const body = req.body;
  const [created] = await db.insert(toursTable).values({
    slug: body.slug,
    title: body.title,
    destinationId: body.destinationId,
    durationDays: body.durationDays,
    category: body.category,
    tourType: body.tourType || "flexible",
    priceAmount: body.priceAmount,
    priceCurrency: body.priceCurrency,
    availabilityStatus: body.availabilityStatus || "inquiry_only",
    imageUrl: body.imageUrl,
    summary: body.summary,
    description: body.description,
    highlights: body.highlights || [],
    itinerary: body.itinerary || [],
    included: body.included || [],
    notIncluded: body.notIncluded || [],
    isFeatured: body.isFeatured ?? false,
    isDemo: body.isDemo ?? false,
    isPublished: body.isPublished ?? true,
  }).returning();

  const [dest] = await db.select().from(destinationsTable).where(eq(destinationsTable.id, created.destinationId)).limit(1);

  res.status(201).json(CreateAdminTourResponse.parse({
    id: created.id,
    slug: created.slug,
    title: created.title,
    destination: dest?.name ?? "",
    country: dest?.country ?? "",
    region: dest?.region ?? null,
    durationDays: created.durationDays,
    category: created.category,
    tourType: created.tourType as "private" | "group" | "flexible",
    priceAmount: created.priceAmount,
    priceCurrency: created.priceCurrency,
    availabilityStatus: created.availabilityStatus as "inquiry_only" | "scheduled" | "unavailable",
    imageUrl: created.imageUrl,
    summary: created.summary,
    description: created.description,
    highlights: created.highlights,
    itinerary: created.itinerary,
    included: created.included,
    notIncluded: created.notIncluded,
    isFeatured: created.isFeatured,
    isDemo: created.isDemo,
  }));
});

router.put("/admin/tours/:id", async (req, res): Promise<void> => {
  const id = Number(req.params.id);
  const body = req.body;

  const [updated] = await db
    .update(toursTable)
    .set({
      slug: body.slug,
      title: body.title,
      destinationId: body.destinationId,
      durationDays: body.durationDays,
      category: body.category,
      tourType: body.tourType,
      priceAmount: body.priceAmount,
      priceCurrency: body.priceCurrency,
      availabilityStatus: body.availabilityStatus,
      imageUrl: body.imageUrl,
      summary: body.summary,
      description: body.description,
      highlights: body.highlights,
      itinerary: body.itinerary,
      included: body.included,
      notIncluded: body.notIncluded,
      isFeatured: body.isFeatured,
      isDemo: body.isDemo,
      isPublished: body.isPublished,
      updatedAt: new Date(),
    })
    .where(eq(toursTable.id, id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Tour not found." });
    return;
  }

  const [dest] = await db.select().from(destinationsTable).where(eq(destinationsTable.id, updated.destinationId)).limit(1);

  res.json(UpdateAdminTourResponse.parse({
    id: updated.id,
    slug: updated.slug,
    title: updated.title,
    destination: dest?.name ?? "",
    country: dest?.country ?? "",
    region: dest?.region ?? null,
    durationDays: updated.durationDays,
    category: updated.category,
    tourType: updated.tourType as "private" | "group" | "flexible",
    priceAmount: updated.priceAmount,
    priceCurrency: updated.priceCurrency,
    availabilityStatus: updated.availabilityStatus as "inquiry_only" | "scheduled" | "unavailable",
    imageUrl: updated.imageUrl,
    summary: updated.summary,
    description: updated.description,
    highlights: updated.highlights,
    itinerary: updated.itinerary,
    included: updated.included,
    notIncluded: updated.notIncluded,
    isFeatured: updated.isFeatured,
    isDemo: updated.isDemo,
  }));
});

router.delete("/admin/tours/:id", async (req, res): Promise<void> => {
  const id = Number(req.params.id);
  await db.delete(toursTable).where(eq(toursTable.id, id));
  res.json({ id, message: "Tour deleted successfully." });
});

// ==================== DESTINATIONS CMS ====================
router.get("/admin/destinations", async (_req, res): Promise<void> => {
  const destinations = await db
    .select()
    .from(destinationsTable)
    .orderBy(asc(destinationsTable.sortOrder), desc(destinationsTable.createdAt));

  const items = await Promise.all(
    destinations.map(async (d) => {
      const [{ value: tourCount }] = await db
        .select({ value: toursTable.id })
        .from(toursTable)
        .where(eq(toursTable.destinationId, d.id));
      return {
        ...d,
        tourCount: tourCount ? 1 : 0,
      };
    }),
  );

  res.json(GetAdminDestinationsResponse.parse(items));
});

router.post("/admin/destinations", async (req, res): Promise<void> => {
  const body = req.body;
  const [created] = await db.insert(destinationsTable).values({
    slug: body.slug,
    name: body.name,
    country: body.country,
    region: body.region || null,
    description: body.description,
    imageUrl: body.imageUrl,
    gallery: body.gallery || [],
    bestTimeToVisit: body.bestTimeToVisit || null,
    languages: body.languages || [],
    currencyCode: body.currencyCode || null,
    travelNotes: body.travelNotes || null,
    isFeatured: body.isFeatured ?? false,
    isDemo: body.isDemo ?? false,
    isPublished: body.isPublished ?? true,
    sortOrder: body.sortOrder ?? 0,
  }).returning();

  res.status(201).json(CreateAdminDestinationResponse.parse({
    ...created,
    tourCount: 0,
  }));
});

router.put("/admin/destinations/:id", async (req, res): Promise<void> => {
  const id = Number(req.params.id);
  const body = req.body;

  const [updated] = await db
    .update(destinationsTable)
    .set({
      slug: body.slug,
      name: body.name,
      country: body.country,
      region: body.region,
      description: body.description,
      imageUrl: body.imageUrl,
      gallery: body.gallery,
      bestTimeToVisit: body.bestTimeToVisit,
      languages: body.languages,
      currencyCode: body.currencyCode,
      travelNotes: body.travelNotes,
      isFeatured: body.isFeatured,
      isDemo: body.isDemo,
      isPublished: body.isPublished,
      sortOrder: body.sortOrder,
      updatedAt: new Date(),
    })
    .where(eq(destinationsTable.id, id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Destination not found." });
    return;
  }

  res.json(UpdateAdminDestinationResponse.parse({
    ...updated,
    tourCount: 0,
  }));
});

router.delete("/admin/destinations/:id", async (req, res): Promise<void> => {
  const id = Number(req.params.id);
  await db.delete(destinationsTable).where(eq(destinationsTable.id, id));
  res.json({ id, message: "Destination deleted successfully." });
});

// ==================== BOOKINGS MANAGEMENT ====================
router.get("/admin/bookings", async (_req, res): Promise<void> => {
  const records = await db
    .select({
      booking: bookingsTable,
      tourTitle: toursTable.title,
      destinationId: toursTable.destinationId,
    })
    .from(bookingsTable)
    .innerJoin(toursTable, eq(bookingsTable.tourId, toursTable.id))
    .orderBy(desc(bookingsTable.createdAt));

  const items = await Promise.all(
    records.map(async ({ booking, tourTitle, destinationId }) => {
      const [dest] = await db
        .select({ name: destinationsTable.name })
        .from(destinationsTable)
        .where(eq(destinationsTable.id, destinationId))
        .limit(1);

      return {
        id: booking.id,
        bookingReference: booking.bookingReference,
        tourId: booking.tourId,
        tourTitle,
        destinationName: dest?.name ?? "Destinations",
        customerName: booking.customerName,
        customerEmail: booking.customerEmail,
        customerPhone: booking.customerPhone,
        travelDate: booking.travelDate,
        travelers: booking.travelers,
        totalAmount: booking.totalAmount,
        currency: booking.currency,
        status: booking.status as "pending" | "confirmed" | "cancelled",
        specialRequests: booking.specialRequests,
        createdAt: booking.createdAt.toISOString(),
      };
    }),
  );

  res.json(GetAdminBookingsResponse.parse(items));
});

router.patch("/admin/bookings/:id", async (req, res): Promise<void> => {
  const id = Number(req.params.id);
  const { status } = req.body;

  const [booking] = await db
    .update(bookingsTable)
    .set({ status, updatedAt: new Date() })
    .where(eq(bookingsTable.id, id))
    .returning();

  if (!booking) {
    res.status(404).json({ error: "Booking not found." });
    return;
  }

  const [tour] = await db
    .select({ title: toursTable.title, destinationId: toursTable.destinationId })
    .from(toursTable)
    .where(eq(toursTable.id, booking.tourId))
    .limit(1);

  const [dest] = await db
    .select({ name: destinationsTable.name })
    .from(destinationsTable)
    .where(eq(destinationsTable.id, tour?.destinationId ?? 0))
    .limit(1);

  res.json(
    UpdateAdminBookingStatusResponse.parse({
      id: booking.id,
      bookingReference: booking.bookingReference,
      tourId: booking.tourId,
      tourTitle: tour?.title ?? "",
      destinationName: dest?.name ?? "",
      customerName: booking.customerName,
      customerEmail: booking.customerEmail,
      customerPhone: booking.customerPhone,
      travelDate: booking.travelDate,
      travelers: booking.travelers,
      totalAmount: booking.totalAmount,
      currency: booking.currency,
      status: booking.status as "pending" | "confirmed" | "cancelled",
      specialRequests: booking.specialRequests,
      createdAt: booking.createdAt.toISOString(),
    }),
  );
});

// ==================== INQUIRIES MANAGEMENT ====================
router.get("/admin/inquiries", async (_req, res): Promise<void> => {
  const inquiries = await db
    .select()
    .from(contactInquiriesTable)
    .orderBy(desc(contactInquiriesTable.createdAt));

  const items = inquiries.map((inq) => ({
    id: inq.id,
    name: inq.name,
    email: inq.email,
    phone: inq.phone,
    subject: inq.subject,
    message: inq.message,
    status: inq.status as "new" | "in_progress" | "resolved",
    createdAt: inq.createdAt.toISOString(),
  }));

  res.json(GetAdminInquiriesResponse.parse(items));
});

router.patch("/admin/inquiries/:id", async (req, res): Promise<void> => {
  const id = Number(req.params.id);
  const { status } = req.body;

  const [updated] = await db
    .update(contactInquiriesTable)
    .set({ status })
    .where(eq(contactInquiriesTable.id, id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Inquiry not found." });
    return;
  }

  res.json(
    UpdateAdminInquiryStatusResponse.parse({
      id: updated.id,
      name: updated.name,
      email: updated.email,
      phone: updated.phone,
      subject: updated.subject,
      message: updated.message,
      status: updated.status as "new" | "in_progress" | "resolved",
      createdAt: updated.createdAt.toISOString(),
    }),
  );
});

// ==================== BLOG POSTS CMS ====================
router.post("/admin/blog", async (req, res): Promise<void> => {
  const body = req.body;
  const [created] = await db.insert(blogPostsTable).values({
    slug: body.slug,
    title: body.title,
    summary: body.summary,
    content: body.content,
    coverImageUrl: body.coverImageUrl,
    authorName: body.authorName || "Editorial Team",
    category: body.category || "Heritage & History",
    tags: body.tags || [],
    isPublished: body.isPublished ?? true,
  }).returning();

  res.status(201).json(CreateAdminBlogPostResponse.parse({
    ...created,
    createdAt: created.createdAt.toISOString(),
  }));
});

router.delete("/admin/blog/:id", async (req, res): Promise<void> => {
  const id = Number(req.params.id);
  await db.delete(blogPostsTable).where(eq(blogPostsTable.id, id));
  res.json({ id, message: "Blog post deleted." });
});

// ==================== FAQS CMS ====================
router.post("/admin/faqs", async (req, res): Promise<void> => {
  const body = req.body;
  const [created] = await db.insert(faqsTable).values({
    question: body.question,
    answer: body.answer,
    category: body.category || "General",
    sortOrder: body.sortOrder ?? 0,
    isPublished: body.isPublished ?? true,
  }).returning();

  res.status(201).json(CreateAdminFaqResponse.parse(created));
});

router.delete("/admin/faqs/:id", async (req, res): Promise<void> => {
  const id = Number(req.params.id);
  await db.delete(faqsTable).where(eq(faqsTable.id, id));
  res.json({ id, message: "FAQ deleted." });
});

// ==================== GALLERY CMS ====================
router.post("/admin/gallery", async (req, res): Promise<void> => {
  const body = req.body;
  const [created] = await db.insert(galleryImagesTable).values({
    title: body.title,
    location: body.location,
    imageUrl: body.imageUrl,
    category: body.category || "Culture",
    caption: body.caption || null,
    isFeatured: body.isFeatured ?? false,
    sortOrder: body.sortOrder ?? 0,
  }).returning();

  res.status(201).json(CreateAdminGalleryImageResponse.parse(created));
});

router.delete("/admin/gallery/:id", async (req, res): Promise<void> => {
  const id = Number(req.params.id);
  await db.delete(galleryImagesTable).where(eq(galleryImagesTable.id, id));
  res.json({ id, message: "Gallery image deleted." });
});

export default router;

