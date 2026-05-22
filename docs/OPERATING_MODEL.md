# Operating Model — 30-Day Asset Resale System

## Business Angel view

This is a speed market, not a browsing marketplace. The asset has a hard deadline, the buyer pool is finite, and the value is in controlled access, trust and immediate execution.

The core rule is:

**No asset should enter the system without a price, deadline, dispatch postcode, buyer tags and risk notes.**

## Workflow

1. Supplier/manufacturer provides asset notice, dimensions, images, drawings and deadline.
2. Admin enters the item manually or automation posts it to `/api/ingest/item`.
3. Asset is saved as `draft`.
4. Admin checks title, price, transport notes, compliance notes and tags.
5. Admin publishes.
6. System creates private tokens for each matching approved buyer.
7. Resend sends private emails.
8. Buyer clicks private link, sees asset sheet and pays with Stripe.
9. Stripe webhook marks item sold and emails admin.
10. Admin/manufacturer dispatches to buyer postcode.

## Buyer segmentation

Do not send everything to everyone. Prestige comes from relevance.

- Giant unusual objects → PROP-BIG, FESTIVAL, IMMERSIVE, RETAIL
- Screens/lights/speakers → AV-LIGHT
- Scenery/flats/sets → SCENIC, IMMERSIVE, CIRCULAR
- Branded/pop-up retail builds → RETAIL, SCENIC
- No-margin save-from-destruction route → CIRCULAR

## Payment strategy

For direct buying, Stripe Checkout is the fastest route. It collects payment, billing address, shipping address and phone number.

For awkward logistics, use either:

1. fixed asset price + fixed transport line; or
2. reserve/deposit payment, then final invoice after postcode confirmation.

This MVP uses fixed asset price + optional fixed transport price.

## Risk gates

Before publishing any item:

- confirm right to resell;
- remove or approve brand/IP/client marks;
- confirm whether decorative only or load-bearing;
- state fire/electrical/structural status;
- state who handles install, offload, lifting and disposal;
- state no storage unless explicitly agreed;
- keep drawings and assembly instructions attached where allowed.

## Full automation path

Phase 1: manual admin upload + automatic buyer alert + Stripe checkout.

Phase 2: supplier sends structured JSON or email attachment to automation parser; parser posts to ingest endpoint.

Phase 3: trusted supplier items auto-publish when all required fields pass validation.

Phase 4: buyer scoring, pricing urgency ladder, automatic reminder alerts at 7/3/1 days before deadline.
