# Aurelia 2.0 Implementation Manifest

This ZIP contains the full Aurelia application codebase from the August 8, 2026 source archive, with the Aurelia 2.0 foundation implementation overlaid, plus the complete Product Architecture & Implementation Roadmap.

## Implemented in this package

- `src/components/bottom-nav.tsx` — Today · Journey · Create · Library · You
- `src/components/pillar-compass.tsx` — Rooted · Eternal · Growth · Light selector
- `src/lib/pillars.ts` — shared Aurelia pillar domain model and backward-compatible category mapping
- `src/lib/path.ts` — Aurelia Foundations seven-day path
- `src/routes/index.tsx` — Aurelia 2.0 Today / Welcome experience
- `src/routes/library.tsx` — pillar-aware library and Saved filtering
- `src/routes/onboarding.tsx` — pillar-aware onboarding
- `src/routes/path.tsx` — Aurelia Foundations UI
- `src/routes/progress.tsx` — Journey framing with Tree and four dimensions
- `supabase/migrations/20260811090000_aurelia_2_pillars.sql` — additive nullable metadata migration

## Full roadmap included

- `Aurelia-2.0-Implementation-Roadmap.md`

The roadmap also identifies the next source files for deeper implementation and polish, including:

- `src/routes/studio.tsx`
- `src/routes/settings.tsx`
- `src/components/affirmation-card.tsx`
- `src/components/tree-of-life.tsx`
- `src/components/weekly-reflection.tsx`
- `src/components/adaptive-daily-ritual.tsx`
- `src/lib/preferences.ts`
- `src/lib/growth.ts`
- `src/lib/daily-ritual.ts`
- `src/data/affirmations.ts`
- `src/components/pillar-icon.tsx`
- `src/components/pillar-badge.tsx`
- `src/components/daily-ritual-flow.tsx`
- `src/components/today-hero.tsx`
- `src/components/journey-pillar-balance.tsx`

Those files remain present in the complete source tree. Where the roadmap calls for later-phase changes that were not part of the initial Aurelia 2.0 implementation commit, their existing working implementations are preserved rather than replaced with incomplete stubs.

## Preservation rule

The package intentionally preserves existing auth, Supabase, reminders, favorites, daily check-ins, gratitude, journal CRUD, voice, custom affirmations, share/wallpaper rendering, AI companion, Tree growth, Capacitor iOS, WidgetKit, and release tooling.
