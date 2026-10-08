import { Link } from 'wouter';
import { ArrowRight, Compass, Sparkles, BookOpen, Camera, Users, Sun } from 'lucide-react';

const experiences = [
  {
    title: 'Historical & Heritage Journeys',
    eyebrow: 'Centuries of Civilizations',
    desc: 'From the medieval earthworks of ancient Kano to Ottoman and Mamluk architectures across North Africa and the Mediterranean.',
    image: '/kano-editorial.jpg',
    category: 'Historical & Heritage',
    tags: ['Architecture', 'City Walls', 'Sultanate Palaces', 'Medieval Urbanism'],
  },
  {
    title: 'Living Crafts & Artisanal Traditions',
    eyebrow: 'Unbroken Lineages',
    desc: 'Meet master indigo dyers, leather artisans, calligraphers, and weavers whose techniques have endured for half a millennium.',
    image: '/cairo-editorial.jpg',
    category: 'Cultural Experiences',
    tags: ['Kofar Mata Indigo', 'Traditional Tanneries', 'Zellige Pottery', 'Handloom Weaving'],
  },
  {
    title: 'Desert Corridors & Caravan Routes',
    eyebrow: 'Trans-Saharan Memory',
    desc: 'Follow the ancient commercial and scholarly routes that linked the Sahelian kingdoms to the Maghreb and the Levant.',
    image: '/marrakech-editorial.jpg',
    category: 'Nature & Adventure',
    tags: ['Sahelian Landscapes', 'Oasis Towns', 'Historical Caravans', 'Trade Posts'],
  },
  {
    title: 'Culinary Heritage & Living Markets',
    eyebrow: 'Flavors of the Sahel & Beyond',
    desc: 'Experience centuries-old marketplaces, traditional spices, communal feasts, and gastronomic rituals rooted in regional soil.',
    image: '/istanbul-editorial.jpg',
    category: 'Food & Cuisine',
    tags: ['Kurmi Market', 'Sahelian Spices', 'Traditional Tea Rituals', 'Local Markets'],
  },
];

export default function ExperiencesPage() {
  return (
    <main>
      <section style={{ background: '#eee8dc', padding: 'clamp(4rem,8vw,7.5rem) clamp(1.25rem,8vw,8rem) 4rem' }}>
        <div className="site-wrap">
          <p className="eyebrow">A curated perspective</p>
          <h1 className="serif" style={{ fontSize: 'clamp(2.8rem,7vw,6rem)', lineHeight: 1.05, fontWeight: 400, maxWidth: 950, margin: '20px 0' }}>
            Travel as an Encounter with Living Heritage.
          </h1>
          <p style={{ fontSize: 16, lineHeight: 1.8, color: '#6e655a', maxWidth: 680 }}>
            Every journey we curate is built around authentic human stories, architectural preservation, and artisanal continuity. Explore our primary experience themes below.
          </p>
        </div>
      </section>

      <section className="section-pad" style={{ background: '#f8f5ee' }}>
        <div className="site-wrap" style={{ display: 'grid', gap: 64 }}>
          {experiences.map((exp, index) => (
            <div
              key={exp.title}
              className={`experience-card ${index % 2 !== 0 ? 'reverse' : ''}`}
              style={{
                borderBottom: index < experiences.length - 1 ? '1px solid #dcd1c2' : 'none',
              }}
            >
              <div className="exp-image" style={{ order: index % 2 === 0 ? 1 : 2 }}>
                <img
                  src={exp.image}
                  alt={exp.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              <div className="exp-content" style={{ order: index % 2 === 0 ? 2 : 1 }}>
                <p className="eyebrow" style={{ color: '#9b7642' }}>{exp.eyebrow}</p>
                <h2 className="serif" style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 400, margin: '10px 0 16px', lineHeight: 1.15 }}>
                  {exp.title}
                </h2>
                <p style={{ color: '#62584c', fontSize: 15, lineHeight: 1.85, marginBottom: 22 }}>
                  {exp.desc}
                </p>

                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
                  {exp.tags.map(t => (
                    <span
                      key={t}
                      style={{
                        background: '#eee7d8',
                        padding: '6px 12px',
                        fontSize: 11,
                        textTransform: 'uppercase',
                        letterSpacing: '.06em',
                        color: '#655a4b',
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <Link
                  href={`/tours?category=${encodeURIComponent(exp.category)}`}
                  className="btn-dark"
                  data-testid={`link-experience-tours-${index}`}
                >
                  Explore matching tours <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bespoke Inquiry Callout */}
      <section className="dark-panel section-pad" style={{ textAlign: 'center' }}>
        <div className="site-wrap" style={{ maxWidth: 760 }}>
          <p className="eyebrow" style={{ color: '#c3a574' }}>Bespoke Research</p>
          <h2 className="serif" style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)', fontWeight: 400, margin: '14px 0 20px', lineHeight: 1.15 }}>
            Seeking a Specific Curatorial Exploration?
          </h2>
          <p style={{ color: '#cfc4b5', lineHeight: 1.8, fontSize: 15, margin: '0 auto 28px' }}>
            We design private research expeditions for institutions, families, and cultural fellows wishing to study manuscripts, architecture, or crafts directly in the field.
          </p>
          <Link href="/contact?subject=Bespoke Curatorial Expedition" className="btn-gold">
            Begin a conversation <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </main>
  );
}

