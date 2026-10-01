import { describe, expect, it } from 'vitest';
import { formatIngredient, scaleIngredient } from '../src/data/recipes.js';

describe('recipe math', () => {
  it('scales ingredient quantities by serving count', () => {
    const scaled = scaleIngredient({ item: 'beans', amount: 3, unit: 'cups' }, 4, 6);
    expect(scaled).toEqual({ item: 'beans', amount: 4.5, unit: 'cups' });
  });

  it('formats fractional ingredients without noisy trailing zeroes', () => {
    expect(formatIngredient({ item: 'olive oil', amount: 1.5, unit: 'tbsp' })).toBe('1.5 tbsp olive oil');
    expect(formatIngredient({ item: 'lemon', amount: 2, unit: '' })).toBe('2 lemon');
  });
});
