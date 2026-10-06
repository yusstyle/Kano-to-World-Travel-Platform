# From Kano to the World

An international cultural-travel platform rooted in Kano, Nigeria, for discovering history, heritage, and travel experiences.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (ESM bundle)

## Where things live

- `artifacts/travel-platform` — public React + Vite travel website
- `artifacts/api-server` — shared Express API
- `lib/api-spec/openapi.yaml` — API contract source of truth
- `lib/db/src/schema` — Drizzle database schema
- `artifacts/api-server/src/seed.ts` — illustrative development content

## Architecture decisions

- Tour and destination examples are demo content, are not for sale, and must not imply dates or prices are confirmed.
- Only business facts supplied or confirmed by the owner may be presented as real; do not invent awards, partners, reviews, qualifications, locations, or contact channels.
- Contact inquiries and newsletter subscriptions are stored in PostgreSQL; email delivery is not configured yet.

## Product

The current public site supports tour and destination discovery, tour filtering and details, founder information, contact inquiries, and newsletter subscriptions. Customer accounts, booking, payments, and the admin CMS remain future implementation phases.

The founder is a Kano-based cultural/history professional with professional experience at the Kano Museum, sharing Kano's history and heritage with visitors. The founder's name, full biography, and photo have not been supplied.

## User preferences

- Build in verified phases rather than presenting unfinished functionality as complete.
- Keep demo content clearly labeled and do not invent real business information.
- Prioritize a premium, culturally grounded, responsive travel experience.

## Gotchas

- Payment credentials, transactional email, real schedules/prices, and company contact/social details have not been configured.
- Use the generated API client and Zod schemas from the OpenAPI contract when adding frontend/backend endpoints.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
