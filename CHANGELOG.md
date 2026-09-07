# Changelog

All notable changes to this project will be documented in this file.

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

[Unreleased]: https://github.com/shrinathsnayak/next-traks/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/shrinathsnayak/next-traks/releases/tag/v1.0.0
