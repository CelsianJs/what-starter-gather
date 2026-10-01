import { Link, route } from 'what-framework/router';

export default function NotFound() {
  return (
    <section class="empty-state page-enter">
      <p class="eyebrow">404</p>
      <h1>This shelf is empty.</h1>
      <p>No Gather page exists for <code>{route.path}</code>.</p>
      <Link class="button primary" href="/recipes">Browse recipes</Link>
    </section>
  );
}
