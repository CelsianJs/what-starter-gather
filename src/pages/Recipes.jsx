import { signal } from 'what-framework';
import { dietaryTags, recipes } from '../data/recipes.js';
import { RecipeCard } from '../components/RecipeCard.jsx';
import { addRecipeToDay, dayHasOpenSlot, days, firstOpenDay, clearFilters, filteredRecipes, query, selectedTags, toggleTag } from '../state/planner.js';

function RecipePlanAction({ recipe }) {
  const selectedDay = signal(firstOpenDay(), `gather.cardDay.${recipe.slug}`);
  return (
    <span class="mini-plan">
      <select aria-label={`Choose day for ${recipe.title}`} value={selectedDay} onInput={(event) => selectedDay(event.target.value)} onChange={(event) => selectedDay(event.target.value)}>
        {days.map((day) => <option value={day} disabled={!dayHasOpenSlot(day)}>{day}</option>)}
      </select>
      <button class="button small" onClick={() => addRecipeToDay(selectedDay(), recipe.slug)}>Add</button>
    </span>
  );
}

export default function Recipes() {
  return (
    <section class="page-enter">
      <div class="page-heading">
        <p class="eyebrow">Recipe index</p>
        <h1>Filter the pantry.</h1>
        <p>Search the local recipe box, stack dietary filters, and open a full recipe card for ingredients, method, and planning.</p>
      </div>
      <div class="filter-panel" role="search">
        <label>
          <span>Search recipes</span>
          <input value={query} onInput={(event) => query(event.target.value)} placeholder="Try miso, tomato, winter..." />
        </label>
        <fieldset>
          <legend>Dietary filters</legend>
          <div class="filter-chips">
            {dietaryTags.map((tag) => (
              <button class={() => selectedTags().includes(tag) ? 'chip-button selected' : 'chip-button'} onClick={() => toggleTag(tag)}>
                {tag}
              </button>
            ))}
          </div>
        </fieldset>
        <button class="button ghost" onClick={clearFilters}>Clear filters</button>
      </div>
      {filteredRecipes().length === 0 ? (
        <div class="empty-state">
          <h2>No recipes match those filters.</h2>
          <p>Try clearing one chip or searching a season instead.</p>
        </div>
      ) : (
        <div class="recipe-grid">
          {filteredRecipes().map((recipe) => (
            <RecipeCard recipe={recipe} action={<RecipePlanAction recipe={recipe} />} />
          ))}
        </div>
      )}
      <p class="fine-print">{recipes.length} synthetic recipes are bundled locally. No network or paid API is used.</p>
    </section>
  );
}
