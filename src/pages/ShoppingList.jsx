import { Link } from 'what-framework/router';
import { checkedIngredients, clearChecks, ingredientKey, marketProgress, resetPlanner, setIngredientChecked, shoppingList } from '../state/planner.js';
import { formatIngredient } from '../data/recipes.js';

export default function ShoppingList() {
  return (
    <section class="page-enter">
      <div class="page-heading split">
        <div>
          <p class="eyebrow">Computed market list</p>
          <h1>One list from the whole plan.</h1>
          <p>Ingredient quantities are aggregated from planned meals and serving overrides.</p>
        </div>
        <Link class="button" href="/planner">Edit planner</Link>
      </div>
      <div class="market-summary">
        <p role="status">{() => `${marketProgress().pickedUp} picked up · ${marketProgress().remaining} remaining · ${marketProgress().total} ingredients`}</p>
        <button class="button ghost" disabled={() => marketProgress().pickedUp === 0} onClick={clearChecks}>Clear checks</button>
        <small>Checks save in this browser. Clear checks leaves your meals and serving sizes unchanged.</small>
      </div>
      {shoppingList().length === 0 ? (
        <div class="empty-state">
          <h2>Your list is empty.</h2>
          <p>Add recipes to the planner to generate a market list.</p>
        </div>
      ) : (
        <div class="shopping-list">
          {shoppingList().map((ingredient) => (
            <article class={() => `shopping-row ${checkedIngredients().includes(ingredientKey(ingredient)) ? 'is-picked-up' : ''}`} key={ingredientKey(ingredient)}>
              <label>
                <input type="checkbox" checked={() => checkedIngredients().includes(ingredientKey(ingredient))} onChange={(event) => setIngredientChecked(ingredientKey(ingredient), event.target.checked)} />
                <span>{formatIngredient(ingredient)}</span>
              </label>
              <small>Used by {ingredient.recipes.join(', ')}</small>
            </article>
          ))}
        </div>
      )}
      <button class="button ghost" onClick={resetPlanner}>Reset list and planner</button>
    </section>
  );
}
