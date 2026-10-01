import AppShell from './components/AppShell.jsx';
import Build from './pages/Build.jsx';
import Home from './pages/Home.jsx';
import NotFound from './pages/NotFound.jsx';
import Planner from './pages/Planner.jsx';
import RecipeDetail from './pages/RecipeDetail.jsx';
import Recipes from './pages/Recipes.jsx';
import ShoppingList from './pages/ShoppingList.jsx';

const withShell = (path, component) => ({ path, component, layout: AppShell });

export const routes = [
  withShell('/', Home),
  withShell('/recipes', Recipes),
  withShell('/recipes/:slug', RecipeDetail),
  withShell('/planner', Planner),
  withShell('/shopping-list', ShoppingList),
  withShell('/build', Build),
  withShell('/404', NotFound),
  withShell('/*', NotFound),
];

export const routeMeta = {
  '/': 'Gather recipe planner',
  '/recipes': 'Recipe catalog',
  '/planner': 'Weekly planner',
  '/shopping-list': 'Shopping list',
  '/build': 'How it is built',
};
