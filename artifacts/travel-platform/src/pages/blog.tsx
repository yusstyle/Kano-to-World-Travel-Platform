import { Link } from 'wouter';
import { useGetBlogPosts } from '@workspace/api-client-react';
import { ArrowRight, Calendar, User, Compass } from 'lucide-react';

export default function BlogPage() {
  const query = useGetBlogPosts();
  const posts = query.data ?? [];

  return (
    <main>
      <section style={{ background: '#eee8dc', padding: 'clamp(4rem,8vw,7.5rem) clamp(1.25rem,8vw,8rem) 4rem' }}>
        <div className="site-wrap">
          <p className="eyebrow">Letters from the road</p>
          <h1 className="serif" style={{ fontSize: 'clamp(2.8rem,7vw,6.2rem)', lineHeight: 1.05, fontWeight: 400, maxWidth: 950, margin: '20px 0' }}>
            Travel Stories & Heritage Notes.
          </h1>
          <p style={{ fontSize: 16, lineHeight: 1.8, color: '#6e655a', maxWidth: 660 }}>
            Essays, field observations, and historical context from Kano, the Sahara, and destinations across Africa and beyond.
          </p>
        </div>
      </section>

      <section className="section-pad" style={{ background: '#f8f5ee' }}>
        <div className="site-wrap">
          {query.isLoading ? (
            <div className="content-grid">
              {[1, 2, 3].map(i => (
                <div key={i}>
                  <div className="skeleton" style={{ height: 260 }} />
                  <div className="skeleton" style={{ height: 24, marginTop: 16, width: '80%' }} />
                  <div className="skeleton" style={{ height: 16, marginTop: 10, width: '95%' }} />
                </div>
              ))}
            </div>
          ) : query.isError ? (
            <div role="alert" style={{ textAlign: 'center', padding: 48, background: '#eee8dc' }}>
              <p className="serif" style={{ fontSize: 24 }}>Stories could not be loaded at this time.</p>
              <button className="btn-outline" onClick={() => void query.refetch()}>Try again</button>
            </div>
          ) : !posts.length ? (
            <div style={{ textAlign: 'center', padding: 60, background: '#eee8dc' }}>
              <Compass size={28} color="#9b7642" />
              <h3 className="serif" style={{ fontSize: 28, margin: '14px 0' }}>New Stories in Preparation</h3>
              <p style={{ color: '#6c6152' }}>Field journals and cultural essays will appear here shortly.</p>
            </div>
          ) : (
            <div className="content-grid">
              {posts.map(post => (
                <article
                  key={post.id}
                  className="image-card"
                  data-testid={`card-blog-${post.id}`}
                  style={{ background: '#faf8f2', display: 'flex', flexDirection: 'column' }}
                >
                  <Link href={`/blog/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <div style={{ position: 'relative', height: 250, overflow: 'hidden', background: '#d7cbbb' }}>
                      <img
                        src={post.coverImageUrl}
                        alt={post.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <span className="status-pill" style={{ position: 'absolute', bottom: 12, left: 12 }}>
                        {post.category}
                      </span>
                    </div>

                    <div style={{ padding: '24px 22px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 11, color: '#827464', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '.06em' }}>
                        <span>{new Date(post.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                        <span>·</span>
                        <span>{post.authorName}</span>
                      </div>

                      <h2 className="serif" style={{ fontSize: 24, fontWeight: 400, margin: '0 0 10px', lineHeight: 1.25 }}>
                        {post.title}
                      </h2>

                      <p style={{ color: '#665d52', fontSize: 13, lineHeight: 1.7, flexGrow: 1, margin: 0 }}>
                        {post.summary}
                      </p>

                      <div style={{ borderTop: '1px solid #e7dfd3', paddingTop: 14, marginTop: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="serif" style={{ color: '#9b7642', fontSize: 15 }}>Read story</span>
                        <ArrowRight size={14} color="#9b7642" />
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

