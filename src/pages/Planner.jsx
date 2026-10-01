import { recipes } from '../data/recipes.js';
import { addRecipeToDay, days, removeRecipeFromDay, resetPlanner, weeklyPlan } from '../state/planner.js';
import { findRecipe } from '../data/recipes.js';

export default function Planner() {
  return (
    <section class="page-enter">
      <div class="page-heading split">
        <div>
          <p class="eyebrow">Weekly planner</p>
          <h1>Assign meals to the week.</h1>
          <p>Selections save in this browser and feed the market list automatically.</p>
        </div>
        <button class="button ghost" onClick={resetPlanner}>Reset week</button>
      </div>
      <div class="planner-grid">
        {days.map((day) => (
          <section class="day-card">
            <h2>{day}</h2>
            {weeklyPlan()[day].length === 0 ? <p class="empty-line">No meals yet.</p> : null}
            <ul class="planned-list">
              {weeklyPlan()[day].map((slug, index) => {
                const recipe = findRecipe(slug);
                return (
                  <li>
                    <span>{recipe?.title || slug}</span>
                    <button aria-label={`Remove ${recipe?.title || slug} from ${day}`} onClick={() => removeRecipeFromDay(day, index)}>×</button>
                  </li>
                );
              })}
            </ul>
            <label>
              <span>Add recipe</span>
              <select onChange={(event) => { if (event.target.value) addRecipeToDay(day, event.target.value); event.target.value = ''; }}>
                <option value="">Choose...</option>
                {recipes.map((recipe) => <option value={recipe.slug}>{recipe.title}</option>)}
              </select>
            </label>
          </section>
        ))}
      </div>
    </section>
  );
}
