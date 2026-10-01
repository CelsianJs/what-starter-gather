import { computed, effect, signal } from 'what-framework';
import { findRecipe, recipes, scaleIngredient } from '../data/recipes.js';

export const STORAGE_KEY = 'what-starter-gather-v1';
export const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function seedPlan() {
  return {
    Monday: ['miso-orchard-noodles'],
    Tuesday: [],
    Wednesday: ['cedar-supper-beans'],
    Thursday: [],
    Friday: ['peppercorn-citrus-chicken'],
    Saturday: [],
    Sunday: [],
  };
}

function safeLoad() {
  if (typeof localStorage === 'undefined') return { plan: seedPlan(), servings: {} };
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (!parsed || typeof parsed !== 'object' || !parsed.plan || !parsed.servings) {
      return { plan: seedPlan(), servings: {} };
    }
    const plan = seedPlan();
    for (const day of days) {
      if (Array.isArray(parsed.plan[day])) {
        plan[day] = parsed.plan[day].filter((slug) => findRecipe(slug));
      }
    }
    return { plan, servings: parsed.servings };
  } catch {
    return { plan: seedPlan(), servings: {} };
  }
}

const initial = safeLoad();

export const query = signal('', 'gather.query');
export const selectedTags = signal([], 'gather.tags');
export const weeklyPlan = signal(initial.plan, 'gather.weeklyPlan');
export const servingOverrides = signal(initial.servings, 'gather.servings');
export const saveNote = signal('Planner is saved locally in this browser.', 'gather.saveNote');

export const filteredRecipes = computed(() => {
  const text = query().trim().toLowerCase();
  const tags = selectedTags();
  return recipes.filter((recipe) => {
    const matchesText = !text || `${recipe.title} ${recipe.subtitle} ${recipe.season}`.toLowerCase().includes(text);
    const matchesTags = tags.every((tag) => recipe.tags.includes(tag));
    return matchesText && matchesTags;
  });
});

export const plannedMeals = computed(() => {
  return days.flatMap((day) => weeklyPlan()[day].map((slug) => ({ day, recipe: findRecipe(slug) })).filter((entry) => entry.recipe));
});

export const plannerStats = computed(() => {
  const meals = plannedMeals();
  return {
    meals: meals.length,
    uniqueRecipes: new Set(meals.map((entry) => entry.recipe.slug)).size,
    openSlots: days.length * 2 - meals.length,
  };
});

export const shoppingList = computed(() => {
  const totals = new Map();
  for (const { recipe } of plannedMeals()) {
    const servings = getServings(recipe.slug);
    for (const ingredient of recipe.ingredients.map((item) => scaleIngredient(item, recipe.baseServings, servings))) {
      const key = `${ingredient.item}|${ingredient.unit}`;
      const existing = totals.get(key) || { item: ingredient.item, unit: ingredient.unit, amount: 0, recipes: new Set() };
      existing.amount += ingredient.amount;
      existing.recipes.add(recipe.title);
      totals.set(key, existing);
    }
  }
  return [...totals.values()]
    .map((item) => ({ ...item, amount: Math.round(item.amount * 100) / 100, recipes: [...item.recipes] }))
    .sort((a, b) => a.item.localeCompare(b.item));
});

export function toggleTag(tag) {
  selectedTags((tags) => (tags.includes(tag) ? tags.filter((item) => item !== tag) : [...tags, tag]));
}

export function clearFilters() {
  query('');
  selectedTags([]);
}

export function getServings(slug) {
  const recipe = findRecipe(slug);
  const override = Number(servingOverrides()[slug]);
  return Number.isFinite(override) && override > 0 ? override : recipe?.baseServings || 1;
}

export function setServings(slug, servings) {
  const value = Math.max(1, Math.min(12, Number(servings) || 1));
  servingOverrides((state) => ({ ...state, [slug]: value }));
}

export function addRecipeToDay(day, slug) {
  if (!days.includes(day) || !findRecipe(slug)) return;
  weeklyPlan((plan) => ({ ...plan, [day]: [...plan[day], slug] }));
}

export function removeRecipeFromDay(day, index) {
  weeklyPlan((plan) => ({ ...plan, [day]: plan[day].filter((_, i) => i !== index) }));
}

export function resetPlanner() {
  weeklyPlan(seedPlan());
  servingOverrides({});
  saveNote('Planner reset to the seed week.');
}

function persistSnapshot(snapshot) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
    saveNote(`Saved ${plannedMeals().length} planned meal${plannedMeals().length === 1 ? '' : 's'} locally.`);
  } catch {
    saveNote('Changes are not saved in this browser. Planner updates will last for this session only.');
  }
}

effect(() => {
  const snapshot = {
    plan: weeklyPlan(),
    servings: servingOverrides(),
  };
  if (typeof localStorage !== 'undefined') {
    persistSnapshot(snapshot);
  }
});
