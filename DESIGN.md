# Design

## Source of truth
- Status: Active
- Last refreshed: 2026-10-07
- Primary product surfaces: recipe index, recipe detail, weekly planner, shopping list, build notes
- Evidence reviewed: What Framework routing/state examples, current getting-started guidance, and the Vura deploy script pattern used by these starters

## Brand
- Personality: editorial, warm, practical, vegetable-market calm
- Trust signals: readable recipes, plain serving math, explicit persistence/reset controls
- Avoid: generic meal-kit gradients, stock food photos, false nutrition claims, pretending content is remote or personalized by AI

## Product goals
- Goals: show search/filtering, routeable content, ingredient scaling, weekly planning, computed shopping lists, and local persistence in a complete starter
- Non-goals: real accounts, payments, live inventory, nutrition medical claims, third-party recipe import
- Success signals: users can pick recipes, scale servings, add meals to days, see one consolidated grocery list, reset local state, and learn how the What patterns fit together

## Personas and jobs
- Primary personas: agents building a consumer productivity app; developers evaluating What Framework patterns
- User jobs: browse a recipe catalog, plan meals for the week, understand how signals/computed/effects/router are organized
- Key contexts of use: desktop evaluation, mobile kitchen glance, agent reference reading

## Information architecture
- Primary navigation: Home, Recipes, Planner, Shopping List, Build Notes
- Core routes/screens: `/`, `/recipes`, `/recipes/:slug`, `/planner`, `/shopping-list`, `/build`, `404`
- Content hierarchy: short editorial summary, catalog cards, recipe detail, planner grid, consolidated list, implementation explanation

## Design principles
- Principle 1: Make state changes visible, reversible, and never silently overwrite an occupied day.
- Principle 2: Keep recipe content warm and crafted while keeping controls utilitarian.
- Tradeoffs: static content is synthetic and local; interactivity is deliberately client-only for portability.

## Visual language
- Color: linen backgrounds, terracotta actions, forest-green filters, black-olive type
- Typography: Georgia for editorial headings and system sans for controls so the starter ships without font dependencies
- Spacing/layout rhythm: the homepage opens as a market-table workbench: a scaled recipe docket, compact explanatory copy, and a weekly planner slip appear in the first viewport instead of a dominant marketing hero
- Shape/radius/elevation: soft paper cards with one-sided shadows, torn-ticket separators, and fine botanical borders
- Motion: subtle page/card entrance and reduced-motion fallback; no parallax
- Imagery/iconography: CSS-only ingredient marks, scaled ingredient lists, and planner slips; no external image assets

## Components
- Existing components to reuse: none; standalone starter
- New/changed components: shell, recipe card/detail, planner slot, shopping group, build note panels
- Variants and states: empty filters, empty day, full day, duplicate recipe in a day, saved planner, reset confirmation, keyboard focus, mobile stack
- Token/component ownership: `src/styles.css` owns tokens; components stay in `src/components`

## Accessibility
- Target standard: WCAG 2.1 AA-minded implementation
- Keyboard/focus behavior: visible focus rings, native controls, route links and planner buttons keyboard reachable
- Contrast/readability: dark text on linen, high-contrast selected states
- Screen-reader semantics: one `h1` per route, labelled search/filter controls, status text for planner summary
- Reduced motion and sensory considerations: `prefers-reduced-motion` disables animations and transitions

## Responsive behavior
- Supported breakpoints/devices: 360px mobile through large desktop
- Layout adaptations: nav wraps, recipe index becomes one column, planner days stack
- Touch/hover differences: hover affordances have focus equivalents; tap targets above 40px

## Interaction states
- Loading: not applicable for static local data
- Empty: no matching recipes and no planned meals have explicit copy
- Error: malformed local storage is ignored and reset to defaults
- Success: saved-note copy and planner/shopping counts update immediately
- Disabled: full days disable in the recipe detail day selector; duplicate additions show explicit no-op copy instead of overwriting
- Offline/slow network: app is static and local once loaded

## Content voice
- Tone: calm, practical, quietly editorial
- Terminology: "plan", "servings", "pantry", "market list"
- Microcopy rules: explain persistence as local to this browser; avoid overclaiming health or personalization

## Implementation constraints
- Framework/styling system: What Framework 0.13.10, what-compiler 0.13.10, Vite, plain CSS
- Design-token constraints: CSS custom properties in `src/styles.css`
- Performance constraints: static data, computed filters, no external assets or runtime network
- Compatibility constraints: modern browsers supported by Vite output and What router
- Test/screenshot expectations: Vitest store tests plus Playwright desktop/mobile flows and screenshots

## Market checklist behavior
- Ingredient item/unit keys own checked state; counts derive from the currently planned ingredients, not stale rows.
- Checked rows are struck through but retain readable quantity/source copy. Picked-up and remaining counts are live status text.
- Clear checks leaves recipes and servings intact; reset planner clears checks with the seed week. Both persist locally with the existing session-only denied-storage fallback.

## Open questions
- [ ] Choose the final Vura subdomain during deployment.
