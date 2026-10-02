export default function Build() {
  return (
    <article class="build-notes page-enter">
      <p class="eyebrow">Agent reference</p>
      <h1>How Gather is built.</h1>
      <section>
        <h2>Signals</h2>
        <p><code>src/state/planner.js</code> keeps search, filters, weekly plan, serving overrides, and save notes in module-scoped signals.</p>
      </section>
      <section>
        <h2>Computed values</h2>
        <p><code>filteredRecipes</code>, <code>plannedMeals</code>, <code>plannerStats</code>, and <code>shoppingList</code> derive UI-ready data without duplicating state.</p>
      </section>
      <section>
        <h2>Effects and persistence</h2>
        <p>A single <code>effect</code> writes planner snapshots into localStorage and updates the saved status. Malformed or denied storage falls back to safe in-memory session edits.</p>
      </section>
      <section>
        <h2>Routing</h2>
        <p><code>src/routes.js</code> defines explicit What router routes including <code>/recipes/:slug</code> and a catch-all 404 route. The build script emits concrete aliases for every bundled recipe plus <code>404.html</code>.</p>
      </section>
      <section>
        <h2>Vura static packaging</h2>
        <p>Gather leaves manifest synthesis to Vura. The build writes real HTML aliases and <code>404.html</code>, while <code>vura.json</code> stays inside the shared schema: no top-level rewrites and catch-all headers use <code>(.*)</code> instead of glob stars.</p>
      </section>
      <section>
        <h2>Known issues handled</h2>
        <p>The app uses <code>href</code> links, avoids external assets, ships reduced-motion CSS, and documents deploy commands without embedding credentials.</p>
      </section>
      <section>
        <h2>Problem → fix → proof</h2>
        <p><strong>Direct routes:</strong> recipe slugs come from <code>src/data/recipes.js</code>, then <code>scripts/static-aliases.mjs</code> writes concrete files. The browser suite opens every recipe URL directly.</p>
        <p><strong>Storage failure:</strong> <code>safeLoad()</code> validates stored JSON and <code>persistSnapshot()</code> catches write errors, so denied storage becomes a visible session-only mode.</p>
        <p><strong>First viewport:</strong> <code>src/pages/Home.jsx</code> now shows the scaled recipe docket and planner slip before any generic feature copy, matching the actual recipe workflow.</p>
        <p><strong>Day selector iteration:</strong> the original detail action was hard-coded to Monday. <code>firstOpenDay()</code> now defaults the native select to the first empty day, full days disable themselves, and duplicate recipes produce clear no-op copy instead of stacking silently.</p>
        <p><strong>Reactive accessible names:</strong> the detail button uses a function child, <code>{'() => `Add to ${selectedDay()}`'}</code>, so its visible label and screen-reader name update after the select changes.</p>
        <p><strong>Upload size:</strong> removing the unused Vura runtime path and manual manifest keeps this static starter on the small archive path, about 22.7 KiB in the local Vura CLI pack check.</p>
      </section>
    </article>
  );
}
