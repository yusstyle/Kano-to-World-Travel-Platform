# From Kano to the World

A travel discovery platform centered on cultural, historical, and heritage experiences, starting in Kano and designed to expand internationally.

## Current build

The public website includes a responsive homepage, tour search and detail pages, destination pages, founder information, contact inquiries, and newsletter sign-up. Tours, destinations, inquiries, and subscribers are stored in PostgreSQL and served through the shared Express API.

Seeded tours and destinations are illustrative demo content only. They do not represent confirmed availability, dates, prices, partners, or products for sale. The site avoids invented testimonials, ratings, awards, and business credentials.

Customer authentication, bookings, Paystack checkout, the customer dashboard, and admin CMS have not been implemented yet. Do not treat the current build as a production booking platform.

## Architecture

- Web: React, TypeScript, Vite, Wouter, TanStack Query
- API: Express 5, TypeScript
- Database: PostgreSQL with Drizzle ORM
- Contract and validation: OpenAPI, Orval-generated React Query hooks and Zod schemas
- Workspace: pnpm monorepo

## Run and verify

The configured Replit workflows start the website and API server.

```bash
pnpm run typecheck
pnpm --filter @workspace/api-spec run codegen
pnpm --filter @workspace/db run push
```

The API seed runs at server startup only when the destination and tour tables are both empty. It inserts records marked as demo content.

## Environment

`DATABASE_URL` is provided by the Replit PostgreSQL environment. See `.env.example` for the names of future integrations; blank values there are not credentials and should be configured through Replit Secrets or the relevant integration setup.

Paystack and email delivery are not active. Before launch, configure and verify those services, add real tour and destination information, and complete the remaining authentication, booking, admin, accessibility, SEO, and security phases.

## Business information still needed

- Company name (if different from the current working brand)
- Founder name, approved biography, and photo
- Logo and approved brand assets
- Phone, email, WhatsApp, office/address, and social accounts
- Confirmed tours, destinations, dates, prices, inclusions, and cancellation terms
- Payment and email provider configuration
- Analytics identifiers, if wanted
