import { useParams, Link } from 'wouter';
import { useGetBlogPost, getGetBlogPostQueryKey } from '@workspace/api-client-react';
import { ArrowLeft, ArrowRight, Calendar, User, Tag } from 'lucide-react';

export default function BlogDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug ?? '';
  const query = useGetBlogPost(slug, { query: { queryKey: getGetBlogPostQueryKey(slug), enabled: Boolean(slug) } });

  if (query.isLoading) {
    return (
      <main className="section-pad site-wrap" style={{ minHeight: '60vh', display: 'grid', placeItems: 'center' }}>
        <p role="status">Loading story…</p>
      </main>
    );
  }

  if (query.isError || !query.data) {
    return (
      <main className="section-pad site-wrap" style={{ textAlign: 'center', minHeight: '60vh' }}>
        <h1 className="serif" style={{ fontSize: 36, margin: '20px 0' }}>Story Not Found</h1>
        <p style={{ color: '#685e51', maxWidth: 460, margin: '0 auto 24px' }}>
          This article or travel essay could not be found.
        </p>
        <Link href="/blog" className="btn-dark">Back to Stories</Link>
      </main>
    );
  }

  const post = query.data;

  return (
    <main style={{ background: '#f8f5ee' }}>
      {/* Hero Cover */}
      <section style={{
        position: 'relative',
        minHeight: 'min(520px, 60vh)',
        backgroundImage: `linear-gradient(0deg, rgba(22,18,15,0.82) 0%, rgba(22,18,15,0.3) 100%), url("${post.coverImageUrl}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'flex-end',
        color: '#fff',
        padding: '60px clamp(1.25rem, 8vw, 8rem)',
      }}>
        <div className="site-wrap" style={{ width: '100%', maxWidth: 900 }}>
          <Link href="/blog" style={{ color: '#eee4d3', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, marginBottom: 28 }}>
            <ArrowLeft size={14} /> All stories
          </Link>

          <p className="eyebrow" style={{ color: '#d5b782' }}>{post.category}</p>
          <h1 className="serif" style={{ fontSize: 'clamp(2.5rem, 5.5vw, 4.8rem)', fontWeight: 400, lineHeight: 1.1, margin: '14px 0 20px' }}>
            {post.title}
          </h1>

          <div style={{ display: 'flex', gap: 16, alignItems: 'center', fontSize: 12, color: '#e5ddd0', letterSpacing: '.06em', textTransform: 'uppercase' }}>
            <span>By {post.authorName}</span>
            <span>·</span>
            <span>{new Date(post.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>
      </section>

      {/* Article Body */}
      <article className="section-pad">
        <div className="site-wrap" style={{ maxWidth: 760 }}>
          <p style={{ fontSize: 19, lineHeight: 1.8, color: '#383028', fontWeight: 400, borderLeft: '3px solid #a9854d', paddingLeft: 22, margin: '0 0 36px' }}>
            {post.summary}
          </p>

          <div style={{ fontSize: 16, lineHeight: 2, color: '#4a4238', whiteSpace: 'pre-line' }}>
            {post.content}
          </div>

          {post.tags && post.tags.length > 0 && (
            <div style={{ borderTop: '1px solid #dcd1c2', paddingTop: 28, marginTop: 44 }}>
              <span className="eyebrow" style={{ display: 'block', marginBottom: 10 }}>Tags & Subjects</span>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {post.tags.map(tag => (
                  <span
                    key={tag}
                    style={{
                      background: '#eee7d8',
                      padding: '6px 14px',
                      fontSize: 11,
                      textTransform: 'uppercase',
                      letterSpacing: '.06em',
                      color: '#655a4b',
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Inquiry Callout */}
          <div style={{ marginTop: 52, padding: 32, background: '#eee8dc', textAlign: 'center' }}>
            <h3 className="serif" style={{ fontSize: 26, fontWeight: 400, margin: '0 0 10px' }}>Inspired by this story?</h3>
            <p style={{ color: '#685e51', fontSize: 14, maxWidth: 500, margin: '0 auto 20px' }}>
              Connect with our team to explore cultural travel ideas rooted in these very histories.
            </p>
            <Link href="/contact" className="btn-dark">
              Make an enquiry <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </article>
    </main>
  );
}
