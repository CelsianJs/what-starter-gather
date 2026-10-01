import { Link } from 'what-framework/router';

export function RecipeCard({ recipe, action }) {
  return (
    <article class="recipe-card" style={`--recipe-color:${recipe.color}`}>
      <div class="card-mark" aria-hidden="true"></div>
      <p class="eyebrow">{recipe.season} · {recipe.time} min</p>
      <h2><Link href={`/recipes/${recipe.slug}`}>{recipe.title}</Link></h2>
      <p>{recipe.subtitle}</p>
      <ul class="chips" aria-label={`${recipe.title} tags`}>
        {recipe.tags.map((tag) => <li>{tag}</li>)}
      </ul>
      {action}
    </article>
  );
}
