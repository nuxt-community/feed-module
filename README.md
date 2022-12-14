# Nuxt Feed Module

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![Github Actions CI][github-actions-ci-src]][github-actions-ci-href]
[![Codecov][codecov-src]][codecov-href]
[![License][license-src]][license-href]

> Feed module enables everyone to have RSS, Atom and Json.

[📖 **Release Notes**](./CHANGELOG.md)

## Features

- 🪄&nbsp; Three different feed types (ATOM 1.0, JSON 1.0, and RSS 2.0)
- 👌&nbsp; As many feeds as you like
- 📦&nbsp; Completely customizable
- 🚀&nbsp; [Nuxt 3](https://v3.nuxtjs.org/) support

## Setup

1. Add `@nuxtjs/feed` dependency to your project

```bash
# Using npm
npm install --save-dev @nuxtjs/feed

# Using pnpm
pnpm install --dev @nuxtjs/feed

# Using yarn
yarn add --dev @nuxtjs/feed
```

2. Add `@nuxtjs/feed` to the `modules` section of `nuxt.config.js`

```js
{
  modules: [
    ['@nuxtjs/feed', { /* module options */ }]
  ],
  feed: { /* module options */ }
}
```

3. [Configure module options](#configuration)

## Configuration

TBD

## Development

- Clone this repository
- Run `pnpm install` to install dependencies
- Run `pnpm run dev:prepare` to generate type stubs
- Use `pnpm run dev` to start [playground](./playground) in development mode
- Use `pnpm run dev:build` to build Nuxt application of [playground](./playground)
- Use `pnpm run dev:generate` to generate Nuxt appllication of [playground](./playground)

## License

[MIT License](./LICENSE)

Copyright (c) - Nuxt Community

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/@nuxtjs/feed/latest.svg
[npm-version-href]: https://npmjs.com/package/@nuxtjs/feed

[npm-downloads-src]: https://img.shields.io/npm/dt/@nuxtjs/feed.svg
[npm-downloads-href]: https://npmjs.com/package/@nuxtjs/feed

[github-actions-ci-src]: https://github.com/nuxt-community/feed-module/workflows/ci/badge.svg
[github-actions-ci-href]: https://github.com/nuxt-community/feed-module/actions?query=workflow%3Aci

[codecov-src]: https://img.shields.io/codecov/c/github/nuxt-community/feed-module.svg
[codecov-href]: https://codecov.io/gh/nuxt-community/feed-module

[license-src]: https://img.shields.io/npm/l/@nuxtjs/feed.svg
[license-href]: https://npmjs.com/package/@nuxtjs/feed
