# Build notes for agents

Gather is intentionally small enough for agents to inspect end-to-end, but it uses the same patterns a larger What Framework app would use.

## What it demonstrates

- `signal` stores filter text, dietary chips, serving overrides, and weekly planner assignments.
- `computed` derives filtered recipes, planner counts, and the consolidated shopping list.
- `effect` persists planner state to `localStorage`, records the latest save note, and falls back to session-only edits when storage writes are denied.
- `what-framework/router` supplies routeable recipe details and a genuine fallback route.
- Static content is authored in `src/data/recipes.js`; route aliases for the recipe index and every concrete recipe detail path are emitted after build for Vura-friendly static hosting.

## Why the state is module-scoped

The planner is a product-level concern shared by recipe details, the planner, and the shopping list. Keeping it in `src/state/planner.js` makes the data flow obvious:

```text
recipe catalog -> planner signal -> computed market list -> UI routes
```

The state module validates stored JSON before using it. If a browser has malformed data, Gather silently returns to the seed week rather than crashing the app.

## Routing

Routes live in `src/routes.js` rather than a file-router so this starter is easy to copy into any Vite project. The recipe route uses `/recipes/:slug`; unknown routes render `NotFound`.

## Vura static deployment notes

Gather is a pure Vite/What client app, so it does not ship a manual `dist/manifest.json` or import `@celsian/vura-core`. Vura can synthesize the static manifest from the built HTML files, concrete aliases, and `404.html`.

Two schema rules matter for this starter:

- `vura.json` only uses supported top-level keys. Static aliases come from files, not an unsupported top-level `rewrites` key.
- Header sources use the Vura routing matcher syntax, so catch-alls are written as `(.*)` instead of `*`.

The source-backed check is Vura Platform's shared config parser in `vura-platform/packages/shared/src/config/vura-config.ts` plus the route matcher in `routing-rules.ts`. After removing the manual server-style manifest path, `createDistArchive()` in the Vura CLI packed Gather at about 22.7 KiB instead of including project dependencies.

## Issues encountered

- The app avoids React-style `to` props and uses `href` on What router `Link`, matching the current router docs.
- Static hosting needs real files for aliases, so `scripts/static-aliases.mjs` writes `/recipes/index.html`, every bundled `/recipes/{slug}/index.html`, `/planner/index.html`, `/shopping-list/index.html`, `/build/index.html`, and `404.html` after Vite builds.
- No external images or fonts are used so the starter remains deterministic and fast in CI.
- The first design pass over-weighted the homepage headline. The fix was to make `src/pages/Home.jsx` a market workbench: the live scaled recipe card, explanatory copy, and planner slip all appear above the fold.
- Serving controls are deliberately stored by recipe slug in `servingOverrides`; this keeps `/recipes/:slug`, the homepage docket, and the shopping-list computation aligned without route-specific state.
- A review caught the hard-coded "Add to Monday" detail action. The fix is an accessible day selector that defaults to the first completely empty day, disables full days, and gives clear duplicate copy when the same recipe is already planned on an occupied day.
- Reactive button labels in What JSX need function children (`{() => ...}`) when the accessible name changes after a select input. The planner detail button uses that pattern so tests can find "Add to Thursday" after the day changes.

## Problem → fix → proof

- Problem: direct recipe links need to work on static hosting. Fix: generate concrete aliases from `src/data/recipes.js`. Proof: `npm run build` prints `static aliases OK: 10 routes plus 404` and Playwright opens every recipe route.
- Problem: localStorage can contain corrupt JSON or throw on write. Fix: `safeLoad()` validates shape and `persistSnapshot()` catches write failures. Proof: browser tests force `Storage.prototype.setItem` to throw and still add meals in-session.
- Problem: homepage screenshots looked like a marketing splash, not a recipe tool. Fix: recipe scaling and weekly planning artifacts now render in the first viewport. Proof: screenshot tests capture `/` after asserting the new “recipe desk” heading.
- Problem: recipe detail and recipe cards silently sent meals to fixed days. Fix: both surfaces now expose native day selects backed by `firstOpenDay()`, `dayHasOpenSlot()`, and duplicate-day guards. Proof: Playwright selects Thursday from the detail page, verifies the Thursday planner card, and checks the occupied-Monday no-op copy.
- Problem: an early Vura config mixed unsupported `rewrites`, `*` header globs, and a manual manifest for a static app. Fix: rely on concrete HTML aliases, valid `(.*)` matchers, and Vura's static manifest synthesis. Proof: `parseVuraJson()` accepts the config, no `dist/manifest.json` remains after build, and the Vura CLI archive is about 22.7 KiB.

## Market checklist completion

The market checkboxes were previously DOM-only: navigating away lost purchased marks. `checkedIngredients` now persists ingredient `item|unit` keys alongside the planner and serving overrides; `marketProgress` counts only keys on the current computed list. Old snapshots default to no checks, unknown keys are ignored, and denied writes retain session editing. `Clear checks` changes no meals or serving overrides; resetting the planner also clears checks.

Smooth path: derive list quantities first, use stable ingredient keys for checked accessors, and test navigation/reload/denied storage before adding remote sync. Regression coverage is in `test/checklist.test.js` and the market checklist browser flow.


## Verification

Expected gates:

```bash
npm ci
npm run test
npm run build
npm run test:browser
```

The browser suite checks search/filtering, every direct recipe route, serving scaling, planner persistence, storage-denied fallback, shopping-list aggregation, 404 behavior, keyboard focus, and mobile rendering.
