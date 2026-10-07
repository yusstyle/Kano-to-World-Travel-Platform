import { Router, type IRouter } from "express";
import {
  GetDestinationParams,
  GetDestinationResponse,
  GetDestinationsResponse,
  GetHomeResponse,
  GetTourParams,
  GetTourResponse,
  GetToursQueryParams,
  GetToursResponse,
} from "@workspace/api-zod";
import {
  and,
  asc,
  count,
  db,
  desc,
  destinationsTable,
  eq,
  gte,
  ilike,
  isNotNull,
  lte,
  or,
  toursTable,
} from "@workspace/db";

const router: IRouter = Router();

type JoinedTour = {
  tour: typeof toursTable.$inferSelect;
  destination: typeof destinationsTable.$inferSelect;
};

function toTourCard({ tour, destination }: JoinedTour) {
  return {
    id: tour.id,
    slug: tour.slug,
    title: tour.title,
    destination: destination.name,
    country: destination.country,
    durationDays: tour.durationDays,
    category: tour.category,
    tourType: tour.tourType as "private" | "group" | "flexible",
    priceAmount: tour.priceAmount,
    priceCurrency: tour.priceCurrency,
    availabilityStatus: tour.availabilityStatus as
      | "inquiry_only"
      | "scheduled"
      | "unavailable",
    imageUrl: tour.imageUrl,
    summary: tour.summary,
    isFeatured: tour.isFeatured,
    isDemo: tour.isDemo,
  };
}

router.get("/home", async (_req, res): Promise<void> => {
  const [featuredTours, featuredDestinations] = await Promise.all([
    db
      .select({ tour: toursTable, destination: destinationsTable })
      .from(toursTable)
      .innerJoin(
        destinationsTable,
        eq(toursTable.destinationId, destinationsTable.id),
      )
      .where(
        and(
          eq(toursTable.isPublished, true),
          eq(toursTable.isFeatured, true),
          eq(destinationsTable.isPublished, true),
        ),
      )
      .orderBy(desc(toursTable.createdAt))
      .limit(4),
    db
      .select()
      .from(destinationsTable)
      .where(
        and(
          eq(destinationsTable.isPublished, true),
          eq(destinationsTable.isFeatured, true),
        ),
      )
      .orderBy(asc(destinationsTable.sortOrder), asc(destinationsTable.name))
      .limit(6),
  ]);

  res.json(
    GetHomeResponse.parse({
      featuredTours: featuredTours.map(toTourCard),
      featuredDestinations,
      experienceCategories: [
        "Historical & Heritage",
        "Cultural Experiences",
        "Nature & Adventure",
        "Food & Cuisine",
        "Photography",
        "Family Experiences",
        "Private Tours",
        "Educational Tours",
      ],
    }),
  );
});

router.get("/tours", async (req, res): Promise<void> => {
  const parsed = GetToursQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { q, destination, category, tourType, minDuration, maxDuration, sort, page, pageSize } =
    parsed.data;
  const conditions = [
    eq(toursTable.isPublished, true),
    eq(destinationsTable.isPublished, true),
  ];

  if (destination) {
    conditions.push(eq(destinationsTable.slug, destination));
  }
  if (category) {
    conditions.push(eq(toursTable.category, category));
  }
  if (tourType) {
    conditions.push(eq(toursTable.tourType, tourType));
  }
  if (minDuration !== undefined) {
    conditions.push(gte(toursTable.durationDays, minDuration));
  }
  if (maxDuration !== undefined) {
    conditions.push(lte(toursTable.durationDays, maxDuration));
  }
  if (q?.trim()) {
    const search = `%${q.trim()}%`;
    conditions.push(
      or(
        ilike(toursTable.title, search),
        ilike(toursTable.summary, search),
        ilike(destinationsTable.name, search),
        ilike(destinationsTable.country, search),
      )!,
    );
  }
  if (sort === "price_low" || sort === "price_high") {
    conditions.push(isNotNull(toursTable.priceAmount));
  }

  const where = and(...conditions);
  const orderBy =
    sort === "newest"
      ? [desc(toursTable.createdAt)]
      : sort === "price_low"
        ? [asc(toursTable.priceAmount)]
        : sort === "price_high"
          ? [desc(toursTable.priceAmount)]
          : [desc(toursTable.isFeatured), desc(toursTable.createdAt)];

  const [rows, totals] = await Promise.all([
    db
      .select({ tour: toursTable, destination: destinationsTable })
      .from(toursTable)
      .innerJoin(
        destinationsTable,
        eq(toursTable.destinationId, destinationsTable.id),
      )
      .where(where)
      .orderBy(...orderBy)
      .limit(pageSize)
      .offset((page - 1) * pageSize),
    db
      .select({ total: count() })
      .from(toursTable)
      .innerJoin(
        destinationsTable,
        eq(toursTable.destinationId, destinationsTable.id),
      )
      .where(where),
  ]);
  const total = totals[0]?.total ?? 0;

  res.json(
    GetToursResponse.parse({
      items: rows.map(toTourCard),
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    }),
  );
});

router.get("/tours/:slug", async (req, res): Promise<void> => {
  const params = GetTourParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [row] = await db
    .select({ tour: toursTable, destination: destinationsTable })
    .from(toursTable)
    .innerJoin(
      destinationsTable,
      eq(toursTable.destinationId, destinationsTable.id),
    )
    .where(
      and(
        eq(toursTable.slug, params.data.slug),
        eq(toursTable.isPublished, true),
        eq(destinationsTable.isPublished, true),
      ),
    )
    .limit(1);

  if (!row) {
    res.status(404).json({ error: "Tour not found" });
    return;
  }

  res.json(
    GetTourResponse.parse({
      ...toTourCard(row),
      region: row.destination.region,
      description: row.tour.description,
      highlights: row.tour.highlights,
      itinerary: row.tour.itinerary,
      included: row.tour.included,
      notIncluded: row.tour.notIncluded,
    }),
  );
});

router.get("/destinations", async (_req, res): Promise<void> => {
  const destinations = await db
    .select()
    .from(destinationsTable)
    .where(eq(destinationsTable.isPublished, true))
    .orderBy(
      asc(destinationsTable.sortOrder),
      desc(destinationsTable.isFeatured),
      asc(destinationsTable.name),
    );

  res.json(GetDestinationsResponse.parse(destinations));
});

router.get("/destinations/:slug", async (req, res): Promise<void> => {
  const params = GetDestinationParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [destination] = await db
    .select()
    .from(destinationsTable)
    .where(
      and(
        eq(destinationsTable.slug, params.data.slug),
        eq(destinationsTable.isPublished, true),
      ),
    )
    .limit(1);

  if (!destination) {
    res.status(404).json({ error: "Destination not found" });
    return;
  }

  const [tourCount] = await db
    .select({ count: count() })
    .from(toursTable)
    .where(
      and(
        eq(toursTable.destinationId, destination.id),
        eq(toursTable.isPublished, true),
      ),
    );

  res.json(
    GetDestinationResponse.parse({
      ...destination,
      tourCount: tourCount?.count ?? 0,
    }),
  );
});

export default router;
