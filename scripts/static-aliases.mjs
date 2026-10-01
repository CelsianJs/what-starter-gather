import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { recipes } from '../src/data/recipes.js';

const routes = [
  ['/', 'Gather — Recipe and meal planner', 'Search recipes, scale ingredients, plan a week, and persist a shopping list.'],
  ['/recipes', 'Recipes — Gather', 'A static recipe index with client-side dietary filters.'],
  ...recipes.map((recipe) => [
    `/recipes/${recipe.slug}`,
    `${recipe.title} — Gather`,
    recipe.subtitle,
  ]),
  ['/planner', 'Planner — Gather', 'A persisted weekly meal planner.'],
  ['/shopping-list', 'Shopping list — Gather', 'A consolidated grocery list from the week plan.'],
  ['/build', 'How Gather is built', 'Implementation notes for agents learning What Framework.'],
];

const shellPath = join('dist', 'index.html');
if (!existsSync(shellPath)) {
  throw new Error('dist/index.html missing; run vite build first');
}
const shell = readFileSync(shellPath, 'utf8');

function writeRoute(path, title, description) {
  const out = path === '/' ? shellPath : join('dist', path.slice(1), 'index.html');
  mkdirSync(dirname(out), { recursive: true });
  const html = shell
    .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
    .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${description}" />`)
    .replace('<div id="app"></div>', `<div id="app"><noscript><main><h1>${title}</h1><p>${description}</p></main></noscript></div>`);
  writeFileSync(out, html);
}

for (const route of routes) writeRoute(...route);
writeRoute('/404', 'Page not found — Gather', 'Gather includes a genuine 404 artifact for Vura static hosting.');
copyFileSync(join('dist', '404', 'index.html'), join('dist', '404.html'));

console.log(`static aliases OK: ${routes.length} routes plus 404`);
