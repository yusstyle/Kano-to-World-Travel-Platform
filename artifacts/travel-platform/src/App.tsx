import { useEffect, useRef, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { ClerkProvider, Show, SignIn, SignUp, useClerk, useSession, useUser } from '@clerk/react';
import { publishableKeyFromHost } from '@clerk/react/internal';
import { shadcn } from '@clerk/themes';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import ExperiencesPage from '@/pages/experiences';
import BlogPage from '@/pages/blog';
import BlogDetailPage from '@/pages/blog-detail';
import GalleryPage from '@/pages/gallery';
import FaqPage from '@/pages/faq';
import BookingConfirmationPage from '@/pages/booking-confirmation';
import AdminPage from '@/pages/admin';
import { Link, Redirect, Route, Router as WouterRouter, Switch, useLocation, useParams } from 'wouter';
import { ArrowDown, ArrowLeft, ArrowRight, Check, Compass, Menu, Search, Send, X, Calendar, Users, Clock } from 'lucide-react';
import {
  getGetTourQueryKey, getGetDestinationQueryKey,
  useGetHome, useGetTours, useGetTour, useGetDestinations, useGetDestination,
  useHealthCheck, useSubmitContact, useSubscribeNewsletter,
  useGetAuthProfile, useInitializeAdmin, useGetAdminSiteContent,
  useUpdateAdminSiteContent, useCreateBooking, getGetAuthProfileQueryKey,
  getGetAdminSiteContentQueryKey, getGetHomeQueryKey, setAuthTokenGetter,
} from '@workspace/api-client-react';
import type { Destination, DestinationDetail, Tour, TourCard } from '@workspace/api-client-react';

const queryClient = new QueryClient();
const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');
const configuredClerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const clerkEnabled = Boolean(configuredClerkKey);
const clerkPubKey = clerkEnabled
  ? publishableKeyFromHost(window.location.hostname, configuredClerkKey)
  : '';
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;

if (typeof window !== 'undefined') {
  const savedAdminToken = localStorage.getItem('admin_token');
  if (savedAdminToken) {
    setAuthTokenGetter(async () => localStorage.getItem('admin_token'));
  }
}

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || '/'
    : path;
}

const clerkAppearance = {
  theme: shadcn,
  cssLayerName: 'clerk',
  options: {
    logoPlacement: 'inside' as const,
    logoLinkUrl: basePath || '/',
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
  },
  variables: {
    colorPrimary: '#a9854d',
    colorForeground: '#28231e',
    colorMutedForeground: '#756957',
    colorDanger: '#983e31',
    colorBackground: '#f8f5ee',
    colorInput: '#fbf9f4',
    colorInputForeground: '#28231e',
    colorNeutral: '#cfc2af',
    fontFamily: '"DM Sans", sans-serif',
    borderRadius: '2px',
  },
  elements: {
    rootBox: 'w-full flex justify-center',
    cardBox: 'bg-[#f8f5ee] rounded-none w-[440px] max-w-full border border-[#ddd0bd] shadow-none overflow-hidden',
    card: '!shadow-none !border-0 !bg-transparent !rounded-none',
    footer: '!shadow-none !border-0 !bg-transparent !rounded-none',
    headerTitle: 'text-[#28231e] font-serif',
    headerSubtitle: 'text-[#6e655a]',
    socialButtonsBlockButtonText: 'text-[#28231e]',
    formFieldLabel: 'text-[#28231e]',
    footerActionLink: 'text-[#765a2e]',
    footerActionText: 'text-[#6e655a]',
    dividerText: 'text-[#7a7063]',
    identityPreviewEditButton: 'text-[#765a2e]',
    formFieldSuccessText: 'text-[#344732]',
    alertText: 'text-[#983e31]',
    logoBox: 'mx-auto',
    logoImage: 'max-h-10',
    socialButtonsBlockButton: 'border-[#cfc2af] bg-[#fbf9f4]',
    formButtonPrimary: 'bg-[#28231e] text-white hover:bg-[#473a2b]',
    formFieldInput: 'bg-[#fbf9f4] text-[#28231e] border-[#cfc2af]',
    footerAction: 'text-[#6e655a]',
    dividerLine: 'bg-[#ded4c6]',
    alert: 'border-[#d8b7ad]',
    otpCodeFieldInput: 'bg-[#fbf9f4] text-[#28231e] border-[#cfc2af]',
    formFieldRow: 'text-[#28231e]',
    main: 'text-[#28231e]',
  },
};

function Header() {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();
  const health = useHealthCheck();
  const nav = [
    { href: '/tours', text: 'Tours' },
    { href: '/destinations', text: 'Destinations' },
    { href: '/experiences', text: 'Experiences' },
    { href: '/blog', text: 'Stories' },
    { href: '/gallery', text: 'Gallery' },
    { href: '/faq', text: 'FAQ' },
    { href: '/about', text: 'Our story' },
    { href: '/admin', text: 'Admin' },
  ];
  return <header className="topbar" style={{ position: 'relative', zIndex: 30, background: '#f8f5ee', borderBottom: '1px solid #e6ded1' }}>
    <div className="site-wrap" style={{ minHeight: 82, padding: '0 clamp(1rem,5vw,4.5rem)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
      <Link href="/" data-testid="link-home" style={{ textDecoration: 'none', color: '#28231e', display: 'flex', alignItems: 'center', gap: 11 }}>
        <span style={{ width: 34, height: 34, border: '1px solid #a9854d', borderRadius: '50%', display: 'grid', placeItems: 'center', color: '#987441' }}><Compass size={17}/></span>
        <span style={{ display: 'grid', lineHeight: 1.05 }}><span className="serif" style={{ fontSize: 16, letterSpacing: '.01em' }}>From Kano</span><span style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '.2em', marginTop: 4 }}>to the world</span></span>
      </Link>
      <button className="menu-toggle btn-outline" onClick={() => setOpen(!open)} aria-label={open ? 'Close navigation' : 'Open navigation'} data-testid="button-menu" style={{ padding: 10, border: 0 }}>{open ? <X size={21}/> : <Menu size={21}/>}</button>
      <nav className={`nav-items ${open ? 'open' : ''}`} aria-label="Main navigation" style={{ alignItems: 'center', gap: 'clamp(14px,2.2vw,32px)' }}>
        {nav.map(item => <Link key={item.href} href={item.href} className="nav-link" data-testid={`link-nav-${item.text.toLowerCase().replaceAll(' ','-')}`} onClick={() => setOpen(false)} style={{ fontSize: 12, color: location === item.href ? '#987441' : (item.href === '/admin' ? '#8a652f' : '#4a433a'), fontWeight: item.href === '/admin' ? 500 : 400 }}>{item.text}</Link>)}
        {clerkEnabled && <>
          <Show when="signed-out"><Link href="/sign-in" className="nav-link" data-testid="link-sign-in" onClick={() => setOpen(false)} style={{ fontSize: 12, color: '#4a433a' }}>Sign in</Link><Link href="/sign-up" className="nav-link" data-testid="link-sign-up" onClick={() => setOpen(false)} style={{ fontSize: 12, color: '#4a433a' }}>Create account</Link></Show>
          <Show when="signed-in"><Link href="/account" className="nav-link" data-testid="link-account" onClick={() => setOpen(false)} style={{ fontSize: 12, color: '#4a433a' }}>My account</Link></Show>
        </>}
        <Link href="/contact" className="btn-dark" data-testid="link-contact-nav" onClick={() => setOpen(false)} style={{ padding: '10px 15px', fontSize: 12 }}>Make an enquiry <ArrowRight size={14}/></Link>
      </nav>
    </div>
    <span aria-hidden="true" data-testid="status-discovery-service" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden' }}>{health.isError ? 'Discovery service unavailable' : 'Discovery service'}</span>
  </header>;
}

function Footer() {
  const [email, setEmail] = useState('');
  const newsletter = useSubscribeNewsletter();
  const [receipt, setReceipt] = useState('');
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    newsletter.mutate({ data: { email } }, { onSuccess: result => { setReceipt(result.message); setEmail(''); } });
  };
  return <footer className="dark-panel" style={{ padding: '72px clamp(1.25rem,6vw,6rem) 28px' }}>
    <div className="site-wrap">
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1.2fr', gap: 48, paddingBottom: 60 }}>
        <div><p className="eyebrow" style={{ color: '#c3a574' }}>From Kano to the World</p><h2 className="serif" style={{ fontWeight: 400, fontSize: 32, lineHeight: 1.2, maxWidth: 370, margin: '17px 0' }}>A deeper way to meet a place.</h2><p style={{ color: '#c3b9aa', fontSize: 13, lineHeight: 1.8, maxWidth: 340 }}>Cultural and historical journeys shaped by a perspective rooted in Kano.</p></div>
        <div><p className="eyebrow" style={{ color: '#c3a574' }}>Explore</p><div style={{ display: 'grid', gap: 12, marginTop: 18, fontSize: 13 }}>
          <Link href="/tours" data-testid="link-footer-tours" style={{ color: '#eee5d8', textDecoration: 'none' }}>Tours</Link>
          <Link href="/destinations" data-testid="link-footer-destinations" style={{ color: '#eee5d8', textDecoration: 'none' }}>Destinations</Link>
          <Link href="/experiences" data-testid="link-footer-experiences" style={{ color: '#eee5d8', textDecoration: 'none' }}>Experiences</Link>
          <Link href="/blog" data-testid="link-footer-blog" style={{ color: '#eee5d8', textDecoration: 'none' }}>Travel Stories</Link>
          <Link href="/gallery" data-testid="link-footer-gallery" style={{ color: '#eee5d8', textDecoration: 'none' }}>Visual Archive</Link>
          <Link href="/faq" data-testid="link-footer-faq" style={{ color: '#eee5d8', textDecoration: 'none' }}>FAQ</Link>
          <Link href="/admin" data-testid="link-footer-admin" style={{ color: '#c5a673', textDecoration: 'none', fontWeight: 500 }}>Admin Portal</Link>
          <Link href="/about" data-testid="link-footer-about" style={{ color: '#eee5d8', textDecoration: 'none' }}>Our story</Link>
          <Link href="/contact" data-testid="link-footer-contact" style={{ color: '#eee5d8', textDecoration: 'none' }}>Contact</Link>
        </div></div>
        <div><p className="eyebrow" style={{ color: '#c3a574' }}>Letters from the road</p><p style={{ color: '#c3b9aa', fontSize: 13, lineHeight: 1.7 }}>Occasional notes on places, people and the histories that stay with us.</p>
          <form onSubmit={submit} style={{ display: 'flex', gap: 8, marginTop: 18 }}><label className="sr-only" htmlFor="newsletter-email">Email address</label><input id="newsletter-email" className="field" type="email" required placeholder="Your email address" value={email} onChange={e => setEmail(e.target.value)} data-testid="input-newsletter-email" style={{ background: '#332d27', color: '#f6f1e8', borderColor: '#61564a' }}/><button className="btn-gold" disabled={newsletter.isPending} aria-label="Subscribe to newsletter" data-testid="button-newsletter-submit" style={{ padding: '0 16px' }}>{newsletter.isPending ? 'Sending' : <Send size={16}/>}</button></form>
          {receipt && <p role="status" data-testid="status-newsletter-success" style={{ color: '#d5c29f', fontSize: 12, marginTop: 10 }}>{receipt}</p>}
          {newsletter.isError && <p role="alert" data-testid="status-newsletter-error" style={{ color: '#efb7a9', fontSize: 12, marginTop: 10 }}>We could not add you just now. Please try again.</p>}
        </div>
      </div>
      <div style={{ borderTop: '1px solid #51483e', paddingTop: 20, display: 'flex', justifyContent: 'space-between', gap: 12, color: '#a99d8c', fontSize: 11 }}><span>© {new Date().getFullYear()} From Kano to the World</span><span>Rooted in Kano. Open to the world.</span></div>
    </div>
  </footer>;
}

function Shell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <div key={location} className="reveal"><Header/>{children}<Footer/></div>;
}

function PageIntro({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return <section style={{ background: '#eee8dc', padding: 'clamp(4rem,8vw,7.5rem) clamp(1.25rem,8vw,8rem) 4rem' }}><div className="site-wrap"><p className="eyebrow">{eyebrow}</p><h1 className="serif" style={{ fontSize: 'clamp(2.9rem,7vw,6.5rem)', lineHeight: 1.02, fontWeight: 400, letterSpacing: '-.04em', maxWidth: 950, margin: '20px 0' }}>{title}</h1>{text && <p style={{ fontSize: 16, lineHeight: 1.8, color: '#6e655a', maxWidth: 650 }}>{text}</p>}</div></section>;
}

function LoadingCards() {
  return <div className="content-grid" data-testid="loading-cards">{[0,1,2].map(i => <div key={i}><div className="skeleton" style={{ height: 280 }}/><div className="skeleton" style={{ height: 24, marginTop: 18, width: '70%'}}/><div className="skeleton" style={{ height: 15, marginTop: 12, width: '92%'}}/></div>)}</div>;
}
function ErrorState({ retry, label = 'We could not load this just now.' }: { retry: () => void; label?: string }) {
  return <div role="alert" data-testid="status-load-error" style={{ padding: '46px 24px', border: '1px solid #dfd4c4', textAlign: 'center', background: '#f8f5ee' }}><p className="serif" style={{ fontSize: 25 }}>{label}</p><button className="btn-outline" onClick={retry} data-testid="button-retry">Try again</button></div>;
}
function EmptyState({ title, text }: { title: string; text: string }) {
  return <div data-testid="status-empty" style={{ padding: '60px 20px', textAlign: 'center', background: '#f2ede4' }}><Compass size={24} color="#9b7642"/><h3 className="serif" style={{ fontWeight: 400, fontSize: 28, margin: '15px 0 8px' }}>{title}</h3><p style={{ color: '#72685d', maxWidth: 440, margin: 'auto', lineHeight: 1.7 }}>{text}</p></div>;
}

function DemoMarker({ demo }: { demo: boolean }) { return demo ? <span className="demo-pill" data-testid="badge-demo">Illustrative demo</span> : null; }

function TourCardView({ tour, linkQuery = '' }: { tour: TourCard; linkQuery?: string }) {
  const availability = tour.isDemo ? 'Demo — not for sale' : tour.availabilityStatus === 'scheduled' ? 'Scheduled' : tour.availabilityStatus === 'unavailable' ? 'Unavailable' : 'Enquire for details';
  return <article className="image-card" data-testid={`card-tour-${tour.id}`} style={{ background: '#faf8f2' }}>
    <Link href={`/tours/${tour.slug}${linkQuery ? `?${linkQuery}` : ''}`} data-testid={`link-tour-${tour.id}`} style={{ display: 'block', color: 'inherit', textDecoration: 'none' }}>
      <div style={{ position: 'relative', overflow: 'hidden', height: 'clamp(230px,29vw,360px)', background: '#d7cbbb' }}><img src={tour.imageUrl} alt={tour.destination} style={{ width: '100%', height: '100%', objectFit: 'cover' }} data-testid={`img-tour-${tour.id}`}/><div style={{ position: 'absolute', top: 15, left: 15 }}><DemoMarker demo={tour.isDemo}/></div><span className="status-pill" style={{ position: 'absolute', right: 15, bottom: 15 }}>{availability}</span></div>
      <div style={{ padding: '22px 22px 25px' }}><p className="eyebrow">{tour.destination}, {tour.country}</p><h3 className="serif card-title" style={{ fontWeight: 400, margin: '11px 0' }}>{tour.title}</h3><p style={{ color: '#6c6257', fontSize: 13, lineHeight: 1.65, minHeight: 43 }}>{tour.summary}</p><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e5ddd1', paddingTop: 15, marginTop: 17, fontSize: 11, color: '#675e52', textTransform: 'uppercase', letterSpacing: '.08em' }}><span>{tour.durationDays} days · {tour.category}</span><span className="serif" style={{ color: '#9b7642', fontSize: 17, textTransform: 'none', letterSpacing: 0 }}>Discover <ArrowRight size={14} style={{ verticalAlign: 'middle' }}/></span></div></div>
    </Link>
  </article>;
}

function DestinationCard({ destination }: { destination: Destination }) {
  return <Link href={`/destinations/${destination.slug}`} className="image-card" data-testid={`card-destination-${destination.id}`} style={{ display: 'block', position: 'relative', overflow: 'hidden', minHeight: 350, color: '#fff', textDecoration: 'none', background: '#675742' }}>
    <img src={destination.imageUrl} alt={destination.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} data-testid={`img-destination-${destination.id}`}/>
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg,rgba(26,22,18,.82),transparent 72%)' }}/>
    <div style={{ position: 'absolute', top: 18, left: 18 }}><DemoMarker demo={destination.isDemo}/></div>
    <div style={{ position: 'absolute', bottom: 24, left: 25, right: 24 }}><p style={{ fontSize: 10, letterSpacing: '.18em', textTransform: 'uppercase', marginBottom: 9 }}>{destination.country}{destination.region ? ` · ${destination.region}` : ''}</p><h3 className="serif" style={{ fontWeight: 400, fontSize: 37, margin: 0 }}>{destination.name}</h3><span style={{ display: 'inline-flex', gap: 8, alignItems: 'center', marginTop: 12, fontSize: 11, textTransform: 'uppercase', letterSpacing: '.12em' }}>Explore destination <ArrowRight size={14}/></span></div>
  </Link>;
}

function HomePage() {
  const home = useGetHome();
  const [, setLocation] = useLocation();
  const [travelPlan, setTravelPlan] = useState({ destination: '', travelDate: '', travelers: '2', category: '' });
  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (travelPlan.destination) params.set('destination', travelPlan.destination);
    if (travelPlan.category) params.set('category', travelPlan.category);
    if (travelPlan.travelDate) params.set('travelDate', travelPlan.travelDate);
    if (travelPlan.travelers) params.set('travelers', travelPlan.travelers);
    const queryString = params.toString();
    setLocation(`/tours${queryString ? `?${queryString}` : ''}`);
  };
  return <Shell><main>
    <section className="hero-image" style={{ minHeight: 'min(760px,calc(100svh - 82px))', backgroundImage: "linear-gradient(90deg,rgba(24,21,18,.75) 0%,rgba(24,21,18,.42) 47%,rgba(24,21,18,.08) 100%),url('/kano-editorial.jpg')", display: 'flex', alignItems: 'center', color: '#fbf7ee' }} data-testid="section-home-hero">
      <div className="site-wrap" style={{ width: '100%', padding: '6rem clamp(1.25rem,9vw,9rem)' }}><p className="eyebrow" style={{ color: '#d5b782' }}>From Kano to the World.</p><h1 className="serif cover-title" style={{ maxWidth: 1050, margin: '26px 0 25px' }}>Discover the World. Experience Its Story.</h1><p style={{ fontSize: 'clamp(15px,1.7vw,19px)', lineHeight: 1.75, maxWidth: 690, color: '#e6ded2' }}>Curated journeys, cultural experiences and unforgettable adventures — from the historic city of Kano to remarkable destinations around the world.</p><div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 34 }}><Link href="/tours" className="btn-gold" data-testid="link-explore-tours">EXPLORE TOURS <ArrowRight size={15}/></Link><a href="#travel-search" className="btn-outline" data-testid="link-plan-your-journey" style={{ borderColor: 'rgba(255,255,255,.5)', color: '#fff' }}>PLAN YOUR JOURNEY</a><Link href="/about" data-testid="link-meet-founder" style={{ color: '#fff', textDecoration: 'underline', textUnderlineOffset: 5, fontSize: 12, alignSelf: 'center', marginLeft: 5 }}>Meet our founder</Link></div><a href="#discover" aria-label="Scroll to discover" data-testid="link-scroll-discover" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, color: '#d7c6a7', marginTop: 45, textDecoration: 'none', fontSize: 10, letterSpacing: '.17em', textTransform: 'uppercase' }}>Scroll to discover <ArrowDown size={14}/></a></div>
    </section>
    <section id="discover" className="section-pad" style={{ background: '#f8f5ee' }}><div className="site-wrap"><div style={{ display: 'grid', gridTemplateColumns: '1fr minmax(260px, .72fr)', gap: 50, alignItems: 'end', marginBottom: 44 }}><div><p className="eyebrow">The perspective</p><h2 className="serif" style={{ fontWeight: 400, fontSize: 'clamp(2.5rem,5vw,4.4rem)', lineHeight: 1.07, maxWidth: 680, margin: '16px 0 0' }}>Travel is richer when you know what you’re looking at.</h2></div><p style={{ color: '#6b6258', fontSize: 15, lineHeight: 1.8, margin: 0 }}>Rooted in Kano and informed by museum experience, each journey invites you to look beyond the landmark—to the living histories, craft and ideas that make a place.</p></div><div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>{home.data?.experienceCategories?.map((item,i) => <span key={`${item}-${i}`} data-testid={`tag-experience-${i}`} style={{ border: '1px solid #cfc2af', padding: '10px 15px', fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: '#5f5549' }}>{item}</span>)}</div></div></section>
    <section id="travel-search" className="travel-search section-pad" style={{ background: '#e7ddcc', paddingTop: 38, paddingBottom: 38 }} data-testid="section-travel-search"><div className="site-wrap"><div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 20, marginBottom: 20 }}><div><p className="eyebrow">Your starting point</p><h2 className="serif" style={{ fontWeight: 400, fontSize: 30, margin: '8px 0 0' }}>Plan a journey</h2></div><p style={{ color: '#756957', fontSize: 11, maxWidth: 380 }}>Dates and traveler count are planning details only—not availability or a booking.</p></div>
      <form onSubmit={submitSearch} className="travel-search-form">
        <label className="search-label">Destination<select className="field" value={travelPlan.destination} onChange={e => setTravelPlan(p => ({ ...p, destination: e.target.value }))} data-testid="select-home-destination"><option value="">Any destination</option>{home.data?.featuredDestinations?.map(d => <option key={d.id} value={d.name}>{d.name}{d.isDemo ? ' — demo' : ''}</option>)}</select></label>
        <label className="search-label">Travel date<input className="field" type="date" value={travelPlan.travelDate} onChange={e => setTravelPlan(p => ({ ...p, travelDate: e.target.value }))} data-testid="input-home-travel-date"/></label>
        <label className="search-label">Travelers<select className="field" value={travelPlan.travelers} onChange={e => setTravelPlan(p => ({ ...p, travelers: e.target.value }))} data-testid="select-home-travelers">{Array.from({length: 10},(_,i) => <option key={i+1} value={String(i+1)}>{i+1} {i === 0 ? 'traveler' : 'travelers'}</option>)}</select></label>
        <label className="search-label">Experience type<select className="field" value={travelPlan.category} onChange={e => setTravelPlan(p => ({ ...p, category: e.target.value }))} data-testid="select-home-experience-type"><option value="">Any experience</option>{home.data?.experienceCategories?.map((c,i) => <option key={`${c}-${i}`} value={c}>{c}</option>)}</select></label>
        <button type="submit" className="btn-dark" data-testid="button-home-search" style={{ minHeight: 48, whiteSpace: 'nowrap' }}>Find a journey <ArrowRight size={14}/></button>
      </form>
    </div></section>
    <section className="section-pad" style={{ background: '#eee8dc' }}><div className="site-wrap"><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: 20, marginBottom: 34 }}><div><p className="eyebrow">A few ways in</p><h2 className="serif" style={{ fontSize: 'clamp(2.4rem,5vw,4rem)', fontWeight: 400, margin: '13px 0 0' }}>Featured journeys</h2></div><Link href="/tours" className="btn-outline" data-testid="link-all-tours">All tours <ArrowRight size={14}/></Link></div>{home.isLoading ? <LoadingCards/> : home.isError ? <ErrorState retry={() => home.refetch()}/> : !home.data?.featuredTours?.length ? <EmptyState title="The next chapter is taking shape" text="There are no featured journeys to show at the moment. Explore again soon."/> : <div className="content-grid">{home.data.featuredTours.map(tour => <TourCardView key={tour.id} tour={tour}/>)}</div>}</div></section>
    <section className="founder-home" style={{ display: 'grid', gridTemplateColumns: '1.1fr .9fr', minHeight: 530, background: '#302921', color: '#f8f4ec' }} data-testid="section-founder-home">
      <div className="founder-home-photo hero-image" role="img" aria-label={home.data?.founderName ?? 'Founder'} style={{ minHeight: 350, backgroundImage: `linear-gradient(0deg,rgba(35,29,23,.15),rgba(35,29,23,.15)),url("${home.data?.founderImageUrl ?? '/kano-editorial.jpg'}")` }}/>
      <div className="founder-home-copy" style={{ padding: 'clamp(3rem,7vw,7rem) clamp(2rem,7vw,6rem)', alignSelf: 'center' }}><p className="eyebrow" style={{ color: '#c5a673' }}>The founder</p><h2 className="serif" style={{ fontSize: 'clamp(2.5rem,4.5vw,4rem)', fontWeight: 400, lineHeight: 1.1, margin: '18px 0' }}>Meet {home.data?.founderName ?? 'our founder'}</h2><p style={{ color: '#d1c6b6', fontSize: 14, lineHeight: 1.85, maxWidth: 470 }}>{home.data?.founderBio ?? 'Founder biography will appear here.'}</p><Link href="/about" className="btn-gold" data-testid="link-home-founder-story" style={{ marginTop: 18 }}>Read the story <ArrowRight size={15}/></Link><Link href="/destinations" data-testid="link-discover-destinations" style={{ display: 'block', marginTop: 20, color: '#e1d2b9', fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase' }}>Explore destinations <ArrowRight size={13} style={{ verticalAlign: 'middle' }}/></Link></div>
    </section>
    <section className="section-pad" style={{ background: '#f8f5ee' }} data-testid="section-travel-values"><div className="site-wrap"><p className="eyebrow">Thoughtful from the outset</p><h2 className="serif" style={{ fontSize: 'clamp(2.4rem,5vw,4rem)', fontWeight: 400, margin: '13px 0 34px' }}>Why travel with us?</h2><div className="values-grid">{['Local Expertise','Authentic Experiences','Professional Service','Carefully Planned Journeys','Flexible Tours','Personalized Support'].map((value,i) => <div key={value} data-testid={`value-travel-${i}`} style={{ display: 'grid', gridTemplateColumns: '38px 1fr', gap: 13, alignItems: 'center', borderTop: '1px solid #d8cdbd', padding: '20px 0' }}><span className="serif" style={{ fontSize: 16, color: '#a9854d' }}>0{i+1}</span><h3 className="serif" style={{ fontWeight: 400, fontSize: 23, margin: 0 }}>{value}</h3></div>)}</div></div></section>
    <section className="section-pad" style={{ background: '#f8f5ee' }}><div className="site-wrap"><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: 20, marginBottom: 35 }}><div><p className="eyebrow">Places with a pulse</p><h2 className="serif" style={{ fontSize: 'clamp(2.4rem,5vw,4rem)', fontWeight: 400, margin: '13px 0 0' }}>Where the stories unfold</h2></div><Link href="/destinations" className="btn-outline" data-testid="link-all-destinations">All destinations <ArrowRight size={14}/></Link></div>{home.isLoading ? <LoadingCards/> : home.isError ? <ErrorState retry={() => home.refetch()}/> : !home.data?.featuredDestinations?.length ? <EmptyState title="Places are being added" text="Destination stories will appear here as they are published."/> : <div className="content-grid">{home.data.featuredDestinations.map(place => <DestinationCard key={place.id} destination={place}/>)}</div>}</div></section>
    <section className="section-pad" style={{ background: '#e7ddcc', textAlign: 'center' }}><div className="site-wrap"><p className="eyebrow">Start a conversation</p><h2 className="serif" style={{ fontSize: 'clamp(2.6rem,5vw,4.4rem)', fontWeight: 400, maxWidth: 760, margin: '16px auto 18px', lineHeight: 1.1 }}>The best journeys begin with a good question.</h2><p style={{ color: '#6e6254', lineHeight: 1.8, maxWidth: 570, margin: '0 auto 25px' }}>Tell us what draws you to a place. We’ll begin there.</p><Link href="/contact" className="btn-dark" data-testid="link-start-conversation">Make an enquiry <ArrowRight size={15}/></Link></div></section>
  </main></Shell>;
}

function ToursPage() {
  const planning = new URLSearchParams(window.location.search);
  const [q, setQ] = useState('');
  const [destination, setDestination] = useState(() => planning.get('destination') ?? '');
  const [category, setCategory] = useState(() => planning.get('category') ?? '');
  const [type, setType] = useState('');
  const [page, setPage] = useState(1);
  const travelDate = planning.get('travelDate') ?? '';
  const travelers = planning.get('travelers') ?? '';
  const params = { ...(q.trim() ? { q: q.trim() } : {}), ...(destination ? { destination } : {}), ...(category ? { category } : {}), ...(type ? { tourType: type as 'private' | 'group' } : {}), page, pageSize: 12 };
  const query = useGetTours(params);
  const items = query.data?.items ?? [];
  const inquiryParams = new URLSearchParams();
  if (destination) inquiryParams.set('destination', destination);
  if (category) inquiryParams.set('experienceType', category);
  if (travelDate) inquiryParams.set('travelDate', travelDate);
  if (travelers) inquiryParams.set('travelers', travelers);
  const detailQuery = inquiryParams.toString();
  return <Shell><main><PageIntro eyebrow="Journeys, considered" title="Tours" text="Explore published journeys shaped around place, memory and cultural context. Every inquiry starts with a conversation."/>
    <section className="section-pad" style={{ paddingTop: 42, background: '#f8f5ee' }}><div className="site-wrap">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 12, background: '#eee8dc', padding: 16, marginBottom: 35 }}>
        <label style={{ position: 'relative' }}><span className="sr-only">Search tours</span><Search size={16} style={{ position: 'absolute', top: 17, left: 13, color: '#8b7c67' }}/><input className="field" value={q} onChange={e => {setQ(e.target.value);setPage(1);}} placeholder="Search journeys" data-testid="input-tour-search" style={{ paddingLeft: 39 }}/></label>
        <label><span className="sr-only">Destination</span><select className="field" value={destination} onChange={e => {setDestination(e.target.value);setPage(1);}} data-testid="select-tour-destination"><option value="">All destinations</option>{Array.from(new Set(items.map(t => t.destination))).map(d => <option key={d} value={d}>{d}</option>)}</select></label>
        <label><span className="sr-only">Category</span><select className="field" value={category} onChange={e => {setCategory(e.target.value);setPage(1);}} data-testid="select-tour-category"><option value="">All themes</option>{Array.from(new Set(items.map(t => t.category))).map(c => <option key={c} value={c}>{c}</option>)}</select></label>
        <label><span className="sr-only">Tour type</span><select className="field" value={type} onChange={e => {setType(e.target.value);setPage(1);}} data-testid="select-tour-type"><option value="">Any format</option><option value="private">Private</option><option value="group">Group</option></select></label>
      </div>
      {query.isLoading ? <LoadingCards/> : query.isError ? <ErrorState retry={() => query.refetch()} label="Journeys could not be loaded."/> : items.length ? <><p data-testid="text-tour-count" style={{ color: '#776c5e', fontSize: 12, marginBottom: 18 }}>{query.data?.total ?? items.length} published {query.data?.total === 1 ? 'journey' : 'journeys'}</p><div className="content-grid">{items.map(t => <TourCardView key={t.id} tour={t} linkQuery={detailQuery}/>)}</div><div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 22, paddingTop: 40 }}><button className="btn-outline" disabled={page <= 1} onClick={() => setPage(p => p - 1)} data-testid="button-tours-previous">Previous</button><span data-testid="text-tour-page" style={{ fontSize: 12 }}>Page {query.data?.page ?? page} of {query.data?.totalPages ?? 1}</span><button className="btn-outline" disabled={!query.data || page >= query.data.totalPages} onClick={() => setPage(p => p + 1)} data-testid="button-tours-next">Next</button></div>{(travelDate || travelers) && <div data-testid="panel-planning-context" style={{ marginTop: 34, padding: '20px 22px', background: '#eee8dc', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 18 }}><div><p className="eyebrow">Planning details only</p><p style={{ margin: '7px 0 0', color: '#62594e', fontSize: 13 }}>{destination ? `${destination} · ` : ''}{category ? `${category} · ` : ''}{travelDate ? `Travel date: ${travelDate} · ` : ''}{travelers ? `${travelers} travelers` : ''}</p><p style={{ margin: '6px 0 0', color: '#7a7063', fontSize: 11 }}>These details are not a booking or confirmation of availability.</p></div><Link href={`/contact?${inquiryParams.toString()}`} className="btn-dark" data-testid="link-share-planning-details">Share these details <ArrowRight size={14}/></Link></div>}</> : <EmptyState title="No journeys match this search" text="Try another place or theme, or clear a filter to see more."/>}
      {!query.isLoading && (query.isError || !items.length) && (travelDate || travelers) && <div style={{ marginTop: 22, display: 'flex', justifyContent: 'center' }}><Link href={`/contact?${inquiryParams.toString()}`} className="btn-dark" data-testid="link-share-planning-details-empty">Share planning details <ArrowRight size={14}/></Link></div>}
    </div></section></main></Shell>;
}

function TourDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug ?? '';
  const tour = useGetTour(slug, { query: { queryKey: getGetTourQueryKey(slug), enabled: Boolean(slug) } });
  const createBooking = useCreateBooking();
  const [, setLocation] = useLocation();

  const [bookingForm, setBookingForm] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    travelDate: '',
    travelers: 2,
    specialRequests: '',
  });
  const [bookingError, setBookingError] = useState('');

  if (tour.isLoading) return <Shell><main className="section-pad"><LoadingCards/></main></Shell>;
  if (tour.isError || !tour.data) return <Shell><main className="section-pad"><ErrorState retry={() => tour.refetch()} label="This journey could not be found."/></main></Shell>;
  const item: Tour = tour.data;
  const inquiryParams = new URLSearchParams(window.location.search);
  inquiryParams.set('subject', item.title);

  const handleBookingSubmit = (e: FormEvent) => {
    e.preventDefault();
    setBookingError('');
    createBooking.mutate({
      data: {
        tourId: item.id,
        customerName: bookingForm.customerName.trim(),
        customerEmail: bookingForm.customerEmail.trim(),
        customerPhone: bookingForm.customerPhone.trim() || null,
        travelDate: bookingForm.travelDate,
        travelers: Number(bookingForm.travelers),
        specialRequests: bookingForm.specialRequests.trim() || null,
      },
    }, {
      onSuccess: (result) => {
        setLocation(`/booking-confirmation/${result.bookingReference}`);
      },
      onError: (err: any) => {
        setBookingError(err?.message || 'Could not submit reservation. Please check details and try again.');
      },
    });
  };

  const estimatedTotal = item.priceAmount ? Number(item.priceAmount) * bookingForm.travelers : null;

  return <Shell><main>
    <section className="hero-image" style={{ minHeight: 570, backgroundImage: `linear-gradient(90deg,rgba(25,21,17,.75),rgba(25,21,17,.18)),url("${item.imageUrl}")`, display: 'flex', alignItems: 'end', color: '#fff' }}><div style={{ padding: '70px clamp(1.25rem,8vw,8rem)', width: '100%' }}><Link href="/tours" data-testid="link-back-tours" style={{ color: '#eee4d3', textDecoration: 'none', display: 'inline-flex', gap: 8, alignItems: 'center', fontSize: 12, marginBottom: 36 }}><ArrowLeft size={14}/> All tours</Link><p className="eyebrow" style={{ color: '#d7b982' }}>{item.destination}, {item.country}</p><h1 className="serif" style={{ fontSize: 'clamp(3rem,7vw,6.5rem)', lineHeight: 1, fontWeight: 400, maxWidth: 900, margin: '14px 0 20px' }}>{item.title}</h1><div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}><DemoMarker demo={item.isDemo}/><span className="status-pill">{item.isDemo ? 'Illustrative only · not for sale' : item.availabilityStatus === 'unavailable' ? 'Currently unavailable' : item.availabilityStatus === 'scheduled' ? 'Scheduled' : 'Available for Reservation'}</span></div></div></section>
     <section className="section-pad" style={{ background: '#f8f5ee' }}><div className="site-wrap" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.4fr) minmax(280px,.6fr)', gap: 'clamp(30px,6vw,90px)' }}><div><p className="eyebrow">{item.category} · {item.durationDays} days · {item.tourType}</p><h2 className="serif" style={{ fontSize: 37, fontWeight: 400, lineHeight: 1.2 }}>{item.summary}</h2><p style={{ color: '#655d53', lineHeight: 1.9, whiteSpace: 'pre-line' }}>{item.description}</p>{item.highlights?.length > 0 && <div style={{ marginTop: 44 }}><h3 className="serif" style={{ fontSize: 28, fontWeight: 400 }}>The story in brief</h3><ul style={{ paddingLeft: 20, color: '#655d53', lineHeight: 2 }}>{item.highlights.map((h,i) => <li key={i} data-testid={`text-tour-highlight-${i}`}>{h}</li>)}</ul></div>}</div>
     <aside style={{ alignSelf: 'start', border: '1px solid #d9cebd', padding: 25, background: '#f1ebdf' }}>
       <p className="eyebrow">Journey notes</p>
       <p style={{ fontSize: 13, lineHeight: 1.8, color: '#5f5548', margin: '4px 0 12px' }}>{item.durationDays} days · {item.destination}, {item.country} · {item.tourType} format</p>
       {item.priceAmount !== null && item.priceCurrency && !item.isDemo && <p style={{ color: '#5f5548', fontSize: 13, margin: '0 0 16px' }}>Published price: <strong>{new Intl.NumberFormat(undefined,{style:'currency',currency:item.priceCurrency}).format(item.priceAmount)}</strong> / person</p>}
       
       <div style={{ borderTop: '1px solid #dcd1c0', paddingTop: 18 }}>
         <p className="eyebrow" style={{ color: '#9b7642', marginBottom: 12 }}>Reserve this Journey</p>
         <form onSubmit={handleBookingSubmit} style={{ display: 'grid', gap: 11 }}>
           <label style={{ fontSize: 11 }}>Preferred Travel Date
             <input className="field" type="date" required value={bookingForm.travelDate} onChange={e => setBookingForm(f => ({ ...f, travelDate: e.target.value }))} style={{ display: 'block', marginTop: 4, fontSize: 12 }} />
           </label>
           <label style={{ fontSize: 11 }}>Travelers
             <select className="field" value={bookingForm.travelers} onChange={e => setBookingForm(f => ({ ...f, travelers: Number(e.target.value) }))} style={{ display: 'block', marginTop: 4, fontSize: 12 }}>
               {Array.from({ length: 10 }, (_, i) => <option key={i + 1} value={i + 1}>{i + 1} {i === 0 ? 'Traveler' : 'Travelers'}</option>)}
             </select>
           </label>
           <label style={{ fontSize: 11 }}>Your Full Name
             <input className="field" required minLength={2} value={bookingForm.customerName} onChange={e => setBookingForm(f => ({ ...f, customerName: e.target.value }))} placeholder="Full Name" style={{ display: 'block', marginTop: 4, fontSize: 12 }} />
           </label>
           <label style={{ fontSize: 11 }}>Email Address
             <input className="field" required type="email" value={bookingForm.customerEmail} onChange={e => setBookingForm(f => ({ ...f, customerEmail: e.target.value }))} placeholder="you@example.com" style={{ display: 'block', marginTop: 4, fontSize: 12 }} />
           </label>
           <label style={{ fontSize: 11 }}>Phone (Optional)
             <input className="field" type="tel" value={bookingForm.customerPhone} onChange={e => setBookingForm(f => ({ ...f, customerPhone: e.target.value }))} placeholder="+234..." style={{ display: 'block', marginTop: 4, fontSize: 12 }} />
           </label>
           <label style={{ fontSize: 11 }}>Special Requests (Optional)
             <textarea className="field" rows={2} value={bookingForm.specialRequests} onChange={e => setBookingForm(f => ({ ...f, specialRequests: e.target.value }))} placeholder="Interests, dietary, accessibility..." style={{ display: 'block', marginTop: 4, fontSize: 12 }} />
           </label>

           {estimatedTotal !== null && item.priceCurrency && (
             <div style={{ background: '#e8e0d2', padding: '10px 12px', fontSize: 12, color: '#4a4135' }}>
               Estimated Total ({bookingForm.travelers} pax): <strong>{new Intl.NumberFormat(undefined, { style: 'currency', currency: item.priceCurrency }).format(estimatedTotal)}</strong>
             </div>
           )}

           {bookingError && <p role="alert" style={{ color: '#983e31', fontSize: 11, margin: 0 }}>{bookingError}</p>}

           <button type="submit" className="btn-dark" disabled={createBooking.isPending} style={{ width: '100%', boxSizing: 'border-box', marginTop: 4 }} data-testid="button-reserve-tour">
             {createBooking.isPending ? 'Submitting Reservation…' : 'Confirm Reservation Request'} <ArrowRight size={14} />
           </button>
         </form>
       </div>

       <div style={{ borderTop: '1px solid #dcd1c0', paddingTop: 12, marginTop: 16 }}>
         <Link href={`/contact?${inquiryParams.toString()}`} style={{ fontSize: 12, color: '#6e6253', textDecoration: 'underline' }}>
           Or make an informal enquiry instead
         </Link>
       </div>
     </aside>
     </div></section>
    {item.itinerary?.length > 0 && <section className="section-pad" style={{ background: '#eee8dc' }}><div className="site-wrap"><p className="eyebrow">The rhythm of the journey</p><h2 className="serif" style={{ fontWeight: 400, fontSize: 42, margin: '12px 0 34px' }}>Itinerary</h2><div style={{ maxWidth: 850 }}>{item.itinerary.map(day => <div key={day.day} data-testid={`row-itinerary-day-${day.day}`} style={{ display: 'grid', gridTemplateColumns: '90px 1fr', gap: 20, padding: '22px 0', borderTop: '1px solid #d2c6b4' }}><span className="eyebrow">Day {day.day}</span><div><h3 className="serif" style={{ fontWeight: 400, fontSize: 24, margin: '0 0 8px' }}>{day.title}</h3><p style={{ color: '#6c6257', lineHeight: 1.7, margin: 0 }}>{day.description}</p><p style={{ color: '#987441', fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase' }}>{day.location}</p></div></div>)}</div></div></section>}
    {(item.included?.length > 0 || item.notIncluded?.length > 0) && <section className="section-pad" style={{ background: '#f8f5ee' }}><div className="site-wrap" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>{[[item.included,'Included'],[item.notIncluded,'Not included']].map(([list,title],i) => <div key={i}><h3 className="serif" style={{ fontSize: 28, fontWeight: 400 }}>{title as string}</h3><ul style={{ paddingLeft: 20, color: '#655d53', lineHeight: 2 }}>{(list as string[]).map((v,j) => <li key={j}>{v}</li>)}</ul></div>)}</div></section>}
  </main></Shell>;
}

function DestinationsPage() {
  const query = useGetDestinations();
  return <Shell><main><PageIntro eyebrow="A world of context" title="Destinations" text="Start with the place. Follow its histories, living traditions and the details that make it singular."/><section className="section-pad" style={{ background: '#f8f5ee' }}><div className="site-wrap">{query.isLoading ? <LoadingCards/> : query.isError ? <ErrorState retry={() => query.refetch()} label="Destinations could not be loaded."/> : query.data?.length ? <div className="content-grid">{query.data.map(d => <DestinationCard key={d.id} destination={d}/>)}</div> : <EmptyState title="No destinations published yet" text="New destination guides will appear here when they are ready."/ >}</div></section></main></Shell>;
}

function DestinationDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug ?? '';
  const query = useGetDestination(slug, { query: { queryKey: getGetDestinationQueryKey(slug), enabled: Boolean(slug) } });
  if (query.isLoading) return <Shell><main className="section-pad"><LoadingCards/></main></Shell>;
  if (query.isError || !query.data) return <Shell><main className="section-pad"><ErrorState retry={() => query.refetch()} label="This destination could not be found."/></main></Shell>;
  const place: DestinationDetail = query.data;
  return <Shell><main><section className="hero-image" style={{ minHeight: 570, backgroundImage: `linear-gradient(90deg,rgba(25,21,17,.72),rgba(25,21,17,.12)),url("${place.imageUrl}")`, display: 'flex', alignItems: 'end', color: '#fff' }}><div style={{ padding: '70px clamp(1.25rem,8vw,8rem)' }}><Link href="/destinations" data-testid="link-back-destinations" style={{ color: '#eee4d3', textDecoration: 'none', display: 'inline-flex', gap: 8, alignItems: 'center', fontSize: 12, marginBottom: 38 }}><ArrowLeft size={14}/> All destinations</Link><div><DemoMarker demo={place.isDemo}/></div><p className="eyebrow" style={{ color: '#d7b982', marginTop: 15 }}>{place.country}{place.region ? ` · ${place.region}` : ''}</p><h1 className="serif" style={{ fontSize: 'clamp(3.5rem,8vw,7rem)', lineHeight: 1, fontWeight: 400, margin: '14px 0' }}>{place.name}</h1></div></section>
    <section className="section-pad" style={{ background: '#f8f5ee' }}><div className="site-wrap" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.4fr) minmax(240px,.6fr)', gap: 'clamp(30px,7vw,100px)' }}><div><p className="eyebrow">A sense of place</p><p style={{ fontSize: 18, lineHeight: 1.9, color: '#51483f' }}>{place.description}</p>{place.gallery?.length > 0 && <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 12, marginTop: 35 }}>{place.gallery.map((image,i) => <img key={i} src={image} alt={`${place.name} gallery ${i+1}`} data-testid={`img-destination-gallery-${i}`} style={{ width: '100%', height: 210, objectFit: 'cover' }}/>)}</div>}</div><aside style={{ background: '#eee8dc', padding: 26, alignSelf: 'start' }}><p className="eyebrow">Useful context</p>{place.bestTimeToVisit && <Fact label="Best time to visit" value={place.bestTimeToVisit}/>}<Fact label="Languages" value={place.languages?.join(', ') || 'Not specified'}/>{place.currencyCode && <Fact label="Currency" value={place.currencyCode}/>}<Fact label="Published journeys" value={String(place.tourCount)}/>{place.travelNotes && <p style={{ color: '#655d53', fontSize: 13, lineHeight: 1.8 }}>{place.travelNotes}</p>}<Link href={`/tours?destination=${encodeURIComponent(place.name)}`} className="btn-dark" data-testid="link-destination-tours" style={{ marginTop: 12 }}>Explore journeys <ArrowRight size={14}/></Link></aside></div></section>
    <section style={{ minHeight: 330, background: '#ddd1bf', display: 'grid', placeItems: 'center', padding: 30, textAlign: 'center' }}><div><p className="eyebrow">Keep exploring</p><h2 className="serif" style={{ fontSize: 40, fontWeight: 400, margin: '10px 0 24px' }}>Let curiosity lead.</h2><Link href="/contact" className="btn-dark" data-testid="link-destination-contact">Ask us about this place <ArrowRight size={14}/></Link></div></section>
  </main></Shell>;
}
function Fact({label,value}:{label:string;value:string}) { return <div style={{ borderTop: '1px solid #d4c9b9', padding: '14px 0' }}><p style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '.13em', color: '#987441', margin: '0 0 6px' }}>{label}</p><p style={{ color: '#484139', fontSize: 13, margin: 0, lineHeight: 1.6 }}>{value}</p></div>; }

function AboutPage() {
  const home = useGetHome();
  const founderName = home.data?.founderName ?? 'Our founder';
  const founderBio = home.data?.founderBio ?? 'Founder biography will appear here.';
  const founderImage = home.data?.founderImageUrl ?? '/kano-editorial.jpg';
  return <Shell><main><PageIntro eyebrow="A point of view, not a package" title="A journey that begins in Kano." text={founderBio}/>
    <section className="section-pad" style={{ background: '#f8f5ee' }}><div className="site-wrap" style={{ display: 'grid', gridTemplateColumns: 'minmax(260px,.85fr) minmax(0,1.15fr)', gap: 'clamp(35px,8vw,115px)', alignItems: 'center' }}><div className="hero-image" role="img" aria-label={founderName} style={{ minHeight: 490, backgroundImage: `url("${founderImage}")` }}/><div><p className="eyebrow">The person behind the perspective</p><h2 className="serif" style={{ fontWeight: 400, fontSize: 'clamp(2.5rem,4vw,4rem)', lineHeight: 1.12 }}>Meet {founderName}</h2><p style={{ fontSize: 15, lineHeight: 1.9, color: '#62594f' }}>{founderBio}</p><Link href="/contact" className="btn-dark" data-testid="link-about-contact" style={{ marginTop: 15 }}>Start a conversation <ArrowRight size={14}/></Link></div></div></section>
    <section className="dark-panel section-pad"><div className="site-wrap" style={{ maxWidth: 950, textAlign: 'center' }}><p className="eyebrow" style={{ color: '#c3a574' }}>Our approach</p><h2 className="serif" style={{ fontWeight: 400, fontSize: 'clamp(2.6rem,5vw,4.5rem)', lineHeight: 1.13, margin: '18px auto 24px' }}>Specific enough to feel a place. Open enough to let it speak.</h2><p style={{ color: '#cfc4b5', lineHeight: 1.9, maxWidth: 700, margin: 'auto' }}>We make space for historical depth, living culture and the unexpected details a map cannot show. This is a public invitation to discover; practical arrangements begin only through direct inquiry.</p></div></section>
    <section className="section-pad" style={{ background: '#eee8dc', textAlign: 'center' }}><div className="site-wrap"><p className="eyebrow">The next step</p><h2 className="serif" style={{ fontSize: 42, fontWeight: 400, margin: '12px 0 25px' }}>Tell us what you’re curious about.</h2><Link href="/contact" className="btn-dark" data-testid="link-about-inquiry">Get in touch <ArrowRight size={14}/></Link></div></section>
  </main></Shell>;
}

function ContactPage() {
  const contact = useSubmitContact();
  const [, setLocation] = useLocation();
  const planning = new URLSearchParams(window.location.search);
  const planningDetails = [
    planning.get('destination') ? `Destination: ${planning.get('destination')}` : '',
    planning.get('travelDate') ? `Travel date: ${planning.get('travelDate')}` : '',
    planning.get('travelers') ? `Travelers: ${planning.get('travelers')}` : '',
    planning.get('experienceType') ? `Experience type: ${planning.get('experienceType')}` : '',
  ].filter(Boolean);
  const [form, setForm] = useState(() => ({ name: '', email: '', phone: '', subject: planning.get('subject') ?? (planningDetails.length ? 'Journey planning inquiry' : ''), message: '' }));
  const [receipt, setReceipt] = useState('');
  const update = (key: keyof typeof form, value: string) => setForm(current => ({ ...current, [key]: value }));
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const inquiryMessage = `${form.message}${planningDetails.length ? `\n\nPlanning details: ${planningDetails.join('; ')}` : ''}`.slice(0, 5000);
    contact.mutate({ data: { name: form.name, email: form.email, ...(form.phone ? { phone: form.phone } : {}), subject: form.subject, message: inquiryMessage } }, { onSuccess: result => { setReceipt(result.message); setForm({ name:'',email:'',phone:'',subject:'',message:'' }); setLocation('/contact'); } });
  };
  return <Shell><main><PageIntro eyebrow="A conversation, first" title="Make an enquiry" text="Share a little about what you have in mind. An inquiry is a starting point, not a booking or confirmation of availability."/>
    <section className="section-pad" style={{ background: '#f8f5ee' }}><div className="site-wrap" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.2fr) minmax(250px,.8fr)', gap: 'clamp(35px,8vw,110px)' }}>
      <div><p className="eyebrow">Write to us</p><h2 className="serif" style={{ fontSize: 34, fontWeight: 400, margin: '10px 0 26px' }}>What would you like to discover?</h2>
        {receipt && <div role="status" data-testid="status-contact-success" style={{ background: '#e7eee2', border: '1px solid #bdcbb5', padding: 18, marginBottom: 22, color: '#344732' }}><div style={{ display: 'flex', gap: 8, alignItems: 'center' }}><Check size={17}/><strong>Message received</strong></div><p style={{ fontSize: 13, lineHeight: 1.6, marginBottom: 0 }}>{receipt}</p></div>}
        {planningDetails.length > 0 && <div data-testid="panel-contact-planning-details" style={{ background: '#eee8dc', borderLeft: '2px solid #a9854d', padding: '15px 18px', marginBottom: 19 }}><p className="eyebrow">Planning details</p><p style={{ color: '#62594e', fontSize: 13, lineHeight: 1.7, margin: '8px 0' }}>{planningDetails.join(' · ')}</p><p style={{ color: '#7a7063', fontSize: 11, margin: 0 }}>These are planning notes only, not a booking or availability confirmation.</p></div>}
        <form onSubmit={submit} style={{ display: 'grid', gap: 17 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}><label style={{ fontSize: 12 }}>Your name<input className="field" required minLength={2} maxLength={120} value={form.name} onChange={e => update('name',e.target.value)} data-testid="input-contact-name" style={{ display: 'block', marginTop: 8 }}/></label><label style={{ fontSize: 12 }}>Email address<input className="field" required type="email" maxLength={320} value={form.email} onChange={e => update('email',e.target.value)} data-testid="input-contact-email" style={{ display: 'block', marginTop: 8 }}/></label></div>
          <label style={{ fontSize: 12 }}>Phone <span style={{ color: '#887d70' }}>(optional)</span><input className="field" type="tel" maxLength={40} value={form.phone} onChange={e => update('phone',e.target.value)} data-testid="input-contact-phone" style={{ display: 'block', marginTop: 8 }}/></label>
          <label style={{ fontSize: 12 }}>Subject<input className="field" required minLength={2} maxLength={160} value={form.subject} onChange={e => update('subject',e.target.value)} data-testid="input-contact-subject" style={{ display: 'block', marginTop: 8 }}/></label>
          <label style={{ fontSize: 12 }}>Your message<textarea className="field" required minLength={10} maxLength={5000} rows={6} value={form.message} onChange={e => update('message',e.target.value)} data-testid="input-contact-message" style={{ display: 'block', marginTop: 8, resize: 'vertical' }}/></label>
          {contact.isError && <p role="alert" data-testid="status-contact-error" style={{ color: '#983e31', fontSize: 13 }}>Your message could not be sent. Please review your details and try again.</p>}
          <button className="btn-dark" type="submit" disabled={contact.isPending} data-testid="button-contact-submit" style={{ justifySelf: 'start' }}>{contact.isPending ? 'Sending your message' : 'Send enquiry'} <ArrowRight size={14}/></button>
          <p style={{ fontSize: 11, color: '#84796c', lineHeight: 1.6 }}>Sending this form does not confirm a tour, date or price. We’ll respond using the contact details you provide.</p>
        </form>
      </div>
      <aside style={{ background: '#eee8dc', padding: 'clamp(24px,4vw,42px)', alignSelf: 'start' }}><p className="eyebrow">An open door</p><h3 className="serif" style={{ fontSize: 29, lineHeight: 1.2, fontWeight: 400 }}>Good journeys begin with listening.</h3><p style={{ fontSize: 14, lineHeight: 1.8, color: '#665c51' }}>Whether you have a specific destination in mind or are still finding the question, tell us what interests you.</p><div style={{ borderTop: '1px solid #d4c7b4', paddingTop: 17, marginTop: 26, color: '#7a6a52', fontSize: 12, lineHeight: 1.8 }}>From Kano to the World<br/>Cultural travel and discovery</div></aside>
    </div></section></main></Shell>;
}

function Router() {
  const [location] = useLocation();
  useEffect(() => {
    const path = location.split('?')[0] || '/';
    const slug = path.split('/').filter(Boolean).at(-1)?.replaceAll('-', ' ');
    const titleAndDescription = path === '/'
      ? ['Kano Cultural Tours & Journeys | From Kano to the World', 'Plan cultural and historical journeys rooted in Kano, Nigeria, with heritage stories, thoughtfully presented destinations and direct travel inquiries.']
      : path === '/tours'
        ? ['Cultural Tours & Heritage Journeys | From Kano to the World', 'Explore cultural and historical tour ideas rooted in Kano, with journey details, destination filters and direct inquiries for planning.']
        : path.startsWith('/tours/')
          ? [`${slug?.replace(/\b\w/g, (letter) => letter.toUpperCase()) ?? 'Tour'} | From Kano to the World`, 'Explore this cultural journey, review its itinerary and send an inquiry. Demo journeys are illustrative and are not for sale.']
          : path === '/destinations'
            ? ['Travel Destinations & Culture | From Kano to the World', 'Discover destinations through their histories, cultural context and travel notes, beginning in Kano, Nigeria.']
            : path.startsWith('/destinations/')
              ? [`${slug?.replace(/\b\w/g, (letter) => letter.toUpperCase()) ?? 'Destination'} Travel Guide | From Kano to the World`, 'Explore destination stories and cultural travel notes. Illustrative destinations are clearly marked as demo content.']
              : path === '/experiences'
                ? ['Curated Travel Experiences | From Kano to the World', 'Thematic perspectives and curated cultural experiences departing from Kano, Nigeria.']
                : path === '/blog'
                  ? ['Travel Journal & Heritage Stories | From Kano to the World', 'Essays, cultural reflections, and historical field notes exploring the caravan routes and living traditions of Kano.']
                  : path.startsWith('/blog/')
                    ? [`${slug?.replace(/\b\w/g, (letter) => letter.toUpperCase()) ?? 'Story'} | From Kano to the World`, 'Read field notes and cultural essays on Kano heritage and world travel.']
                    : path === '/gallery'
                      ? ['Visual Archive & Heritage Gallery | From Kano to the World', 'High-resolution photographic glimpses into Kano architecture, dyeing pits, Durbar pageantry, and Sahel landscapes.']
                      : path === '/faq'
                        ? ['Frequently Asked Questions | From Kano to the World', 'Planning guidance, cultural etiquette, booking procedures, and travel logistics for Kano and beyond.']
                        : path.startsWith('/booking-confirmation/')
                          ? ['Reservation Confirmed | From Kano to the World', 'Your reservation reference and trip summary details.']
                          : path === '/admin'
                            ? ['Management Portal | From Kano to the World', 'Administrative control over tours, destinations, bookings, and site content.']
                            : path === '/about'
                              ? ['Our Story | Kano Cultural Travel | From Kano to the World', 'Meet the Kano-based cultural and history professional behind this travel perspective and explore the story that informs the journeys.']
                              : path === '/contact'
                                ? ['Contact | Plan a Cultural Journey from Kano', 'Share your travel interests with From Kano to the World. An inquiry is not a booking or confirmation of availability or price.']
                                : path === '/sign-in'
                                  ? ['Sign In | From Kano to the World', 'Sign in to your From Kano to the World account.']
                                  : path === '/sign-up'
                                    ? ['Create an Account | From Kano to the World', 'Create an account to keep your travel plans and inquiries together.']
                                    : ['Account | From Kano to the World', 'Manage your account and travel inquiries.'];

    document.title = titleAndDescription[0];
    const setMeta = (selector: string, value: string) => {
      const element = document.head.querySelector<HTMLMetaElement>(selector);
      if (element) element.content = value;
    };
    setMeta('meta[name="description"]', titleAndDescription[1]);
    setMeta('meta[property="og:title"]', titleAndDescription[0]);
    setMeta('meta[property="og:description"]', titleAndDescription[1]);
    setMeta('meta[name="twitter:title"]', titleAndDescription[0]);
    setMeta('meta[name="twitter:description"]', titleAndDescription[1]);

    const siteBaseUrl = import.meta.env.VITE_PUBLIC_SITE_URL?.replace(/\/$/, '');
    if (siteBaseUrl) {
      const canonicalUrl = `${siteBaseUrl}${path === '/' ? '/' : path}`;
      let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.rel = 'canonical';
        document.head.append(canonical);
      }
      canonical.href = canonicalUrl;
      setMeta('meta[property="og:url"]', canonicalUrl);
      setMeta('meta[property="og:image"]', `${siteBaseUrl}/kano-editorial.jpg`);
      setMeta('meta[name="twitter:image"]', `${siteBaseUrl}/kano-editorial.jpg`);
    }
  }, [location]);

  return <ErrorBoundary resetKey={location}><Switch>
    <Route path="/" component={HomeRedirect}/>
    <Route path="/tours" component={ToursPage}/>
    <Route path="/tours/:slug" component={TourDetailPage}/>
    <Route path="/destinations" component={DestinationsPage}/>
    <Route path="/destinations/:slug" component={DestinationDetailPage}/>
    <Route path="/experiences">{() => <Shell><ExperiencesPage /></Shell>}</Route>
    <Route path="/blog">{() => <Shell><BlogPage /></Shell>}</Route>
    <Route path="/blog/:slug">{() => <Shell><BlogDetailPage /></Shell>}</Route>
    <Route path="/gallery">{() => <Shell><GalleryPage /></Shell>}</Route>
    <Route path="/faq">{() => <Shell><FaqPage /></Shell>}</Route>
    <Route path="/booking-confirmation/:reference">{() => <Shell><BookingConfirmationPage /></Shell>}</Route>
    <Route path="/contact" component={ContactPage}/>
    <Route path="/about" component={AboutPage}/>
    <Route path="/sign-in/*?" component={SignInPage}/>
    <Route path="/sign-up/*?" component={SignUpPage}/>
    <Route path="/account" component={AccountRoute}/>
    <Route path="/admin" component={AdminRoute}/>
    <Route component={NotFound}/>
  </Switch></ErrorBoundary>;
}

function HomeRedirect() {
  if (!clerkEnabled) {
    return <HomePage />;
  }
  return <><Show when="signed-in"><Redirect to="/account"/></Show><Show when="signed-out"><HomePage/></Show></>;
}

function AdminRoute() {
  return <Shell><AdminPage /></Shell>;
}

function AccountRoute() {
  if (!clerkEnabled) {
    return <Redirect to="/" />;
  }
  return <><Show when="signed-in"><AccountPage/></Show><Show when="signed-out"><Redirect to="/sign-in"/></Show></>;
}

function SignInPage() {
  if (!clerkEnabled) {
    return <Redirect to="/" />;
  }
  return <main className="auth-route"><Link href="/" className="auth-back-link" data-testid="link-auth-home">From Kano to the World</Link><SignIn routing="path" path={`${basePath}/sign-in`} signUpUrl={`${basePath}/sign-up`}/></main>;
}

function SignUpPage() {
  if (!clerkEnabled) {
    return <Redirect to="/" />;
  }
  return <main className="auth-route"><Link href="/" className="auth-back-link" data-testid="link-auth-home">From Kano to the World</Link><SignUp routing="path" path={`${basePath}/sign-up`} signInUrl={`${basePath}/sign-in`}/></main>;
}

function AccountPage() {
  const { user } = useUser();
  const profile = useGetAuthProfile({ query: { queryKey: getGetAuthProfileQueryKey(), retry: false } });
  const initializeAdmin = useInitializeAdmin();
  const client = useQueryClient();
  const email = user?.primaryEmailAddress?.emailAddress ?? 'Email not available';

  const startAdminInitialization = () => {
    initializeAdmin.mutate(undefined, {
      onSuccess: () => {
        void client.invalidateQueries({ queryKey: getGetAuthProfileQueryKey() });
      },
    });
  };

  return <Shell><main><PageIntro eyebrow="Your account" title="Keep your journey close." text="Manage your account and the travel plans you have shared with us."/>
    <section className="section-pad" style={{ background: '#f8f5ee' }}><div className="site-wrap account-grid">
      <div className="account-card"><p className="eyebrow">Account details</p><h2 className="serif" style={{ fontSize: 32, fontWeight: 400, margin: '10px 0 22px' }}>{user?.fullName || 'Your account'}</h2><p style={{ color: '#62594e', fontSize: 14 }}>{email}</p>
        {profile.isLoading ? <p role="status">Loading your account…</p> : profile.isError ? <div role="alert"><p>We could not load your account details.</p><button className="btn-outline" onClick={() => void profile.refetch()}>Try again</button></div> : <><p className="status-pill" data-testid="text-account-role">{profile.data?.role === 'admin' ? 'Administrator' : 'Customer account'}</p><p style={{ color: '#7a7063', fontSize: 12, lineHeight: 1.7, marginTop: 18 }}>Your sign-in is securely managed. We do not store your password in this application.</p></>}
      </div>
      <div className="account-card"><p className="eyebrow">Travel planning</p><h2 className="serif" style={{ fontSize: 30, fontWeight: 400, margin: '10px 0 16px' }}>A conversation comes first.</h2><p style={{ color: '#62594e', lineHeight: 1.8, fontSize: 14 }}>Dates and traveler counts shared in an inquiry are planning notes only. They do not confirm a booking, availability, or price.</p><Link href="/contact" className="btn-dark" data-testid="link-account-contact" style={{ marginTop: 12 }}>Make an enquiry <ArrowRight size={14}/></Link>
        {profile.data?.role === 'admin' && <Link href="/admin" className="btn-outline" data-testid="link-account-admin" style={{ marginTop: 12 }}>Open admin tools <ArrowRight size={14}/></Link>}
        {profile.data?.canInitializeAdmin && <div style={{ borderTop: '1px solid #d8cdbd', marginTop: 26, paddingTop: 20 }}><p style={{ color: '#62594e', fontSize: 13, lineHeight: 1.7 }}>The account owner can initialize the one-time administrator role using the verified email configured for this application.</p><button className="btn-outline" type="button" disabled={initializeAdmin.isPending} onClick={startAdminInitialization} data-testid="button-initialize-admin">{initializeAdmin.isPending ? 'Checking account…' : 'Initialize administrator access'}</button>{initializeAdmin.isError && <p role="alert" style={{ color: '#983e31', fontSize: 12 }}>Administrator access could not be initialized. Check the configured owner email or contact the site owner.</p>}</div>}
      </div>
    </div></section>
  </main></Shell>;
}

function ClerkAuthTokenProvider() {
  const { isSignedIn, session } = useSession();

  useEffect(() => {
    setAuthTokenGetter(async () => {
      if (!isSignedIn || !session) return null;
      return session.getToken();
    });
  }, [isSignedIn, session]);

  return null;
}

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const client = useQueryClient();
  const previousUserId = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = addListener(({ user }) => {
      const nextUserId = user?.id ?? null;
      if (previousUserId.current !== undefined && previousUserId.current !== nextUserId) {
        client.clear();
      }
      previousUserId.current = nextUserId;
    });
    return unsubscribe;
  }, [addListener, client]);

  return null;
}

function ClerkApp() {
  const [, setLocation] = useLocation();
  const content = (
    <QueryClientProvider client={queryClient}><TooltipProvider><Router/><Toaster/></TooltipProvider></QueryClientProvider>
  );

  if (!clerkEnabled) {
    return content;
  }

  return <ClerkProvider
    publishableKey={clerkPubKey}
    proxyUrl={clerkProxyUrl}
    appearance={clerkAppearance}
    signInUrl={`${basePath}/sign-in`}
    signUpUrl={`${basePath}/sign-up`}
    localization={{
      signIn: { start: { title: 'Welcome back', subtitle: 'Sign in to continue planning your journey.' } },
      signUp: { start: { title: 'Create your account', subtitle: 'Keep your travel plans and inquiries together.' } },
    }}
    routerPush={(to) => setLocation(stripBase(to))}
    routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
  >
    <ClerkQueryClientCacheInvalidator />
    <ClerkAuthTokenProvider />
    {content}
  </ClerkProvider>;
}

function App() {
  return <WouterRouter base={basePath}><ClerkApp/></WouterRouter>;
}

export default App;
