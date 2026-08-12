# Aurelia 2.0 — Product Architecture & Implementation Roadmap  
  
**Product promise:** Aurelia is a daily practice for remembering who you are, nurturing who you are becoming, and carrying more light into the world.  
  
**Brand line:** **Aurelia — Rooted in Eternity**  
  
**Four pillars:**  
- **Rooted** — grounding, safety, presence, self-worth, belonging  
- **Eternal** — meaning, wisdom, gratitude, identity, love, connection  
- **Growth** — resilience, confidence, healing, goals, change, possibility  
- **Light** — hope, courage, kindness, service, connection, giving forward  
  
The pillars are a semantic layer across the whole product, not four separate app sections.  
  
---  
  
## 1. Current codebase audit  
  
Source of truth reviewed: `Aurelia-FULL-Updated-2026-08-08.zip` (`aurelia-v2`). The source tree matches the `aurelia-all-7-features-with-ios.zip` source tree, so the newer full archive can safely be treated as the working base.  
  
### Stack already in place  
- React 19 + TypeScript  
- TanStack Router / TanStack Query  
- Tailwind CSS  
- Supabase auth, database and storage  
- Capacitor 8 iOS shell  
- WidgetKit target + App Group  
- App Store/TestFlight shipping scripts  
  
### Existing routes and features to preserve  
| Current route | Existing capability | 2.0 disposition |  
|---|---|---|  
| `/` | Daily affirmation, favorites, mood/energy check-in, adaptive ritual, reminders, home-screen hub | **Rebuild as Today**; retain all data/actions |  
| `/onboarding` | Name, focus areas, tone | **Expand** into intention + pillar onboarding |  
| `/library` | Search/filter all 365 affirmations, favorites | **Keep**; add pillar filtering |  
| `/rituals` | 60-sec breath + guided audio, ritual tracking | **Keep** as a contextual practice destination |  
| `/aurelia` | AI companion / spoken guidance | **Keep**; surface contextually, not as main nav |  
| `/progress` | Tree of Life, growth points, streaks, weekly reflection, mood history | **Transform into Journey** |  
| `/journal` | Private journal | **Keep**; surface within Journey and Today |  
| `/studio` | Custom affirmations + share/wallpaper generation | **Transform into Create** |  
| `/voice` | Record personal affirmations | **Keep** under Create |  
| `/saved` | Favorites | **Keep** under Library / You |  
| `/path` | Seven-day guided introduction | **Rework** into Aurelia Foundations onboarding journey |  
| `/settings` | reminders, wallpaper, accessibility, preferences | **Move under You** while preserving route |  
| `/auth` | authentication | **Keep unchanged except copy/branding** |  
  
### Existing backend data to preserve  
- `profiles`  
- `favorites`  
- `voice_affirmations`  
- `user_preferences`  
- `daily_checkins`  
- `gratitude_entries`  
- `journal_entries`  
- `custom_affirmations`  
- `path_progress`  
- `growth_events`  
  
No destructive migration is necessary for Aurelia 2.0.  
  
---  
  
## 2. Target information architecture  
  
### Primary bottom navigation  
1. **Today** — daily ritual and emotional entry point  
2. **Journey** — Tree of Life, reflection, history and progress  
3. **Create** — personal affirmations, voice and visual cards  
4. **Library** — discovery, saved content and guided practices  
5. **You** — profile, preferences, reminders, accessibility, personal settings  
  
### Secondary destinations  
- Breath / guided audio  
- Speak with Aurelia  
- Journal entry editor  
- Saved affirmations  
- Aurelia Foundations / seven-day path  
- Wallpaper/share composer  
- Voice recorder  
  
These remain routable so existing deep links and working code do not break, but they stop competing for permanent navigation space.  
  
### Navigation migration  
Current bottom nav:  
`Today · Breathe · Aurelia · Progress · Journal`  
  
Aurelia 2.0 bottom nav:  
`Today · Journey · Create · Library · You`  
  
Compatibility rules:  
- Keep existing route paths.  
- Add new aliases/routes for `/journey`, `/create`, `/you` or map the labels onto existing routes initially.  
- Do not remove `/progress`, `/studio`, `/settings`, `/rituals`, `/journal`, `/voice`, `/saved`.  
- Add redirects only after analytics confirms no legacy/deep-link dependency.  
  
---  
  
## 3. Core product model: the Aurelia Compass  
  
Create one shared domain type:  
  
```ts  
export type AureliaPillar = "rooted" | "eternal" | "growth" | "light";  
```  
  
Each pillar owns:  
- icon  
- name  
- short promise  
- long description  
- semantic tags  
- optional accent treatment  
- ritual recommendations  
- content-ranking weights  
  
Suggested canonical definitions:  
  
```ts  
export const AURELIA_PILLARS = {  
  rooted: {  
    label: "Rooted",  
    promise: "Come back to yourself.",  
    tags: ["grounding", "calm", "safety", "presence", "self-worth", "belonging"],  
  },  
  eternal: {  
    label: "Eternal",  
    promise: "Remember what remains.",  
    tags: ["meaning", "wisdom", "gratitude", "identity", "love", "connection"],  
  },  
  growth: {  
    label: "Growth",  
    promise: "Become what is beginning within you.",  
    tags: ["resilience", "confidence", "healing", "goals", "change", "possibility"],  
  },  
  light: {  
    label: "Light",  
    promise: "Carry hope forward.",  
    tags: ["hope", "courage", "kindness", "service", "connection", "giving"],  
  },  
};  
```  
  
The four pillars should appear as a subtle context badge, filter or selector—not as four app silos.  
  
---  
  
## 4. Screen-by-screen Aurelia 2.0 reconstruction  
  
### A. Splash / first impression  
**Current:** video/splash infrastructure already exists.  
  
**2.0:**  
- Tree/crescent mark  
- AURELIA  
- `Rooted in Eternity`  
- restrained animation: roots glow -> trunk -> canopy -> one point of light  
- keep reduced-motion fallback  
  
**Files:**  
- `src/components/splash-intro.tsx`  
- `src/styles.css`  
- existing splash assets / iOS launch assets  
  
Do not delay startup with a long animation. Aim for 1.0–1.8 seconds and allow immediate continuation after app initialization.  
  
### B. Welcome / signed-out home  
**Current:** wealth-oriented quote plus “365 affirmations for wealth, energy, change and healing.”  
  
**2.0 copy:**  
- AURELIA  
- Rooted in Eternity  
- “A daily practice for remembering who you are, nurturing who you are becoming, and carrying more light into the world.”  
- Primary CTA: **Begin your journey**  
- Secondary CTA: **Explore Aurelia** / browse Library  
  
**File:** `src/routes/index.tsx` (`Welcome` component)  
  
### C. Onboarding  
**Current:** Name -> focus areas -> tone.  
  
**2.0:** preserve those fields, but reorganize onboarding into 4 lightweight moments:  
1. **Welcome** — explain Return / Remember / Grow / Give.  
2. **What do you need more of right now?** — Rooted / Eternal / Growth / Light, multi-select allowed; store as preferred pillars.  
3. **What are you working through or toward?** — preserve existing focus areas and extend with human-language intentions.  
4. **How should Aurelia speak to you?** — preserve Gentle / Bold / Devotional.  
  
Optional after onboarding: offer the seven-day Foundations path; never require it.  
  
**Files:**  
- `src/routes/onboarding.tsx`  
- `src/lib/preferences.ts`  
  
### D. Today — the core experience  
**Current:** greeting -> affirmation -> check-in -> adaptive ritual -> home-screen hub -> six shortcut tiles.  
  
**2.0 hierarchy:**  
1. Brand eyebrow: `Aurelia · Rooted in Eternity`  
2. Personal greeting  
3. Prompt: **What do you need today?**  
4. Four-pillar compass (Rooted/Eternal/Growth/Light)  
5. **Today’s affirmation** with one small pillar badge  
6. Primary CTA: **Begin today’s ritual**  
7. Completed-state reflection: “Carry this with you”  
8. Continue Journey / saved / contextual suggestions below the fold  
  
**Important:** do not show every existing feature on the first viewport.  
  
#### Today ritual flow  
- Arrive — 1–3 breaths  
- Affirm — today’s affirmation  
- Reflect — one prompt  
- Act — one tiny action  
- Close — “Carry this with you”  
  
If mood/energy is low, preserve the current adaptive behavior from `buildAdaptiveRitual`; simply rewrite it through the pillar language.  
  
**Files:**  
- `src/routes/index.tsx`  
- `src/components/daily-checkin.tsx`  
- `src/components/adaptive-daily-ritual.tsx`  
- `src/lib/daily-ritual.ts`  
- `src/lib/journey.ts`  
  
### E. Journey (evolution of Progress)  
**Current:** tree, growth points, unlocks, weekly reflection, streaks, ritual minutes, actions, gratitudes, days journeyed, mood/energy history.  
  
**2.0 hierarchy:**  
1. **Your Tree** — visual hero  
2. Human-language summary: “42 days of returning to yourself.”  
3. Four growth dimensions: Rooted / Eternal / Growth / Light  
4. Weekly reflection  
5. Timeline / history  
6. Numbers last, collapsed or visually secondary  
  
Avoid turning emotional practice into competitive gamification. Keep streaks but stop making them the identity of the screen.  
  
#### Tree behavior  
Map practices to visual growth:  
- Rooted -> root density / glow  
- Eternal -> trunk / inner knot illumination  
- Growth -> branches / leaves  
- Light -> canopy lights / stars  
  
Existing `growth_events` still counts completion. Add pillar metadata so the same events can affect a specific tree dimension.  
  
**Files:**  
- `src/routes/progress.tsx`  
- `src/components/tree-of-life.tsx`  
- `src/components/tree-unlocks.tsx`  
- `src/components/weekly-reflection.tsx`  
- `src/lib/growth.ts`  
  
### F. Create (evolution of Studio)  
**Current:** write custom affirmation, choose old category, reflection/action, add to rotation, render Story/Square/wallpaper/share.  
  
**2.0:**  
Tabs or segmented controls inside Create:  
- **Write** — personal affirmation  
- **Voice** — record it in your own voice  
- **Visual** — make wallpaper/share card  
  
Replace category-first authoring with pillar-first intent:  
- “What do you need this affirmation to hold?”  
- Rooted / Eternal / Growth / Light  
- optional topic tags  
  
Keep all current rendering and storage behavior.  
  
**Files:**  
- `src/routes/studio.tsx`  
- `src/routes/voice.tsx`  
- `src/lib/custom-affirmations.ts`  
- `src/lib/share-card.ts`  
- `src/lib/voice.ts`  
  
### G. Library  
**Current:** 365 list, search by text/day, four old categories, favorites.  
  
**2.0:**  
Top-level discovery filters:  
- For you  
- Rooted  
- Eternal  
- Growth  
- Light  
- Saved  
  
Secondary topic filters retain current categories and can gradually evolve over time.  
  
Add a pillar field to every affirmation while preserving `category`.  
  
**Files:**  
- `src/routes/library.tsx`  
- `src/data/affirmations.ts`  
  
### H. You  
**Current:** settings, reminder times, accessibility, wallpaper, account/app preferences.  
  
**2.0:**  
- Personal intention  
- Preferred pillars  
- Name  
- Tone  
- Reminder schedule  
- Voice reminder preferences  
- Accessibility  
- Appearance  
- Privacy/context controls  
- Account  
- App information  
  
Keep the current settings route internally if helpful, but present the destination as **You**.  
  
**Files:**  
- `src/routes/settings.tsx`  
- `src/lib/preferences.ts`  
  
### I. Breathe / Rituals  
Do not remove `/rituals`.  
  
Instead, surface it contextually:  
- Rooted -> 60-Second Calm  
- Eternal -> Stillness / gratitude breath  
- Growth -> Before the Meeting / confidence practice  
- Light -> compassion / intention practice  
  
Rituals can also remain discoverable inside Library.  
  
### J. Journal  
Do not remove `/journal`.  
  
Entry points become contextual:  
- after Today reflection  
- inside Journey timeline  
- inside weekly reflection  
- from You / secondary menu  
  
Add optional pillar metadata to new entries. Old entries stay untagged.  
  
### K. Speak with Aurelia  
Keep `/aurelia` and the current endpoint.  
  
Change its product role from a permanent bottom-navigation destination to contextual support:  
- “Reflect with Aurelia” after a journal entry  
- “Talk this through” after a low check-in  
- “Turn this thought into an affirmation” from Create  
  
This preserves the feature while making it feel purposeful.  
  
### L. Aurelia Foundations (`/path`)  
Reframe the existing seven-day path:  
  
1. **Root** — arrive through breath  
2. **Listen** — receive an affirmation  
3. **Choose** — take one aligned action  
4. **Remember** — gratitude  
5. **Notice** — mood/energy awareness  
6. **Reflect** — private journaling  
7. **Illuminate** — view Tree growth and choose a continuing intention  
  
Reuse the existing `path_progress` table and completion mechanisms.  
  
---  
  
## 5. Data model and Supabase migration  
  
Use additive migration only.  
  
### `profiles` or `user_preferences`  
Add:  
```sql  
preferred_pillars text[]  
current_intention text  
```  
  
Prefer `user_preferences` if personalization is already centralized there.  
  
### `custom_affirmations`  
Add:  
```sql  
pillar text check (pillar in ('rooted','eternal','growth','light'))  
tags text[]  
```  
  
### `journal_entries`  
Add nullable:  
```sql  
pillar text check (pillar in ('rooted','eternal','growth','light'))  
```  
  
### `daily_checkins`  
Add nullable:  
```sql  
selected_pillar text check (selected_pillar in ('rooted','eternal','growth','light'))  
```  
  
### `growth_events`  
Add nullable:  
```sql  
pillar text check (pillar in ('rooted','eternal','growth','light'))  
```  
  
Existing rows must remain valid with `NULL` pillar values.  
  
### Future Collective Light tables — do not add in initial 2.0 migration  
Potential later schema:  
- `collective_practice_counts` or server-generated aggregates  
- `light_dedications` with strict anonymity/moderation boundaries  
  
Do not expose identifiable user activity publicly.  
  
---  
  
## 6. Affirmation content migration  
  
Extend the TypeScript affirmation type rather than replacing category:  
  
```ts  
interface Affirmation {  
  day: number;  
  category: Category;  
  pillar: AureliaPillar;  
  tags?: string[];  
  affirmation: string;  
  reflection: string;  
  action: string;  
}  
```  
  
### Initial deterministic mapping  
Use semantics rather than a destructive category rename:  
- Inner Healing -> usually **Rooted**, sometimes Eternal/Growth  
- Positive Change -> usually **Growth**  
- Positive Energy -> usually **Light** or Rooted  
- Wealth Creation -> usually **Growth** or Light depending on copy  
  
Then manually review the 365 library so the pillar reflects the *meaning of the actual sentence*, not the old category name.  
  
### Content tone standard  
Affirmations should be:  
- believable rather than absolute  
- compassionate rather than grandiose  
- action-connected  
- hopeful without denying difficulty  
- short enough to speak aloud  
  
Prefer: “I can begin again without erasing how far I’ve come.”  
Avoid overpromising language such as guaranteed attraction, invincibility or certainty.  
  
---  
  
## 7. Component architecture additions  
  
Create:  
- `src/lib/pillars.ts` — source of truth for pillar names, icons, copy, tags  
- `src/components/pillar-icon.tsx`  
- `src/components/pillar-compass.tsx`  
- `src/components/pillar-badge.tsx`  
- `src/components/daily-ritual-flow.tsx`  
- `src/components/journey-tree-summary.tsx`  
- `src/components/journey-pillar-balance.tsx`  
- `src/components/today-hero.tsx`  
  
Refactor rather than duplicate:  
- `AdaptiveDailyRitual` becomes an engine/input to `DailyRitualFlow`  
- `AffirmationCard` receives optional `pillar`  
- `TreeOfLife` receives optional pillar distribution  
- `WeeklyReflection` receives pillar summary  
  
Do not create separate `RootedPage`, `EternalPage`, `GrowthPage`, `LightPage` routes.  
  
---  
  
## 8. Design system rules  
  
### Brand palette  
- Aurelia Gold — primary line/icon/accent  
- Deep Emerald — living/background accent  
- Forest Green — secondary organic surface  
- Charcoal/Obsidian — primary dark canvas  
- Ivory — reading surface/text accent  
  
### Usage principle  
Gold is meaning, not decoration. Use it for:  
- selected pillar  
- primary CTA emphasis  
- Tree growth  
- key dividers / iconography  
  
Avoid gold borders around every component.  
  
### Typography  
Keep the current display-serif + body-serif atmosphere but establish strict roles:  
- Display serif: brand, primary ritual phrase, major screen title  
- Body serif: affirmation/reflection  
- Sans/utility: controls, metadata, labels  
  
### Motion  
Tree motion should be slow and directional:  
`roots -> trunk -> branches -> light`.  
Respect `reduced_motion` already present in preferences.  
  
---  
  
## 9. Preserve-working-features contract  
  
Before visual reconstruction, lock these behaviors with regression tests/manual checks:  
1. Auth sign-in/sign-out  
2. Onboarding completion and redirect  
3. Daily affirmation selection and midnight rollover  
4. Custom affirmation rotation  
5. Favorites  
6. Mood and energy save/update  
7. Action completion  
8. Gratitude save/update  
9. Ritual seconds tracking  
10. Growth event logging and Tree stages  
11. Journal CRUD  
12. Custom affirmation CRUD  
13. Voice recording/upload/transcript playback path  
14. Reminders and reminder times  
15. Wallpaper/share/story/square rendering  
16. AI companion endpoint  
17. Weekly AI reflection  
18. iOS Capacitor sync  
19. Widget deep link to Today  
20. App version / TestFlight shipping scripts  
  
No 2.0 phase is complete if one of these regresses.  
  
---  
  
## 10. Implementation roadmap  
  
### Phase 0 — Safety baseline (1–2 engineering days)  
- Create `aurelia-2` feature branch.  
- Run build/lint/typecheck in a known-good environment.  
- Capture screenshots of every current route.  
- Create a manual regression checklist for the 20 preserved behaviors.  
- Confirm Supabase migration state in staging.  
- Keep current production release deployable throughout.  
  
**Exit:** current app can be reproduced and shipped unchanged.  
  
### Phase 1 — Brand foundation + domain model (2–4 days)  
- Add `pillars.ts`.  
- Add four final SVG icons.  
- Add new brand token classes.  
- Add pillar fields through additive Supabase migration.  
- Extend types/hooks without changing UI behavior.  
- Seed/tag the 365 affirmations.  
  
**Exit:** app still looks mostly the same, but the data model understands Rooted/Eternal/Growth/Light.  
  
### Phase 2 — Today 2.0 (4–7 days)  
- Build `PillarCompass`.  
- Recompose `/` around one primary daily ritual.  
- Preserve existing `DailyCheckin`, favorites, reminder hooks and daily selection.  
- Integrate adaptive ritual into the new flow.  
- Reduce old shortcut grid prominence.  
- Add completed ritual state.  
  
**Exit:** a user can open the app, choose what they need, complete one coherent ritual and leave.  
  
### Phase 3 — Journey + living Tree (4–7 days)  
- Relabel Progress -> Journey.  
- Add pillar distribution queries.  
- Extend growth logging with pillar.  
- Update Tree visuals to respond to root/trunk/branch/light dimensions.  
- Reorder numbers below meaning/reflection.  
- Preserve all streak/history calculations.  
  
**Exit:** practice visibly accumulates into a meaningful personal Tree.  
  
### Phase 4 — Create + Library consolidation (4–6 days)  
- Reframe Studio -> Create.  
- Bring Voice into Create navigation.  
- Add pillar metadata to custom affirmations.  
- Add pillar filter to Library.  
- Keep old category filters as secondary topics.  
- Merge Saved into Library information architecture while preserving `/saved`.  
  
**Exit:** discovery and creation feel like one coherent content system.  
  
### Phase 5 — You + Foundations + contextual utilities (3–5 days)  
- Reframe Settings -> You.  
- Extend preference screen with current intention/preferred pillars.  
- Rework seven-day Path copy as Aurelia Foundations.  
- Contextually surface Breathe, Journal and Speak with Aurelia.  
- Update widget copy/deep-link presentation to 2.0 language without breaking `aurelia://today`.  
  
**Exit:** secondary features stop competing with core navigation.  
  
### Phase 6 — Content quality + polish (4–8 days)  
- Human review all 365 pillar assignments.  
- Rewrite weak/overpromising affirmation copy.  
- Add pillar-specific reflection prompts.  
- Tune empty/loading/error states.  
- Accessibility pass.  
- iPhone size/safe-area testing.  
- performance/motion pass.  
  
### Phase 7 — Collective Light beta (later, independent release)  
- Anonymous aggregate “practiced today” count.  
- One-tap “Add your light.”  
- Optional anonymous affirmation dedication.  
- No follower graph, likes or public profiles.  
- Abuse controls and privacy review before release.  
  
---  
  
## 11. Exact file-level change map  
  
### Modify first  
- `src/routes/index.tsx` — Today 2.0 composition  
- `src/routes/onboarding.tsx` — pillar/intention onboarding  
- `src/routes/progress.tsx` — Journey hierarchy  
- `src/routes/studio.tsx` — Create hierarchy  
- `src/routes/library.tsx` — pillar filtering  
- `src/routes/settings.tsx` — You hierarchy  
- `src/components/bottom-nav.tsx` — five destination IA  
- `src/components/affirmation-card.tsx` — pillar badge + ritual presentation  
- `src/components/tree-of-life.tsx` — four-dimensional growth input  
- `src/components/weekly-reflection.tsx` — pillar-aware reflection context  
- `src/components/adaptive-daily-ritual.tsx` — integrate into ritual flow  
- `src/lib/preferences.ts` — preferred pillars/intention  
- `src/lib/growth.ts` — pillar-aware growth events  
- `src/lib/daily-ritual.ts` — pillar-aware ritual generation  
- `src/data/affirmations.ts` — pillar/tags  
  
### Add  
- `src/lib/pillars.ts`  
- `src/components/pillar-icon.tsx`  
- `src/components/pillar-compass.tsx`  
- `src/components/pillar-badge.tsx`  
- `src/components/daily-ritual-flow.tsx`  
- `src/components/today-hero.tsx`  
- `src/components/journey-pillar-balance.tsx`  
- one new Supabase additive migration  
  
### Preserve with minimal edits  
- `src/routes/auth.tsx`  
- `src/routes/voice.tsx`  
- `src/routes/journal.tsx`  
- `src/routes/rituals.tsx`  
- `src/routes/aurelia.tsx`  
- API routes  
- reminder engine  
- share-card renderer  
- iOS release scripts  
- Capacitor config  
- WidgetKit infrastructure  
  
---  
  
## 12. Release strategy  
  
Do not launch this as one giant rewrite.  
  
Use a feature flag such as `aurelia_v2_experience` (local/env first; remote flag later if desired):  
- old route implementation remains available while rebuilding  
- ship data migrations before UI dependency  
- release Today first to internal TestFlight  
- then Journey  
- then navigation consolidation  
- then content polish  
  
Recommended public release naming:  
- **Aurelia 2.0 — Rooted in Eternity**  
  
App Store positioning:  
“A daily affirmation and reflection practice designed to help you return to yourself, grow with intention, and carry hope forward.”  
  
---  
  
## 13. Definition of done for Aurelia 2.0  
  
Aurelia 2.0 is ready when a new user can:  
1. understand the purpose in under 10 seconds;  
2. choose Rooted, Eternal, Growth or Light without needing instructions;  
3. complete a meaningful daily ritual in 30–180 seconds;  
4. see that practice affect their Tree;  
5. find or create an affirmation without learning a complex taxonomy;  
6. return later and understand their journey without feeling scored;  
7. use every current feature they previously relied on;  
8. leave the app feeling calmer, more hopeful or more intentional than when they opened it.  
  
---  
  
## 14. Recommended build order — first concrete commits  
  
1. `feat: add Aurelia pillar domain model`  
2. `db: add additive pillar preference and content metadata`  
3. `content: tag 365 affirmations with initial pillar mapping`  
4. `ui: add pillar icon badge and compass components`  
5. `today: introduce Aurelia daily ritual flow behind feature flag`  
6. `journey: make Tree growth pillar-aware`  
7. `nav: move to Today Journey Create Library You`  
8. `create: integrate personal voice and visual output`  
9. `library: add pillar discovery and Saved view`  
10. `you: consolidate preferences reminders accessibility`  
11. `foundations: reframe seven-day path`  
12. `polish: content accessibility motion iOS QA`  
  
This sequence keeps the database backward-compatible, keeps legacy routes alive, and prevents a visually ambitious redesign from destabilizing a working app.  
