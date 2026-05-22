# The Craftist Asset Exchange

Invite-only resale platform for one-use stage builds, scenic props, bars, AV/lighting assets and event materials.

## What this build does

- Admin login for you/partner via a private passcode.
- Add inventory manually with images, drawings, PDFs and buyer terms.
- Segment approved buyers by tags.
- Publish an asset and automatically send private Resend email alerts to matching buyers.
- Each email contains a unique private token link.
- Buyer opens the private asset page, enters delivery postcode and pays through Stripe Checkout.
- Stripe webhook marks the item sold, locks the asset and records buyer/order details.
- API ingest endpoint allows supplier/Zapier/Make/email-parser automation to create inventory without manual entry.

## Stack

- Next.js on Vercel
- Supabase Postgres + Storage
- Stripe Checkout + webhooks
- Resend email

## Fast setup

1. Create a Supabase project.
2. Open Supabase SQL Editor and run `supabase/schema.sql`.
3. Optional: run `supabase/seed_buyers.sql` then replace example buyers.
4. Create a Resend API key and verified sending domain.
5. Create Stripe test/live keys.
6. Deploy this repo to Vercel.
7. Add all variables from `.env.example` into Vercel Project Settings → Environment Variables.
8. Add a Stripe webhook endpoint:
   - URL: `https://YOUR-DOMAIN/api/stripe/webhook`
   - Events: `checkout.session.completed`, `checkout.session.expired`
   - Copy the webhook signing secret into `STRIPE_WEBHOOK_SECRET`.
9. Visit `/login`, enter `ADMIN_PASSCODE`, add buyers and create your first asset.

## Buyer tags

Use these standard tags:

- `PROP-BIG` — giant props, bars, scenic objects
- `AV-LIGHT` — screens, speakers, lights, truss, AV
- `SCENIC` — flats, set walls, scenic build pieces
- `RETAIL` — shop display, visual merchandising, pop-up
- `IMMERSIVE` — attractions, escape rooms, themed venues
- `FESTIVAL` — festival bars, outdoor features, photo moments
- `CIRCULAR` — fallback reuse/salvage/no-waste route
- `ALL` — buyer receives everything

## Automatic inventory ingest

POST JSON to:

`/api/ingest/item`

Header:

`Authorization: Bearer YOUR_INGEST_SECRET`

Example:

```json
{
  "title": "12ft Giant Cherry Bar / DJ Booth",
  "description": "One-use scenic cherry bar, repurposable as DJ booth or festival feature.",
  "tags": ["PROP-BIG", "FESTIVAL", "IMMERSIVE"],
  "dimensions": "12ft x 12ft x 12ft",
  "dispatch_postcode": "CB25",
  "guide_price_pence": 450000,
  "transport_price_pence": 50000,
  "currency": "gbp",
  "image_urls": ["https://example.com/cherry.jpg"],
  "files": [{ "name": "Assembly drawings", "url": "https://example.com/drawings.pdf" }],
  "auto_publish": false
}
```

Set `auto_publish` to `true` only when supplier data is trusted and complete enough to alert buyers without review.

## Cron

The included Vercel cron releases expired reservations once per day by default. The buyer page and checkout route also self-release expired reservations when opened. For high-speed trading, upgrade Vercel and change `vercel.json` to run every 15–30 minutes.

## Live money caution

Use Stripe test mode first. Only switch to live keys after you have checked:

- company bank details and Stripe account ownership;
- VAT/accounting treatment;
- cancellation/refund terms;
- right to resell each asset;
- brand/IP/client marks removed;
- installation, fire, electrical and structural safety disclaimers;
- transport/offload responsibility.
