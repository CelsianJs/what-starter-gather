import { expect, it } from 'vitest';
import { checkedIngredients, clearChecks, ingredientKey, marketProgress, resetPlanner, setIngredientChecked, shoppingList, weeklyPlan } from '../src/state/planner.js';

it('tracks ingredient keys without changing the plan or duplicating checks', () => {
  resetPlanner();
  const before = weeklyPlan();
  const key = ingredientKey(shoppingList()[0]);
  setIngredientChecked(key, true);
  setIngredientChecked(key, true);
  expect(checkedIngredients()).toEqual([key]);
  expect(marketProgress().pickedUp).toBe(1);
  clearChecks();
  expect(marketProgress().pickedUp).toBe(0);
  expect(weeklyPlan()).toBe(before);
});

it('ignores unknown ingredient keys', () => {
  resetPlanner();
  setIngredientChecked('made up|unit', true);
  expect(checkedIngredients()).toEqual([]);
});
