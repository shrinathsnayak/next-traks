# next-traks

Simple, privacy-friendly analytics for [Next.js](https://nextjs.org) - powered by [Traks](https://traks.dev).

[![npm version](https://img.shields.io/npm/v/next-traks.svg)](https://www.npmjs.com/package/next-traks) [![npm downloads](https://img.shields.io/npm/dm/next-traks.svg)](https://www.npmjs.com/package/next-traks) [![bundle size](https://img.shields.io/bundlephobia/minzip/next-traks)](https://bundlephobia.com/package/next-traks) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![Next.js](https://img.shields.io/badge/Next.js-13%2B-black)](https://nextjs.org)

> **Shoutout to [Traks](https://traks.dev)** - the self-hosted, cookie-free analytics platform that runs inside your own Cloudflare account. This package is an official-style integration that makes using Traks with Next.js effortless.

## Table of Contents

- [Installation](#installation)
- [Agent setup (copy-paste)](#agent-setup-copy-paste)
- [Usage](#usage)
- [Proxy the tracker script](#proxy-the-tracker-script)
- [Send custom events](#send-custom-events)
- [TypeScript custom events](#typescript-custom-events)
- [Environment variables](#environment-variables)
- [Developing](#developing)
- [License](#license)

## Installation

```bash
npm install next-traks
```

## Agent setup (copy-paste)

Paste the block below into Cursor, Claude Code, Copilot Chat, or any coding agent. Fill in your Traks values first (from the [Traks](https://traks.dev) dashboard).

````md
Set up next-traks with first-party proxying in this Next.js app.

Package: https://www.npmjs.com/package/next-traks
Docs: https://github.com/shrinathsnayak/next-traks

Values (replace if still placeholders):

- SITE_KEY: pb_xxxxxxxx
- COLLECTOR_SRC: https://analytics-collect.your-domain.com/t.js

Do all of the following:

1. Install the package:
   npm install next-traks
   (or pnpm / yarn / bun equivalent)
   Use a recent version that exports "next-traks/proxy" (1.0.2+).

2. Wire the Next.js config with the Node-safe proxy entry.
   - Prefer editing existing next.config.mjs, next.config.ts, or next.config.js.
   - For new or ESM configs: MUST import from "next-traks/proxy" (not from "next-traks").
     Importing withTraksProxy from "next-traks" in next.config.mjs/ts fails because the
     main ESM bundle loads react and next/script.
   - Backward compatible: existing CommonJS next.config.js that uses
     require("next-traks") can stay as-is. Prefer migrating to "next-traks/proxy".
   - Wrap the exported config with withTraksProxy({ src: COLLECTOR_SRC }).
   - Preserve any existing config options and other wrappers (compose them).

   ESM example (next.config.mjs / next.config.ts):

   ```js
   import { withTraksProxy } from 'next-traks/proxy'

   export default withTraksProxy({
     src: 'COLLECTOR_SRC',
   })({
     // existing next config
   })
   ```

   CommonJS example (next.config.js):

   ```js
   const { withTraksProxy } = require('next-traks/proxy')

   module.exports = withTraksProxy({
     src: 'COLLECTOR_SRC',
   })({
     // existing next config
   })
   ```

3. Mount TraksProvider at the app root.
   - App Router: wrap children in app/layout.tsx (or the root layout).
   - Pages Router: wrap the page in pages/_app.tsx.
   - Because the proxy is enabled, do NOT pass `src` to TraksProvider.
   - Pass site={SITE_KEY} only.

   ```tsx
   import TraksProvider from 'next-traks'

   ;<TraksProvider site="SITE_KEY">{children}</TraksProvider>
   ```

4. Do not add createRequire / dynamic import workarounds. Use next-traks/proxy.

5. Optionally show a one-line custom event example with useTraks from "next-traks" in a client component.

6. Summarize the files you changed.
````

After the agent finishes, restart the Next.js dev server so config rewrites take effect.

## Usage

### Include the tracker script

Wrap your app with `<TraksProvider />` at the top level. Find your site key and collector script URL in your [Traks](https://traks.dev) dashboard.

#### App Router

```tsx
// app/layout.tsx
import TraksProvider from 'next-traks'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <TraksProvider
          site="pb_xxxxxxxx"
          src="https://analytics-collect.your-domain.com/t.js"
        >
          {children}
        </TraksProvider>
      </body>
    </html>
  )
}
```

#### Pages Router

```tsx
// pages/_app.tsx
import TraksProvider from 'next-traks'

export default function MyApp({ Component, pageProps }) {
  return (
    <TraksProvider
      site="pb_xxxxxxxx"
      src="https://analytics-collect.your-domain.com/t.js"
    >
      <Component {...pageProps} />
    </TraksProvider>
  )
}
```

### `TraksProvider` props

| Prop               | Type          | Description                                                                                                                       |
| ------------------ | ------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `site`             | `string`      | **Required.** Your Traks site key, e.g. `pb_xxxxxxxx`.                                                                            |
| `src`              | `string`      | The collector script URL, e.g. `https://analytics-collect.your-domain.com/t.js`. Not required when using `withTraksProxy`.        |
| `hashBasedRouting` | `boolean`     | Set to `true` for hash-based routers so `#/route` becomes part of the page path.                                                  |
| `track404`         | `boolean`     | Set to `true` on your 404 template to record broken URLs as a `404` event.                                                        |
| `enabled`          | `boolean`     | Explicitly enable or disable the tracker. Defaults to `true` in production only (checks `NODE_ENV` and `NEXT_PUBLIC_VERCEL_ENV`). |
| `integrity`        | `string`      | Optional subresource integrity hash for the tracker script.                                                                       |
| `scriptProps`      | `ScriptProps` | Optional overrides for the `<script>` element props.                                                                              |

## Proxy the tracker script

To avoid ad blockers and use first-party URLs, wrap your Next.js config with `withTraksProxy`.

### Recommended: `next-traks/proxy`

Import from **`next-traks/proxy`** in config files. That subpath has no React or `next/script` dependencies, so Node can load it when evaluating the config.

Importing `withTraksProxy` from `next-traks` in `next.config.mjs` / `next.config.ts` will fail with `ERR_MODULE_NOT_FOUND` for `next/script`.

#### `next.config.mjs` / `next.config.ts`

```js
// next.config.mjs
import { withTraksProxy } from 'next-traks/proxy'

export default withTraksProxy({
  src: 'https://analytics-collect.your-domain.com/t.js',
})({
  // ...your Next.js config, even if empty
})
```

```ts
// next.config.ts
import type { NextConfig } from 'next'
import { withTraksProxy } from 'next-traks/proxy'

const nextConfig: NextConfig = {
  // ...
}

export default withTraksProxy({
  src: 'https://analytics-collect.your-domain.com/t.js',
})(nextConfig)
```

#### `next.config.js` (CommonJS)

```js
// next.config.js
const { withTraksProxy } = require('next-traks/proxy')

module.exports = withTraksProxy({
  src: 'https://analytics-collect.your-domain.com/t.js',
})({
  // ...your Next.js config, even if empty
})
```

### Backward compatibility

`withTraksProxy` remains exported from the main `next-traks` entry. Existing CommonJS configs that use `require('next-traks')` keep working — no migration required:

```js
// next.config.js — still supported
const { withTraksProxy } = require('next-traks')

module.exports = withTraksProxy({
  src: 'https://analytics-collect.your-domain.com/t.js',
})({})
```

Prefer `next-traks/proxy` for new setups and for any ESM config (`next.config.mjs` / `next.config.ts`). The main package entry is still the right place to import `TraksProvider` and `useTraks` in app code.

When the proxy is active, `src` is not required on `TraksProvider`:

```tsx
<TraksProvider site="pb_xxxxxxxx">{children}</TraksProvider>
```

By default the script is served from `/t.js` and the event API from `/api/event`. You can override the script path:

```js
import { withTraksProxy } from 'next-traks/proxy'

export default withTraksProxy({
  src: 'https://analytics-collect.your-domain.com/t.js',
  scriptPath: '/js/script.js',
})({
  // ...
})
```

> **Note:** The Traks tracker always sends events to `/api/event` relative to the script's origin. This is hard-coded in the tracker, so the API path is not configurable through this package.

`withTraksProxy` accepts any config that extends `NextConfig`, so it works alongside other wrappers without casting:

```js
// next.config.mjs
import { withTraksProxy } from 'next-traks/proxy'
import withPWA from '@ducanh2912/next-pwa'

const nextConfig = withPWA({
  dest: 'public',
})

export default withTraksProxy({
  src: 'https://traks-collect.abhijeetnayak99.workers.dev/t.js',
})(nextConfig)
```

## Send custom events

Use the `useTraks` hook to fire custom events from React components. It is a client-only hook, so it must be used inside a client component or page. Calls made before the tracker loads are queued by the inline stub and replayed in order.

```tsx
import { useTraks } from 'next-traks'

export default function TraksButton() {
  const traks = useTraks()

  return (
    <button onClick={() => traks('signup', { plan: 'pro' })}>Sign up</button>
  )
}
```

You can also pass an optional numeric `value`:

```tsx
<button onClick={() => traks('purchase', { sku: 'T100' }, 49.99)}>
  Purchase
</button>
```

## TypeScript custom events

Type your events so only the right payloads are accepted:

```tsx
import { useTraks } from 'next-traks'

type MyEvents = {
  signup: { plan: string }
  purchase: { sku: string }
  click: never
}

export default function TypedButton() {
  const traks = useTraks<MyEvents>()

  return (
    <button onClick={() => traks('signup', { plan: 'pro' })}>Sign up</button>
  )
}
```

Events defined as `never` (like `click` above) can be sent without props:

```tsx
traks('click')
```

## Environment variables

| Variable                 | Description                                                                |
| ------------------------ | -------------------------------------------------------------------------- |
| `NEXT_PUBLIC_VERCEL_ENV` | Checked to decide production mode when `enabled` is not set.               |
| `NEXT_TRAKS_TEST_DOMAIN` | When using `withTraksProxy`, redirect rewrites to this domain for testing. |
| `NEXT_TRAKS_DEBUG`       | Log the generated rewrites to the console.                                 |

## Developing

Requires Node.js 18.17 or later.

- `npm install` – install dependencies.
- `npm run lint` – run ESLint.
- `npm run format` – run Prettier.
- `npm test` – run the test suite.
- `npm run build` – generate the production bundle under `dist/`.
- `npm publish` – publish to npm after building.

## License

MIT

---

Maintained by [Shrinath Nayak](https://snayak.dev). Built for [Traks](https://traks.dev).
