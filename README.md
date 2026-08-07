# BoothBnb Frontend

## Overview
Full-stack event marketplace frontend for BoothBnb, built with Next.js, React, and TypeScript — leveraging Server Components and SSR for performance and SEO. Vendors and hosts can browse, book, and pay for event booth spaces through this interface.

## Quick Links
* **Web Application:** [https://dev.boothbnb.online](https://dev.boothbnb.online)
* **Backend Repo:** [https://github.com/ChongWengKit/boothbnb-backend](https://github.com/ChongWengKit/boothbnb-backend)
* **API Docs:** [https://api.dev.boothbnb.online/swagger](https://api.dev.boothbnb.online/swagger)

## Tech Stack
* **Framework:** Next.js, React, TypeScript
* **Styling:** Tailwind CSS
* **Deployment & CI/CD:** Vercel, GitHub Actions, Cloudflare (DNS)
* **Integrations:** Stripe (checkout), Cloudinary (media), Leaflet.js (interactive maps)

## Key Features
* **Server-Rendered Marketplace:** Built with Next.js Server Components and SSR for fast load times and strong SEO.
* **Multi-Currency Checkout:** Integrated Stripe checkout with live Frankfurter exchange rates for accurate, localized pricing.
* **Interactive Location Mapping:** Leaflet.js-powered maps for browsing event booth locations.
* **Optimized Media Delivery:** Cloudinary integration for fast, responsive images across listings.
* **Authentication:** Google OAuth sign-in, with protected routes for vendor/host dashboards.
* **Responsive Design:** Built mobile-first with Tailwind CSS.

## ⚙️ Getting Started
```bash
git clone https://github.com/ChongWengKit/boothbnb-frontend.git
cd boothbnb-frontend
npm install
cp .env.example .env
npm run dev
```

## 🔑 Environment Variables

Create a `.env` file in the root and set the following:

* `NEXT_PUBLIC_GOOGLE_CLIENT_ID` — Google OAuth client ID for sign-in
* `NEXT_PUBLIC_API_DOMAIN` — base URL of the backend API
* `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` — Cloudinary cloud name for image delivery
* `NEXT_PUBLIC_CLOUDINARY_API_KEY` — Cloudinary API key for client-side uploads
* `NEXT_PUBLIC_PHOTON_API_URL` — Photon geocoding API endpoint, used for location search on the map
* `NEXT_PUBLIC_BASE_URL` — base URL of the frontend app itself
