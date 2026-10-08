import { useState, useEffect, useRef } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { Link } from 'wouter';
import { useQueryClient } from '@tanstack/react-query';
import {
  useGetAuthProfile,
  useGetAdminSiteContent,
  useUpdateAdminSiteContent,
  useGetAdminTours,
  useCreateAdminTour,
  useDeleteAdminTour,
  useGetAdminDestinations,
  useCreateAdminDestination,
  useDeleteAdminDestination,
  useGetAdminBookings,
  useUpdateAdminBookingStatus,
  useGetAdminInquiries,
  useUpdateAdminInquiryStatus,
  useCreateAdminFaq,
  useCreateAdminGalleryImage,
  getGetAuthProfileQueryKey,
  getGetAdminSiteContentQueryKey,
  getGetHomeQueryKey,
  getGetAdminToursQueryKey,
  getGetAdminDestinationsQueryKey,
  getGetAdminBookingsQueryKey,
  getGetAdminInquiriesQueryKey,
  setAuthTokenGetter,
} from '@workspace/api-client-react';
import {
  Compass,
  Check,
  Plus,
  Trash2,
  Calendar,
  Users,
  MessageSquare,
  MapPin,
  Layers,
  FileText,
  DollarSign,
  AlertCircle,
  ExternalLink,
  Lock,
  LogIn,
  LogOut,
  Shield,
  Upload,
  ImageIcon,
} from 'lucide-react';

type AdminTab = 'overview' | 'tours' | 'destinations' | 'bookings' | 'inquiries' | 'content';

export default function AdminPage() {
  const [tab, setTab] = useState<AdminTab>('overview');
  const profile = useGetAuthProfile({ query: { queryKey: getGetAuthProfileQueryKey(), retry: false } });
  const client = useQueryClient();

  // Queries
  const toursQuery = useGetAdminTours({ query: { queryKey: getGetAdminToursQueryKey(), enabled: profile.data?.role === 'admin' } });
  const destinationsQuery = useGetAdminDestinations({ query: { queryKey: getGetAdminDestinationsQueryKey(), enabled: profile.data?.role === 'admin' } });
  const bookingsQuery = useGetAdminBookings({ query: { queryKey: getGetAdminBookingsQueryKey(), enabled: profile.data?.role === 'admin' } });
  const inquiriesQuery = useGetAdminInquiries({ query: { queryKey: getGetAdminInquiriesQueryKey(), enabled: profile.data?.role === 'admin' } });
  const contentQuery = useGetAdminSiteContent({ query: { queryKey: getGetAdminSiteContentQueryKey(), enabled: profile.data?.role === 'admin' } });

  // Mutations
  const updateContent = useUpdateAdminSiteContent();
  const createTour = useCreateAdminTour();
  const deleteTour = useDeleteAdminTour();
  const createDestination = useCreateAdminDestination();
  const deleteDestination = useDeleteAdminDestination();
  const updateBookingStatus = useUpdateAdminBookingStatus();
  const updateInquiryStatus = useUpdateAdminInquiryStatus();
  const createFaq = useCreateAdminFaq();
  const createGallery = useCreateAdminGalleryImage();

  // Forms
  const [founderForm, setFounderForm] = useState({
    founderName: '',
    founderBio: '',
    founderImageUrl: '',
  });

  const [tourForm, setTourForm] = useState({
    slug: '',
    title: '',
    destinationId: 1,
    durationDays: 2,
    category: 'Historical & Heritage',
    tourType: 'flexible' as 'private' | 'group' | 'flexible',
    priceAmount: '' as string | number,
    priceCurrency: 'USD',
    imageUrl: '/kano-editorial.jpg',
    summary: '',
    description: '',
  });

  const [destForm, setDestForm] = useState({
    slug: '',
    name: '',
    country: 'Nigeria',
    region: 'Kano State',
    description: '',
    imageUrl: '/kano-editorial.jpg',
    bestTimeToVisit: 'November to February',
  });

  const [faqForm, setFaqForm] = useState({
    question: '',
    answer: '',
    category: 'General',
  });

  const [galleryForm, setGalleryForm] = useState({
    title: '',
    location: 'Kano, Nigeria',
    imageUrl: '/kano-editorial.jpg',
    category: 'Culture',
  });

  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (contentQuery.data) {
      setFounderForm(contentQuery.data);
    }
  }, [contentQuery.data]);

  const showNotification = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  if (profile.isLoading) {
    return <main className="section-pad site-wrap"><p role="status">Verifying administrator access…</p></main>;
  }

  if (profile.isError || profile.data?.role !== 'admin') {
    return (
      <AdminLoginForm
        onSuccess={async () => {
          await client.invalidateQueries({ queryKey: getGetAuthProfileQueryKey() });
          await client.invalidateQueries({ queryKey: getGetAdminToursQueryKey() });
          await client.invalidateQueries({ queryKey: getGetAdminDestinationsQueryKey() });
          await client.invalidateQueries({ queryKey: getGetAdminBookingsQueryKey() });
          await client.invalidateQueries({ queryKey: getGetAdminInquiriesQueryKey() });
          await client.invalidateQueries({ queryKey: getGetAdminSiteContentQueryKey() });
        }}
      />
    );
  }

  const tours = toursQuery.data ?? [];
  const destinations = destinationsQuery.data ?? [];
  const bookings = bookingsQuery.data ?? [];
  const inquiries = inquiriesQuery.data ?? [];

  // Handlers
  const handleSaveFounder = (e: FormEvent) => {
    e.preventDefault();
    updateContent.mutate({ data: founderForm }, {
      onSuccess: async () => {
        await client.invalidateQueries({ queryKey: getGetHomeQueryKey() });
        showNotification('Founder profile updated successfully.');
      },
    });
  };

  const handleCreateTour = (e: FormEvent) => {
    e.preventDefault();
    createTour.mutate({
      data: {
        slug: tourForm.slug.trim().toLowerCase().replaceAll(' ', '-'),
        title: tourForm.title.trim(),
        destinationId: Number(tourForm.destinationId),
        durationDays: Number(tourForm.durationDays),
        category: tourForm.category,
        tourType: tourForm.tourType,
        priceAmount: tourForm.priceAmount ? Number(tourForm.priceAmount) : null,
        priceCurrency: tourForm.priceCurrency || null,
        imageUrl: tourForm.imageUrl.trim(),
        summary: tourForm.summary.trim(),
        description: tourForm.description.trim(),
        isPublished: true,
        isFeatured: false,
        isDemo: false,
      },
    }, {
      onSuccess: async () => {
        await client.invalidateQueries({ queryKey: getGetAdminToursQueryKey() });
        await client.invalidateQueries({ queryKey: getGetHomeQueryKey() });
        setTourForm({
          slug: '',
          title: '',
          destinationId: destinations[0]?.id ?? 1,
          durationDays: 2,
          category: 'Historical & Heritage',
          tourType: 'flexible',
          priceAmount: '',
          priceCurrency: 'USD',
          imageUrl: '/kano-editorial.jpg',
          summary: '',
          description: '',
        });
        showNotification('New journey created and published.');
      },
    });
  };

  const handleDeleteTour = (id: number) => {
    if (!confirm('Are you sure you want to delete this journey?')) return;
    deleteTour.mutate({ id }, {
      onSuccess: async () => {
        await client.invalidateQueries({ queryKey: getGetAdminToursQueryKey() });
        await client.invalidateQueries({ queryKey: getGetHomeQueryKey() });
        showNotification('Tour deleted.');
      },
    });
  };

  const handleCreateDestination = (e: FormEvent) => {
    e.preventDefault();
    createDestination.mutate({
      data: {
        slug: destForm.slug.trim().toLowerCase().replaceAll(' ', '-'),
        name: destForm.name.trim(),
        country: destForm.country.trim(),
        region: destForm.region?.trim() || null,
        description: destForm.description.trim(),
        imageUrl: destForm.imageUrl.trim(),
        bestTimeToVisit: destForm.bestTimeToVisit.trim() || null,
        isPublished: true,
        isFeatured: false,
        isDemo: false,
        sortOrder: 0,
      },
    }, {
      onSuccess: async () => {
        await client.invalidateQueries({ queryKey: getGetAdminDestinationsQueryKey() });
        await client.invalidateQueries({ queryKey: getGetHomeQueryKey() });
        setDestForm({
          slug: '',
          name: '',
          country: 'Nigeria',
          region: 'Kano State',
          description: '',
          imageUrl: '/kano-editorial.jpg',
          bestTimeToVisit: 'November to February',
        });
        showNotification('New destination published.');
      },
    });
  };

  const handleDeleteDestination = (id: number) => {
    if (!confirm('Are you sure you want to delete this destination?')) return;
    deleteDestination.mutate({ id }, {
      onSuccess: async () => {
        await client.invalidateQueries({ queryKey: getGetAdminDestinationsQueryKey() });
        await client.invalidateQueries({ queryKey: getGetHomeQueryKey() });
        showNotification('Destination removed.');
      },
    });
  };

  const handleUpdateBooking = (id: number, status: 'pending' | 'confirmed' | 'cancelled') => {
    updateBookingStatus.mutate({ id, data: { status } }, {
      onSuccess: async () => {
        await client.invalidateQueries({ queryKey: getGetAdminBookingsQueryKey() });
        showNotification(`Booking #${id} status changed to ${status}.`);
      },
    });
  };

  const handleUpdateInquiry = (id: number, status: 'new' | 'in_progress' | 'resolved') => {
    updateInquiryStatus.mutate({ id, data: { status } }, {
      onSuccess: async () => {
        await client.invalidateQueries({ queryKey: getGetAdminInquiriesQueryKey() });
        showNotification(`Inquiry #${id} marked as ${status}.`);
      },
    });
  };

  const handleAddFaq = (e: FormEvent) => {
    e.preventDefault();
    createFaq.mutate({ data: faqForm }, {
      onSuccess: () => {
        setFaqForm({ question: '', answer: '', category: 'General' });
        showNotification('FAQ item published.');
      },
    });
  };

  const handleAddGallery = (e: FormEvent) => {
    e.preventDefault();
    createGallery.mutate({ data: galleryForm }, {
      onSuccess: () => {
        setGalleryForm({ title: '', location: 'Kano, Nigeria', imageUrl: '/kano-editorial.jpg', category: 'Culture' });
        showNotification('Gallery image added.');
      },
    });
  };

  const handleLogout = async () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_email');
    setAuthTokenGetter(async () => null);
    await fetch('/api/auth/admin-logout', { method: 'POST' }).catch(() => {});
    await client.invalidateQueries({ queryKey: getGetAuthProfileQueryKey() });
  };

  return (
    <main style={{ background: '#f8f5ee', minHeight: '85vh' }}>
      {/* Admin Top Header */}
      <section style={{ background: '#28231e', color: '#f8f5ee', padding: '36px clamp(1.25rem, 5vw, 4rem) 28px' }}>
        <div className="site-wrap" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <p className="eyebrow" style={{ color: '#c5a673', margin: 0 }}>Management Portal</p>
            <h1 className="serif" style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 400, margin: '6px 0 0' }}>
              From Kano to the World · Admin
            </h1>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, color: '#c5a673', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Shield size={13} /> {localStorage.getItem('admin_email') || 'yusufhussaini0904@gmail.com'}
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="btn-outline"
              style={{ color: '#eee', borderColor: '#665949', fontSize: 12, padding: '7px 12px' }}
            >
              Sign Out <LogOut size={13} style={{ marginLeft: 6 }} />
            </button>
            <Link href="/" target="_blank" className="btn-gold" style={{ fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              Preview Live Site <ExternalLink size={13} />
            </Link>
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <div style={{ background: '#eee8dc', borderBottom: '1px solid #d8cdbd' }}>
        <div className="site-wrap" style={{ display: 'flex', gap: 4, overflowX: 'auto', padding: '0 1rem' }}>
          {[
            { id: 'overview', label: 'Overview', icon: <Compass size={14} /> },
            { id: 'tours', label: `Tours (${tours.length})`, icon: <MapPin size={14} /> },
            { id: 'destinations', label: `Destinations (${destinations.length})`, icon: <Layers size={14} /> },
            { id: 'bookings', label: `Bookings (${bookings.length})`, icon: <Calendar size={14} /> },
            { id: 'inquiries', label: `Inquiries (${inquiries.length})`, icon: <MessageSquare size={14} /> },
            { id: 'content', label: 'Website Content', icon: <FileText size={14} /> },
          ].map(item => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id as AdminTab)}
              data-testid={`tab-admin-${item.id}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '16px 20px',
                border: 0,
                borderBottom: tab === item.id ? '2px solid #9b7642' : '2px solid transparent',
                background: tab === item.id ? '#f8f5ee' : 'transparent',
                color: tab === item.id ? '#9b7642' : '#574e43',
                fontWeight: tab === item.id ? 600 : 400,
                fontSize: 13,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notification Toast */}
      {successMsg && (
        <div style={{ background: '#e1ede0', borderBottom: '1px solid #b7d6b4', padding: '12px 24px', color: '#2b5c2d', textAlign: 'center', fontSize: 13 }}>
          <Check size={15} style={{ verticalAlign: 'middle', marginRight: 6 }} /> {successMsg}
        </div>
      )}

      {/* Main Tab Content Area */}
      <div className="site-wrap section-pad" style={{ paddingTop: 32 }}>
        {/* ==================== TAB: OVERVIEW ==================== */}
        {tab === 'overview' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 18, marginBottom: 36 }}>
              {[
                { label: 'Published Tours', count: tours.length, icon: <MapPin size={22} color="#9b7642" /> },
                { label: 'Destinations', count: destinations.length, icon: <Layers size={22} color="#9b7642" /> },
                { label: 'Customer Bookings', count: bookings.length, icon: <Calendar size={22} color="#9b7642" /> },
                { label: 'Inquiries Received', count: inquiries.length, icon: <MessageSquare size={22} color="#9b7642" /> },
              ].map(stat => (
                <div key={stat.label} style={{ background: '#fff', border: '1px solid #ddd1bf', padding: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '.08em', color: '#7a6f62' }}>{stat.label}</span>
                    {stat.icon}
                  </div>
                  <p className="serif" style={{ fontSize: 36, margin: '14px 0 0', fontWeight: 400, color: '#28231e' }}>{stat.count}</p>
                </div>
              ))}
            </div>

            {/* Recent Bookings preview */}
            <div style={{ background: '#fff', border: '1px solid #ddd1bf', padding: 28, marginBottom: 28 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                <h2 className="serif" style={{ fontSize: 24, fontWeight: 400, margin: 0 }}>Recent Reservations</h2>
                <button className="btn-outline" onClick={() => setTab('bookings')} style={{ padding: '6px 14px', fontSize: 12 }}>View All</button>
              </div>

              {!bookings.length ? (
                <p style={{ color: '#726759', fontSize: 14 }}>No bookings submitted yet.</p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #eee', textAlign: 'left', color: '#887d70' }}>
                        <th style={{ padding: '8px 12px' }}>Ref</th>
                        <th style={{ padding: '8px 12px' }}>Tour</th>
                        <th style={{ padding: '8px 12px' }}>Guest</th>
                        <th style={{ padding: '8px 12px' }}>Date</th>
                        <th style={{ padding: '8px 12px' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.slice(0, 5).map(b => (
                        <tr key={b.id} style={{ borderBottom: '1px solid #f6f3ed' }}>
                          <td style={{ padding: '10px 12px', fontWeight: 600 }}>{b.bookingReference}</td>
                          <td style={{ padding: '10px 12px' }}>{b.tourTitle}</td>
                          <td style={{ padding: '10px 12px' }}>{b.customerName}</td>
                          <td style={{ padding: '10px 12px' }}>{b.travelDate}</td>
                          <td style={{ padding: '10px 12px' }}><span className="status-pill">{b.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================== TAB: TOURS CMS ==================== */}
        {tab === 'tours' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.35fr) minmax(320px, 0.9fr)', gap: 32, alignItems: 'start' }}>
              {/* Tours Table */}
              <div style={{ background: '#fff', border: '1px solid #ddd1bf', padding: 24 }}>
                <h2 className="serif" style={{ fontSize: 26, fontWeight: 400, margin: '0 0 18px' }}>Published Journeys</h2>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #eee', textAlign: 'left', color: '#887d70' }}>
                        <th style={{ padding: '8px 10px' }}>Title</th>
                        <th style={{ padding: '8px 10px' }}>Destination</th>
                        <th style={{ padding: '8px 10px' }}>Duration</th>
                        <th style={{ padding: '8px 10px' }}>Type</th>
                        <th style={{ padding: '8px 10px', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tours.map(t => (
                        <tr key={t.id} style={{ borderBottom: '1px solid #f4eee3' }}>
                          <td style={{ padding: '10px' }}>
                            <strong>{t.title}</strong>
                            <div style={{ fontSize: 11, color: '#8a7d6e' }}>/{t.slug}</div>
                          </td>
                          <td style={{ padding: '10px' }}>{t.destination}</td>
                          <td style={{ padding: '10px' }}>{t.durationDays}d</td>
                          <td style={{ padding: '10px' }}>{t.tourType}</td>
                          <td style={{ padding: '10px', textAlign: 'right' }}>
                            <button
                              onClick={() => handleDeleteTour(t.id)}
                              aria-label={`Delete tour ${t.title}`}
                              data-testid={`button-delete-tour-${t.id}`}
                              style={{ border: 0, background: 'transparent', color: '#a63d30', cursor: 'pointer', padding: 4 }}
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Create Tour Form */}
              <div style={{ background: '#fff', border: '1px solid #ddd1bf', padding: 28 }}>
                <h3 className="serif" style={{ fontSize: 22, fontWeight: 400, margin: '0 0 16px' }}>Add New Journey</h3>
                <form onSubmit={handleCreateTour} style={{ display: 'grid', gap: 14 }}>
                  <label style={{ fontSize: 12 }}>Tour Title
                    <input className="field" required value={tourForm.title} onChange={e => setTourForm(f => ({ ...f, title: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-') }))} placeholder="e.g. Kano Dyeing & Ramparts" style={{ display: 'block', marginTop: 6 }} />
                  </label>
                  <label style={{ fontSize: 12 }}>Slug
                    <input className="field" required value={tourForm.slug} onChange={e => setTourForm(f => ({ ...f, slug: e.target.value }))} style={{ display: 'block', marginTop: 6 }} />
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <label style={{ fontSize: 12 }}>Destination
                      <select className="field" value={tourForm.destinationId} onChange={e => setTourForm(f => ({ ...f, destinationId: Number(e.target.value) }))} style={{ display: 'block', marginTop: 6 }}>
                        {destinations.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                      </select>
                    </label>
                    <label style={{ fontSize: 12 }}>Duration (Days)
                      <input className="field" type="number" min={1} required value={tourForm.durationDays} onChange={e => setTourForm(f => ({ ...f, durationDays: Number(e.target.value) }))} style={{ display: 'block', marginTop: 6 }} />
                    </label>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <label style={{ fontSize: 12 }}>Category
                      <select className="field" value={tourForm.category} onChange={e => setTourForm(f => ({ ...f, category: e.target.value }))} style={{ display: 'block', marginTop: 6 }}>
                        <option value="Historical & Heritage">Historical & Heritage</option>
                        <option value="Cultural Experiences">Cultural Experiences</option>
                        <option value="Nature & Adventure">Nature & Adventure</option>
                        <option value="Food & Cuisine">Food & Cuisine</option>
                      </select>
                    </label>
                    <label style={{ fontSize: 12 }}>Format
                      <select className="field" value={tourForm.tourType} onChange={e => setTourForm(f => ({ ...f, tourType: e.target.value as any }))} style={{ display: 'block', marginTop: 6 }}>
                        <option value="flexible">Flexible</option>
                        <option value="private">Private</option>
                        <option value="group">Group</option>
                      </select>
                    </label>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 12 }}>
                    <label style={{ fontSize: 12 }}>Price Amount (Optional)
                      <input className="field" type="number" value={tourForm.priceAmount} onChange={e => setTourForm(f => ({ ...f, priceAmount: e.target.value }))} placeholder="e.g. 450" style={{ display: 'block', marginTop: 6 }} />
                    </label>
                    <label style={{ fontSize: 12 }}>Currency
                      <input className="field" value={tourForm.priceCurrency} onChange={e => setTourForm(f => ({ ...f, priceCurrency: e.target.value }))} placeholder="USD" style={{ display: 'block', marginTop: 6 }} />
                    </label>
                  </div>
                  <ImageUploadField
                    label="Journey Cover Image"
                    required
                    value={tourForm.imageUrl}
                    onChange={url => setTourForm(f => ({ ...f, imageUrl: url }))}
                  />
                  <label style={{ fontSize: 12 }}>Summary
                    <textarea className="field" rows={2} required value={tourForm.summary} onChange={e => setTourForm(f => ({ ...f, summary: e.target.value }))} style={{ display: 'block', marginTop: 6 }} />
                  </label>
                  <label style={{ fontSize: 12 }}>Description
                    <textarea className="field" rows={4} required value={tourForm.description} onChange={e => setTourForm(f => ({ ...f, description: e.target.value }))} style={{ display: 'block', marginTop: 6 }} />
                  </label>
                  <button type="submit" className="btn-dark" disabled={createTour.isPending} style={{ marginTop: 8 }}>
                    {createTour.isPending ? 'Publishing…' : 'Publish Journey'} <Plus size={14} />
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB: DESTINATIONS CMS ==================== */}
        {tab === 'destinations' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.35fr) minmax(320px, 0.9fr)', gap: 32, alignItems: 'start' }}>
              {/* Destinations Table */}
              <div style={{ background: '#fff', border: '1px solid #ddd1bf', padding: 24 }}>
                <h2 className="serif" style={{ fontSize: 26, fontWeight: 400, margin: '0 0 18px' }}>Destinations</h2>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #eee', textAlign: 'left', color: '#887d70' }}>
                        <th style={{ padding: '8px 10px' }}>Name</th>
                        <th style={{ padding: '8px 10px' }}>Country</th>
                        <th style={{ padding: '8px 10px' }}>Region</th>
                        <th style={{ padding: '8px 10px', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {destinations.map(d => (
                        <tr key={d.id} style={{ borderBottom: '1px solid #f4eee3' }}>
                          <td style={{ padding: '10px' }}>
                            <strong>{d.name}</strong>
                            <div style={{ fontSize: 11, color: '#8a7d6e' }}>/{d.slug}</div>
                          </td>
                          <td style={{ padding: '10px' }}>{d.country}</td>
                          <td style={{ padding: '10px' }}>{d.region || '—'}</td>
                          <td style={{ padding: '10px', textAlign: 'right' }}>
                            <button
                              onClick={() => handleDeleteDestination(d.id)}
                              aria-label={`Delete destination ${d.name}`}
                              data-testid={`button-delete-dest-${d.id}`}
                              style={{ border: 0, background: 'transparent', color: '#a63d30', cursor: 'pointer', padding: 4 }}
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Create Destination Form */}
              <div style={{ background: '#fff', border: '1px solid #ddd1bf', padding: 28 }}>
                <h3 className="serif" style={{ fontSize: 22, fontWeight: 400, margin: '0 0 16px' }}>Add Destination</h3>
                <form onSubmit={handleCreateDestination} style={{ display: 'grid', gap: 14 }}>
                  <label style={{ fontSize: 12 }}>Destination Name
                    <input className="field" required value={destForm.name} onChange={e => setDestForm(f => ({ ...f, name: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-') }))} placeholder="e.g. Zaria" style={{ display: 'block', marginTop: 6 }} />
                  </label>
                  <label style={{ fontSize: 12 }}>Slug
                    <input className="field" required value={destForm.slug} onChange={e => setDestForm(f => ({ ...f, slug: e.target.value }))} style={{ display: 'block', marginTop: 6 }} />
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <label style={{ fontSize: 12 }}>Country
                      <input className="field" required value={destForm.country} onChange={e => setDestForm(f => ({ ...f, country: e.target.value }))} style={{ display: 'block', marginTop: 6 }} />
                    </label>
                    <label style={{ fontSize: 12 }}>Region
                      <input className="field" value={destForm.region} onChange={e => setDestForm(f => ({ ...f, region: e.target.value }))} style={{ display: 'block', marginTop: 6 }} />
                    </label>
                  </div>
                  <ImageUploadField
                    label="Destination Hero Image"
                    required
                    value={destForm.imageUrl}
                    onChange={url => setDestForm(f => ({ ...f, imageUrl: url }))}
                  />
                  <label style={{ fontSize: 12 }}>Best Time to Visit
                    <input className="field" value={destForm.bestTimeToVisit} onChange={e => setDestForm(f => ({ ...f, bestTimeToVisit: e.target.value }))} style={{ display: 'block', marginTop: 6 }} />
                  </label>
                  <label style={{ fontSize: 12 }}>Description
                    <textarea className="field" rows={4} required value={destForm.description} onChange={e => setDestForm(f => ({ ...f, description: e.target.value }))} style={{ display: 'block', marginTop: 6 }} />
                  </label>
                  <button type="submit" className="btn-dark" disabled={createDestination.isPending} style={{ marginTop: 8 }}>
                    {createDestination.isPending ? 'Publishing…' : 'Publish Destination'} <Plus size={14} />
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB: BOOKINGS MANAGEMENT ==================== */}
        {tab === 'bookings' && (
          <div style={{ background: '#fff', border: '1px solid #ddd1bf', padding: 28 }}>
            <h2 className="serif" style={{ fontSize: 26, fontWeight: 400, margin: '0 0 20px' }}>Customer Reservations</h2>
            {!bookings.length ? (
              <p style={{ color: '#726759', padding: 20 }}>No customer bookings received yet.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #eee', textAlign: 'left', color: '#887d70' }}>
                      <th style={{ padding: '10px 12px' }}>Reference</th>
                      <th style={{ padding: '10px 12px' }}>Tour & Destination</th>
                      <th style={{ padding: '10px 12px' }}>Guest Details</th>
                      <th style={{ padding: '10px 12px' }}>Date</th>
                      <th style={{ padding: '10px 12px' }}>Travelers</th>
                      <th style={{ padding: '10px 12px' }}>Total</th>
                      <th style={{ padding: '10px 12px' }}>Status</th>
                      <th style={{ padding: '10px 12px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map(b => (
                      <tr key={b.id} style={{ borderBottom: '1px solid #f4eee3' }}>
                        <td style={{ padding: '12px', fontWeight: 600 }}>{b.bookingReference}</td>
                        <td style={{ padding: '12px' }}>
                          <div><strong>{b.tourTitle}</strong></div>
                          <div style={{ fontSize: 11, color: '#887d70' }}>{b.destinationName}</div>
                        </td>
                        <td style={{ padding: '12px' }}>
                          <div>{b.customerName}</div>
                          <div style={{ fontSize: 11, color: '#887d70' }}>{b.customerEmail}</div>
                          {b.customerPhone && <div style={{ fontSize: 11, color: '#887d70' }}>{b.customerPhone}</div>}
                        </td>
                        <td style={{ padding: '12px' }}>{b.travelDate}</td>
                        <td style={{ padding: '12px' }}>{b.travelers}</td>
                        <td style={{ padding: '12px' }}>
                          {b.totalAmount !== null ? `${b.currency} ${b.totalAmount}` : 'Quote required'}
                        </td>
                        <td style={{ padding: '12px' }}>
                          <span className="status-pill" style={{
                            background: b.status === 'confirmed' ? '#e2efe1' : b.status === 'cancelled' ? '#fbeae8' : '#eee7dc',
                            color: b.status === 'confirmed' ? '#245a27' : b.status === 'cancelled' ? '#993427' : '#5d5446',
                          }}>
                            {b.status}
                          </span>
                        </td>
                        <td style={{ padding: '12px', textAlign: 'right' }}>
                          <select
                            value={b.status}
                            onChange={e => handleUpdateBooking(b.id, e.target.value as any)}
                            style={{ padding: '4px 8px', fontSize: 11, border: '1px solid #cfc2af' }}
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ==================== TAB: INQUIRIES ==================== */}
        {tab === 'inquiries' && (
          <div style={{ background: '#fff', border: '1px solid #ddd1bf', padding: 28 }}>
            <h2 className="serif" style={{ fontSize: 26, fontWeight: 400, margin: '0 0 20px' }}>Contact Inquiries</h2>
            {!inquiries.length ? (
              <p style={{ color: '#726759', padding: 20 }}>No contact inquiries received yet.</p>
            ) : (
              <div style={{ display: 'grid', gap: 16 }}>
                {inquiries.map(inq => (
                  <div key={inq.id} style={{ border: '1px solid #eee4d5', padding: 20, background: '#faf8f4' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                      <div>
                        <span className="eyebrow" style={{ color: '#9b7642' }}>{inq.subject}</span>
                        <h3 className="serif" style={{ fontSize: 20, fontWeight: 400, margin: '4px 0 6px' }}>{inq.name}</h3>
                        <p style={{ color: '#685d50', fontSize: 12, margin: 0 }}>
                          {inq.email} {inq.phone ? `· ${inq.phone}` : ''} · {new Date(inq.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <select
                          value={inq.status}
                          onChange={e => handleUpdateInquiry(inq.id, e.target.value as any)}
                          style={{ padding: '6px 10px', fontSize: 12, border: '1px solid #cfc2af' }}
                        >
                          <option value="new">New</option>
                          <option value="in_progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                        </select>
                      </div>
                    </div>
                    <p style={{ color: '#484036', fontSize: 14, lineHeight: 1.7, marginTop: 14, whiteSpace: 'pre-line' }}>
                      {inq.message}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==================== TAB: CONTENT CMS ==================== */}
        {tab === 'content' && (
          <div style={{ display: 'grid', gap: 32 }}>
            {/* Founder Content */}
            <div style={{ background: '#fff', border: '1px solid #ddd1bf', padding: 28 }}>
              <p className="eyebrow" style={{ color: '#9b7642' }}>Founder & Heritage Perspective</p>
              <h2 className="serif" style={{ fontSize: 26, fontWeight: 400, margin: '8px 0 20px' }}>Edit Founder Profile</h2>
              <form onSubmit={handleSaveFounder} style={{ display: 'grid', gap: 16 }}>
                <label style={{ fontSize: 12 }}>Founder Name
                  <input className="field" required minLength={2} maxLength={120} value={founderForm.founderName} onChange={e => setFounderForm(f => ({ ...f, founderName: e.target.value }))} style={{ display: 'block', marginTop: 6 }} />
                </label>
                <label style={{ fontSize: 12 }}>Founder Biography
                  <textarea className="field" rows={5} required minLength={10} maxLength={5000} value={founderForm.founderBio} onChange={e => setFounderForm(f => ({ ...f, founderBio: e.target.value }))} style={{ display: 'block', marginTop: 6, resize: 'vertical' }} />
                </label>
                <ImageUploadField
                  label="Founder Portrait Photograph"
                  required
                  value={founderForm.founderImageUrl}
                  onChange={url => setFounderForm(f => ({ ...f, founderImageUrl: url }))}
                />
                <button type="submit" className="btn-dark" disabled={updateContent.isPending} style={{ justifySelf: 'start' }}>
                  {updateContent.isPending ? 'Saving…' : 'Save Founder Content'} <Check size={14} />
                </button>
              </form>
            </div>

            {/* Quick Add FAQ & Gallery Forms */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
              {/* Add FAQ */}
              <div style={{ background: '#fff', border: '1px solid #ddd1bf', padding: 24 }}>
                <h3 className="serif" style={{ fontSize: 20, fontWeight: 400, margin: '0 0 16px' }}>Add FAQ Item</h3>
                <form onSubmit={handleAddFaq} style={{ display: 'grid', gap: 12 }}>
                  <label style={{ fontSize: 12 }}>Question
                    <input className="field" required value={faqForm.question} onChange={e => setFaqForm(f => ({ ...f, question: e.target.value }))} style={{ display: 'block', marginTop: 6 }} />
                  </label>
                  <label style={{ fontSize: 12 }}>Category
                    <input className="field" required value={faqForm.category} onChange={e => setFaqForm(f => ({ ...f, category: e.target.value }))} placeholder="Philosophy, Logistics..." style={{ display: 'block', marginTop: 6 }} />
                  </label>
                  <label style={{ fontSize: 12 }}>Answer
                    <textarea className="field" rows={3} required value={faqForm.answer} onChange={e => setFaqForm(f => ({ ...f, answer: e.target.value }))} style={{ display: 'block', marginTop: 6 }} />
                  </label>
                  <button type="submit" className="btn-dark" disabled={createFaq.isPending} style={{ justifySelf: 'start' }}>
                    Publish FAQ <Plus size={14} />
                  </button>
                </form>
              </div>

              {/* Add Gallery */}
              <div style={{ background: '#fff', border: '1px solid #ddd1bf', padding: 24 }}>
                <h3 className="serif" style={{ fontSize: 20, fontWeight: 400, margin: '0 0 16px' }}>Add Photo to Archive</h3>
                <form onSubmit={handleAddGallery} style={{ display: 'grid', gap: 12 }}>
                  <label style={{ fontSize: 12 }}>Photo Title
                    <input className="field" required value={galleryForm.title} onChange={e => setGalleryForm(f => ({ ...f, title: e.target.value }))} style={{ display: 'block', marginTop: 6 }} />
                  </label>
                  <label style={{ fontSize: 12 }}>Location
                    <input className="field" required value={galleryForm.location} onChange={e => setGalleryForm(f => ({ ...f, location: e.target.value }))} placeholder="e.g. Kano, Nigeria" style={{ display: 'block', marginTop: 6 }} />
                  </label>
                  <ImageUploadField
                    label="Archive Photograph"
                    required
                    value={galleryForm.imageUrl}
                    onChange={url => setGalleryForm(f => ({ ...f, imageUrl: url }))}
                  />
                  <label style={{ fontSize: 12 }}>Category
                    <input className="field" required value={galleryForm.category} onChange={e => setGalleryForm(f => ({ ...f, category: e.target.value }))} placeholder="Craft, Architecture, Culture..." style={{ display: 'block', marginTop: 6 }} />
                  </label>
                  <button type="submit" className="btn-dark" disabled={createGallery.isPending} style={{ justifySelf: 'start' }}>
                    Add Photo <Plus size={14} />
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function AdminLoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState('yusufhussaini0904@gmail.com');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Invalid administrator email address.');
      }

      const data = await res.json();
      localStorage.setItem('admin_token', data.token);
      localStorage.setItem('admin_email', data.email);
      setAuthTokenGetter(async () => data.token);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="section-pad site-wrap" style={{ minHeight: '65vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fbf9f4', border: '1px solid #dcd1c2', padding: 'clamp(28px, 5vw, 48px)', maxWidth: 480, width: '100%', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
          <span style={{ width: 42, height: 42, borderRadius: '50%', background: '#a9854d', display: 'grid', placeItems: 'center', color: '#fff' }}>
            <Lock size={20} />
          </span>
          <div>
            <p className="eyebrow" style={{ margin: 0, color: '#a9854d' }}>Management Portal</p>
            <h1 className="serif" style={{ fontSize: 26, fontWeight: 400, margin: 0 }}>Administrator Sign In</h1>
          </div>
        </div>

        <p style={{ color: '#685e51', fontSize: 13, lineHeight: 1.6, marginBottom: 22 }}>
          Sign in with the authorized administrator email to manage journeys, destinations, reservations, inquiries, and platform content.
        </p>

        {error && (
          <div role="alert" style={{ background: '#fdf2f0', border: '1px solid #f2cfca', color: '#983e31', padding: '10px 14px', fontSize: 13, marginBottom: 18, borderRadius: 2 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16 }}>
          <label style={{ fontSize: 12, fontWeight: 500, color: '#4a4238' }}>
            Administrator Email
            <input
              type="email"
              required
              className="field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. yusufhussaini0904@gmail.com"
              style={{ display: 'block', marginTop: 8 }}
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="btn-dark"
            style={{ width: '100%', justifyContent: 'center', marginTop: 6 }}
          >
            {loading ? 'Authenticating…' : 'Sign In as Administrator'} <LogIn size={15} style={{ marginLeft: 8 }} />
          </button>
        </form>

        <div style={{ marginTop: 24, paddingTop: 18, borderTop: '1px solid #e8e0d4', textAlign: 'center' }}>
          <p style={{ fontSize: 12, color: '#7a7063', margin: 0 }}>
            Configured administrator: <strong>yusufhussaini0904@gmail.com</strong>
          </p>
        </div>
      </div>
    </main>
  );
}

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  required?: boolean;
}

function ImageUploadField({ label, value, onChange, required = false }: ImageUploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (JPEG, PNG, WebP, GIF, SVG).');
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setUploadError('Image size exceeds 25MB limit.');
      return;
    }

    setUploading(true);
    setUploadError('');

    try {
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
      });
      reader.readAsDataURL(file);
      const dataUri = await base64Promise;

      const token = localStorage.getItem('admin_token');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          filename: file.name,
          data: dataUri,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to upload image.');
      }

      const result = await res.json();
      onChange(result.url);
    } catch (err: any) {
      setUploadError(err.message || 'Error uploading image.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div style={{ display: 'grid', gap: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 12, fontWeight: 500, color: '#383028' }}>{label}</span>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          style={{ background: 'none', border: 'none', color: '#8a652f', fontSize: 11, cursor: 'pointer', textDecoration: 'underline' }}
        >
          {showUrlInput ? 'Upload file instead' : 'Enter URL manually'}
        </button>
      </div>

      {showUrlInput ? (
        <input
          type="text"
          className="field"
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="e.g. /kano-editorial.jpg or https://..."
          style={{ display: 'block' }}
        />
      ) : (
        <div style={{ display: 'grid', gap: 10 }}>
          <div
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: '2px dashed #d5c8b6',
              background: '#fbf9f4',
              padding: '16px 14px',
              textAlign: 'center',
              cursor: 'pointer',
              borderRadius: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#ede3d3', display: 'grid', placeItems: 'center', color: '#8a652f' }}>
              <Upload size={16} />
            </div>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: '#28231e' }}>
              {uploading ? 'Uploading image to server…' : 'Choose image to upload from your computer'}
            </p>
            <p style={{ margin: 0, fontSize: 11, color: '#7a7063' }}>
              Supports JPG, PNG, WebP, GIF, SVG (up to 25MB)
            </p>
          </div>

          {uploadError && (
            <p role="alert" style={{ color: '#983e31', fontSize: 12, margin: 0 }}>
              {uploadError}
            </p>
          )}

          {value && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#fff', border: '1px solid #dfd3c3', padding: 8 }}>
              <img
                src={value}
                alt="Uploaded preview"
                style={{ width: 56, height: 56, objectFit: 'cover', border: '1px solid #d8cdbd' }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: 12, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#28231e' }}>
                  {value}
                </p>
                <p style={{ margin: '2px 0 0', fontSize: 11, color: '#326830', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Check size={12} /> Image ready
                </p>
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="btn-outline"
                style={{ fontSize: 11, padding: '5px 10px' }}
              >
                Change
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
