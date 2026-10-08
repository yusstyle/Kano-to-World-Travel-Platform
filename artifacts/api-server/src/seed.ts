import {
  blogPostsTable,
  db,
  destinationsTable,
  faqsTable,
  galleryImagesTable,
  siteContentTable,
  toursTable,
  userProfilesTable,
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

  // Seed Blog Posts if empty
  const [existingBlog] = await db.select({ id: blogPostsTable.id }).from(blogPostsTable).limit(1);
  if (!existingBlog) {
    await db.insert(blogPostsTable).values([
      {
        slug: "living-indigo-kofar-mata-dye-pits",
        title: "The Living Indigo: Inside the 500-Year-Old Kofar Mata Dye Pits",
        summary: "How ancient natural dyeing techniques in Kano continue to tell stories of trans-Saharan trade and artisanal resilience.",
        content: `For over five centuries, the Kofar Mata Dye Pits in Kano have remained in continuous operation. Founded in 1498 during the reign of Sarki Muhammadu Rumfa, these earthen pits have witnessed the rise, transformation, and enduring dignity of trans-Saharan commerce.

Walking onto the grounds of Kofar Mata, the scent of fermented indigo, potassium, and ash rises from the circular pits carved deep into the earth. The master dyers—many tracing their craft through unbroken family lineages—lower hand-woven cotton fabrics into the dark vats with rhythmic precision.

Here, indigo is not merely a pigment; it is living chemistry and memory. Different tie-and-dye patterns carried distinct social meanings across West Africa and the Sahara: from protective geometric designs worn by noble cavalry to intricate patterns treasured across desert trade networks.

A visit to Kofar Mata is an invitation to look past modern synthetic speed and experience craft where time itself is an ingredient.`,
        coverImageUrl: "/kano-editorial.jpg",
        authorName: "Kano Heritage Fellow",
        category: "Living Craft",
        tags: ["Kano", "History", "Craft", "Textiles"],
        isPublished: true,
      },
      {
        slug: "ancient-city-walls-modern-crossroads",
        title: "From Ancient City Walls to Modern Crossroads",
        summary: "Exploring the defensive earthworks of Kano and what architectural heritage teaches modern travelers.",
        content: `Built between 1095 and 1134 under Sarki Gijimasu and completed in later centuries, the Ancient Kano City Walls once enclosed 24 square kilometers of farms, residential quarters, and markets.

Standing beside the remaining earthen bastions today, one perceives the sheer scale of medieval Hausa civil engineering. The gates—known as Kofofi—were not just defensive checkpoints; they were cultural thresholds through which camel caravans from Tripoli, Timbuktu, and Cairo brought manuscripts, spices, and copperware, returning with Kano leather, dyed cloth, and grain.

Understanding Kano through its walls transforms how we see contemporary African urban life—not as a recent creation, but as a civilization with deep municipal roots.`,
        coverImageUrl: "/kano-editorial.jpg",
        authorName: "Heritage Research Associate",
        category: "Architecture",
        tags: ["Architecture", "Heritage", "Nigeria"],
        isPublished: true,
      },
      {
        slug: "trans-saharan-echoes-kano-cairo-marrakech",
        title: "Trans-Saharan Echoes: Linking Kano to Cairo and Marrakech",
        summary: "Why true international travel begins with understanding historical corridors that connected West Africa to the Mediterranean.",
        content: `Long before modern borders and commercial flights, scholarly and trade caravans navigated the Sahel and Sahara. Kano served as a premier southern terminal in this trans-continental network.

Scholars from Kano exchanged treatises with intellectual circles in Cairo’s Al-Azhar, while Moroccan merchants frequented the Kurmi Market. Moroccan leatherwork often had its origins in northern Nigerian tanneries, prized across Europe as 'Morocco leather'.

When we travel from Kano to Cairo, Marrakech, or Istanbul today, we are not exploring disconnected tourist stops. We are tracing the historical memory of routes that bound cultures together across sand, stone, and centuries.`,
        coverImageUrl: "/cairo-editorial.jpg",
        authorName: "Editorial Team",
        category: "Historical Perspectives",
        tags: ["Trade Routes", "Sahara", "Cultural Journeys"],
        isPublished: true,
      },
    ]);
  }

  // Seed FAQs if empty
  const [existingFaq] = await db.select({ id: faqsTable.id }).from(faqsTable).limit(1);
  if (!existingFaq) {
    await db.insert(faqsTable).values([
      {
        question: "How do journeys with From Kano to the World differ from standard tour packages?",
        answer: "Our journeys are curated through a museum and cultural heritage lens. Rather than superficial sightseeing, we focus on deep historical context, architecture, living artisanal traditions, and meaningful exchanges with local custodians.",
        category: "Philosophy",
        sortOrder: 1,
        isPublished: true,
      },
      {
        question: "Can tours be customized for private groups or solo travelers?",
        answer: "Yes. All our published itineraries serve as conceptual frameworks. We offer tailored private journeys with flexible dates, bespoke research focus, and specialized local guides.",
        category: "Booking & Flexibility",
        sortOrder: 2,
        isPublished: true,
      },
      {
        question: "How are accommodations and transport arranged?",
        answer: "We select boutique heritage lodgings and comfortable, secure private transport that reflect the character of each destination, ensuring seamless travel and peace of mind.",
        category: "Logistics",
        sortOrder: 3,
        isPublished: true,
      },
      {
        question: "What is the booking and reservation process?",
        answer: "You can submit an inquiry or a booking reservation directly on our platform. Our journey concierge will verify dates, discuss preferences, and issue a formal reservation confirmation with verified payment instructions.",
        category: "Booking & Flexibility",
        sortOrder: 4,
        isPublished: true,
      },
    ]);
  }

  // Seed Gallery Images if empty
  const [existingGallery] = await db.select({ id: galleryImagesTable.id }).from(galleryImagesTable).limit(1);
  if (!existingGallery) {
    await db.insert(galleryImagesTable).values([
      {
        title: "Dyeing the Indigo Cloth",
        location: "Kano, Nigeria",
        imageUrl: "/kano-editorial.jpg",
        category: "Craft",
        caption: "Centuries of indigo alchemy at the Kofar Mata Dye Pits.",
        isFeatured: true,
        sortOrder: 1,
      },
      {
        title: "Historic Minarets and Alleys",
        location: "Cairo, Egypt",
        imageUrl: "/cairo-editorial.jpg",
        category: "Architecture",
        caption: "Architectural layers spanning Mamluk and Ottoman eras.",
        isFeatured: true,
        sortOrder: 2,
      },
      {
        title: "Medina Courtyards & Zellige",
        location: "Marrakech, Morocco",
        imageUrl: "/marrakech-editorial.jpg",
        category: "Culture",
        caption: "Intricate tilework and shaded courtyards in historic riads.",
        isFeatured: true,
        sortOrder: 3,
      },
      {
        title: "Bosphorus Crossroads",
        location: "Istanbul, Türkiye",
        imageUrl: "/istanbul-editorial.jpg",
        category: "Landscapes",
        caption: "Where historic sea passages connect two continents.",
        isFeatured: true,
        sortOrder: 4,
      },
    ]);
  }

  // Ensure administrator profile is seeded
  await db
    .insert(userProfilesTable)
    .values({ clerkUserId: "admin_yusufhussaini", role: "admin" })
    .onConflictDoUpdate({
      target: userProfilesTable.clerkUserId,
      set: { role: "admin", updatedAt: new Date() },
    });

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
