# Contributing to TourCraft

## TL;DR

- Read the README first (root `README.md`)
- Branch off `main`, open a PR back to `main`
- Pre-commit hook auto-formats; don't fight it
- Read the relevant spec in `docs/superpowers/specs/` before non-trivial changes
- Use the per-section component folder convention; no cross-section imports
- Conventional-commit-style messages: `feat|fix|chore|docs|refactor(scope): short summary`

## Working on a feature

1. **Start from a spec.** If one doesn't exist for what you're building, write one in `docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md` first. The existing specs in that folder are good templates.
2. **Branch from `main`**. Use a short kebab-case name: `feat/itinerary-page`, `fix/contacts-pagination-overflow`.
3. **Build it.** Stick to the conventions in the README:
   - `<script setup lang="ts">` SFCs
   - Per-section component folders, no cross-section imports
   - Shared primitives at `components/` root; tokens/types/formatters in `src/data/`
   - BEM-style scoped SCSS class names
   - `mso-*` icon names (Material Symbols Outlined)
4. **Commit.** Conventional commits style: `feat(shows): add dispute settlement modal` / `fix(travel): correct grid columns on narrow viewport`. The pre-commit hook runs Prettier + ESLint via lint-staged.
5. **Open a PR.** Fill in the PR template (`.github/PULL_REQUEST_TEMPLATE.md`). Screenshots for UI changes save reviewer time.

## Local dev

```bash
nvm use            # picks up Node 20 from .nvmrc
npm install
npm run dev        # http://localhost:5173/
```

If `npm install` warns about peer deps after `git pull`, try `rm -rf node_modules package-lock.json && npm install`. Vuestic UI's dependency tree is occasionally fragile.

## Code review expectations

- **Spec compliance first.** Does the change match what the spec says it should do?
- **Code quality second.** Naming, types, BEM consistency, no `any`, no commented-out code.
- **Visual fidelity for UI.** Compare to the relevant mock in `screens/`. Wireframe fidelity is the bar — exact pixels not required, but layout / structure / copy should match.

## Things that won't pass review

- Cross-section component imports (a `tasks/` widget importing from `contacts/`)
- New `any` types (use `unknown` and narrow if you genuinely don't know the shape)
- Hardcoded colors instead of `severityTokens` / `statusTokens` / Vuestic theme variables
- Pre-formatted `<script>` style blocks (let Prettier own formatting)
- Renaming widely-used types/exports without updating consumers + the relevant spec
- New deps without justification (we just stripped ~16 demo deps; we're not in a rush to add more)

## License

Internal collab project. Don't redistribute or open-source without checking with the team first.
