---
name: setup-semantic-release
description: >
  Set up semantic-release for automated versioning and NPM publishing.
  Use when the user wants to add semantic-release, automated versioning,
  or automated NPM publishing to their project. Also triggers when the user
  asks about setting up CI/CD for package releases or GitHub Actions release workflows.
---

# Setup Semantic Release

You are setting up semantic-release for automated versioning and NPM publishing in the user's project.

## Prerequisites

Before starting, verify:
1. The current directory is a git repository root
2. The git working tree is clean (no uncommitted changes)
3. A `package.json` exists in the project root

If any prerequisite fails, inform the user and help them fix it before proceeding.

## Steps

### 1. Install semantic-release

```bash
bun i -D semantic-release
```

If bun is not available, fall back to:
```bash
npm install --save-dev semantic-release
```

### 2. Create GitHub Actions release workflow

Create `.github/workflows/release.yml` with this content (skip if it already exists):

```yaml
# Release workflow
# check https://www.npmjs.com/package/[package-name]/access for OIDC setup
# 1. repo = this repo
# 2. package-name = package to publish

name: Release
description: "Release workflow for publishing package"

on:
  pull_request:
    branches:
      - main
  push:
    tags:
      - 'v*.*.*'
    branches:
      - main
      - beta

permissions:
  id-token: write # required for OIDC
  contents: write # read and write access to repository contents
  issues: write

jobs:
  build-test-release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - uses: actions/setup-node@v6
        with: {node-version: latest}
      - uses: oven-sh/setup-bun@v2
      - run: bun i
      - run: bunx biofix
      - run: bun run build
      - run: bun run test
      - if: github.event_name == 'push'
        run: bunx semantic-release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

Adapt the workflow to the project's needs:
- If the project doesn't use bun, replace bun commands with npm equivalents
- If there's no build step, remove `bun run build`
- If there's no test step, remove `bun run test`
- Keep the `biofix` step as-is (it auto-fixes common issues)

### 3. Commit the changes

```bash
git add .
git commit -m "chore: setup semantic release"
```

### 4. Show OIDC configuration reminder

After setup, extract the package name and repo info, then tell the user:

```
=== Setup Complete ===
Don't forget to configure OIDC for NPM publishing!
Visit: https://www.npmjs.com/package/{package-name}/access
Steps:
  1. Set repo = {owner}/{repo}
  2. Set workflow name = release.yml

Also ensure GitHub Actions has write permissions:
  Visit: {repo-url}/settings/actions
  Set "Workflow permissions" to "Read and write permissions"
=====================
```

## Important Notes

- This uses **npm provenance via OIDC** — no NPM_TOKEN secret is needed
- The workflow publishes on pushes to `main` and `beta` branches
- Semantic-release follows [Conventional Commits](https://www.conventionalcommits.org/) for version bumps:
  - `fix:` → patch release
  - `feat:` → minor release
  - `feat!:` or `BREAKING CHANGE:` → major release
- The `beta` branch publishes pre-releases automatically
