import { dietaryTags, recipes } from '../data/recipes.js';
import { RecipeCard } from '../components/RecipeCard.jsx';
import { addRecipeToDay, clearFilters, filteredRecipes, query, selectedTags, toggleTag } from '../state/planner.js';

export default function Recipes() {
  return (
    <section class="page-enter">
      <div class="page-heading">
        <p class="eyebrow">Recipe index</p>
        <h1>Filter the pantry.</h1>
        <p>Search static recipe content and stack dietary filters; every result links to a routeable detail page.</p>
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
            <RecipeCard recipe={recipe} action={<button class="button small" onClick={() => addRecipeToDay('Sunday', recipe.slug)}>Add to Sunday</button>} />
          ))}
        </div>
      )}
      <p class="fine-print">{recipes.length} synthetic recipes are bundled locally. No network or paid API is used.</p>
    </section>
  );
}
