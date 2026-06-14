# Chipo's Lux Apartments Website

One-page React, Vite, TypeScript, and Tailwind CSS starter website for Chipo's Lux Apartments in Choma, Southern Province, Zambia.

## Setup

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
```

## GitHub Pages

This project is configured for GitHub Pages at the custom domain:

```text
https://chiposluxapartments.com/
```

The deployment workflow lives in `.github/workflows/deploy.yml` and builds the Vite app with the custom-domain root base path.

In GitHub, set **Settings > Pages > Build and deployment** to:

- Source: **Deploy from a branch**
- Branch: **gh-pages**
- Folder: **/root**

Do not point GitHub Pages at `main` / `/root`, because that serves the unbuilt Vite source files and causes missing JavaScript or image 404 errors.

## Where to update content

- Website images: curated, optimized copies live in `public/images/site`.
- Latest Chipolux photos use semantic filenames such as `chipolux-front-exterior.jpg`, `chipolux-living-room.jpg`, `chipolux-bedroom-wide.jpg`, and `chipolux-bathroom-shower.jpg`.
- Website video: the compressed web version lives in `public/videos/chipolux-video-tour.mp4` and is used in the video tour section. The homepage hero currently uses the secure exterior image mapped as `images.heroFront` in `src/content.ts`.
- Original apartment photos: keep them in `public/images`; the current site selection is mapped in `src/content.ts`.
- Jobs page: the hiring page lives at `/jobs/`, uses `public/images/site/chipolux-hiring-advert.jpeg`, and the open roles are managed in `jobOpenings` in `src/content.ts`.
- Rates: update the `pricing` array in `src/content.ts`.
- Google Maps: update `directionsLink` and `mapEmbedUrl` in `src/content.ts`.
- Location details: update `business.locationNote`, `business.distanceFromTown`, `landmarks`, `directionsLink`, and `mapEmbedUrl` in `src/content.ts`.
- WhatsApp number: update `business.whatsappNumber` and `business.phoneDisplay` in `src/content.ts`.
- Email and location: update the `business` object in `src/content.ts`. Public inquiries use `business.email`; career inquiries use `business.careersEmail`.
- Careers content: update `careerAreas`, `hiringDetails`, and `jobOpenings` in `src/content.ts`.

No environment variables are required. The booking form opens WhatsApp with the entered details and does not require a backend.
