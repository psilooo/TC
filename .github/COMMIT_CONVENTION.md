# Commit Message Convention

We use a lightweight version of [Conventional Commits](https://www.conventionalcommits.org/).

## Format

```
<type>(<scope>): <short summary>
```

Examples from the existing log:

```
feat(shows): add Settlement, Attachments, RecentActivity cards (row 3)
fix(router): restore scrollBehavior and BASE_URL config
chore(deps): uninstall demo runtime + Storybook devDeps
docs: spec for additional skeleton screens
refactor(foundation): move KpiTile to components/ root
```

## Types

- **feat** — new functionality, new component, new fixture
- **fix** — bug fix, missed reference, broken import
- **refactor** — moving/renaming/restructuring without behavior change
- **chore** — deps, config, branding, deletes
- **docs** — README, specs, plans, code comments
- **style** — pure formatting (rare; the pre-commit hook handles most)
- **test** — when we add tests, those go here

## Scopes

Match the section being changed. Common ones in this repo:

- `dashboard`, `tour-dates`, `shows`, `travel`, `contacts`, `tasks`, `docs` — per-section work
- `navbar`, `sidebar`, `routing`, `layout` — shell-level work
- `data`, `types`, `severity`, `format` — data layer
- `foundation` — anything affecting multiple sections at once
- `deps` — package install/uninstall
- `brand` — branding / branding-adjacent metadata changes

A scope is optional but encouraged. `chore: bump deps` is fine if no specific section applies.

## Subject

- Imperative mood: "add X", "fix Y", "remove Z" — not "added", "fixes", "removed"
- ≤ 72 characters when possible (auto-wraps in `git log --oneline`)
- No period at the end

## Body (optional)

- Wrap at 72 characters
- Use it when the "why" isn't obvious from the title or diff
- Reference specs/plans when relevant: `Implements §6.3 of <spec-name>`
- Reference issues: `Closes #42`

## Co-author trailers

When pairing or working with Claude:

```
Co-Authored-By: Name <email@example.com>
```

GitHub renders these as a list of co-authors on the commit.
