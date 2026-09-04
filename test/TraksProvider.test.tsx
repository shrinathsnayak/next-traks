/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react'
import { render } from '@testing-library/react'
import TraksProvider from '../lib/TraksProvider'

jest.mock('next/script', () => ({
  __esModule: true,
  default: jest.fn(function Script(props: any) {
    const {
      src,
      'data-site': site,
      'data-hash': hash,
      'data-404': track404,
      integrity,
      crossOrigin,
      dangerouslySetInnerHTML,
      children,
      ...rest
    } = props

    const dataAttrs: any = {}
    if (site !== undefined) dataAttrs['data-site'] = site
    if (hash !== undefined) dataAttrs['data-hash'] = hash
    if (track404 !== undefined) dataAttrs['data-404'] = track404

    return (
      <script
        src={src}
        {...dataAttrs}
        integrity={integrity}
        crossOrigin={crossOrigin}
        {...rest}
        dangerouslySetInnerHTML={dangerouslySetInnerHTML}
      >
        {children}
      </script>
    )
  }),
}))

function setNodeEnv(env: string) {
  ;(process.env as any).NODE_ENV = env
}

afterEach(() => {
  delete process.env.NEXT_TRAKS_SCRIPT_PATH
  delete process.env.NEXT_TRAKS_API_PATH
})

test('renders the stub and script in production', () => {
  setNodeEnv('production')

  const { container } = render(
    <TraksProvider
      site="pb_abc123"
      src="https://analytics-collect.example.com/t.js"
    >
      <div>children</div>
    </TraksProvider>
  )

  const scripts = container.querySelectorAll('script')
  expect(scripts).toHaveLength(2)

  expect(scripts[0].getAttribute('id')).toBe('next-traks-stub')
  expect(scripts[0].getAttribute('strategy')).toBe('beforeInteractive')
  expect(scripts[0].innerHTML).toBe(
    'window.traks=window.traks||function(){(window.traks.q=window.traks.q||[]).push(arguments)}'
  )

  expect(scripts[1].getAttribute('id')).toBe('next-traks-script')
  expect(scripts[1].getAttribute('src')).toBe(
    'https://analytics-collect.example.com/t.js'
  )
  expect(scripts[1].getAttribute('data-site')).toBe('pb_abc123')
  expect(scripts[1].getAttribute('defer')).toBe('')
})

test('renders optional attributes when enabled', () => {
  setNodeEnv('production')

  const { container } = render(
    <TraksProvider
      site="pb_abc123"
      src="https://analytics-collect.example.com/t.js"
      hashBasedRouting
      track404
      integrity="sha384-..."
    >
      <div>children</div>
    </TraksProvider>
  )

  const script = container.querySelector('script#next-traks-script')
  expect(script?.getAttribute('data-hash')).toBe('')
  expect(script?.getAttribute('data-404')).toBe('')
  expect(script?.getAttribute('integrity')).toBe('sha384-...')
  expect(script?.getAttribute('crossOrigin')).toBe('anonymous')
})

test('does not render scripts when disabled', () => {
  setNodeEnv('production')

  const { container } = render(
    <TraksProvider
      site="pb_abc123"
      src="https://analytics-collect.example.com/t.js"
      enabled={false}
    >
      <div>children</div>
    </TraksProvider>
  )

  expect(container.querySelectorAll('script')).toHaveLength(0)
})

test('uses proxy script path from env', () => {
  setNodeEnv('production')
  process.env.NEXT_TRAKS_SCRIPT_PATH = '/t.js'

  const { container } = render(
    <TraksProvider site="pb_abc123">
      <div>children</div>
    </TraksProvider>
  )

  const script = container.querySelector('script#next-traks-script')
  expect(script?.getAttribute('src')).toBe('/t.js')
})

test('throws when both src and proxy path are set', () => {
  setNodeEnv('production')
  process.env.NEXT_TRAKS_SCRIPT_PATH = '/t.js'

  expect(() =>
    render(
      <TraksProvider
        site="pb_abc123"
        src="https://analytics-collect.example.com/t.js"
      />
    )
  ).toThrow('next-traks: src is already set by withTraksProxy')
})

test('throws when src is missing and proxy is not used', () => {
  setNodeEnv('production')

  expect(() => render(<TraksProvider site="pb_abc123" />)).toThrow(
    'next-traks: src is required when not using withTraksProxy'
  )
})

test('throws when site is missing', () => {
  setNodeEnv('production')

  expect(() =>
    render(
      <TraksProvider site="" src="https://analytics-collect.example.com/t.js" />
    )
  ).toThrow('next-traks: site is required')
})
