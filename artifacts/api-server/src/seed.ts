import {
  db,
  destinationsTable,
  siteContentTable,
  toursTable,
  type InsertDestination,
  type InsertTour,
} from "@workspace/db";
import { logger } from "./lib/logger";

const defaultSiteContent = {
  founderName: "A Kano-based professional working in culture and history",
  founderBio:
    "A Kano-based professional working in culture and history, with experience at Kano Museum sharing Kano’s history and heritage.",
  founderImageUrl: "/kano-editorial.jpg",
};

const demoDestinations: InsertDestination[] = [
  {
    slug: "kano",
    name: "Kano",
    country: "Nigeria",
    region: "Kano State",
    description:
      "A northern Nigerian city with a deep cultural history and enduring traditions. This destination profile is demonstration content.",
    imageUrl: "/kano-editorial.jpg",
    gallery: ["/kano-editorial.jpg"],
    bestTimeToVisit: null,
    languages: [],
    currencyCode: null,
    travelNotes: null,
    isFeatured: true,
    isDemo: true,
    isPublished: true,
    sortOrder: 1,
  },
  {
    slug: "cairo",
    name: "Cairo",
    country: "Egypt",
    region: null,
    description:
      "A city shaped by many layers of history, architecture, and daily life. This destination profile is demonstration content.",
    imageUrl: "/cairo-editorial.jpg",
    gallery: ["/cairo-editorial.jpg"],
    bestTimeToVisit: null,
    languages: [],
    currencyCode: null,
    travelNotes: null,
    isFeatured: true,
    isDemo: true,
    isPublished: true,
    sortOrder: 2,
  },
  {
    slug: "marrakech",
    name: "Marrakech",
    country: "Morocco",
    region: null,
    description:
      "A North African destination known for its historic urban character, craft traditions, and vibrant food culture. This profile is demonstration content.",
    imageUrl: "/marrakech-editorial.jpg",
    gallery: ["/marrakech-editorial.jpg"],
    bestTimeToVisit: null,
    languages: [],
    currencyCode: null,
    travelNotes: null,
    isFeatured: true,
    isDemo: true,
    isPublished: true,
    sortOrder: 3,
  },
  {
    slug: "istanbul",
    name: "Istanbul",
    country: "Türkiye",
    region: null,
    description:
      "A meeting point of histories, neighborhoods, and waterways. This destination profile is demonstration content.",
    imageUrl: "/istanbul-editorial.jpg",
    gallery: ["/istanbul-editorial.jpg"],
    bestTimeToVisit: null,
    languages: [],
    currencyCode: null,
    travelNotes: null,
    isFeatured: true,
    isDemo: true,
    isPublished: true,
    sortOrder: 4,
  },
];

const demoTours: Array<Omit<InsertTour, "destinationId"> & { destinationSlug: string }> = [
  {
    destinationSlug: "kano",
    slug: "kano-heritage-discovery",
    title: "Kano Heritage Discovery",
    durationDays: 1,
    category: "Historical & Heritage",
    tourType: "flexible",
    priceAmount: null,
    priceCurrency: null,
    availabilityStatus: "inquiry_only",
    imageUrl: "/kano-editorial.jpg",
    summary:
      "A demonstration itinerary for discovering Kano through its history and living heritage.",
    description:
      "This sample tour concept shows how a culturally grounded visit to Kano could be presented. It is demonstration content, not an available product. Contact the team to discuss a real journey.",
    highlights: [
      "Explore the city through historical context",
      "Learn about local heritage and traditions",
      "Shape the pace around your interests",
    ],
    itinerary: [
      {
        day: 1,
        title: "Kano through its stories",
        description:
          "A sample day for exploring the city's heritage with time for conversation and discovery.",
        location: "Kano",
      },
    ],
    included: [],
    notIncluded: [],
    isFeatured: true,
    isDemo: true,
    isPublished: true,
  },
  {
    destinationSlug: "cairo",
    slug: "cairo-layers-of-history",
    title: "Cairo: Layers of History",
    durationDays: 2,
    category: "Historical & Heritage",
    tourType: "flexible",
    priceAmount: null,
    priceCurrency: null,
    availabilityStatus: "inquiry_only",
    imageUrl: "/cairo-editorial.jpg",
    summary:
      "A demonstration concept tracing the many eras and stories of Cairo.",
    description:
      "This sample listing demonstrates a possible history-focused Cairo experience. It is not currently offered for sale and does not represent confirmed dates, partners, or inclusions.",
    highlights: [
      "Explore the city's layered history",
      "Connect landmarks with their wider context",
      "Allow time for local culture and conversation",
    ],
    itinerary: [
      {
        day: 1,
        title: "Historic Cairo",
        description: "A sample day centered on the city's historic fabric.",
        location: "Cairo",
      },
      {
        day: 2,
        title: "Stories across the city",
        description: "A sample continuation focused on culture and place.",
        location: "Cairo",
      },
    ],
    included: [],
    notIncluded: [],
    isFeatured: true,
    isDemo: true,
    isPublished: true,
  },
  {
    destinationSlug: "marrakech",
    slug: "marrakech-culture-and-craft",
    title: "Marrakech: Culture & Craft",
    durationDays: 2,
    category: "Cultural Experiences",
    tourType: "flexible",
    priceAmount: null,
    priceCurrency: null,
    availabilityStatus: "inquiry_only",
    imageUrl: "/marrakech-editorial.jpg",
    summary:
      "A demonstration concept exploring Marrakech through its place, craft, and culture.",
    description:
      "This sample listing demonstrates a possible cultural experience in Marrakech. It is not currently offered for sale and does not represent confirmed dates, partners, or inclusions.",
    highlights: [
      "Discover the destination at a considered pace",
      "Explore cultural and craft traditions",
      "Leave room for a personalized itinerary",
    ],
    itinerary: [
      {
        day: 1,
        title: "A first look at Marrakech",
        description: "A sample introduction to the city and its culture.",
        location: "Marrakech",
      },
      {
        day: 2,
        title: "Craft and everyday life",
        description: "A sample day focused on cultural discovery.",
        location: "Marrakech",
      },
    ],
    included: [],
    notIncluded: [],
    isFeatured: true,
    isDemo: true,
    isPublished: true,
  },
  {
    destinationSlug: "istanbul",
    slug: "istanbul-historic-crossroads",
    title: "Istanbul: Historic Crossroads",
    durationDays: 2,
    category: "Historical & Heritage",
    tourType: "flexible",
    priceAmount: null,
    priceCurrency: null,
    availabilityStatus: "inquiry_only",
    imageUrl: "/istanbul-editorial.jpg",
    summary:
      "A demonstration concept for reading Istanbul through its neighborhoods and histories.",
    description:
      "This sample listing demonstrates a possible heritage journey in Istanbul. It is not currently offered for sale and does not represent confirmed dates, partners, or inclusions.",
    highlights: [
      "Explore the city's many historical layers",
      "See how place and water shape its story",
      "Personalize the route around your interests",
    ],
    itinerary: [
      {
        day: 1,
        title: "Across the historic city",
        description: "A sample introduction to Istanbul's heritage.",
        location: "Istanbul",
      },
      {
        day: 2,
        title: "Neighborhoods and waterways",
        description: "A sample continuation focused on place and culture.",
        location: "Istanbul",
      },
    ],
    included: [],
    notIncluded: [],
    isFeatured: true,
    isDemo: true,
    isPublished: true,
  },
];

export async function seedDemoContent(): Promise<void> {
  const [existingDestination] = await db
    .select({ id: destinationsTable.id })
    .from(destinationsTable)
    .limit(1);
  const [existingTour] = await db
    .select({ id: toursTable.id })
    .from(toursTable)
    .limit(1);
  const [existingSiteContent] = await db
    .select({ id: siteContentTable.id })
    .from(siteContentTable)
    .limit(1);

  if (!existingSiteContent) {
    await db.insert(siteContentTable).values(defaultSiteContent);
  }

  if (existingDestination || existingTour) {
    return;
  }

  const insertedDestinations = await db
    .insert(destinationsTable)
    .values(demoDestinations)
    .returning({ id: destinationsTable.id, slug: destinationsTable.slug });
  const idsBySlug = new Map(
    insertedDestinations.map((destination) => [
      destination.slug,
      destination.id,
    ]),
  );
  const toursToInsert = demoTours.map(({ destinationSlug, ...tour }) => {
    const destinationId = idsBySlug.get(destinationSlug);
    if (destinationId === undefined) {
      throw new Error(`Seed destination missing: ${destinationSlug}`);
    }
    return { ...tour, destinationId };
  });

  await db.insert(toursTable).values(toursToInsert);
  logger.info(
    { destinations: insertedDestinations.length, tours: toursToInsert.length },
    "Demo travel content seeded",
  );
}
