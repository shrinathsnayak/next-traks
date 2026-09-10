# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

## [1.0.2] - 2026-09-10

### Fixed

- Added a React-free `next-traks/proxy` entry for `next.config.mjs` / `next.config.ts`. Importing `withTraksProxy` from the main package previously evaluated `react` and `next/script`, which Node's ESM loader cannot resolve (`ERR_MODULE_NOT_FOUND` for `next/script`). Use `import { withTraksProxy } from 'next-traks/proxy'` in ESM configs.

### Backward compatibility

- The main entry still re-exports `withTraksProxy`. Existing `require('next-traks')` in CommonJS `next.config.js` continues to work with no changes.
- `TraksProvider` and `useTraks` imports from `next-traks` are unchanged.

## [1.0.1] - 2026-09-10

### Fixed

- `withTraksProxy` now preserves the input config type (`<T extends NextConfig>(config: T) => T`) instead of returning a separately resolved `NextConfig`. Composing with other wrappers (e.g. `withPWA`) no longer needs `as never` / `as NextConfig` casts.

## [1.0.0] - 2026-09-08

### Added

- Initial release of `next-traks`.
- `TraksProvider` React component for injecting the Traks tracker script in both App Router and Pages Router applications.
- `useTraks` hook for sending custom events from client components, with TypeScript support for typed event payloads.
- `withTraksProxy` Next.js config wrapper for proxying the tracker script and event API through first-party URLs.
- Support for hash-based routing, 404 tracking, optional script integrity, and explicit enable/disable toggles.
- Environment variables for debugging and testing proxy rewrites: `NEXT_TRAKS_TEST_DOMAIN` and `NEXT_TRAKS_DEBUG`.
- ESM and CommonJS builds with TypeScript declarations.
- Jest test suite and GitHub Actions CI/CD workflows for lint, build, test, and npm publish with provenance.

[Unreleased]: https://github.com/shrinathsnayak/next-traks/compare/v1.0.2...HEAD
[1.0.2]: https://github.com/shrinathsnayak/next-traks/releases/tag/v1.0.2
[1.0.1]: https://github.com/shrinathsnayak/next-traks/releases/tag/v1.0.1
[1.0.0]: https://github.com/shrinathsnayak/next-traks/releases/tag/v1.0.0
