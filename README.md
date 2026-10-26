# Laya — Resort & Staycation Showcase

A responsive resort showcase built with React, TypeScript, Vinext, and Cloudflare D1. This project lives directly in the user-requested Resort & Staycation Showcase Website folder.

## Features

- Filterable accommodation cards, image galleries, room details, capacity, amenities, and PHP nightly rates.
- Shared check-in/check-out/guest planner; interactive monthly sample availability calendar; stay estimates.
- Interactive virtual photo walkthrough with scene navigation, hotspots, zoom, and arrow-key controls. Genuine 360° property footage is not supplied.
- Amenities, location map, regional Google Maps link, and expandable FAQs.
- Reservation inquiries saved in D1 with unique references, date/capacity validation, and consent.
- Protected host inbox at `/inquiries`, status updates, and JSON export.

## Local development

Node 22.13+ is required. Run `npm ci`, then `npm run dev`. On this Windows machine use the `S:` drive substitution pointing at this folder to avoid npm lifecycle quoting problems with the ampersand in the path. Production build: `npm run build`; preview: `npm start`.

D1 migrations are generated from `db/schema.ts`. Hosted Sites applies the SQL migrations on publication. Local preview uses a separate database; apply the generated migration with Wrangler as documented in the Sites starter.

## Sample content

Laya is fictional. Replace the property name, location, rates, capacity, rooms, amenities, and policies in `app/stay-data.ts` and `app/resort.tsx` with verified business data. Availability is deterministic demo data, not a channel-manager or booking-system integration. Estimates use the displayed nightly rate; final quotes are subject to the host. Inquiries do not reserve dates or process payments. No email notifications are configured.

Pexels images are stored in `public/images`. Photographer credits and source links are available at `/credits`. Images show different properties and are illustrative. Replace tour images with photographs of the same property for a coherent real-property tour.

## Access

Hosted site access is owner-private. The host inbox and read/update APIs require ChatGPT identity and rely on the owner-private Sites access boundary for authorization. Add an explicit server-side host allowlist before changing the audience to public or shared. Never publish this authorization model to a broader audience without that change. No credentials are committed.
