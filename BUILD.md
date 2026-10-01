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

## Issues encountered

- The app avoids React-style `to` props and uses `href` on What router `Link`, matching the current router docs.
- Static hosting needs real files for aliases, so `scripts/static-aliases.mjs` writes `/recipes/index.html`, every bundled `/recipes/{slug}/index.html`, `/planner/index.html`, `/shopping-list/index.html`, `/build/index.html`, and `404.html` after Vite builds.
- No external images or fonts are used so the starter remains deterministic and fast in CI.
- The first design pass over-weighted the homepage headline. The fix was to make `src/pages/Home.jsx` a market workbench: the live scaled recipe card, explanatory copy, and planner slip all appear above the fold.
- Serving controls are deliberately stored by recipe slug in `servingOverrides`; this keeps `/recipes/:slug`, the homepage docket, and the shopping-list computation aligned without route-specific state.

## Problem → fix → proof

- Problem: direct recipe links need to work on static hosting. Fix: generate concrete aliases from `src/data/recipes.js`. Proof: `npm run build` prints `static aliases OK: 10 routes plus 404` and Playwright opens every recipe route.
- Problem: localStorage can contain corrupt JSON or throw on write. Fix: `safeLoad()` validates shape and `persistSnapshot()` catches write failures. Proof: browser tests force `Storage.prototype.setItem` to throw and still add meals in-session.
- Problem: homepage screenshots looked like a marketing splash, not a recipe tool. Fix: recipe scaling and weekly planning artifacts now render in the first viewport. Proof: screenshot tests capture `/` after asserting the new “recipe desk” heading.

## Verification

Expected gates:

```bash
npm ci
npm run test
npm run build
npm run test:browser
```

The browser suite checks search/filtering, every direct recipe route, serving scaling, planner persistence, storage-denied fallback, shopping-list aggregation, 404 behavior, keyboard focus, and mobile rendering.
