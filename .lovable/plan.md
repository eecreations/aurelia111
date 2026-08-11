# Restore the Aurelia app into this project

This project is currently the blank starter template (only a placeholder home page). The uploaded archive contains the full Aurelia app (203 files): all screens, components, data, styles, backend migrations and iOS release scripts. The plan is to bring that codebase in and get it running here.

## What gets brought in

- Screens: home, Aurelia chat, auth, onboarding, journal, library, path, progress, rituals, saved, settings, studio, voice
- Components: affirmation card, audio player, breath ritual, daily check-in, music dock, splash intro, tree of life, accessibility panel, bottom nav, plus the full shadcn UI set
- Content and logic: affirmations dataset, "Aurelia forty", journaling, growth/tracking, reminders, share cards, voice helpers
- Design system: the Aurelia styles.css theme (replaces the default template theme)
- Assets: silk texture, app icons, favicon, manifest, splash/intro video asset pointers
- Backend: Lovable Cloud enabled, then the archive's database migrations applied (profiles, journal, tracking, etc.)
- API routes: Aurelia chat and voice endpoints, plus the transcription server function

## Approach

1. Extract the archive to a temp folder and verify it contains no git metadata.
2. Enable Lovable Cloud so the database/auth integration files resolve.
3. Copy `src/`, `public/`, `supabase/migrations`, `scripts/`, `capacitor.config.ts`, `components.json`, `app.version.json` into the project, excluding git metadata, `node_modules`, the two nested zip archives inside the archive, and the archive's `.env`.
4. Merge `package.json` dependencies from the archive and install them.
5. Apply the database migrations in timestamp order.
6. Register any required API keys as secrets (the archive's `.env` is not copied; I'll list what's needed).
7. Verify: build passes, home route renders Aurelia (not the placeholder), and the main screens load.

## Technical notes

- Both projects are TanStack Start + Vite + Tailwind v4, so the layout maps 1:1; `routeTree.gen.ts` regenerates automatically rather than being copied blindly.
- `src/integrations/supabase/*` from the archive is replaced by this project's freshly generated Cloud integration files so the keys point at this project's backend, not the old one.
- Migrations run against a fresh database here, so all tables are created from scratch; existing data in the old project is not transferred.
- The `remotion/` folder and iOS GitHub workflow are optional; I'll include the release scripts and Capacitor config but skip the nested duplicate zips.
