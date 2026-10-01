# Gather

Gather is a complete What Framework starter for a recipe catalog and weekly meal planner. It demonstrates static content, client routing, global signals, computed lists, effects for local persistence, routeable details, keyboard-friendly controls, and a Vura-ready static build.

## Prerequisites

- Node.js 22.x
- npm 10+ (bundled with current Node 22 releases)
- After `npm ci`, install Playwright Chromium for browser verification: `npx playwright install chromium`
- Vura Platform credentials for deployment

## Run it

```bash
npm ci
npm run dev
```

Open the printed Vite URL and try:

- Search "miso" or filter `vegan`.
- Open a recipe detail page and change the serving count.
- Add recipes to several days from Planner.
- Review `/shopping-list`, then reset the planner.
- Visit `/build` for the agent-readable implementation notes.

## Build and test

```bash
npm run test
npm run build
npm run test:browser
```

`npm run verify` runs all three. Browser tests save screenshots under `test-results/screenshots`.
On minimal Linux CI images that do not already include browser system libraries, use `npx playwright install --with-deps chromium` instead.

## Reset local state

Gather stores the planner and chosen servings in this browser key:

```js
localStorage.removeItem('what-starter-gather-v1')
```

The UI also has a reset button in Planner and Shopping List.

## Deploy on Vura

Deployment requires Vura credentials configured in your environment. The starter is prepared for:

```bash
npm ci
npx vura-platform login
npx vura-platform projects
npm run deploy:vura
```

Use `npm run deploy:vura:prod` for a production upload. The deploy scripts call the pinned local `vura-platform` package installed by `npm ci`.

Planned public repo: `CelsianJs/what-starter-gather`.

## Source map for agents

- `src/state/planner.js` — global signals, computed shopping list, local persistence effect.
- `src/data/recipes.js` — synthetic static recipe content.
- `src/routes.js` — route table and route metadata.
- `src/pages/Build.jsx` — public implementation notes.
- `scripts/static-aliases.mjs` — static route aliases, route-specific titles, and a real `404.html` for Vura static synthesis.

See [BUILD.md](./BUILD.md) and `/build` for the longer implementation guide.
