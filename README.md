# @snomiao/setup-semantic-release

A tool to automatically set up semantic-release for your JavaScript/TypeScript projects.

[![npm version](https://badge.fury.io/js/@snomiao%2Fsetup-semantic-release.svg)](https://www.npmjs.com/package/@snomiao/setup-semantic-release)
[![license](https://img.shields.io/npm/l/@snomiao/setup-semantic-release)](https://github.com/snomiao/setup-semantic-release/blob/main/LICENSE)

## Features

- ✅ Sets up [semantic-release](https://github.com/semantic-release/semantic-release)
- ✅ Configures [Husky](https://typicode.github.io/husky/) git hooks
- ✅ Adds GitHub Actions workflow for automated releases
- ✅ Easy one-command setup process

## Installation

```bash
# Using bun
bun add @snomiao/setup-semantic-release -D

# Using npm
npm install @snomiao/setup-semantic-release --save-dev
```

## Usage

Run the following command in the root directory of your git repository:

```bash
# Using bun
bunx @snomiao/setup-semantic-release

# Using npx
npx @snomiao/setup-semantic-release
```

## What It Does

When you run the setup command, it will:

1. Check that you're in the root of a git repository
2. Check that your git working tree is clean
3. Install and configure Husky
4. Install semantic-release dependencies
5. Set up a GitHub Actions workflow for automated releases
6. Commit the changes with "chore: setup semantic release"

## Configuration

If you have an `NPM_TOKEN` environment variable set, it will automatically configure it as a GitHub secret for your repository. Otherwise, it will provide instructions on how to set it up manually.

## Claude Code Skill

This package is also available as a [Claude Code](https://claude.ai/claude-code) skill/plugin. AI agents can use it to set up semantic-release in your project conversationally.

### Install

```bash
bunx skills add snomiao/setup-semantic-release
```

### Use

Once installed, invoke it in Claude Code:

```
/setup-semantic-release
```

Or just ask Claude: *"Set up semantic-release for this project"* — the skill triggers automatically based on context.

## Requirements

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) or [Bun](https://bun.sh/)
- A clean git repository

## License

MIT © [snomiao](https://github.com/snomiao)