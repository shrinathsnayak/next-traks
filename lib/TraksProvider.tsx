import React from 'react'
import Script from 'next/script'
import { STUB_SCRIPT } from './constants'
import type { TraksProviderProps } from './types'

export default function TraksProvider(props: TraksProviderProps) {
  const {
    enabled = process.env.NODE_ENV === 'production' &&
      (!process.env.NEXT_PUBLIC_VERCEL_ENV ||
        process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'),
  } = props

  const proxyScriptPath = process.env.NEXT_TRAKS_SCRIPT_PATH

  if (props.src && proxyScriptPath) {
    throw new Error('next-traks: src is already set by withTraksProxy')
  }

  const src = proxyScriptPath ?? props.src
  if (!src) {
    throw new Error('next-traks: src is required when not using withTraksProxy')
  }

  if (!props.site) {
    throw new Error('next-traks: site is required')
  }

  return (
    <>
      {enabled && (
        <>
          <Script
            id="next-traks-stub"
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{ __html: STUB_SCRIPT }}
            nonce={props.scriptProps?.nonce}
          />
          <Script
            {...props.scriptProps}
            defer
            id="next-traks-script"
            src={src}
            data-site={props.site}
            data-hash={props.hashBasedRouting ? '' : undefined}
            data-404={props.track404 ? '' : undefined}
            integrity={props.integrity}
            crossOrigin={props.integrity ? 'anonymous' : undefined}
          />
        </>
      )}
      {props.children}
    </>
  )
}
