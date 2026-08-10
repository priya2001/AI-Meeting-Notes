# MeetWise

MeetWise is a full-stack AI meeting notes SaaS built for the "Zero to Subscriber" challenge.

It lets a user sign up, generate meeting notes from a transcript, save results per account, and manage a paid subscription flow.

## Live Demo

- Production: https://ai-meeting-notes-delta.vercel.app/

## What It Does

- Marketing landing page with pricing tiers
- Clerk authentication with persistent sessions
- AI meeting note generation from transcript input
- Per-user meeting history stored in the database
- Stripe test-mode checkout and billing portal flow
- Free vs Pro plan gating

## Tech Stack

- Next.js 14
- React 18
- Tailwind CSS
- Clerk for auth
- Neon Postgres + Drizzle ORM
- Groq API for AI generation
- Stripe for subscriptions and billing

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

Required variables:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `DATABASE_URL`
- `DATABASE_POOL_URL`
- `DIRECT_URL`
- `GROQ_API_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_PRICE_PRO`
- `STRIPE_PRICE_ENTERPRISE`
- `NEXT_PUBLIC_APP_URL`

### 3. Run the app locally

```bash
npm run dev
```

Then open `http://localhost:3000`.

## Useful Scripts

- `npm run dev` - start the local development server
- `npm run build` - build the app for production
- `npm run start` - start the production server
- `npm run lint` - run lint checks

## Notes

- Stripe runs in test mode for this project.
- The deployment URL above is the current public build.
- Database records are intended to stay tied to the logged-in user.

