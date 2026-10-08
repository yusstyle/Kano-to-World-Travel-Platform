import { useState } from 'react';
import { Link } from 'wouter';
import { useGetFaqs } from '@workspace/api-client-react';
import { ArrowRight, ChevronDown, ChevronUp, HelpCircle, Compass } from 'lucide-react';

export default function FaqPage() {
  const query = useGetFaqs();
  const faqs = query.data ?? [];
  const [openIds, setOpenIds] = useState<number[]>([]);

  const toggle = (id: number) => {
    setOpenIds(current =>
      current.includes(id) ? current.filter(x => x !== id) : [...current, id]
    );
  };

  const categories = Array.from(new Set(faqs.map(f => f.category)));

  return (
    <main>
      <section style={{ background: '#eee8dc', padding: 'clamp(4rem,8vw,7.5rem) clamp(1.25rem,8vw,8rem) 4rem' }}>
        <div className="site-wrap">
          <p className="eyebrow">Practical context & philosophy</p>
          <h1 className="serif" style={{ fontSize: 'clamp(2.8rem,7vw,6.2rem)', lineHeight: 1.05, fontWeight: 400, maxWidth: 950, margin: '20px 0' }}>
            Frequently Asked Questions.
          </h1>
          <p style={{ fontSize: 16, lineHeight: 1.8, color: '#6e655a', maxWidth: 660 }}>
            Everything you need to know about our approach to cultural journeys, private logistics, booking procedures, and accommodations.
          </p>
        </div>
      </section>

      <section className="section-pad" style={{ background: '#f8f5ee' }}>
        <div className="site-wrap" style={{ maxWidth: 860 }}>
          {query.isLoading ? (
            <div style={{ display: 'grid', gap: 16 }}>
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="skeleton" style={{ height: 72 }} />
              ))}
            </div>
          ) : query.isError ? (
            <div role="alert" style={{ textAlign: 'center', padding: 48, background: '#eee8dc' }}>
              <p className="serif" style={{ fontSize: 24 }}>Questions could not be loaded at this time.</p>
              <button className="btn-outline" onClick={() => void query.refetch()}>Try again</button>
            </div>
          ) : !faqs.length ? (
            <div style={{ textAlign: 'center', padding: 60, background: '#eee8dc' }}>
              <HelpCircle size={28} color="#9b7642" />
              <h3 className="serif" style={{ fontSize: 28, margin: '14px 0' }}>FAQ Guide in Preparation</h3>
              <p style={{ color: '#6c6152' }}>Please contact us directly with any travel questions.</p>
              <Link href="/contact" className="btn-dark" style={{ marginTop: 16 }}>Make an Enquiry</Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 36 }}>
              {categories.map(category => {
                const categoryFaqs = faqs.filter(f => f.category === category);
                return (
                  <div key={category} style={{ background: '#fff', border: '1px solid #ddd1bf', padding: '28px clamp(18px, 4vw, 36px)' }}>
                    <p className="eyebrow" style={{ color: '#9b7642', marginBottom: 18 }}>{category}</p>

                    <div style={{ display: 'grid', gap: 12 }}>
                      {categoryFaqs.map(faq => {
                        const isOpen = openIds.includes(faq.id);
                        return (
                          <div
                            key={faq.id}
                            style={{
                              borderTop: '1px solid #eee5d8',
                              paddingTop: 16,
                              paddingBottom: 16,
                            }}
                          >
                            <button
                              type="button"
                              onClick={() => toggle(faq.id)}
                              aria-expanded={isOpen}
                              style={{
                                width: '100%',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                textAlign: 'left',
                                background: 'transparent',
                                border: 0,
                                cursor: 'pointer',
                                padding: 0,
                                gap: 16,
                              }}
                            >
                              <h3 className="serif" style={{ fontSize: 20, fontWeight: 400, color: '#28231e', margin: 0, lineHeight: 1.3 }}>
                                {faq.question}
                              </h3>
                              <span style={{ color: '#9b7642', flexShrink: 0 }}>
                                {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                              </span>
                            </button>

                            {isOpen && (
                              <p style={{ color: '#63584b', fontSize: 14, lineHeight: 1.85, marginTop: 14, marginBottom: 0 }}>
                                {faq.answer}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Contact Assistance Callout */}
          <div style={{ marginTop: 48, background: '#eee8dc', padding: 36, textAlign: 'center' }}>
            <p className="eyebrow">Still have a question?</p>
            <h2 className="serif" style={{ fontSize: 32, fontWeight: 400, margin: '10px 0 16px' }}>
              We’re happy to talk through every detail.
            </h2>
            <p style={{ color: '#685d50', fontSize: 14, maxWidth: 520, margin: '0 auto 22px' }}>
              Whether you are planning months in advance or exploring initial possibilities, our team in Kano is ready to assist.
            </p>
            <Link href="/contact" className="btn-dark" data-testid="link-faq-contact">
              Send us your question <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

