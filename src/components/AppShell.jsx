import { Link } from 'what-framework/router';
import { plannerStats, saveNote } from '../state/planner.js';

const nav = [
  ['/', 'Home'],
  ['/recipes', 'Recipes'],
  ['/planner', 'Planner'],
  ['/shopping-list', 'Shopping List'],
  ['/build', 'Build Notes'],
];

export default function AppShell({ children }) {
  return (
    <div class="site-shell">
      <a class="skip-link" href="#content">Skip to content</a>
      <header class="masthead">
        <div>
          <p class="eyebrow">Meal planning notebook</p>
          <Link class="brand" href="/" aria-label="Gather home">Gather</Link>
        </div>
        <nav class="nav" aria-label="Primary">
          {nav.map(([href, label]) => (
            <Link href={href} activeClass="active" exactActiveClass="active">{label}</Link>
          ))}
        </nav>
      </header>
      <aside class="ribbon" aria-label="Planner status">
        <span>{plannerStats().meals} meals planned</span>
        <span>{plannerStats().uniqueRecipes} recipes</span>
        <span>{saveNote()}</span>
      </aside>
      <main id="content" class="content">
        {children}
      </main>
      <footer class="footer">
        <p>Recipe content is synthetic and local. Build notes explain the implementation for teams adapting the app.</p>
      </footer>
    </div>
  );
}
