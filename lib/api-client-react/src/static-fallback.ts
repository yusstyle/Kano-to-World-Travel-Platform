import type {
  Tour,
  TourCard,
  Destination,
  DestinationDetail,
  BlogPost,
  FaqItem,
  GalleryImage,
  Booking,
  InquiryItem,
  SiteContent,
  HomeContent,
  TourList,
} from "./generated/api.schemas";

const STORAGE_KEYS = {
  SITE_CONTENT: "kano_site_content_v2",
  DESTINATIONS: "kano_destinations_v2",
  TOURS: "kano_tours_v2",
  BOOKINGS: "kano_bookings_v2",
  INQUIRIES: "kano_inquiries_v2",
  BLOG: "kano_blog_v2",
  FAQS: "kano_faqs_v2",
  GALLERY: "kano_gallery_v2",
};

const DEFAULT_SITE_CONTENT: SiteContent = {
  founderName: "A Kano-based professional working in culture and history",
  founderBio:
    "A Kano-based professional working in culture and history, with experience at Kano Museum sharing Kano’s history and heritage.",
  founderImageUrl: "/kano-editorial.jpg",
};

const DEFAULT_DESTINATIONS: DestinationDetail[] = [
  {
    id: 1,
    slug: "kano",
    name: "Kano",
    country: "Nigeria",
    region: "Kano State",
    description:
      "A northern Nigerian city with a deep cultural history, ancient mud walls, living indigo dye pits, and enduring Sahelian trade traditions.",
    imageUrl: "/kano-editorial.jpg",
    gallery: ["/kano-editorial.jpg"],
    bestTimeToVisit: "November to February",
    languages: ["Hausa", "English", "Arabic"],
    currencyCode: "NGN",
    travelNotes: "Dress modestly and respect historical custodians when visiting heritage quarters.",
    isFeatured: true,
    isDemo: false,
    tourCount: 1,
  },
  {
    id: 2,
    slug: "cairo",
    name: "Cairo",
    country: "Egypt",
    region: null,
    description:
      "A historic metropolis on the Nile shaped by centuries of scholarship, Mamluk architecture, and trans-Saharan cultural connections.",
    imageUrl: "/cairo-editorial.jpg",
    gallery: ["/cairo-editorial.jpg"],
    bestTimeToVisit: "October to April",
    languages: ["Arabic", "English"],
    currencyCode: "EGP",
    travelNotes: "Ideal for cultural travelers interested in trans-Saharan intellectual and architectural exchanges.",
    isFeatured: true,
    isDemo: true,
    tourCount: 1,
  },
  {
    id: 3,
    slug: "marrakech",
    name: "Marrakech",
    country: "Morocco",
    region: null,
    description:
      "A North African imperial city renowned for its historic medina, intricate leather craftsmanship, and centuries-old caravan trade ties with Kano.",
    imageUrl: "/marrakech-editorial.jpg",
    gallery: ["/marrakech-editorial.jpg"],
    bestTimeToVisit: "March to May & September to November",
    languages: ["Arabic", "Berber", "French"],
    currencyCode: "MAD",
    travelNotes: "Explore the historic souks and tanneries to trace artisanal links to West African leatherwork.",
    isFeatured: true,
    isDemo: true,
    tourCount: 1,
  },
  {
    id: 4,
    slug: "istanbul",
    name: "Istanbul",
    country: "Türkiye",
    region: null,
    description:
      "A crossroads of continents and civilisations where trans-continental trade and Islamic scholarship converged over a millennium.",
    imageUrl: "/istanbul-editorial.jpg",
    gallery: ["/istanbul-editorial.jpg"],
    bestTimeToVisit: "April to June & September to November",
    languages: ["Turkish", "English"],
    currencyCode: "TRY",
    travelNotes: "A journey bridging the Mediterranean and the wider Muslim world.",
    isFeatured: true,
    isDemo: true,
    tourCount: 1,
  },
];

const DEFAULT_TOURS: Tour[] = [
  {
    id: 1,
    slug: "kano-heritage-discovery",
    title: "Kano Heritage Discovery",
    destination: "Kano",
    country: "Nigeria",
    region: "Kano State",
    durationDays: 3,
    category: "Historical & Heritage",
    tourType: "flexible",
    priceAmount: 450,
    priceCurrency: "USD",
    availabilityStatus: "scheduled",
    imageUrl: "/kano-editorial.jpg",
    summary:
      "An immersive 3-day exploration of Kano's ancient city walls, 500-year-old Kofar Mata indigo dye pits, Kurmi Market, and Gidan Makama Museum.",
    description:
      "Rooted in Kano's deep historiography, this curated journey guides travelers through living artisanal quarters, architectural earthworks, and palace history with specialized local custodians.",
    highlights: [
      "Guided walk through the 500-year-old Kofar Mata Dye Pits",
      "Historical lecture and tour of the Ancient Kano City Walls and Kofofi",
      "Curated tour of Gidan Makama Museum and Emir's Palace architecture",
      "Visit to Kurmi Market, historic hub of trans-Saharan trade",
    ],
    itinerary: [
      {
        day: 1,
        title: "The Living Indigo & Kofar Mata",
        description: "Meet master dyers at Kofar Mata Dye Pits, founded in 1498, and discover the traditional chemistry of natural indigo dyeing.",
        location: "Kofar Mata, Kano",
      },
      {
        day: 2,
        title: "City Walls & Medieval Fortifications",
        description: "Survey the earthen ramparts of the Ancient Kano City Walls built under Sarki Gijimasu and examine the historic gates.",
        location: "Old City, Kano",
      },
      {
        day: 3,
        title: "Gidan Makama & The Trade Crossroads",
        description: "Explore the 15th-century palace architecture of Gidan Makama Museum and the bustling lanes of historic Kurmi Market.",
        location: "Kurmi Market & Gidan Makama, Kano",
      },
    ],
    included: [
      "Expert cultural historian guide",
      "All entrance fees and site access permits",
      "Private ground transport in Kano",
      "Traditional welcome lunch and artisanal tea ceremony",
    ],
    notIncluded: [
      "International flights to Kano (KAN)",
      "Travel insurance",
      "Personal purchases",
    ],
    isFeatured: true,
    isDemo: false,
    isPublished: true,
  },
  {
    id: 2,
    slug: "cairo-layers-of-history",
    title: "Cairo: Layers of History",
    destination: "Cairo",
    country: "Egypt",
    region: null,
    durationDays: 4,
    category: "Historical & Heritage",
    tourType: "flexible",
    priceAmount: 850,
    priceCurrency: "USD",
    availabilityStatus: "inquiry_only",
    imageUrl: "/cairo-editorial.jpg",
    summary:
      "Trace the historic and scholarly links between West African scholarship and Cairo’s Al-Azhar quarter, Islamic architectural monuments, and the Nile.",
    description:
      "Connect landmarks with their wider Mediterranean and Saharan contexts, examining manuscripts, trade linkages, and architectural evolution across the city.",
    highlights: [
      "Explore historic Islamic Cairo and Al-Azhar complex",
      "Examine the architectural geometry of Sultan Hassan mosque",
      "Study trans-Saharan trade goods and records at local archives",
    ],
    itinerary: [
      {
        day: 1,
        title: "Historic Cairo & Al-Azhar",
        description: "Walk the historic corridors of Islamic Cairo and learn about centuries of scholarly exchange with Kano.",
        location: "Old Cairo",
      },
      {
        day: 2,
        title: "The Citadel & Mamluk Grandeur",
        description: "Explore the Citadel of Saladin and the grand madrasas of Sultan Hassan and Al-Rifa'i.",
        location: "Citadel District, Cairo",
      },
      {
        day: 3,
        title: "Coptic Cairo & River Heritage",
        description: "A cultural exploration along the ancient riverbanks and churches of Old Cairo.",
        location: "Coptic Cairo",
      },
      {
        day: 4,
        title: "Markets & Craft Traditions",
        description: "Khan el-Khalili market lanes and traditional brass and copper artisan workshops.",
        location: "Khan el-Khalili",
      },
    ],
    included: ["Licensed Egyptologist guide", "Private air-conditioned transport", "Site entrance tickets"],
    notIncluded: ["International airfare", "Meals not specified"],
    isFeatured: true,
    isDemo: true,
    isPublished: true,
  },
  {
    id: 3,
    slug: "marrakech-culture-and-craft",
    title: "Marrakech: Culture & Craft",
    destination: "Marrakech",
    country: "Morocco",
    region: null,
    durationDays: 3,
    category: "Cultural Experiences",
    tourType: "flexible",
    priceAmount: 620,
    priceCurrency: "USD",
    availabilityStatus: "inquiry_only",
    imageUrl: "/marrakech-editorial.jpg",
    summary:
      "Explore Marrakech through its artisan souks, historic riads, and the leatherwork routes linking northern Nigeria to Moroccan tanneries.",
    description:
      "Discover the shared artisanal roots and material culture that connected Hausa leather crafters to North African leather masters for hundreds of years.",
    highlights: [
      "Trace the history of 'Morocco leather' back to northern Nigerian tanneries",
      "Private access to traditional riad architecture and zellige workshops",
      "Curated guided tours of Bahia Palace and Medersa Ben Youssef",
    ],
    itinerary: [
      {
        day: 1,
        title: "The Medina & Architectural Courtyards",
        description: "Survey the historic Medina, Bahia Palace, and intricate zellige tile designs.",
        location: "Medina, Marrakech",
      },
      {
        day: 2,
        title: "Tanneries & Material Histories",
        description: "Visit traditional leather dye pits and understand trans-Saharan leather trade connections.",
        location: "Bab Debbagh Tanneries",
      },
      {
        day: 3,
        title: "Gardens & Cultural Life",
        description: "Explore Majorelle Garden, the Berber Museum, and culinary craft.",
        location: "Gueliz & Medina",
      },
    ],
    included: ["Private cultural guide", "Entry permits", "Tea and pastry tasting"],
    notIncluded: ["Flights", "Personal expenses"],
    isFeatured: true,
    isDemo: true,
    isPublished: true,
  },
  {
    id: 4,
    slug: "istanbul-historic-crossroads",
    title: "Istanbul: Historic Crossroads",
    destination: "Istanbul",
    country: "Türkiye",
    region: null,
    durationDays: 4,
    category: "Historical & Heritage",
    tourType: "flexible",
    priceAmount: 890,
    priceCurrency: "USD",
    availabilityStatus: "inquiry_only",
    imageUrl: "/istanbul-editorial.jpg",
    summary:
      "A grand narrative of waterways, minarets, imperial caravanserais, and the meeting of Mediterranean and Asian heritage.",
    description:
      "An architectural and historical inquiry into the crossroads of continents, with visits to Hagia Sophia, Topkapi Palace, the Grand Bazaar, and Bosphorus maritime heritage.",
    highlights: [
      "Hagia Sophia and Blue Mosque historical comparative tour",
      "Topkapi Palace imperial libraries and relic rooms",
      "Bosphorus private cultural cruise exploring waterfront trade mansions",
    ],
    itinerary: [
      {
        day: 1,
        title: "Sultanahmet Imperial Heart",
        description: "Hagia Sophia, Hippodrome monuments, and the Basilica Cistern.",
        location: "Sultanahmet, Istanbul",
      },
      {
        day: 2,
        title: "Palace Archives & Bazaars",
        description: "Topkapi Palace grounds and the centuries-old Grand Bazaar.",
        location: "Fatih, Istanbul",
      },
      {
        day: 3,
        title: "Bosphorus Straits & Maritime History",
        description: "Historical voyage across European and Asian shorelines.",
        location: "Bosphorus Strait",
      },
      {
        day: 4,
        title: "Ottoman Architecture & Artisans",
        description: "Süleymaniye Mosque complex and craft ateliers.",
        location: "Süleymaniye, Istanbul",
      },
    ],
    included: ["Expert guide", "Maritime transport", "Museum passes"],
    notIncluded: ["Flights", "Visa fees"],
    isFeatured: true,
    isDemo: true,
    isPublished: true,
  },
];

const DEFAULT_BLOG_POSTS: BlogPost[] = [
  {
    id: 1,
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
    createdAt: "2026-09-15T10:00:00Z",
  },
  {
    id: 2,
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
    createdAt: "2026-09-20T10:00:00Z",
  },
  {
    id: 3,
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
    createdAt: "2026-09-28T10:00:00Z",
  },
];

const DEFAULT_FAQS: FaqItem[] = [
  {
    id: 1,
    question: "How do journeys with From Kano to the World differ from standard tour packages?",
    answer: "Our journeys are curated through a museum and cultural heritage lens. Rather than superficial sightseeing, we focus on deep historical context, architecture, living artisanal traditions, and meaningful exchanges with local custodians.",
    category: "Philosophy",
    sortOrder: 1,
    isPublished: true,
  },
  {
    id: 2,
    question: "Can tours be customized for private groups or solo travelers?",
    answer: "Yes. All our published itineraries serve as conceptual frameworks. We offer tailored private journeys with flexible dates, bespoke research focus, and specialized local guides.",
    category: "Booking & Flexibility",
    sortOrder: 2,
    isPublished: true,
  },
  {
    id: 3,
    question: "How are accommodations and transport arranged?",
    answer: "We select boutique heritage lodgings and comfortable, secure private transport that reflect the character of each destination, ensuring seamless travel and peace of mind.",
    category: "Logistics",
    sortOrder: 3,
    isPublished: true,
  },
  {
    id: 4,
    question: "What is the booking and reservation process?",
    answer: "You can submit an inquiry or a booking reservation directly on our platform. Our journey concierge will verify dates, discuss preferences, and issue a formal reservation confirmation with verified payment instructions.",
    category: "Booking & Flexibility",
    sortOrder: 4,
    isPublished: true,
  },
];

const DEFAULT_GALLERY: GalleryImage[] = [
  {
    id: 1,
    title: "Dyeing the Indigo Cloth",
    location: "Kano, Nigeria",
    imageUrl: "/kano-editorial.jpg",
    category: "Craft",
    caption: "Centuries of indigo alchemy at the Kofar Mata Dye Pits.",
    isFeatured: true,
    sortOrder: 1,
  },
  {
    id: 2,
    title: "Historic Minarets and Alleys",
    location: "Cairo, Egypt",
    imageUrl: "/cairo-editorial.jpg",
    category: "Architecture",
    caption: "Architectural layers spanning Mamluk and Ottoman eras.",
    isFeatured: true,
    sortOrder: 2,
  },
  {
    id: 3,
    title: "Medina Courtyards & Zellige",
    location: "Marrakech, Morocco",
    imageUrl: "/marrakech-editorial.jpg",
    category: "Culture",
    caption: "Intricate tilework and shaded courtyards in historic riads.",
    isFeatured: true,
    sortOrder: 3,
  },
  {
    id: 4,
    title: "Bosphorus Crossroads",
    location: "Istanbul, Türkiye",
    imageUrl: "/istanbul-editorial.jpg",
    category: "Landscapes",
    caption: "Where historic sea passages connect two continents.",
    isFeatured: true,
    sortOrder: 4,
  },
];

const DEFAULT_BOOKINGS: Booking[] = [
  {
    id: 1,
    bookingReference: "KANO-941824",
    tourId: 1,
    tourTitle: "Kano Heritage Discovery",
    destinationName: "Kano, Nigeria",
    customerName: "Amina Bello",
    customerEmail: "amina.bello@example.com",
    customerPhone: "+234 803 123 4567",
    travelDate: "2026-11-15",
    travelers: 2,
    totalAmount: 900,
    currency: "USD",
    status: "confirmed",
    specialRequests: "Interested in meeting master indigo dyers and exploring family genealogy.",
    createdAt: "2026-10-01T14:22:00Z",
  },
  {
    id: 2,
    bookingReference: "KANO-941825",
    tourId: 2,
    tourTitle: "Cairo: Layers of History",
    destinationName: "Cairo, Egypt",
    customerName: "Ibrahim Mansur",
    customerEmail: "ibrahim.mansur@example.com",
    customerPhone: "+234 802 987 6543",
    travelDate: "2026-12-05",
    travelers: 1,
    totalAmount: 850,
    currency: "USD",
    status: "pending",
    specialRequests: "Focus on Al-Azhar manuscript libraries and historic madrasas.",
    createdAt: "2026-10-05T09:15:00Z",
  },
];

const DEFAULT_INQUIRIES: InquiryItem[] = [
  {
    id: 1,
    name: "Dr. Fatima Zubairu",
    email: "fatima.zubairu@example.org",
    phone: "+44 7700 900123",
    subject: "Private University Group Tour to Kano & Sahara Corridor",
    message: "Planning a bespoke 10-day research study trip for 6 postgraduate students focusing on Sahelian civil engineering and ancient walls.",
    status: "in_progress",
    createdAt: "2026-10-04T11:45:00Z",
  },
  {
    id: 2,
    name: "Tariq Al-Hassan",
    email: "tariq.alhassan@example.com",
    phone: "+971 50 123 4567",
    subject: "Custom Family Cultural Tour in Kano & Marrakech",
    message: "We would like to book a private tour for a family of 4 in early January, exploring artisan textile and leather workshops.",
    status: "new",
    createdAt: "2026-10-07T16:30:00Z",
  },
];

// Helper to read/write localStorage
function getStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    }
    return JSON.parse(raw);
  } catch {
    return defaultValue;
  }
}

function setStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

export function handleStaticFallback<T = unknown>(
  url: string,
  method: string,
  bodyInit?: BodyInit | null,
): T | undefined {
  if (typeof window === "undefined") return undefined;

  let pathname = url;
  let searchParams = new URLSearchParams();
  try {
    const parsed = new URL(url, window.location.origin);
    pathname = parsed.pathname;
    searchParams = parsed.searchParams;
  } catch {
    const parts = url.split("?");
    pathname = parts[0];
    if (parts[1]) searchParams = new URLSearchParams(parts[1]);
  }

  // Parse body if JSON
  let body: any = {};
  if (typeof bodyInit === "string" && bodyInit.trim().startsWith("{")) {
    try {
      body = JSON.parse(bodyInit);
    } catch {
      body = {};
    }
  }

  // 1. Health check & Upload
  if (pathname === "/api/health") {
    return { status: "ok" } as T;
  }

  if (pathname === "/api/admin/upload" && method === "POST") {
    return {
      url: body.data || "/kano-editorial.jpg",
      filename: body.filename || "upload.jpg",
      size: body.data ? body.data.length : 0,
    } as T;
  }

  // 2. Authentication
  if (pathname === "/api/auth/me" && method === "GET") {
    const adminEmail = (localStorage.getItem("admin_email") || "").trim().toLowerCase();
    const adminToken = localStorage.getItem("admin_token");
    const isAuthedAdmin = adminEmail === "yusufhussaini0904@gmail.com" && Boolean(adminToken);

    return {
      clerkUserId: isAuthedAdmin ? "admin_yusufhussaini" : "guest",
      role: isAuthedAdmin ? "admin" : "customer",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      canInitializeAdmin: false,
    } as T;
  }

  if (pathname === "/api/auth/admin-login" && method === "POST") {
    const email = (body.email || "").trim().toLowerCase();
    if (email === "yusufhussaini0904@gmail.com") {
      const token = `vercel_admin_${Date.now()}`;
      localStorage.setItem("admin_token", token);
      localStorage.setItem("admin_email", "yusufhussaini0904@gmail.com");
      localStorage.setItem("admin_role", "admin");
      return { token, email: "yusufhussaini0904@gmail.com" } as T;
    }
    const err = new Error("Invalid administrator email address.");
    (err as any).status = 401;
    throw err;
  }

  if (pathname === "/api/auth/admin-logout" && method === "POST") {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_email");
    localStorage.removeItem("admin_role");
    return { success: true } as T;
  }

  // 3. Site Content
  if ((pathname === "/api/site-content" || pathname === "/api/admin/site-content") && method === "GET") {
    return getStorage<SiteContent>(STORAGE_KEYS.SITE_CONTENT, DEFAULT_SITE_CONTENT) as T;
  }

  if (pathname === "/api/admin/site-content" && (method === "PUT" || method === "POST")) {
    const current = getStorage<SiteContent>(STORAGE_KEYS.SITE_CONTENT, DEFAULT_SITE_CONTENT);
    const updated: SiteContent = {
      founderName: body.founderName ?? current.founderName,
      founderBio: body.founderBio ?? current.founderBio,
      founderImageUrl: body.founderImageUrl ?? current.founderImageUrl,
    };
    setStorage(STORAGE_KEYS.SITE_CONTENT, updated);
    return updated as T;
  }

  // 4. Homepage
  if (pathname === "/api/home" && method === "GET") {
    const content = getStorage<SiteContent>(STORAGE_KEYS.SITE_CONTENT, DEFAULT_SITE_CONTENT);
    const destinations = getStorage<DestinationDetail[]>(STORAGE_KEYS.DESTINATIONS, DEFAULT_DESTINATIONS);
    const tours = getStorage<Tour[]>(STORAGE_KEYS.TOURS, DEFAULT_TOURS);

    const homeData: HomeContent = {
      founderName: content.founderName,
      founderBio: content.founderBio,
      founderImageUrl: content.founderImageUrl,
      experienceCategories: [
        "Historical & Heritage",
        "Cultural Experiences",
        "Living Craft",
        "Architectural History",
        "Scholarly Routes",
      ],
      featuredDestinations: destinations.filter((d) => d.isFeatured),
      featuredTours: tours.filter((t) => t.isFeatured).map((t) => ({
        id: t.id,
        slug: t.slug,
        title: t.title,
        destination: t.destination,
        country: t.country,
        durationDays: t.durationDays,
        category: t.category,
        tourType: t.tourType,
        priceAmount: t.priceAmount,
        priceCurrency: t.priceCurrency,
        availabilityStatus: t.availabilityStatus,
        imageUrl: t.imageUrl,
        summary: t.summary,
        isFeatured: t.isFeatured,
        isDemo: t.isDemo,
      })),
    };
    return homeData as T;
  }

  // 5. Destinations
  if (pathname === "/api/destinations" && method === "GET") {
    return getStorage<DestinationDetail[]>(STORAGE_KEYS.DESTINATIONS, DEFAULT_DESTINATIONS) as T;
  }

  if (pathname.startsWith("/api/destinations/") && method === "GET") {
    const slug = pathname.replace("/api/destinations/", "").toLowerCase();
    const destinations = getStorage<DestinationDetail[]>(STORAGE_KEYS.DESTINATIONS, DEFAULT_DESTINATIONS);
    const match = destinations.find((d) => d.slug.toLowerCase() === slug) || destinations[0];
    return match as T;
  }

  if (pathname === "/api/admin/destinations" && method === "GET") {
    return getStorage<DestinationDetail[]>(STORAGE_KEYS.DESTINATIONS, DEFAULT_DESTINATIONS) as T;
  }

  if (pathname === "/api/admin/destinations" && method === "POST") {
    const destinations = getStorage<DestinationDetail[]>(STORAGE_KEYS.DESTINATIONS, DEFAULT_DESTINATIONS);
    const newId = (destinations.reduce((max, d) => Math.max(max, d.id), 0) || 0) + 1;
    const newDest: DestinationDetail = {
      id: newId,
      slug: body.slug || `destination-${newId}`,
      name: body.name || "New Destination",
      country: body.country || "Nigeria",
      region: body.region || null,
      description: body.description || "",
      imageUrl: body.imageUrl || "/kano-editorial.jpg",
      gallery: body.gallery || ["/kano-editorial.jpg"],
      bestTimeToVisit: body.bestTimeToVisit || null,
      languages: body.languages || ["English"],
      currencyCode: body.currencyCode || null,
      travelNotes: body.travelNotes || null,
      isFeatured: Boolean(body.isFeatured),
      isDemo: Boolean(body.isDemo),
      tourCount: 0,
    };
    destinations.unshift(newDest);
    setStorage(STORAGE_KEYS.DESTINATIONS, destinations);
    return newDest as T;
  }

  if (pathname.startsWith("/api/admin/destinations/") && method === "DELETE") {
    const id = Number(pathname.replace("/api/admin/destinations/", ""));
    const destinations = getStorage<DestinationDetail[]>(STORAGE_KEYS.DESTINATIONS, DEFAULT_DESTINATIONS);
    const filtered = destinations.filter((d) => d.id !== id);
    setStorage(STORAGE_KEYS.DESTINATIONS, filtered);
    return { success: true } as T;
  }

  // 6. Tours
  if (pathname === "/api/tours" && method === "GET") {
    const tours = getStorage<Tour[]>(STORAGE_KEYS.TOURS, DEFAULT_TOURS);
    const q = (searchParams.get("q") || "").toLowerCase();
    const dest = (searchParams.get("destination") || "").toLowerCase();
    const cat = (searchParams.get("category") || "").toLowerCase();
    const type = (searchParams.get("tourType") || "").toLowerCase();

    let filtered = tours;
    if (q) {
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.summary.toLowerCase().includes(q) ||
          t.destination.toLowerCase().includes(q),
      );
    }
    if (dest) {
      filtered = filtered.filter((t) => t.destination.toLowerCase().includes(dest));
    }
    if (cat) {
      filtered = filtered.filter((t) => t.category.toLowerCase().includes(cat));
    }
    if (type) {
      filtered = filtered.filter((t) => t.tourType.toLowerCase() === type);
    }

    const cards: TourCard[] = filtered.map((t) => ({
      id: t.id,
      slug: t.slug,
      title: t.title,
      destination: t.destination,
      country: t.country,
      durationDays: t.durationDays,
      category: t.category,
      tourType: t.tourType,
      priceAmount: t.priceAmount,
      priceCurrency: t.priceCurrency,
      availabilityStatus: t.availabilityStatus,
      imageUrl: t.imageUrl,
      summary: t.summary,
      isFeatured: t.isFeatured,
      isDemo: t.isDemo,
    }));

    const result: TourList = {
      items: cards,
      total: cards.length,
      page: 1,
      pageSize: 12,
      totalPages: 1,
    };
    return result as T;
  }

  if (pathname.startsWith("/api/tours/") && method === "GET") {
    const slug = pathname.replace("/api/tours/", "").toLowerCase();
    const tours = getStorage<Tour[]>(STORAGE_KEYS.TOURS, DEFAULT_TOURS);
    const match = tours.find((t) => t.slug.toLowerCase() === slug) || tours[0];
    return match as T;
  }

  if (pathname === "/api/admin/tours" && method === "GET") {
    return getStorage<Tour[]>(STORAGE_KEYS.TOURS, DEFAULT_TOURS) as T;
  }

  if (pathname === "/api/admin/tours" && method === "POST") {
    const tours = getStorage<Tour[]>(STORAGE_KEYS.TOURS, DEFAULT_TOURS);
    const destinations = getStorage<DestinationDetail[]>(STORAGE_KEYS.DESTINATIONS, DEFAULT_DESTINATIONS);
    const dest = destinations.find((d) => d.id === body.destinationId) || destinations[0];

    const newId = (tours.reduce((max, t) => Math.max(max, t.id), 0) || 0) + 1;
    const newTour: Tour = {
      id: newId,
      slug: body.slug || `tour-${newId}`,
      title: body.title || "New Journey",
      destination: dest.name,
      country: dest.country,
      region: dest.region,
      durationDays: Number(body.durationDays) || 2,
      category: body.category || "Historical & Heritage",
      tourType: body.tourType || "flexible",
      priceAmount: body.priceAmount ? Number(body.priceAmount) : null,
      priceCurrency: body.priceCurrency || "USD",
      availabilityStatus: body.availabilityStatus || "scheduled",
      imageUrl: body.imageUrl || "/kano-editorial.jpg",
      summary: body.summary || "",
      description: body.description || "",
      highlights: body.highlights || ["Cultural discovery", "Guided historical walks"],
      itinerary: body.itinerary || [
        { day: 1, title: "Arrival & Orientation", description: "Welcome and initial discovery.", location: dest.name },
      ],
      included: body.included || ["Professional guide", "Site access permits"],
      notIncluded: body.notIncluded || ["Personal expenses"],
      isFeatured: Boolean(body.isFeatured),
      isDemo: Boolean(body.isDemo),
      isPublished: true,
    };
    tours.unshift(newTour);
    setStorage(STORAGE_KEYS.TOURS, tours);
    return newTour as T;
  }

  if (pathname.startsWith("/api/admin/tours/") && method === "DELETE") {
    const id = Number(pathname.replace("/api/admin/tours/", ""));
    const tours = getStorage<Tour[]>(STORAGE_KEYS.TOURS, DEFAULT_TOURS);
    const filtered = tours.filter((t) => t.id !== id);
    setStorage(STORAGE_KEYS.TOURS, filtered);
    return { success: true } as T;
  }

  // 7. Bookings
  if (pathname === "/api/admin/bookings" && method === "GET") {
    return getStorage<Booking[]>(STORAGE_KEYS.BOOKINGS, DEFAULT_BOOKINGS) as T;
  }

  if (pathname === "/api/bookings" && method === "POST") {
    const bookings = getStorage<Booking[]>(STORAGE_KEYS.BOOKINGS, DEFAULT_BOOKINGS);
    const tours = getStorage<Tour[]>(STORAGE_KEYS.TOURS, DEFAULT_TOURS);
    const tour = tours.find((t) => t.id === body.tourId) || tours[0];

    const newId = (bookings.reduce((max, b) => Math.max(max, b.id), 0) || 0) + 1;
    const ref = `KANO-${Math.floor(100000 + Math.random() * 900000)}`;
    const newBooking: Booking = {
      id: newId,
      bookingReference: ref,
      tourId: tour.id,
      tourTitle: tour.title,
      destinationName: `${tour.destination}, ${tour.country}`,
      customerName: body.customerName || "Customer",
      customerEmail: body.customerEmail || "",
      customerPhone: body.customerPhone || null,
      travelDate: body.travelDate || "2026-12-01",
      travelers: Number(body.travelers) || 2,
      totalAmount: tour.priceAmount ? tour.priceAmount * (Number(body.travelers) || 1) : null,
      currency: tour.priceCurrency || "USD",
      status: "pending",
      specialRequests: body.specialRequests || null,
      createdAt: new Date().toISOString(),
    };
    bookings.unshift(newBooking);
    setStorage(STORAGE_KEYS.BOOKINGS, bookings);
    return {
      id: newBooking.id,
      message: "Your booking reservation request has been received.",
      bookingReference: ref,
    } as T;
  }

  if (pathname.startsWith("/api/admin/bookings/") && method === "PATCH") {
    const id = Number(pathname.replace("/api/admin/bookings/", ""));
    const bookings = getStorage<Booking[]>(STORAGE_KEYS.BOOKINGS, DEFAULT_BOOKINGS);
    const booking = bookings.find((b) => b.id === id);
    if (booking && body.status) {
      booking.status = body.status;
      setStorage(STORAGE_KEYS.BOOKINGS, bookings);
      return booking as T;
    }
    return booking as T;
  }

  // 8. Inquiries / Contact
  if (pathname === "/api/admin/inquiries" && method === "GET") {
    return getStorage<InquiryItem[]>(STORAGE_KEYS.INQUIRIES, DEFAULT_INQUIRIES) as T;
  }

  if (pathname === "/api/contact" && method === "POST") {
    const inquiries = getStorage<InquiryItem[]>(STORAGE_KEYS.INQUIRIES, DEFAULT_INQUIRIES);
    const newId = (inquiries.reduce((max, i) => Math.max(max, i.id), 0) || 0) + 1;
    const newInquiry: InquiryItem = {
      id: newId,
      name: body.name || "Inquirer",
      email: body.email || "",
      phone: body.phone || null,
      subject: body.subject || "General Inquiry",
      message: body.message || "",
      status: "new",
      createdAt: new Date().toISOString(),
    };
    inquiries.unshift(newInquiry);
    setStorage(STORAGE_KEYS.INQUIRIES, inquiries);
    return {
      id: newId,
      message: "Thank you for reaching out. A journey specialist will be in touch shortly.",
    } as T;
  }

  if (pathname.startsWith("/api/admin/inquiries/") && method === "PATCH") {
    const id = Number(pathname.replace("/api/admin/inquiries/", ""));
    const inquiries = getStorage<InquiryItem[]>(STORAGE_KEYS.INQUIRIES, DEFAULT_INQUIRIES);
    const inquiry = inquiries.find((i) => i.id === id);
    if (inquiry && body.status) {
      inquiry.status = body.status;
      setStorage(STORAGE_KEYS.INQUIRIES, inquiries);
      return inquiry as T;
    }
    return inquiry as T;
  }

  // 9. Newsletter
  if (pathname === "/api/newsletter" && method === "POST") {
    return {
      id: 1,
      message: "Thank you for subscribing to Letters from the Road.",
    } as T;
  }

  // 10. Blog
  if (pathname === "/api/blog" && method === "GET") {
    return getStorage<BlogPost[]>(STORAGE_KEYS.BLOG, DEFAULT_BLOG_POSTS) as T;
  }

  if (pathname.startsWith("/api/blog/") && method === "GET") {
    const slug = pathname.replace("/api/blog/", "").toLowerCase();
    const posts = getStorage<BlogPost[]>(STORAGE_KEYS.BLOG, DEFAULT_BLOG_POSTS);
    const post = posts.find((p) => p.slug.toLowerCase() === slug) || posts[0];
    return post as T;
  }

  // 11. FAQs
  if (pathname === "/api/faqs" && method === "GET") {
    return getStorage<FaqItem[]>(STORAGE_KEYS.FAQS, DEFAULT_FAQS) as T;
  }

  if (pathname === "/api/admin/faqs" && method === "POST") {
    const faqs = getStorage<FaqItem[]>(STORAGE_KEYS.FAQS, DEFAULT_FAQS);
    const newId = (faqs.reduce((max, f) => Math.max(max, f.id), 0) || 0) + 1;
    const newFaq: FaqItem = {
      id: newId,
      question: body.question || "FAQ Question",
      answer: body.answer || "FAQ Answer",
      category: body.category || "General",
      sortOrder: faqs.length + 1,
      isPublished: true,
    };
    faqs.push(newFaq);
    setStorage(STORAGE_KEYS.FAQS, faqs);
    return newFaq as T;
  }

  // 12. Gallery
  if (pathname === "/api/gallery" && method === "GET") {
    return getStorage<GalleryImage[]>(STORAGE_KEYS.GALLERY, DEFAULT_GALLERY) as T;
  }

  if (pathname === "/api/admin/gallery" && method === "POST") {
    const gallery = getStorage<GalleryImage[]>(STORAGE_KEYS.GALLERY, DEFAULT_GALLERY);
    const newId = (gallery.reduce((max, g) => Math.max(max, g.id), 0) || 0) + 1;
    const newItem: GalleryImage = {
      id: newId,
      title: body.title || "Archive Photograph",
      location: body.location || "Kano, Nigeria",
      imageUrl: body.imageUrl || "/kano-editorial.jpg",
      category: body.category || "Culture",
      caption: body.caption || null,
      isFeatured: true,
      sortOrder: gallery.length + 1,
    };
    gallery.unshift(newItem);
    setStorage(STORAGE_KEYS.GALLERY, gallery);
    return newItem as T;
  }

  return undefined;
}

