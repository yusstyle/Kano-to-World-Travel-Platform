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
  SITE_CONTENT: "kano_site_content_v4",
  DESTINATIONS: "kano_destinations_v4",
  TOURS: "kano_tours_v4",
  BOOKINGS: "kano_bookings_v4",
  INQUIRIES: "kano_inquiries_v4",
  BLOG: "kano_blog_v4",
  FAQS: "kano_faqs_v4",
  GALLERY: "kano_gallery_v4",
};

const DEFAULT_SITE_CONTENT: SiteContent = {
  founderName: "A Kano-based professional working in culture and history",
  founderBio:
    "A Kano-based professional working in culture and history, with experience at Kano Museum sharing Kano’s history and heritage.",
  founderImageUrl: "/founder.jpg",
};

const DEFAULT_DESTINATIONS: DestinationDetail[] = [
  {
    id: 1,
    slug: "kano",
    name: "Kano",
    country: "Nigeria",
    region: "Kano State",
    description:
      "An ancient northern Nigerian city with a thousand years of history, defensive mud walls, 500-year-old indigo dye pits, and enduring Sahelian caravan trade traditions.",
    imageUrl: "/kano-editorial.jpg",
    gallery: ["/kano-editorial.jpg", "/gidan-makama-hero.jpg"],
    bestTimeToVisit: "November to February",
    languages: ["Hausa", "English", "Arabic"],
    currencyCode: "NGN",
    travelNotes: "Dress modestly and respect historical custodians when visiting heritage quarters and royal courtyards.",
    isFeatured: true,
    isDemo: false,
    tourCount: 3,
  },
  {
    id: 2,
    slug: "cairo",
    name: "Cairo",
    country: "Egypt",
    region: "Nile Valley",
    description:
      "A grand historic metropolis on the Nile shaped by the Pyramids of Giza, Mamluk minarets, ancient scholarship at Al-Azhar, and trans-Saharan cultural connections.",
    imageUrl: "/cairo-editorial.jpg",
    gallery: ["/cairo-editorial.jpg", "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=1200&q=80"],
    bestTimeToVisit: "October to April",
    languages: ["Arabic", "English"],
    currencyCode: "EGP",
    travelNotes: "Ideal for cultural travelers interested in trans-Saharan intellectual and architectural exchanges and ancient Nile civilisations.",
    isFeatured: true,
    isDemo: false,
    tourCount: 2,
  },
  {
    id: 3,
    slug: "marrakech",
    name: "Marrakech",
    country: "Morocco",
    region: "High Atlas & Sahara",
    description:
      "A vibrant North African imperial city renowned for its labyrinthine medina, zellige courtyards, traditional leather tanneries, and centuries-old caravan ties to Kano.",
    imageUrl: "/marrakech-editorial.jpg",
    gallery: ["/marrakech-editorial.jpg", "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80"],
    bestTimeToVisit: "March to May & September to November",
    languages: ["Arabic", "Berber", "French"],
    currencyCode: "MAD",
    travelNotes: "Explore the historic souks and tanneries to trace artisanal links to West African leatherwork and desert caravans.",
    isFeatured: true,
    isDemo: false,
    tourCount: 2,
  },
  {
    id: 4,
    slug: "istanbul",
    name: "Istanbul",
    country: "Türkiye",
    region: "Marmara",
    description:
      "The legendary crossroads of continents and civilisations where trans-continental maritime routes, Byzantine splendour, and Ottoman architectural mastery converge.",
    imageUrl: "/istanbul-editorial.jpg",
    gallery: ["/istanbul-editorial.jpg", "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1200&q=80"],
    bestTimeToVisit: "April to June & September to November",
    languages: ["Turkish", "English"],
    currencyCode: "TRY",
    travelNotes: "A magnificent journey bridging Europe and Asia, linking Mediterranean trade to the Silk and Spice routes.",
    isFeatured: true,
    isDemo: false,
    tourCount: 2,
  },
  {
    id: 5,
    slug: "zanzibar",
    name: "Zanzibar",
    country: "Tanzania",
    region: "Swahili Coast",
    description:
      "An exotic spice archipelago in the Indian Ocean where ancient Swahili maritime trade, carved Arabian doorways, clove plantations, and turquoise waters meet.",
    imageUrl: "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=1200&q=80",
    gallery: ["https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=1200&q=80"],
    bestTimeToVisit: "June to October & December to February",
    languages: ["Swahili", "English", "Arabic"],
    currencyCode: "TZS",
    travelNotes: "Unmissable for ocean lovers and heritage travelers fascinated by Indian Ocean dhow navigation and spice trade history.",
    isFeatured: true,
    isDemo: false,
    tourCount: 1,
  },
  {
    id: 6,
    slug: "dubai",
    name: "Dubai & Abu Dhabi",
    country: "United Arab Emirates",
    region: "Arabian Gulf",
    description:
      "A glittering meeting of golden desert sands, Arabian Gulf pearl-diving traditions, futuristic skyline architecture, and world-class luxury cultural institutions.",
    imageUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80",
    gallery: ["https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1200&q=80"],
    bestTimeToVisit: "November to March",
    languages: ["Arabic", "English"],
    currencyCode: "AED",
    travelNotes: "Combines high-end desert safaris with visits to the Louvre Abu Dhabi and Sheikh Zayed Grand Mosque.",
    isFeatured: true,
    isDemo: false,
    tourCount: 1,
  },
  {
    id: 7,
    slug: "andalusia",
    name: "Granada & Cordoba",
    country: "Spain",
    region: "Andalusia",
    description:
      "The jewel of Moorish European civilization, where the Alhambra palace, the Mezquita's forest of horseshoe arches, and flamenco traditions echo centuries of shared Mediterranean history.",
    imageUrl: "https://images.unsplash.com/photo-1596706900424-64df87ba4ce2?auto=format&fit=crop&w=1200&q=80",
    gallery: ["https://images.unsplash.com/photo-1596706900424-64df87ba4ce2?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1562979314-bee7453e938c?auto=format&fit=crop&w=1200&q=80"],
    bestTimeToVisit: "April to June & September to October",
    languages: ["Spanish", "English"],
    currencyCode: "EUR",
    travelNotes: "Explore the pinnacle of medieval Islamic architecture and palace garden design in southern Europe.",
    isFeatured: true,
    isDemo: false,
    tourCount: 1,
  },
  {
    id: 8,
    slug: "maasai-mara",
    name: "Maasai Mara & Serengeti",
    country: "Kenya & Tanzania",
    region: "East African Rift",
    description:
      "One of the world’s greatest natural wonders, renowned for the Great Migration, boundless golden savannahs, the Big Five, and centuries-old pastoralist culture.",
    imageUrl: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80",
    gallery: ["https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=1200&q=80"],
    bestTimeToVisit: "July to October (Migration) & December to March",
    languages: ["Swahili", "Maa", "English"],
    currencyCode: "KES",
    travelNotes: "An unforgettable safari adventure staying in luxury eco-lodges with expert local guides.",
    isFeatured: true,
    isDemo: false,
    tourCount: 1,
  },
  {
    id: 9,
    slug: "alula",
    name: "AlUla & The Ancient Incense Route",
    country: "Saudi Arabia",
    region: "Medina Province",
    description:
      "An extraordinary open-air museum set amid sandstone canyons, boasting UNESCO-listed Hegra rock tombs, ancient Dadanite ruins, and desert astronomy.",
    imageUrl: "https://images.unsplash.com/photo-1578895210405-907db486c111?auto=format&fit=crop&w=1200&q=80",
    gallery: ["https://images.unsplash.com/photo-1578895210405-907db486c111?auto=format&fit=crop&w=1200&q=80"],
    bestTimeToVisit: "October to April",
    languages: ["Arabic", "English"],
    currencyCode: "SAR",
    travelNotes: "Monumental rock-carved architecture along the ancient frankincense and caravan route.",
    isFeatured: true,
    isDemo: false,
    tourCount: 1,
  },
  {
    id: 10,
    slug: "cape-town",
    name: "Cape Town",
    country: "South Africa",
    region: "Western Cape",
    description:
      "A breathtaking coastal city where the Atlantic and Indian Oceans meet beneath dramatic Table Mountain, offering rich Cape Malay cultural heritage and scenic coastal drives.",
    imageUrl: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=1200&q=80",
    gallery: ["https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=1200&q=80"],
    bestTimeToVisit: "November to March",
    languages: ["English", "Afrikaans", "Xhosa"],
    currencyCode: "ZAR",
    travelNotes: "Spectacular ocean views, cableway excursions, and visits to the historic Bo-Kaap colorful quarter.",
    isFeatured: true,
    isDemo: false,
    tourCount: 1,
  },
];

const DEFAULT_TOURS: Tour[] = [
  {
    id: 1,
    slug: "kano-heritage-discovery",
    title: "Kano Heritage Discovery & Royal Durbar",
    destination: "Kano",
    country: "Nigeria",
    region: "Kano State",
    durationDays: 3,
    category: "Cultural & Heritage",
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
    title: "Cairo & The Pyramids: 5,000 Years of Civilization",
    destination: "Cairo",
    country: "Egypt",
    region: "Nile Valley",
    durationDays: 4,
    category: "World Heritage",
    tourType: "flexible",
    priceAmount: 850,
    priceCurrency: "USD",
    availabilityStatus: "scheduled",
    imageUrl: "/cairo-editorial.jpg",
    summary:
      "From the Pyramids of Giza to the medieval minarets of Islamic Cairo and ancient scholarship corridors along the Nile.",
    description:
      "An architectural and cultural survey of Cairo, examining trans-Saharan intellectual exchanges between West Africa and Egypt, Mamluk madrasas, and ancient wonders.",
    highlights: [
      "Private guided tour of the Great Pyramids of Giza & Sphinx",
      "Survey of Islamic Cairo, Al-Azhar Mosque, and manuscript archives",
      "Evening private Nile felucca cultural cruise",
      "Curated walkthrough of the Grand Egyptian Museum and Khan el-Khalili bazaar",
    ],
    itinerary: [
      {
        day: 1,
        title: "Monuments of Antiquity: Giza Plateau",
        description: "Explore the Great Pyramids, Sphinx, and solar boat archives with Egyptology custodians.",
        location: "Giza Plateau",
      },
      {
        day: 2,
        title: "Medieval Minarets & Trans-Saharan Scholars",
        description: "Walk through Bab Zuweila, Sultan Hassan Mosque, and Al-Azhar historic courtyards.",
        location: "Islamic Cairo",
      },
      {
        day: 3,
        title: "Treasures of the Grand Egyptian Museum",
        description: "Survey pharaonic artifacts and royal treasures followed by an archival lecture.",
        location: "Giza / New Cairo",
      },
      {
        day: 4,
        title: "The Living Nile & Spice Corridors",
        description: "Felucca boat journey at sunset and private access to historic spice ateliers in Khan el-Khalili.",
        location: "Nile River & Khan el-Khalili",
      },
    ],
    included: ["Licensed Egyptologist guide", "Private air-conditioned transport", "Site entrance tickets", "Private felucca sail"],
    notIncluded: ["International flights", "Egyptian entry visa", "Gratuities"],
    isFeatured: true,
    isDemo: false,
    isPublished: true,
  },
  {
    id: 3,
    slug: "marrakech-craft-caravan",
    title: "Marrakech & Erg Chebbi Sahara Desert Bivouac",
    destination: "Marrakech",
    country: "Morocco",
    region: "High Atlas & Sahara",
    durationDays: 5,
    category: "Desert Expeditions",
    tourType: "flexible",
    priceAmount: 980,
    priceCurrency: "USD",
    availabilityStatus: "scheduled",
    imageUrl: "/marrakech-editorial.jpg",
    summary:
      "Trace ancient caravan trade corridors from the imperial medina of Marrakech across the High Atlas Mountains into the singing dunes of the Sahara.",
    description:
      "Discover the shared artisanal roots and material culture that connected Hausa leather crafters to North African leather masters for hundreds of years, culminating in a luxury Sahara desert camp experience.",
    highlights: [
      "Trace the history of 'Morocco leather' back to northern Nigerian tanneries at Bab Debbagh",
      "Private access to traditional riad architecture, zellige workshops, and Bahia Palace",
      "Scenic crossing of the Tizi n'Tichka pass in the High Atlas Mountains",
      "Camel trek and luxury desert bivouac under the starry Sahara sky at Erg Chebbi",
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
        title: "Into the Atlas & Kasbahs",
        description: "Ascend the High Atlas Mountains and explore the ancient clay fortress of Ait Benhaddou.",
        location: "Ait Benhaddou & Ouarzazate",
      },
      {
        day: 4,
        title: "Sahara Dunes & Starlit Desert Camp",
        description: "Arrive at Erg Chebbi dunes for sunset camel voyage and traditional Gnawa desert music.",
        location: "Erg Chebbi, Merzouga",
      },
      {
        day: 5,
        title: "Return Through Rose Valleys",
        description: "Morning sunrise over the sand dunes and scenic journey back to Marrakech.",
        location: "Dades Valley to Marrakech",
      },
    ],
    included: ["Private 4x4 expedition transport", "Cultural guide", "Luxury Sahara tent with private facilities", "Traditional Moroccan dining"],
    notIncluded: ["Flights to Marrakech (RAK)", "Personal expenses"],
    isFeatured: true,
    isDemo: false,
    isPublished: true,
  },
  {
    id: 4,
    slug: "istanbul-historic-crossroads",
    title: "Istanbul: Historic Crossroads of Continents",
    destination: "Istanbul",
    country: "Türkiye",
    region: "Marmara",
    durationDays: 4,
    category: "World Heritage",
    tourType: "flexible",
    priceAmount: 890,
    priceCurrency: "USD",
    availabilityStatus: "scheduled",
    imageUrl: "/istanbul-editorial.jpg",
    summary:
      "A grand narrative of waterways, minarets, imperial caravanserais, and the meeting of Mediterranean, Asian, and African heritage.",
    description:
      "An architectural and historical inquiry into the crossroads of continents, with visits to Hagia Sophia, Topkapi Palace, the Grand Bazaar, and private Bosphorus maritime heritage sailing.",
    highlights: [
      "Hagia Sophia and Blue Mosque historical comparative tour",
      "Topkapi Palace imperial libraries, relic rooms, and harem quarters",
      "Bosphorus private cultural cruise exploring waterfront trade mansions",
      "Private walkthrough of the Grand Bazaar and Spice Market craft ateliers",
    ],
    itinerary: [
      {
        day: 1,
        title: "Sultanahmet Imperial Heart",
        description: "Hagia Sophia, Hippodrome monuments, and the underground Basilica Cistern.",
        location: "Sultanahmet, Istanbul",
      },
      {
        day: 2,
        title: "Palace Archives & Ottoman Grandeur",
        description: "Topkapi Palace grounds, imperial collections, and Süleymaniye Mosque complex.",
        location: "Fatih, Istanbul",
      },
      {
        day: 3,
        title: "Bosphorus Straits & Maritime Crossroads",
        description: "Historical voyage across European and Asian shorelines with maritime historian.",
        location: "Bosphorus Strait",
      },
      {
        day: 4,
        title: "Living Bazaars & Silk Road Artisans",
        description: "Centuries-old ateliers of the Grand Bazaar and traditional Turkish tea ceremony.",
        location: "Grand Bazaar & Eminönü",
      },
    ],
    included: ["Expert licensed historian guide", "Private yacht cruise on Bosphorus", "All museum entry passes", "Culinary tastings"],
    notIncluded: ["Flights to Istanbul (IST)", "Visa fees"],
    isFeatured: true,
    isDemo: false,
    isPublished: true,
  },
  {
    id: 5,
    slug: "zanzibar-spice-island",
    title: "Zanzibar Spice Island & Swahili Stone Town",
    destination: "Zanzibar",
    country: "Tanzania",
    region: "Swahili Coast",
    durationDays: 5,
    category: "Coastal & Island Retreats",
    tourType: "flexible",
    priceAmount: 1150,
    priceCurrency: "USD",
    availabilityStatus: "scheduled",
    imageUrl: "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=1200&q=80",
    summary:
      "Explore the labyrinth of Stone Town, historic spice plantations, carved Arabian doors, and turquoise Indian Ocean waters on traditional dhow boats.",
    description:
      "Trace the maritime trading routes that linked the African continent to Arabia and India. Stay in boutique heritage properties in Stone Town and unwind along pristine coral beaches.",
    highlights: [
      "Walking historical tour of Stone Town, House of Wonders, and the Sultan's Palace",
      "Sensory tour of organic clove, nutmeg, and vanilla plantations",
      "Sunset sailing voyage aboard a handcrafted Swahili wooden dhow",
      "Snorkeling over coral reefs at Mnemba Atoll with marine conservationists",
    ],
    itinerary: [
      { day: 1, title: "Stone Town Historical Thresholds", description: "Wander limestone alleys, admire carved brass-studded doors, and visit the Old Fort.", location: "Stone Town" },
      { day: 2, title: "Spice Routes & Living Botanical Heritage", description: "Visit rural spice estates to smell, taste, and understand centuries of spice trade.", location: "Kizimbani Spice Plantations" },
      { day: 3, title: "Prison Island & Ocean Dhow Sailing", description: "Sail to Changuu Island to meet giant Aldabra tortoises and cruise at sunset.", location: "Indian Ocean" },
      { day: 4, title: "Turquoise Shores & Coral Reefs", description: "Relax on Nungwi's white sand beaches and snorkel crystal waters.", location: "Nungwi Beach" },
      { day: 5, title: "Swahili Culinary & Farewell", description: "Seafood lunch and Swahili cooking masterclass before departure.", location: "Stone Town" },
    ],
    included: ["Private boutique heritage hotel stays", "Private transfers", "Dhow boat charter", "Guided spice tour"],
    notIncluded: ["Flights to Zanzibar (ZNZ)", "Personal expenses"],
    isFeatured: true,
    isDemo: false,
    isPublished: true,
  },
  {
    id: 6,
    slug: "dubai-desert-gulf-voyage",
    title: "Dubai Desert Oasis & Arabian Gulf Cultural Expedition",
    destination: "Dubai & Abu Dhabi",
    country: "United Arab Emirates",
    region: "Arabian Gulf",
    durationDays: 4,
    category: "Desert Expeditions",
    tourType: "flexible",
    priceAmount: 1250,
    priceCurrency: "USD",
    availabilityStatus: "scheduled",
    imageUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80",
    summary:
      "A journey through Arabian desert dunes, falconry traditions, historic creek abra boats, and the stunning Louvre Abu Dhabi on the Gulf.",
    description:
      "Experience the blend of timeless Bedouin desert heritage and visionary modern architecture, linking trans-Saharan trade history to the maritime trade of the Arabian Gulf.",
    highlights: [
      "Heritage desert safari with vintage Land Rovers, falconry, and Bedouin dinner",
      "Historic Al Fahidi cultural quarter, Dubai Creek abra ride, and gold/spice souks",
      "Full-day excursion to Abu Dhabi: Sheikh Zayed Grand Mosque & Louvre Abu Dhabi",
      "Architectural survey of the Museum of the Future and Burj Khalifa panoramas",
    ],
    itinerary: [
      { day: 1, title: "Old Dubai & The Maritime Creek", description: "Explore Al Fahidi, traditional wind-tower architecture, and spice souks.", location: "Old Dubai" },
      { day: 2, title: "The Royal Desert Conservation Reserve", description: "Luxury desert safari, Arabian oryx tracking, stargazing, and traditional feast.", location: "Dubai Desert Reserve" },
      { day: 3, title: "Abu Dhabi Cultural Day", description: "Visit the monumental Sheikh Zayed Mosque and the universal galleries of Louvre Abu Dhabi.", location: "Abu Dhabi" },
      { day: 4, title: "Modern Vistas & Farewell", description: "Visit the Museum of the Future and experience high tea overlooking the skyline.", location: "Downtown Dubai" },
    ],
    included: ["Luxury 5-star hotel accommodations", "Private executive transport", "Desert safari & dinner", "Louvre Abu Dhabi entry"],
    notIncluded: ["International flights", "UAE tourist visa"],
    isFeatured: true,
    isDemo: false,
    isPublished: true,
  },
  {
    id: 7,
    slug: "andalusia-moorish-alhambra",
    title: "Moorish Andalusia: The Alhambra & Cordoba Corridor",
    destination: "Granada & Cordoba",
    country: "Spain",
    region: "Andalusia",
    durationDays: 5,
    category: "World Heritage",
    tourType: "flexible",
    priceAmount: 1450,
    priceCurrency: "USD",
    availabilityStatus: "scheduled",
    imageUrl: "https://images.unsplash.com/photo-1596706900424-64df87ba4ce2?auto=format&fit=crop&w=1200&q=80",
    summary:
      "Discover the pinnacle of Moorish architectural elegance in Granada's Alhambra, the Great Mosque of Cordoba, and whitewashed Albayzín hillside alleys.",
    description:
      "Explore the historic corridor of Al-Andalus, tracing the intellectual, agricultural, and aesthetic connections that bound southern Spain, North Africa, and the trans-Saharan world for eight centuries.",
    highlights: [
      "VIP private access to the Nasrid Palaces and Generalife Gardens at the Alhambra",
      "Guided walk through the 856 red-and-white double arches of the Great Mosque of Cordoba",
      "Sunset vistas over the Alhambra from the medieval Moorish quarter of Albayzín",
      "Visit to the ruins of Madinat al-Zahra, the lost caliphal palace-city of Cordoba",
    ],
    itinerary: [
      { day: 1, title: "Arrival in Granada & The Albayzín", description: "Check in to a restored Carmencita and wander cobblestone streets with views of the snowcapped Sierra Nevada.", location: "Albayzín, Granada" },
      { day: 2, title: "The Alhambra: Court of the Lions", description: "Full-day immersion in Nasrid architecture, intricate stucco arabesques, and courtyards.", location: "Alhambra Palace" },
      { day: 3, title: "Scenic Olive Route to Cordoba", description: "Private transfer through rolling Andalusian olive groves to the ancient caliphal capital.", location: "Granada to Cordoba" },
      { day: 4, title: "The Mezquita & Judería Quarter", description: "Stand in awe beneath the horseshoe arches of the Mezquita and explore floral courtyards.", location: "Cordoba Historic Center" },
      { day: 5, title: "Madinat al-Zahra & Farewell", description: "Explore the 10th-century caliph's city and olive oil tasting before departure.", location: "Madinat al-Zahra" },
    ],
    included: ["Boutique historic hotel lodgings", "All Alhambra & Mezquita reserved passes", "Private guide", "Intercity private transfer"],
    notIncluded: ["Flights to Malaga / Madrid", "Schengen visa"],
    isFeatured: true,
    isDemo: false,
    isPublished: true,
  },
  {
    id: 8,
    slug: "maasai-mara-great-migration",
    title: "Maasai Mara Wildlife Safari & Great Rift Valley",
    destination: "Maasai Mara & Serengeti",
    country: "Kenya & Tanzania",
    region: "East African Rift",
    durationDays: 5,
    category: "Wildlife & Safaris",
    tourType: "flexible",
    priceAmount: 1750,
    priceCurrency: "USD",
    availabilityStatus: "scheduled",
    imageUrl: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80",
    summary:
      "A thrilling safari across the golden plains of the Maasai Mara, tracking lions, elephants, leopards, and witnessing the legendary Great Migration.",
    description:
      "Stay in eco-luxury tented safari camps nestled in private conservancies. Enjoy daily sunrise game drives with certified Maasai naturalist guides and visit traditional bomas.",
    highlights: [
      "Daily open-roof 4x4 game drives in prime wildlife sectors",
      "Witnessing huge herds of wildebeest and zebras crossing the Mara River",
      "Guided bush walk with Maasai warriors learning tracking and medicinal botany",
      "Optional hot air balloon flight with champagne breakfast over the savanna",
    ],
    itinerary: [
      { day: 1, title: "Great Rift Valley to the Mara", description: "Scenic flight or overland transfer from Nairobi past Mount Longonot to the reserve.", location: "Great Rift Valley" },
      { day: 2, title: "Big Cats & Predator Territory", description: "Full-day safari searching for prides of lions, cheetahs, and leopards.", location: "Maasai Mara Reserve" },
      { day: 3, title: "The Mara River & Migration Trails", description: "Observe crocodiles and hippos along the Mara River crossings.", location: "Mara River" },
      { day: 4, title: "Maasai Cultural Encounter & Bush Walk", description: "Visit a traditional community boma and learn ancient pastoralist wisdom.", location: "Mara Conservancy" },
      { day: 5, title: "Sunrise Safari & Return", description: "Early morning game drive catching golden light, followed by transfer to Nairobi.", location: "Nairobi" },
    ],
    included: ["Luxury tented camp with full board", "Safari Land Cruiser with pop-up roof", "Park entrance fees", "Professional tracker"],
    notIncluded: ["International flights to Nairobi (NBO)", "Hot air balloon safari upgrade"],
    isFeatured: true,
    isDemo: false,
    isPublished: true,
  },
  {
    id: 9,
    slug: "alula-ancient-incense-trails",
    title: "AlUla Ancient Nabataean Incense Trails",
    destination: "AlUla & The Ancient Incense Route",
    country: "Saudi Arabia",
    region: "Medina Province",
    durationDays: 4,
    category: "World Heritage",
    tourType: "flexible",
    priceAmount: 1650,
    priceCurrency: "USD",
    availabilityStatus: "scheduled",
    imageUrl: "https://images.unsplash.com/photo-1578895210405-907db486c111?auto=format&fit=crop&w=1200&q=80",
    summary:
      "Journey deep into the dramatic desert sandstone canyons of Hegra, ancient Dadan, and the mirrored architectural wonder of Maraya.",
    description:
      "Experience Saudi Arabia's premier UNESCO World Heritage destination. Marvel at monumental tombs carved directly into golden sandstone cliffs along the historic incense and frankincense trade route.",
    highlights: [
      "Private guided excursion through the rock-cut tombs of Hegra (Mada'in Salih)",
      "Tour of ancient Dadan and the Lion Tombs of the Lihyanite kingdom",
      "Architectural visit to Maraya, the world's largest mirrored building, and Old Town AlUla",
      "Stargazing experience in the tranquil desert canyon of Gharameel",
    ],
    itinerary: [
      { day: 1, title: "Arrival in the Oasis of AlUla", description: "Check in to luxury canyon villas and witness sunset at Elephant Rock.", location: "Jabal AlFil, AlUla" },
      { day: 2, title: "Hegra: The Southern Sister of Petra", description: "Explore over 110 remarkably preserved monumental tombs carved by the Nabataeans.", location: "Hegra UNESCO Site" },
      { day: 3, title: "Dadan, Jabal Ikmah & Old Town", description: "Decode thousands of pre-Arabic rock inscriptions and wander mudbrick lanes.", location: "Dadan & Old Town" },
      { day: 4, title: "Maraya Architecture & Oasis Walk", description: "Stroll beneath towering date palms and marvel at modern mirror architecture.", location: "AlUla Oasis" },
    ],
    included: ["Luxury resort accommodation", "Private 4WD desert vehicle", "Expert heritage storyteller guide", "All site permits"],
    notIncluded: ["Flights to AlUla (ULH)", "Saudi tourist visa"],
    isFeatured: true,
    isDemo: false,
    isPublished: true,
  },
  {
    id: 10,
    slug: "cape-town-two-oceans",
    title: "Cape Town: Table Mountain & Two Oceans Explorer",
    destination: "Cape Town",
    country: "South Africa",
    region: "Western Cape",
    durationDays: 5,
    category: "Coastal & Island Retreats",
    tourType: "flexible",
    priceAmount: 1350,
    priceCurrency: "USD",
    availabilityStatus: "scheduled",
    imageUrl: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=1200&q=80",
    summary:
      "From the summit of Table Mountain to the Cape of Good Hope, penguin colonies, and the colorful spice heritage of the historic Bo-Kaap.",
    description:
      "A magnificent coastal adventure on the southern tip of the African continent. Discover dramatic ocean panoramas, maritime history, and the unique Cape Malay cultural heritage.",
    highlights: [
      "Cableway ascent to the summit plateau of Table Mountain",
      "Scenic coastal drive along Chapman's Peak to the Cape of Good Hope",
      "Visiting the African penguin colony at Boulders Beach",
      "Walking cultural and culinary food tour in historic Bo-Kaap",
    ],
    itinerary: [
      { day: 1, title: "Table Mountain & City Bowl", description: "Ascend Table Mountain for 360-degree views of the city and Atlantic Ocean.", location: "Table Mountain" },
      { day: 2, title: "Cape Peninsula & Two Oceans", description: "Drive Chapman's Peak, visit Cape Point, and meet penguins at Boulders Beach.", location: "Cape Point" },
      { day: 3, title: "Bo-Kaap & Cape Malay Heritage", description: "Wander brightly colored streets and take a private Cape Malay cooking workshop.", location: "Bo-Kaap" },
      { day: 4, title: "Kirstenbosch & Constantia Valley", description: "Walk the canopy walkway at Kirstenbosch Botanical Gardens.", location: "Kirstenbosch" },
      { day: 5, title: "Robben Island & Waterfront", description: "Historical ferry excursion to Robben Island museum and farewell dinner.", location: "V&A Waterfront" },
    ],
    included: ["Boutique waterfront hotel", "Table Mountain cable car passes", "Private vehicle & driver", "All entrance fees"],
    notIncluded: ["Flights to Cape Town (CPT)", "Personal expenses"],
    isFeatured: true,
    isDemo: false,
    isPublished: true,
  },
  {
    id: 11,
    slug: "ancient-walls-sahelian-architecture",
    title: "Ancient Walls & Sahelian Earth Architecture",
    destination: "Kano",
    country: "Nigeria",
    region: "Kano State",
    durationDays: 4,
    category: "World Heritage",
    tourType: "flexible",
    priceAmount: 600,
    priceCurrency: "USD",
    availabilityStatus: "scheduled",
    imageUrl: "/kano-editorial.jpg",
    summary:
      "A specialized survey of the medieval mud fortifications, Kofofi city gates, Gidan Rumfa royal palace, and Sahelian earth engineering.",
    description:
      "A deep architectural journey examining 1,000 years of earthen architecture and urban planning in northern Nigeria, guided by conservation specialists and local master masons.",
    highlights: [
      "Field survey of surviving ramparts at Kofar Waika and Kofar Dawanau",
      "Private access to 15th-century palace earth arches and Gidan Rumfa courtyards",
      "Masterclass with traditional Tubali earth-brick builders",
      "Comparative lecture on trans-Saharan defensive architecture",
    ],
    itinerary: [
      { day: 1, title: "The 11th-Century Foundations", description: "Survey the earthen bastions of Sarki Gijimasu and early defensive lines.", location: "Ancient Kano City Walls" },
      { day: 2, title: "City Gates & Caravanserais", description: "Examine key historic Kofofi gates and Kurmi Market distribution nodes.", location: "Old City, Kano" },
      { day: 3, title: "Royal Courtyards & Palaces", description: "Architectural study of Gidan Makama and Emir's Palace earthen facades.", location: "Emir's Palace & Gidan Makama" },
      { day: 4, title: "Living Craft & Masons", description: "Observe living earth masonry and preservation initiatives.", location: "Old City Artisan Quarters" },
    ],
    included: ["Expert architectural historian guide", "All ground transport", "Conservation workshop fees", "Curated meals"],
    notIncluded: ["Flights", "Personal expenses"],
    isFeatured: true,
    isDemo: false,
    isPublished: true,
  },
  {
    id: 12,
    slug: "zaria-queen-amina-fortresses",
    title: "Zaria: Queen Amina's Fortresses & Citadels",
    destination: "Zaria",
    country: "Nigeria",
    region: "Kaduna State",
    durationDays: 2,
    category: "Cultural & Heritage",
    tourType: "flexible",
    priceAmount: 380,
    priceCurrency: "USD",
    availabilityStatus: "scheduled",
    imageUrl: "/kano-editorial.jpg",
    summary:
      "Journey south from Kano along historic trade corridors to Queen Amina's legendary 16th-century earthen walls and scholarly quarters in Zaria.",
    description:
      "Experience the storied history of the kingdom of Zazzau, the monumental military earthworks erected by warrior Queen Amina, and centuries-old Islamic scholastic traditions.",
    highlights: [
      "Guided walk along Queen Amina's earthen ramparts (Ganuwar Amina)",
      "Tour of the Emir of Zazzau's Palace and traditional Hausa vaulted architecture",
      "Visit to Barewa College and historical academic institutions",
      "Traditional pottery and leathercraft guild demonstrations",
    ],
    itinerary: [
      { day: 1, title: "From Kano to Zazzau", description: "Scenic transfer south through Sahelian savannah to ancient Zaria; survey Ganuwar Amina.", location: "Zaria Walls & Gates" },
      { day: 2, title: "Royal Architecture & Living Heritage", description: "Visit Emir's Palace, historical courtyards, and traditional artisans before return transfer.", location: "Zaria City" },
    ],
    included: ["Private executive vehicle transport from Kano", "Heritage custodian guide", "Palace permits", "Traditional lunch"],
    notIncluded: ["Flights", "Personal expenses"],
    isFeatured: true,
    isDemo: false,
    isPublished: true,
  },
  {
    id: 13,
    slug: "cappadocia-bosphorus-grand-tour",
    title: "Cappadocia Fairy Chimneys & Bosphorus Grand Tour",
    destination: "Istanbul",
    country: "Türkiye",
    region: "Central Anatolia & Istanbul",
    durationDays: 6,
    category: "World Heritage",
    tourType: "flexible",
    priceAmount: 1350,
    priceCurrency: "USD",
    availabilityStatus: "scheduled",
    imageUrl: "https://images.unsplash.com/photo-1608037521244-f1c6c7635294?auto=format&fit=crop&w=1200&q=80",
    summary:
      "Combine the imperial grandeur of Istanbul with the surreal landscapes, cave dwellings, and sunrise hot air balloons of Cappadocia.",
    description:
      "An unforgettable journey across Anatolia, from the Byzantine and Ottoman palaces of the Bosphorus to the rock-hewn underground cities and fairy chimneys of Cappadocia.",
    highlights: [
      "Sunrise hot air balloon flight over the moonscape valleys of Göreme",
      "Guided exploration of the underground city of Derinkuyu and rock churches",
      "Luxury cave hotel experience carved into ancient volcanic tuff",
      "Private boat cruise on the Bosphorus dividing Europe and Asia",
    ],
    itinerary: [
      { day: 1, title: "Imperial Istanbul Monuments", description: "Hagia Sophia, Blue Mosque, and Topkapi Palace.", location: "Istanbul" },
      { day: 2, title: "Bosphorus Cruise & Flight to Cappadocia", description: "Morning boat cruise along the Bosphorus; afternoon flight to Kayseri.", location: "Istanbul to Cappadocia" },
      { day: 3, title: "Sunrise Balloons & Göreme Open Air Museum", description: "Float above fairy chimneys at sunrise followed by visits to Byzantine frescoed cave churches.", location: "Göreme, Cappadocia" },
      { day: 4, title: "Underground Cities & Pigeon Valley", description: "Descend into multi-level subterranean cities and hike Rose Valley.", location: "Derinkuyu & Uçhisar" },
      { day: 5, title: "Anatolian Pottery & Carpet Guilds", description: "Master pottery workshops along the Red River in Avanos.", location: "Avanos" },
      { day: 6, title: "Return to Istanbul & Farewell", description: "Morning scenic flight back to Istanbul for final bazaar shopping.", location: "Istanbul" },
    ],
    included: ["Luxury cave resort stay", "Domestic Turkish flights", "Hot air balloon flight ticket", "Private guides"],
    notIncluded: ["International flights", "Personal purchases"],
    isFeatured: true,
    isDemo: false,
    isPublished: true,
  },
  {
    id: 14,
    slug: "trans-saharan-indigo-craft",
    title: "Trans-Saharan Living Craft & Master Indigo Workshop",
    destination: "Kano",
    country: "Nigeria",
    region: "Kano State",
    durationDays: 3,
    category: "Living Craft & Artisans",
    tourType: "flexible",
    priceAmount: 500,
    priceCurrency: "USD",
    availabilityStatus: "scheduled",
    imageUrl: "/kano-editorial.jpg",
    summary:
      "Hands-on masterclass with fifth-generation natural indigo dyers, leather artisans, and textile weavers in ancient craft guilds.",
    description:
      "A rare opportunity for textile enthusiasts, designers, and cultural travelers to learn the 500-year-old natural fermentation chemistry of Kofar Mata and take home hand-dyed bespoke textiles.",
    highlights: [
      "Private workshop with master dyers at the 1498 Kofar Mata pits",
      "Learn traditional tie-dye resist patterns (Kallabi, Dan Kano, Gidan Sarki)",
      "Behind-the-scenes access to leather guild ateliers and brass casting in Kurmi Market",
      "Personalized hand-dyed textile souvenir tailored with master dyers",
    ],
    itinerary: [
      { day: 1, title: "The Chemistry of Indigo", description: "Learn about natural indigo plant fermentation, ash preparation, and vat dipping.", location: "Kofar Mata Pits" },
      { day: 2, title: "Pattern Creation & Hand Dyeing", description: "Create your own patterns and lower fabrics into centuries-old earthen pits.", location: "Kofar Mata & Dala" },
      { day: 3, title: "Textile Beating & Guild Walk", description: "Observe rhythmic wooden mallet beating giving indigo its metallic luster.", location: "Old City Guilds" },
    ],
    included: ["All workshop materials and natural dyes", "Master artisan fees", "Traditional meals", "Private transport"],
    notIncluded: ["Flights", "Accommodation (can be arranged)"],
    isFeatured: true,
    isDemo: false,
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
  // --- Living Craft ---
  {
    id: 1,
    title: "Centuries of Indigo Dyeing",
    location: "Kano, Nigeria",
    imageUrl: "/kano-editorial.jpg",
    category: "Living Craft",
    caption: "Generations of indigo alchemy at the famous Kofar Mata Dye Pits, operating continuously since 1498.",
    isFeatured: true,
    sortOrder: 1,
  },
  {
    id: 2,
    title: "Moroccan Zellige Tile Artisans",
    location: "Marrakech, Morocco",
    imageUrl: "https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=1200&q=80",
    category: "Living Craft",
    caption: "Master zellige craftsmen carving geometric terracotta patterns by hand in the Medina ateliers.",
    isFeatured: true,
    sortOrder: 2,
  },
  {
    id: 3,
    title: "Traditional Loom & Silk Weaving",
    location: "Cairo, Egypt",
    imageUrl: "https://images.unsplash.com/photo-1568084680786-a84f91d1153c?auto=format&fit=crop&w=1200&q=80",
    category: "Living Craft",
    caption: "Artisan weavers preserving century-old Egyptian cotton and silk loom techniques.",
    isFeatured: true,
    sortOrder: 3,
  },
  {
    id: 4,
    title: "Glazed Ceramics & Pottery Wheel",
    location: "Istanbul, Türkiye",
    imageUrl: "https://images.unsplash.com/photo-1517824806704-9040b037703b?auto=format&fit=crop&w=1200&q=80",
    category: "Living Craft",
    caption: "Iznik-style ceramic crafting and hand-painted tile arts passed through artisan lineages.",
    isFeatured: false,
    sortOrder: 4,
  },
  {
    id: 5,
    title: "Hammered Brass & Filigree Metalwork",
    location: "Marrakech, Morocco",
    imageUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80",
    category: "Living Craft",
    caption: "Pierced brass lanterns catching warm shadows inside the artisan copper souks.",
    isFeatured: false,
    sortOrder: 5,
  },
  {
    id: 6,
    title: "Master Guitar & Luthier Craft",
    location: "Granada, Spain",
    imageUrl: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=1200&q=80",
    category: "Living Craft",
    caption: "Handcrafted classical instruments made in the historic Albaicín workshop quarters.",
    isFeatured: false,
    sortOrder: 6,
  },

  // --- Architecture & Monuments ---
  {
    id: 7,
    title: "Ancient Gidan Makama Royal Architecture",
    location: "Kano, Nigeria",
    imageUrl: "/gidan-makama-hero.jpg",
    category: "Architecture & Monuments",
    caption: "Traditional Hausa mud-relief vaulting and historic courtyards dating to the 15th century.",
    isFeatured: true,
    sortOrder: 7,
  },
  {
    id: 8,
    title: "The Great Pyramids & Desert Plateau",
    location: "Giza, Egypt",
    imageUrl: "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=1200&q=80",
    category: "Architecture & Monuments",
    caption: "The timeless monumental silhouettes of the Fourth Dynasty rising above the sands.",
    isFeatured: true,
    sortOrder: 8,
  },
  {
    id: 9,
    title: "Historic Minarets of Islamic Cairo",
    location: "Cairo, Egypt",
    imageUrl: "/cairo-editorial.jpg",
    category: "Architecture & Monuments",
    caption: "Mamluk stone domes, crenellated parapets, and minarets rising over Mu'izz Street.",
    isFeatured: true,
    sortOrder: 9,
  },
  {
    id: 10,
    title: "Sultanahmet & Byzantine Heritage",
    location: "Istanbul, Türkiye",
    imageUrl: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=1200&q=80",
    category: "Architecture & Monuments",
    caption: "Sweeping Ottoman cupolas and soaring stone spires framing the ancient skyline.",
    isFeatured: true,
    sortOrder: 10,
  },
  {
    id: 11,
    title: "Galata Tower & Golden Horn",
    location: "Istanbul, Türkiye",
    imageUrl: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1200&q=80",
    category: "Architecture & Monuments",
    caption: "The 14th-century Genoese stone watchtower overlooking the historic waters of the Golden Horn.",
    isFeatured: false,
    sortOrder: 11,
  },
  {
    id: 12,
    title: "Sheikh Zayed Grand Mosque Arcades",
    location: "Abu Dhabi, UAE",
    imageUrl: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80",
    category: "Architecture & Monuments",
    caption: "Pristine Macedonian marble colonnades inlaid with mother-of-pearl and lapis lazuli.",
    isFeatured: true,
    sortOrder: 12,
  },
  {
    id: 13,
    title: "Moorish Courtyards & Horseshoe Arches",
    location: "Cordoba & Granada, Spain",
    imageUrl: "https://images.unsplash.com/photo-1543783207-ec64e4d95325?auto=format&fit=crop&w=1200&q=80",
    category: "Architecture & Monuments",
    caption: "Harmonious Islamic stonework and whispering water fountains of medieval Al-Andalus.",
    isFeatured: false,
    sortOrder: 13,
  },
  {
    id: 14,
    title: "Ancient Stone Colonnades & Heritage Paths",
    location: "AlUla, Saudi Arabia",
    imageUrl: "https://images.unsplash.com/photo-1531572753322-ad063cecc140?auto=format&fit=crop&w=1200&q=80",
    category: "Architecture & Monuments",
    caption: "Carved sandstone tombs and monumental facades along the ancient frankincense highway.",
    isFeatured: false,
    sortOrder: 14,
  },

  // --- Landscapes & Deserts ---
  {
    id: 15,
    title: "Dunes of Erg Chebbi at Sunset",
    location: "Merzouga, Morocco",
    imageUrl: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80",
    category: "Landscapes & Deserts",
    caption: "Windswept Sahara ridgelines glowing amber in the warm twilight of North Africa.",
    isFeatured: true,
    sortOrder: 15,
  },
  {
    id: 16,
    title: "Table Mountain & Atlantic Ocean",
    location: "Cape Town, South Africa",
    imageUrl: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=1200&q=80",
    category: "Landscapes & Deserts",
    caption: "The majestic flat-topped sandstone sentinel towering over the South Atlantic coastline.",
    isFeatured: true,
    sortOrder: 16,
  },
  {
    id: 17,
    title: "Turquoise Indian Ocean at Nungwi",
    location: "Zanzibar, Tanzania",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    category: "Landscapes & Deserts",
    caption: "Crystal-clear coral shallows and pristine white sand beaches along the spice archipelago.",
    isFeatured: true,
    sortOrder: 17,
  },
  {
    id: 18,
    title: "The Bosphorus Crossroads",
    location: "Istanbul, Türkiye",
    imageUrl: "/istanbul-editorial.jpg",
    category: "Landscapes & Deserts",
    caption: "The storied maritime waterway connecting the Black Sea to the Mediterranean.",
    isFeatured: false,
    sortOrder: 18,
  },
  {
    id: 19,
    title: "Cliffs of Cape Point & Cape Peninsula",
    location: "Cape Town, South Africa",
    imageUrl: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80",
    category: "Landscapes & Deserts",
    caption: "Rugged floral kingdom headlands where two oceanic currents meet.",
    isFeatured: false,
    sortOrder: 19,
  },
  {
    id: 20,
    title: "Red Sandstone Canyons of the Arabian Desert",
    location: "AlUla, Saudi Arabia",
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
    category: "Landscapes & Deserts",
    caption: "Towering monoliths shaped by millennia of desert winds and ancient trade journeys.",
    isFeatured: false,
    sortOrder: 20,
  },

  // --- Bazaars & Markets ---
  {
    id: 21,
    title: "Centuries-Old Kurmi Trading Market",
    location: "Kano, Nigeria",
    imageUrl: "/kano-editorial.jpg",
    category: "Bazaars & Markets",
    caption: "A 500-year-old labyrinth of leatherworkers, herbalists, brass smiths, and textile merchants.",
    isFeatured: true,
    sortOrder: 21,
  },
  {
    id: 22,
    title: "Lantern Souks & Grand Bazaar Corridors",
    location: "Istanbul, Türkiye",
    imageUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80",
    category: "Bazaars & Markets",
    caption: "Over four thousand covered shops resonating with trade since the Ottoman 15th century.",
    isFeatured: true,
    sortOrder: 22,
  },
  {
    id: 23,
    title: "Fragrant Saffron & Spice Souks",
    location: "Dubai, UAE",
    imageUrl: "https://images.unsplash.com/photo-1578922746465-3a80a228f223?auto=format&fit=crop&w=1200&q=80",
    category: "Bazaars & Markets",
    caption: "Heaping mounds of dried rosebuds, Persian saffron, frankincense resin, and cardamom pods.",
    isFeatured: true,
    sortOrder: 23,
  },
  {
    id: 24,
    title: "Vibrant Medina Corridors & Souks",
    location: "Marrakech, Morocco",
    imageUrl: "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=1200&q=80",
    category: "Bazaars & Markets",
    caption: "Sunlit Medina alleys brimming with woven Berber rugs, spices, and copper crafts.",
    isFeatured: false,
    sortOrder: 24,
  },
  {
    id: 25,
    title: "Darajani Spice & Tropical Fruit Market",
    location: "Stone Town, Zanzibar",
    imageUrl: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1200&q=80",
    category: "Bazaars & Markets",
    caption: "Freshly harvested cloves, nutmeg, vanilla beans, and tropical bounty from island plantations.",
    isFeatured: false,
    sortOrder: 25,
  },
  {
    id: 26,
    title: "Khan el-Khalili Artisan Alleyways",
    location: "Cairo, Egypt",
    imageUrl: "https://images.unsplash.com/photo-1549144511-f099e773c147?auto=format&fit=crop&w=1200&q=80",
    category: "Bazaars & Markets",
    caption: "Narrow medieval corridors of perfume distillers, silver merchants, and traditional coffeehouses.",
    isFeatured: false,
    sortOrder: 26,
  },

  // --- Culture & Traditions ---
  {
    id: 27,
    title: "Hausa Durbar Horsemen & Royal Pageantry",
    location: "Kano, Nigeria",
    imageUrl: "/founder-museum.jpg",
    category: "Culture & Traditions",
    caption: "Spectacular royal cavalry dressed in indigo turbans, silk brocades, and ceremonial regalia.",
    isFeatured: true,
    sortOrder: 27,
  },
  {
    id: 28,
    title: "Moroccan Mint Tea & Hospitality Ritual",
    location: "Marrakech, Morocco",
    imageUrl: "https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=1200&q=80",
    category: "Culture & Traditions",
    caption: "The art of welcoming guests with high-poured gunpowder green tea infused with fresh mint.",
    isFeatured: true,
    sortOrder: 28,
  },
  {
    id: 29,
    title: "Historic Dhow Harbor & Swahili Sailors",
    location: "Stone Town, Zanzibar",
    imageUrl: "https://images.unsplash.com/photo-1528702748617-c64d49f918af?auto=format&fit=crop&w=1200&q=80",
    category: "Culture & Traditions",
    caption: "Handcrafted wooden dhows navigating ancient Indian Ocean monsoon trade routes.",
    isFeatured: true,
    sortOrder: 29,
  },
  {
    id: 30,
    title: "Bedouin Desert Caravan Traditions",
    location: "Dubai & Empty Quarter, UAE",
    imageUrl: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=80",
    category: "Culture & Traditions",
    caption: "Traditional camel caravan journeys across golden dunes with authentic desert campsite hospitality.",
    isFeatured: false,
    sortOrder: 30,
  },
  {
    id: 31,
    title: "Nomadic Camel Herders of the Sahara",
    location: "AlUla & Arabian Desert",
    imageUrl: "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=1200&q=80",
    category: "Culture & Traditions",
    caption: "Enduring desert nomadic heritage and oral storytelling under pristine star-filled night skies.",
    isFeatured: false,
    sortOrder: 31,
  },
  {
    id: 32,
    title: "Andalusian Heritage & Flamenco Evening",
    location: "Seville & Granada, Spain",
    imageUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80",
    category: "Culture & Traditions",
    caption: "Soulful flamenco singing, cante jondo, and poetic Moorish cultural echoes.",
    isFeatured: false,
    sortOrder: 32,
  },

  // --- Wildlife & Safaris ---
  {
    id: 33,
    title: "Pride of Lions on the Maasai Mara Savanna",
    location: "Maasai Mara, Kenya",
    imageUrl: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80",
    category: "Wildlife & Safaris",
    caption: "Apex predators resting on the open golden grasslands of the Great Rift Valley.",
    isFeatured: true,
    sortOrder: 33,
  },
  {
    id: 34,
    title: "Elephant Herd on the Great Savanna Plains",
    location: "Serengeti & Mara Corridor, East Africa",
    imageUrl: "https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?auto=format&fit=crop&w=1200&q=80",
    category: "Wildlife & Safaris",
    caption: "A matriarch-led herd moving across the vast golden plains under ancient skies.",
    isFeatured: true,
    sortOrder: 34,
  },
  {
    id: 35,
    title: "Acacia Tree Silhouette at Savanna Sunrise",
    location: "Serengeti, Tanzania",
    imageUrl: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1200&q=80",
    category: "Wildlife & Safaris",
    caption: "The iconic umbrella acacia glowing against the crimson sunrise of the African savanna.",
    isFeatured: true,
    sortOrder: 35,
  },
  {
    id: 36,
    title: "Zebra Herd Grazing Across the Mara",
    location: "Maasai Mara, Kenya",
    imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80",
    category: "Wildlife & Safaris",
    caption: "Vibrant wildlife herds during the Great Migration across the East African ecosystem.",
    isFeatured: false,
    sortOrder: 36,
  },
  {
    id: 37,
    title: "Giraffes Moving Across the Acacia Woodland",
    location: "Rift Valley, Kenya",
    imageUrl: "https://images.unsplash.com/photo-1547721064-da6cfb341d50?auto=format&fit=crop&w=1200&q=80",
    category: "Wildlife & Safaris",
    caption: "Graceful silhouettes towering above the golden acacia trees on early morning game drive.",
    isFeatured: false,
    sortOrder: 37,
  },
  {
    id: 38,
    title: "Expedition 4x4 on Savanna Safari Trail",
    location: "East African National Parks",
    imageUrl: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80",
    category: "Wildlife & Safaris",
    caption: "Custom safari vehicles traversing untamed landscapes guided by local wildlife trackers.",
    isFeatured: false,
    sortOrder: 38,
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
    customerEmail: "amina.bello@heritage-kano.ng",
    customerPhone: "+234 803 123 4567",
    travelDate: "2026-11-15",
    travelers: 2,
    totalAmount: 900,
    currency: "USD",
    status: "confirmed",
    specialRequests: "Special focus on family ancestral quarters in Old City and meeting Kofar Mata master dyers.",
    createdAt: "2026-10-01T14:22:00Z",
  },
  {
    id: 2,
    bookingReference: "KANO-941825",
    tourId: 5,
    tourTitle: "Ancient Walls & Sahelian Architecture",
    destinationName: "Kano, Nigeria",
    customerName: "Dr. Arthur Pendleton",
    customerEmail: "a.pendleton@ucl.ac.uk",
    customerPhone: "+44 7911 123456",
    travelDate: "2026-11-22",
    travelers: 4,
    totalAmount: 2400,
    currency: "USD",
    status: "confirmed",
    specialRequests: "Architectural faculty delegation. Need permit for high-resolution photogrammetry of remaining 11th-century earthen bastions.",
    createdAt: "2026-10-04T08:15:00Z",
  },
  {
    id: 3,
    bookingReference: "KANO-941826",
    tourId: 2,
    tourTitle: "Cairo: Layers of History",
    destinationName: "Cairo, Egypt",
    customerName: "Ibrahim Mansur & Family",
    customerEmail: "ibrahim.mansur@transcorp.ng",
    customerPhone: "+234 802 987 6543",
    travelDate: "2026-12-05",
    travelers: 3,
    totalAmount: 2550,
    currency: "USD",
    status: "confirmed",
    specialRequests: "Focus on Mamluk madrasas, Al-Azhar archival manuscripts, and historical trans-Saharan pilgrimage corridors.",
    createdAt: "2026-10-05T09:15:00Z",
  },
  {
    id: 4,
    bookingReference: "KANO-941827",
    tourId: 3,
    tourTitle: "Marrakech: Craft & Caravan Legacies",
    destinationName: "Marrakech, Morocco",
    customerName: "Fatima Al-Mansoor",
    customerEmail: "f.almansoor@dubaiarts.ae",
    customerPhone: "+971 50 882 1920",
    travelDate: "2026-12-18",
    travelers: 2,
    totalAmount: 1500,
    currency: "USD",
    status: "confirmed",
    specialRequests: "Masterclass with Bab Debbagh leather tanners; tracing northern Nigerian raw material routes to Moroccan leather craft.",
    createdAt: "2026-10-08T11:20:00Z",
  },
  {
    id: 5,
    bookingReference: "KANO-941828",
    tourId: 1,
    tourTitle: "Kano Heritage Discovery",
    destinationName: "Kano, Nigeria",
    customerName: "Marcus & Elena Vance",
    customerEmail: "mvance@stanfordalumni.org",
    customerPhone: "+1 415 672 8901",
    travelDate: "2027-01-10",
    travelers: 2,
    totalAmount: 900,
    currency: "USD",
    status: "confirmed",
    specialRequests: "Documentary research on natural indigo fermentation chemistry and traditional cloth beating techniques.",
    createdAt: "2026-10-10T16:45:00Z",
  },
  {
    id: 6,
    bookingReference: "KANO-941829",
    tourId: 1,
    tourTitle: "Kano Heritage Discovery",
    destinationName: "Kano, Nigeria",
    customerName: "Hajiya Maryam Sanusi",
    customerEmail: "maryam.sanusi@heritagebank.com",
    customerPhone: "+234 809 555 7711",
    travelDate: "2027-01-24",
    travelers: 5,
    totalAmount: 2250,
    currency: "USD",
    status: "pending",
    specialRequests: "Private family gathering for visiting diaspora children; requires airport reception at KAN and comfortable executive sprinter bus.",
    createdAt: "2026-10-12T13:30:00Z",
  },
  {
    id: 7,
    bookingReference: "KANO-941830",
    tourId: 6,
    tourTitle: "Zaria: Queen Amina's Fortresses & Citadels",
    destinationName: "Zaria, Nigeria",
    customerName: "Jean-Luc Moreau",
    customerEmail: "jl.moreau@sorbonne-universite.fr",
    customerPhone: "+33 6 12 34 56 78",
    travelDate: "2027-02-02",
    travelers: 2,
    totalAmount: 760,
    currency: "USD",
    status: "confirmed",
    specialRequests: "Bilingual English/French historical custodian requested; keen on Queen Amina wall fragments and medieval gates.",
    createdAt: "2026-10-13T10:10:00Z",
  },
  {
    id: 8,
    bookingReference: "KANO-941831",
    tourId: 1,
    tourTitle: "Kano Heritage Discovery",
    destinationName: "Kano, Nigeria",
    customerName: "Zainab Oladipo",
    customerEmail: "zainab.oladipo@designstudio.ng",
    customerPhone: "+234 814 220 3491",
    travelDate: "2027-02-14",
    travelers: 2,
    totalAmount: 900,
    currency: "USD",
    status: "pending",
    specialRequests: "Anniversary private journey; request private rooftop dinner overlooking old city skyline.",
    createdAt: "2026-10-15T15:20:00Z",
  },
  {
    id: 9,
    bookingReference: "KANO-941832",
    tourId: 4,
    tourTitle: "Istanbul: Historic Crossroads",
    destinationName: "Istanbul, Türkiye",
    customerName: "Sophia Lindqvist",
    customerEmail: "sophia.lindqvist@arch.kth.se",
    customerPhone: "+46 70 123 4567",
    travelDate: "2027-03-20",
    travelers: 2,
    totalAmount: 1780,
    currency: "USD",
    status: "confirmed",
    specialRequests: "Comparative dome architectural study between Ottoman imperial mosques and Mediterranean monuments.",
    createdAt: "2026-10-16T12:00:00Z",
  },
  {
    id: 10,
    bookingReference: "KANO-941833",
    tourId: 5,
    tourTitle: "Ancient Walls & Sahelian Architecture",
    destinationName: "Kano, Nigeria",
    customerName: "David K. Miller",
    customerEmail: "david.miller@conservation-intl.org",
    customerPhone: "+1 202 555 0199",
    travelDate: "2027-04-18",
    travelers: 3,
    totalAmount: 1800,
    currency: "USD",
    status: "pending",
    specialRequests: "Site assessment for earth conservation and community heritage preservation workshops.",
    createdAt: "2026-10-17T09:40:00Z",
  },
  {
    id: 11,
    bookingReference: "KANO-941834",
    tourId: 2,
    tourTitle: "Cairo: Layers of History",
    destinationName: "Cairo, Egypt",
    customerName: "Dr. Kwame Acheampong",
    customerEmail: "k.acheampong@ug.edu.gh",
    customerPhone: "+233 24 456 7890",
    travelDate: "2027-03-08",
    travelers: 1,
    totalAmount: 850,
    currency: "USD",
    status: "confirmed",
    specialRequests: "Trans-Saharan academic exchange; visiting Al-Azhar University archives.",
    createdAt: "2026-10-18T14:10:00Z",
  },
  {
    id: 12,
    bookingReference: "KANO-941835",
    tourId: 1,
    tourTitle: "Kano Heritage Discovery",
    destinationName: "Kano, Nigeria",
    customerName: "Balarabe Usman",
    customerEmail: "balarabe.usman@kanoculture.gov.ng",
    customerPhone: "+234 806 777 8899",
    travelDate: "2027-04-05",
    travelers: 4,
    totalAmount: 1800,
    currency: "USD",
    status: "confirmed",
    specialRequests: "Hosting visiting museum directors from West African Curatorial Network.",
    createdAt: "2026-10-19T07:30:00Z",
  },
];

const DEFAULT_INQUIRIES: InquiryItem[] = [
  {
    id: 1,
    name: "Prof. Julian Hayes",
    email: "j.hayes@soas.ac.uk",
    phone: "+44 20 7898 4000",
    subject: "Bespoke Field Trip for 14 History Postgraduates to Kano Old City & Zaria",
    message: "We are organizing the annual SOAS Department of History field seminar for late January 2027. We are looking for curated custodial access to Kofar Mata Dye Pits, Gidan Makama archival vaults, and an expert lecture on medieval Hausa municipal defenses.",
    status: "new",
    createdAt: "2026-10-19T08:15:00Z",
  },
  {
    id: 2,
    name: "Tariq Al-Hassan",
    email: "tariq.alhassan@heritagefoundation.ae",
    phone: "+971 50 123 4567",
    subject: "Custom Family Cultural Tour in Kano & Marrakech",
    message: "We would like to book a private VIP journey for a family of 4 in early January, exploring artisan textile and leather workshops with private ground transport and 5-star heritage lodgings.",
    status: "in_progress",
    createdAt: "2026-10-18T16:30:00Z",
  },
  {
    id: 3,
    name: "Ngozi Eze & Chinedu Okonkwo",
    email: "ngozi@lagosartscollective.org",
    phone: "+234 802 334 5566",
    subject: "Collaborative Curatorial Residency & Dye Pit Documentation",
    message: "Our arts collective is preparing a visual monograph on living indigo techniques in West Africa. We would like to arrange a 5-day on-site research session with senior master dyers at Kofar Mata with local language translation.",
    status: "in_progress",
    createdAt: "2026-10-17T11:20:00Z",
  },
  {
    id: 4,
    name: "Aisha Garba",
    email: "aisha.garba@houstondiaspora.org",
    phone: "+1 713 555 0188",
    subject: "12-Person Group Booking for Kano Durbar 2027",
    message: "We are organizing a cultural homecoming trip for 12 Nigerian-American professionals during the upcoming Durbar celebrations. Please advise on custom itinerary packages, security arrangements, and reserved viewing seating.",
    status: "new",
    createdAt: "2026-10-16T19:40:00Z",
  },
  {
    id: 5,
    name: "Dr. Fatima Zubairu",
    email: "fatima.zubairu@cambridge.ac.uk",
    phone: "+44 7700 900123",
    subject: "Private University Group Tour to Kano & Sahara Corridor",
    message: "Planning a bespoke 10-day research study trip for 6 postgraduate students focusing on Sahelian civil engineering, earth masonry, and medieval city gates.",
    status: "in_progress",
    createdAt: "2026-10-14T11:45:00Z",
  },
  {
    id: 6,
    name: "Michael Sterling",
    email: "m.sterling@natgeo-contributor.com",
    phone: "+1 212 555 7820",
    subject: "Permits and scout for photo essay on 500-year indigo pits",
    message: "On assignment for an international heritage magazine. Need logistical guidance, cultural clearance, and access permits to photograph morning light and master artisans at Kofar Mata.",
    status: "in_progress",
    createdAt: "2026-10-12T14:15:00Z",
  },
  {
    id: 7,
    name: "Dr. Klaus Wernecke",
    email: "klaus.wernecke@hu-berlin.de",
    phone: "+49 30 2093 0",
    subject: "Archival research access to Kano Emirate historical records",
    message: "Conducting comparative studies on trans-Saharan commercial contracts from the 16th to 19th centuries. Requesting consultation with Kano historical curators.",
    status: "resolved",
    createdAt: "2026-10-10T09:00:00Z",
  },
  {
    id: 8,
    name: "Hajiya Maryam Danbaba",
    email: "m.danbaba@heritageclub.ng",
    phone: "+234 803 999 4433",
    subject: "Weekend private heritage retreat for 8 members",
    message: "Planning an exclusive weekend retreat exploring Gidan Makama Museum, Kurmi Market spices and brassware, and traditional Hausa culinary arts.",
    status: "resolved",
    createdAt: "2026-10-08T15:30:00Z",
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
    const parsed = JSON.parse(raw);
    if (key === STORAGE_KEYS.SITE_CONTENT && (!parsed?.founderImageUrl || parsed.founderImageUrl === "/kano-editorial.jpg")) {
      parsed.founderImageUrl = "/founder.jpg";
      localStorage.setItem(key, JSON.stringify(parsed));
    }
    return parsed;
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
        "Wildlife & Safari",
        "Desert Expeditions",
        "Coastal & Island Retreats",
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

