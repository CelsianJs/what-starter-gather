export const recipes = [
  {
    slug: 'cedar-supper-beans',
    title: 'Cedar Supper Beans',
    subtitle: 'Creamy white beans, smoked paprika oil, and bitter greens.',
    time: 35,
    baseServings: 4,
    season: 'cool weather',
    tags: ['vegetarian', 'gluten-free', 'one-pot'],
    color: '#9d4f32',
    ingredients: [
      { item: 'cannellini beans', amount: 3, unit: 'cups' },
      { item: 'olive oil', amount: 4, unit: 'tbsp' },
      { item: 'shallots', amount: 2, unit: '' },
      { item: 'smoked paprika', amount: 1.5, unit: 'tsp' },
      { item: 'vegetable stock', amount: 2, unit: 'cups' },
      { item: 'kale', amount: 1, unit: 'bunch' },
      { item: 'lemon', amount: 1, unit: '' },
    ],
    steps: [
      'Sweat sliced shallots in olive oil until glossy and amber at the edges.',
      'Bloom paprika, fold in beans and stock, and simmer until the broth turns creamy.',
      'Tear kale into the pot, finish with lemon, and spoon paprika oil over each bowl.',
    ],
  },
  {
    slug: 'miso-orchard-noodles',
    title: 'Miso Orchard Noodles',
    subtitle: 'Buckwheat noodles with miso pear dressing and sesame herbs.',
    time: 25,
    baseServings: 2,
    season: 'late summer',
    tags: ['vegan', 'dairy-free', 'quick'],
    color: '#536f45',
    ingredients: [
      { item: 'soba noodles', amount: 6, unit: 'oz' },
      { item: 'white miso', amount: 2, unit: 'tbsp' },
      { item: 'ripe pear', amount: 1, unit: '' },
      { item: 'rice vinegar', amount: 1.5, unit: 'tbsp' },
      { item: 'toasted sesame oil', amount: 2, unit: 'tsp' },
      { item: 'cucumber', amount: 1, unit: '' },
      { item: 'mint', amount: 0.5, unit: 'cup' },
    ],
    steps: [
      'Cook soba, rinse cold, and shake dry.',
      'Blend miso, pear, vinegar, and sesame oil into a pale dressing.',
      'Toss noodles with shaved cucumber, mint, and dressing just before serving.',
    ],
  },
  {
    slug: 'tomato-hearth-tart',
    title: 'Tomato Hearth Tart',
    subtitle: 'Jammy tomatoes over a chickpea-herb crust.',
    time: 50,
    baseServings: 6,
    season: 'high summer',
    tags: ['vegetarian', 'gluten-free', 'bake'],
    color: '#b85f38',
    ingredients: [
      { item: 'cherry tomatoes', amount: 4, unit: 'cups' },
      { item: 'chickpea flour', amount: 1.5, unit: 'cups' },
      { item: 'eggs', amount: 2, unit: '' },
      { item: 'goat cheese', amount: 4, unit: 'oz' },
      { item: 'thyme', amount: 2, unit: 'tbsp' },
      { item: 'olive oil', amount: 3, unit: 'tbsp' },
    ],
    steps: [
      'Roast tomatoes until wrinkled and sweet.',
      'Whisk chickpea flour, eggs, thyme, oil, and water into a loose batter.',
      'Bake the crust, scatter tomatoes and goat cheese, then bake until bronzed.',
    ],
  },
  {
    slug: 'green-market-congee',
    title: 'Green Market Congee',
    subtitle: 'Ginger rice porridge with asparagus, peas, and chili crisp.',
    time: 70,
    baseServings: 4,
    season: 'spring',
    tags: ['vegan', 'gluten-free', 'slow'],
    color: '#345e4c',
    ingredients: [
      { item: 'jasmine rice', amount: 1, unit: 'cup' },
      { item: 'ginger', amount: 2, unit: 'inches' },
      { item: 'mushroom stock', amount: 7, unit: 'cups' },
      { item: 'asparagus', amount: 1, unit: 'bunch' },
      { item: 'peas', amount: 1, unit: 'cup' },
      { item: 'scallions', amount: 4, unit: '' },
      { item: 'chili crisp', amount: 4, unit: 'tsp' },
    ],
    steps: [
      'Simmer rice, ginger, and stock until the grains bloom into porridge.',
      'Stir in asparagus coins and peas for the last few minutes.',
      'Serve with scallions and a careful spoon of chili crisp.',
    ],
  },
  {
    slug: 'peppercorn-citrus-chicken',
    title: 'Peppercorn Citrus Chicken',
    subtitle: 'Skillet chicken with orange, fennel seed, and crushed pepper.',
    time: 40,
    baseServings: 4,
    season: 'winter',
    tags: ['protein', 'gluten-free', 'skillet'],
    color: '#c87838',
    ingredients: [
      { item: 'chicken thighs', amount: 6, unit: '' },
      { item: 'orange', amount: 2, unit: '' },
      { item: 'fennel seed', amount: 1, unit: 'tsp' },
      { item: 'black peppercorns', amount: 1, unit: 'tbsp' },
      { item: 'garlic cloves', amount: 5, unit: '' },
      { item: 'chicken stock', amount: 1, unit: 'cup' },
      { item: 'parsley', amount: 0.5, unit: 'cup' },
    ],
    steps: [
      'Sear seasoned chicken until the skin releases from the pan.',
      'Toast fennel, pepper, and garlic in the drippings, then deglaze with orange and stock.',
      'Braise until glossy and shower with parsley.',
    ],
  },
];

export const dietaryTags = ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'quick', 'one-pot'];

export function findRecipe(slug) {
  return recipes.find((recipe) => recipe.slug === slug);
}

export function scaleIngredient(ingredient, baseServings, servings) {
  const ratio = servings / baseServings;
  const amount = Math.round(ingredient.amount * ratio * 100) / 100;
  return { ...ingredient, amount };
}

export function formatIngredient(ingredient) {
  const amount = Number.isInteger(ingredient.amount) ? String(ingredient.amount) : ingredient.amount.toFixed(2).replace(/0+$/, '').replace(/\.$/, '');
  return `${amount}${ingredient.unit ? ` ${ingredient.unit}` : ''} ${ingredient.item}`;
}
