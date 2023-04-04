# Nuxt Feed Module

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

Feed module enables everyone to have RSS, Atom and Json.

- [✨ &nbsp;Release Notes](/CHANGELOG.md)

## Features

- 🪄&nbsp; Three different feed types (ATOM 1.0, JSON 1.0, and RSS 2.0)
- 👌&nbsp; As many feeds as you like
- 📦&nbsp; Completely customizable
- 🚀&nbsp; [Nuxt 3](https://nuxt.com) support

## Quick Setup

1. Add `@nuxtjs/feed` dependency to your project

```bash
# Using pnpm
pnpm add -D @nuxtjs/feed
# Using yarn
yarn add --dev @nuxtjs/feed
# Using npm
npm install --save-dev @nuxtjs/feed
```

2. Add `@nuxtjs/feed` to the `modules` section of `nuxt.config.ts`

```js
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/feed'
  ]
})
```

That's it! You can now use Nuxt Feed Module in your Nuxt app ✨

## Configuration

TBD

## Development

```bash
# Install dependencies
pnpm install
# Generate type stubs
pnpm run dev:prepare
# Develop with the playground
pnpm run dev
# Build the playground
pnpm run dev:build
# Run ESLint
pnpm run lint
# Run Vitest
pnpm run test
pnpm run test:watch
# Release new version
pnpm run release
```

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/@nuxtjs/feed/latest.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-version-href]: https://npmjs.com/package/@nuxtjs/feed

[npm-downloads-src]: https://img.shields.io/npm/dm/@nuxtjs/feed.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-downloads-href]: https://npmjs.com/package/@nuxtjs/feed

[license-src]: https://img.shields.io/npm/l/@nuxtjs/feed.svg?style=flat&colorA=18181B&colorB=28CF8D
[license-href]: https://npmjs.com/package/@nuxtjs/feed

[nuxt-src]: https://img.shields.io/badge/Nuxt-18181B?logo=nuxt.js
[nuxt-href]: https://nuxt.com/modules/module-feed
