# FieldLog IQ

**Field Visit + Inspection Intelligence Platform**

A mobile-first React/TypeScript web app for logging field visits, tagging equipment, tracking issues, and surfacing intelligence patterns across service sites.

---

## Features

### Core MVP
- **Structured Visit Logging** — Log site visits with technician, type, geo capture, equipment tags, issues, checklists, and field notes
- **Multi-step form** — Guided 6-step flow: Site Info → Visit Details → Equipment → Issues → Checklist → Notes
- **Industry-aware checklists** — Auto-populated checklists based on vertical (HVAC, Property, Insurance, Manufacturing, Restoration)
- **GPS capture** — Browser geolocation captured per-visit
- **Offline-first** — All data persisted in `localStorage`; online/offline status indicator

### Intelligence Layer
- **Repeat failure detection** — Identifies recurring issue categories across visits at the same site
- **High-volume site concentration** — "These 2 sites account for 62% of service calls"
- **Predictive service intervals** — Estimates next service date based on average visit cycle
- **Risk scoring** — Per-site risk score based on open issues, critical incidents, and emergencies

### Cross-industry
Supports HVAC, water/fire restoration, insurance adjusters, manufacturing service techs, and property managers.

---

## Tech Stack

- **React 18** + **TypeScript** — strict mode
- **Vite 5** — build tooling
- No external UI library — all components hand-crafted
- `localStorage` persistence (drop-in Firebase replace in `src/services/storageService.ts`)

---

## Architecture

```
src/
├── types/          # All TypeScript interfaces & enums
├── utils/          # Pure logic: dateUtils, analyticsUtils, idUtils
├── services/       # storageService (localStorage CRUD), seedData
├── hooks/          # useVisits (central data hook), useGeo, useOfflineStatus
├── components/
│   ├── layout/     # AppShell (sidebar + mobile nav)
│   ├── common/     # Badge, Button, Card primitives
│   ├── dashboard/  # KpiCard, InsightCard, SiteVolumeBar
│   ├── visits/     # VisitCard, FilterBar
│   └── newvisit/   # NewVisitForm (multi-step)
└── pages/          # DashboardPage, VisitsPage, VisitDetailPage, NewVisitPage, SitesPage
```

---

## Getting Started

```bash
npm install
npm run dev
```

Build for production:
```bash
npm run build
```

---

## Environment / Deployment

No environment variables required for local development. Designed for Vercel deployment. To upgrade from `localStorage` to Firebase:

1. Replace `src/services/storageService.ts` with Firestore calls
2. Add `VITE_FIREBASE_*` env vars in `.env.local` and Vercel project settings
3. Keep all hooks/utils/components unchanged — the service layer is the only swap

---

## Seed Data

On first load, 16 sample visits across 5 sites are seeded to demonstrate the intelligence layer (repeat failures, high-volume detection). Clear with:
```js
localStorage.clear()
```
Then reload to re-seed, or start fresh.
