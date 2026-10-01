import { Link, route } from 'what-framework/router';
import { findRecipe, formatIngredient, scaleIngredient } from '../data/recipes.js';
import { addRecipeToDay, getServings, setServings } from '../state/planner.js';

export default function RecipeDetail() {
  const recipe = findRecipe(route.params.slug);
  if (!recipe) {
    return (
      <section class="page-enter empty-state">
        <h1>Recipe not found.</h1>
        <p>That recipe is not in Gather’s static catalog.</p>
        <Link class="button" href="/recipes">Return to recipes</Link>
      </section>
    );
  }

  return (
    <article class="recipe-detail page-enter" style={`--recipe-color:${recipe.color}`}>
      <Link class="text-link" href="/recipes">← All recipes</Link>
      <header>
        <p class="eyebrow">{recipe.season} · {recipe.time} minutes</p>
        <h1>{recipe.title}</h1>
        <p class="lede">{recipe.subtitle}</p>
        <ul class="chips">{recipe.tags.map((tag) => <li>{tag}</li>)}</ul>
      </header>
      <div class="detail-layout">
        <section class="paper-panel">
          <label class="serving-control">
            <span>Servings</span>
            <input type="range" min="1" max="12" value={() => getServings(recipe.slug)} onInput={(event) => setServings(recipe.slug, event.target.value)} />
            <strong>{getServings(recipe.slug)}</strong>
          </label>
          <h2>Ingredients</h2>
          <ul class="ingredient-list">
            {recipe.ingredients.map((ingredient) => (
              <li>{formatIngredient(scaleIngredient(ingredient, recipe.baseServings, getServings(recipe.slug)))}</li>
            ))}
          </ul>
          <button class="button primary" onClick={() => addRecipeToDay('Monday', recipe.slug)}>Add to Monday</button>
        </section>
        <section class="paper-panel">
          <h2>Method</h2>
          <ol class="steps">
            {recipe.steps.map((step) => <li>{step}</li>)}
          </ol>
        </section>
      </div>
    </article>
  );
}
