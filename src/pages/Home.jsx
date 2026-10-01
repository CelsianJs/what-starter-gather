import { Link } from 'what-framework/router';
import { formatIngredient, recipes, scaleIngredient } from '../data/recipes.js';
import { days, getServings, weeklyPlan } from '../state/planner.js';

export default function Home() {
  const feature = recipes[0];
  const servingCount = () => getServings(feature.slug);
  return (
    <section class="market-workbench page-enter" style={`--recipe-color:${feature.color}`}>
      <article class="recipe-docket" aria-label="Featured scaled recipe">
        <p class="eyebrow">{feature.season} market card</p>
        <h2><Link href={`/recipes/${feature.slug}`}>{feature.title}</Link></h2>
        <p>{feature.subtitle}</p>
        <div class="docket-meter">
          <span>Base {feature.baseServings}</span>
          <strong>{servingCount()} servings</strong>
        </div>
        <ul class="ingredient-list compact">
          {feature.ingredients.slice(0, 4).map((ingredient) => (
            <li>{formatIngredient(scaleIngredient(ingredient, feature.baseServings, servingCount()))}</li>
          ))}
        </ul>
        <Link class="text-link" href={`/recipes/${feature.slug}`}>Scale the whole recipe →</Link>
      </article>
      <div class="workbench-copy">
        <p class="eyebrow">Static recipes · reactive planning</p>
        <h1>A recipe desk that turns into a market list.</h1>
        <p class="lede">
          Gather opens with the actual moving parts: recipe content, serving math, weekly slots, and
          a shopping list that stays local to this browser.
        </p>
        <div class="actions">
          <Link class="button primary" href="/planner">Open planner</Link>
          <Link class="button" href="/shopping-list">View market list</Link>
        </div>
      </div>
      <aside class="planner-slip" aria-label="This week preview">
        <p class="eyebrow">This week</p>
        {days.slice(0, 5).map((day) => {
          const planned = weeklyPlan()[day];
          const recipe = recipes.find((item) => item.slug === planned[0]);
          return (
            <p><strong>{day.slice(0, 3)}</strong><span>{recipe ? recipe.title : 'open slot'}</span></p>
          );
        })}
        <Link class="button small" href="/planner">Edit the week</Link>
      </aside>
    </section>
  );
}
