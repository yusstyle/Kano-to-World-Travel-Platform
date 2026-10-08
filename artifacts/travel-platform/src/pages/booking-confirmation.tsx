import { useParams, Link } from 'wouter';
import { useGetBooking, getGetBookingQueryKey } from '@workspace/api-client-react';
import { ArrowLeft, Check, Printer, Send, Compass, Clock, Calendar, Users, ShieldCheck } from 'lucide-react';

export default function BookingConfirmationPage() {
  const params = useParams<{ reference: string }>();
  const reference = params.reference ?? '';
  const query = useGetBooking(reference, { query: { queryKey: getGetBookingQueryKey(reference), enabled: Boolean(reference) } });

  if (query.isLoading) {
    return (
      <main className="section-pad site-wrap" style={{ minHeight: '60vh', display: 'grid', placeItems: 'center' }}>
        <p role="status">Loading reservation details…</p>
      </main>
    );
  }

  if (query.isError || !query.data) {
    return (
      <main className="section-pad site-wrap" style={{ textAlign: 'center', minHeight: '60vh' }}>
        <h1 className="serif" style={{ fontSize: 36, margin: '20px 0' }}>Reservation Not Found</h1>
        <p style={{ color: '#685e51', maxWidth: 460, margin: '0 auto 24px' }}>
          We could not locate a reservation matching reference <code style={{ background: '#eee', padding: '2px 6px' }}>{reference}</code>.
        </p>
        <Link href="/tours" className="btn-dark">Explore Journeys</Link>
      </main>
    );
  }

  const booking = query.data;
  const isConfirmed = booking.status === 'confirmed';

  return (
    <main className="section-pad" style={{ background: '#f8f5ee', minHeight: '80vh' }}>
      <div className="site-wrap" style={{ maxWidth: 840 }}>
        <Link href="/tours" className="auth-back-link" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
          <ArrowLeft size={14} /> Back to all journeys
        </Link>

        {/* Confirmation Header Card */}
        <div style={{ background: '#fff', border: '1px solid #d9cdbd', padding: 'clamp(24px, 5vw, 48px)', marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
            <span style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: isConfirmed ? '#2f6336' : '#9b7642',
              color: '#fff',
              display: 'grid',
              placeItems: 'center',
            }}>
              {isConfirmed ? <ShieldCheck size={24} /> : <Check size={24} />}
            </span>
            <div>
              <p className="eyebrow" style={{ color: '#9b7642', margin: 0 }}>
                {isConfirmed ? 'Reservation Confirmed' : 'Reservation Request Received'}
              </p>
              <h1 className="serif" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', margin: 0, fontWeight: 400 }}>
                {isConfirmed ? 'Your Journey is Confirmed' : 'Thank You for Your Reservation'}
              </h1>
            </div>
          </div>

          <p style={{ color: '#63594e', lineHeight: 1.8, fontSize: 15, margin: '14px 0 24px' }}>
            We have recorded your booking details. An acknowledgement copy and travel concierge briefing will be sent to{' '}
            <strong>{booking.customerEmail}</strong>.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', padding: '16px 20px', background: '#f5f0e6', borderLeft: '3px solid #9b7642' }}>
            <span style={{ fontSize: 13, color: '#726453' }}>Booking Reference:</span>
            <strong style={{ fontSize: 18, letterSpacing: '.05em', color: '#28231e' }} data-testid="text-booking-reference">
              {booking.bookingReference}
            </strong>
            <span className="status-pill" style={{ marginLeft: 'auto', textTransform: 'capitalize' }}>
              {booking.status}
            </span>
          </div>
        </div>

        {/* Journey & Customer Summary Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, marginBottom: 28 }}>
          {/* Journey Card */}
          <div style={{ background: '#fff', border: '1px solid #d9cdbd', padding: 28 }}>
            <p className="eyebrow" style={{ color: '#9b7642' }}>Journey Particulars</p>
            <h3 className="serif" style={{ fontSize: 24, fontWeight: 400, margin: '8px 0 16px' }}>{booking.tourTitle}</h3>
            
            <div style={{ display: 'grid', gap: 12, fontSize: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#554c41' }}>
                <Compass size={16} color="#9b7642" />
                <span>Destination: <strong>{booking.destinationName}</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#554c41' }}>
                <Calendar size={16} color="#9b7642" />
                <span>Preferred Date: <strong>{booking.travelDate}</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#554c41' }}>
                <Users size={16} color="#9b7642" />
                <span>Travelers: <strong>{booking.travelers} {booking.travelers === 1 ? 'person' : 'people'}</strong></span>
              </div>
              {typeof booking.totalAmount === 'number' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#554c41', borderTop: '1px solid #eee', paddingTop: 10 }}>
                  <Clock size={16} color="#9b7642" />
                  <span>Estimated Total: <strong>{new Intl.NumberFormat(undefined, { style: 'currency', currency: booking.currency }).format(booking.totalAmount)}</strong></span>
                </div>
              )}
            </div>
          </div>

          {/* Guest Information */}
          <div style={{ background: '#fff', border: '1px solid #d9cdbd', padding: 28 }}>
            <p className="eyebrow" style={{ color: '#9b7642' }}>Guest Details</p>
            <h3 className="serif" style={{ fontSize: 24, fontWeight: 400, margin: '8px 0 16px' }}>{booking.customerName}</h3>

            <div style={{ display: 'grid', gap: 12, fontSize: 14, color: '#554c41' }}>
              <div>Email: <strong>{booking.customerEmail}</strong></div>
              {booking.customerPhone && <div>Phone: <strong>{booking.customerPhone}</strong></div>}
              {booking.specialRequests && (
                <div style={{ borderTop: '1px solid #eee', paddingTop: 10, fontSize: 13, color: '#6a5f52' }}>
                  <span className="eyebrow" style={{ display: 'block', marginBottom: 4 }}>Special Requests</span>
                  {booking.specialRequests}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', background: '#eee8dc', padding: '18px 24px' }}>
          <button
            type="button"
            className="btn-outline"
            onClick={() => window.print()}
            data-testid="button-print-booking"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff' }}
          >
            <Printer size={15} /> Print / Save PDF
          </button>

          <div style={{ display: 'flex', gap: 12 }}>
            <Link
              href={`/contact?subject=${encodeURIComponent(`Booking Ref: ${booking.bookingReference} Inquiry`)}`}
              className="btn-dark"
              data-testid="link-booking-support"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
            >
              Contact Concierge <Send size={14} />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
