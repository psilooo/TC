<!-- Keep the title short and descriptive. Use the conventional-commit style: feat|fix|chore|docs|refactor(scope): short summary. -->

## Summary

<!-- 1–3 bullets describing what this PR changes and why -->

-
-

## Screenshots

<!-- For UI changes — before / after, ideally cropped to the affected widget. Skip if non-visual. -->

## Testing

- [ ] `npm run dev` boots cleanly with no console errors
- [ ] `npm run build:ci` passes
- [ ] Manually verified the affected route(s):
  - [ ] /dashboard
  - [ ] /tour-dates
  - [ ] /shows
  - [ ] /travel
  - [ ] /contacts
  - [ ] /tasks
  - [ ] /documents
  - [ ] /settlements
  - [ ] (other)

## Conventions checklist

- [ ] Follows the per-section component folder convention (no cross-section imports)
- [ ] Shared UI lives at `components/` root; tokens/types/formatters in `src/data/`
- [ ] BEM-style scoped SCSS class names
- [ ] No new `any` types
- [ ] Updated `docs/superpowers/specs/` or `docs/superpowers/plans/` if scope changed
- [ ] Linked the relevant spec / plan / issue below

## Spec / plan / issue

<!-- e.g. "Implements docs/superpowers/specs/<spec-name>.md §6.3" or "Closes #123" -->
