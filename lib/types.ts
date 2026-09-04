import type { ReactNode, ComponentProps } from 'react'
import type Script from 'next/script'

export type TraksEventProps = Record<string, unknown> | never | undefined

export type Events = Record<string, TraksEventProps>

export type DefaultEvents = Record<string, Record<string, unknown> | undefined>

export type IsOptionalProps<P> = [P] extends [never]
  ? false
  : undefined extends P
    ? true
    : false

export type EventArgs<E, N extends keyof E & string> = [E[N]] extends [never]
  ? [props?: undefined, value?: number]
  : IsOptionalProps<E[N]> extends true
    ? [props?: E[N], value?: number]
    : [props: E[N], value?: number]

export interface TraksProviderProps {
  /**
   * Your Traks site key, e.g. pb_xxx. Find it in your Traks dashboard.
   */
  site: string
  /**
   * The Traks collector script URL, e.g. https://analytics-collect.your-domain.com/t.js.
   * Not required when using withTraksProxy.
   */
  src?: string
  /**
   * Set to true for hash-based routers, so #/route becomes part of the page path.
   */
  hashBasedRouting?: boolean
  /**
   * Put this on your 404 template to record broken URLs as a 404 event.
   */
  track404?: boolean
  children?: ReactNode
  /**
   * Use this to explicitly decide whether or not to render the tracker.
   * If not passed, the tracker is rendered in production environments only
   * (checking NODE_ENV and NEXT_PUBLIC_VERCEL_ENV).
   */
  enabled?: boolean
  /**
   * Optionally define the subresource integrity attribute for extra security.
   * See https://infosec.mozilla.org/guidelines/web_security#subresource-integrity
   */
  integrity?: string
  /**
   * Optionally override any props passed to the script element.
   * Built-in props (id, src, data-site, data-hash, data-404, integrity,
   * crossOrigin, defer) cannot be overridden.
   */
  scriptProps?: ComponentProps<typeof Script>
}

export interface Rewrite {
  source: string
  destination: string
  basePath?: false
}

export interface WithTraksProxyOptions {
  /**
   * The Traks collector script URL, e.g.
   * https://analytics-collect.your-domain.com/t.js.
   */
  src: string
  /**
   * The local path for the proxied script. Defaults to /t.js.
   * Note: the Traks tracker always sends events to /api/event relative to the
   * script's origin, so the API path is fixed at /api/event.
   */
  scriptPath?: string
}

export type TraksWindow = Window & {
  traks?: (...args: unknown[]) => void
}
