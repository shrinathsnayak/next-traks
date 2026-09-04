# Next-Traks

[![npm version](https://img.shields.io/npm/v/next-traks.svg)](https://www.npmjs.com/package/next-traks)
[![npm downloads](https://img.shields.io/npm/dm/next-traks.svg)](https://www.npmjs.com/package/next-traks)
[![bundle size](https://img.shields.io/bundlephobia/minzip/next-traks)](https://bundlephobia.com/package/next-traks)

Simple integration for [Next.js](https://nextjs.org) and [Traks](https://traks.dev) privacy-friendly analytics.

Traks is a self-hosted, cookie-free analytics platform that runs inside your own Cloudflare account.

Maintained by [Shrinath Nayak](https://snayak.dev).

## Installation

```bash
npm install next-traks
```

## Usage

### Include the tracker script

Wrap your app with `<TraksProvider />` at the top level. Find your site key and collector script URL in your Traks dashboard.

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

| Name               | Description                                                                                                                       |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| `site`             | **Required.** Your Traks site key, e.g. `pb_xxxxxxxx`.                                                                            |
| `src`              | The collector script URL, e.g. `https://analytics-collect.your-domain.com/t.js`. Not required when using `withTraksProxy`.        |
| `hashBasedRouting` | Set to `true` for hash-based routers so `#/route` becomes part of the page path.                                                  |
| `track404`         | Set to `true` on your 404 template to record broken URLs as a `404` event.                                                        |
| `enabled`          | Explicitly enable or disable the tracker. Defaults to `true` in production only (checks `NODE_ENV` and `NEXT_PUBLIC_VERCEL_ENV`). |
| `integrity`        | Optional subresource integrity hash for the tracker script.                                                                       |
| `scriptProps`      | Optional overrides for the `<script>` element props.                                                                              |

### Proxy the tracker script

To avoid ad blockers and use first-party URLs, wrap your `next.config.js` with `withTraksProxy`:

```js
// next.config.js
const { withTraksProxy } = require('next-traks')

module.exports = withTraksProxy({
  src: 'https://analytics-collect.your-domain.com/t.js',
})({
  // ...your Next.js config, even if empty
})
```

When the proxy is active, `src` is not required on `TraksProvider`:

```tsx
<TraksProvider site="pb_xxxxxxxx">{children}</TraksProvider>
```

By default the script is served from `/t.js` and the event API from `/api/event`. You can override the script path:

```js
const { withTraksProxy } = require('next-traks')

module.exports = withTraksProxy({
  src: 'https://analytics-collect.your-domain.com/t.js',
  scriptPath: '/js/script.js',
})({
  // ...
})
```

> **Note:** The Traks tracker always sends events to `/api/event` relative to the script's origin. This is hard-coded in the tracker, so the API path is not configurable through this package.

`withTraksProxy` accepts any config that extends `NextConfig`, so it works alongside other wrappers without casting:

```js
// next.config.js
const { withTraksProxy } = require('next-traks')
const withPWA = require('@ducanh2912/next-pwa').default

const nextConfig = withPWA({
  dest: 'public',
})

module.exports = withTraksProxy({
  src: 'https://traks-collect.abhijeetnayak99.workers.dev/t.js',
})(nextConfig)
```

### Send custom events

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

### TypeScript custom events

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
