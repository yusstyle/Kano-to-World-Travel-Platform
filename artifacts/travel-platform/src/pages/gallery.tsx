import { useState } from 'react';
import { useGetGalleryImages } from '@workspace/api-client-react';
import { Compass, X, MapPin } from 'lucide-react';
import type { GalleryImage } from '@workspace/api-client-react';

export default function GalleryPage() {
  const query = useGetGalleryImages();
  const images = query.data ?? [];
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeImage, setActiveImage] = useState<GalleryImage | null>(null);

  const categories = ['All', ...Array.from(new Set(images.map(img => img.category)))];
  const filtered = selectedCategory === 'All' ? images : images.filter(img => img.category === selectedCategory);

  return (
    <main>
      <section style={{ background: '#eee8dc', padding: 'clamp(4rem,8vw,7.5rem) clamp(1.25rem,8vw,8rem) 4rem' }}>
        <div className="site-wrap">
          <p className="eyebrow">Visual archive</p>
          <h1 className="serif" style={{ fontSize: 'clamp(2.8rem,7vw,6.2rem)', lineHeight: 1.05, fontWeight: 400, maxWidth: 950, margin: '20px 0' }}>
            Photographic Notes on Place & Living Culture.
          </h1>
          <p style={{ fontSize: 16, lineHeight: 1.8, color: '#6e655a', maxWidth: 660 }}>
            Visual impressions from Kano, ancient ramparts, master dye pits, desert oasis towns, and cultural crossroads.
          </p>
        </div>
      </section>

      <section className="section-pad" style={{ background: '#f8f5ee' }}>
        <div className="site-wrap">
          {/* Category Filter Pills */}
          {categories.length > 1 && (
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 38 }}>
              {categories.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  data-testid={`button-gallery-filter-${cat.toLowerCase()}`}
                  style={{
                    padding: '8px 18px',
                    fontSize: 12,
                    textTransform: 'uppercase',
                    letterSpacing: '.08em',
                    border: '1px solid #cfc2af',
                    background: selectedCategory === cat ? '#28231e' : '#f5f0e6',
                    color: selectedCategory === cat ? '#fff' : '#4a4136',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {query.isLoading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="skeleton" style={{ height: 320 }} />
              ))}
            </div>
          ) : query.isError ? (
            <div role="alert" style={{ textAlign: 'center', padding: 48, background: '#eee8dc' }}>
              <p className="serif" style={{ fontSize: 24 }}>Gallery could not be loaded at this time.</p>
              <button className="btn-outline" onClick={() => void query.refetch()}>Try again</button>
            </div>
          ) : !filtered.length ? (
            <div style={{ textAlign: 'center', padding: 60, background: '#eee8dc' }}>
              <Compass size={28} color="#9b7642" />
              <h3 className="serif" style={{ fontSize: 28, margin: '14px 0' }}>No Photos in this Category</h3>
              <p style={{ color: '#6c6152' }}>Select another category to view images.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
              {filtered.map(img => (
                <div
                  key={img.id}
                  onClick={() => setActiveImage(img)}
                  data-testid={`card-gallery-${img.id}`}
                  style={{
                    position: 'relative',
                    height: 320,
                    overflow: 'hidden',
                    background: '#ddd0bd',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease',
                  }}
                  className="image-card"
                >
                  <img
                    src={img.imageUrl}
                    alt={img.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(0deg, rgba(20,16,13,0.85) 0%, transparent 60%)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    padding: 20,
                    color: '#fff',
                  }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, textTransform: 'uppercase', letterSpacing: '.1em', color: '#d5b782', marginBottom: 4 }}>
                      <MapPin size={12} /> {img.location}
                    </span>
                    <h3 className="serif" style={{ fontSize: 20, margin: 0, fontWeight: 400 }}>{img.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Enlarged Image Modal */}
      {activeImage && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setActiveImage(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(18,15,12,0.92)',
            zIndex: 100,
            display: 'grid',
            placeItems: 'center',
            padding: 24,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              maxWidth: 900,
              width: '100%',
              background: '#f8f5ee',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <button
              onClick={() => setActiveImage(null)}
              aria-label="Close image preview"
              style={{
                position: 'absolute',
                top: 14,
                right: 14,
                background: '#28231e',
                color: '#fff',
                border: 0,
                padding: 8,
                cursor: 'pointer',
                zIndex: 10,
              }}
            >
              <X size={20} />
            </button>

            <img
              src={activeImage.imageUrl}
              alt={activeImage.title}
              style={{ width: '100%', maxHeight: '65vh', objectFit: 'cover' }}
            />

            <div style={{ padding: '24px 28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 16 }}>
                <div>
                  <p className="eyebrow" style={{ color: '#9b7642', margin: 0 }}>{activeImage.location} · {activeImage.category}</p>
                  <h2 className="serif" style={{ fontSize: 28, fontWeight: 400, margin: '6px 0 10px' }}>{activeImage.title}</h2>
                </div>
              </div>
              {activeImage.caption && (
                <p style={{ color: '#655b4e', fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                  {activeImage.caption}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

