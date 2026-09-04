import type { NextConfig } from 'next'
import withTraksProxy from '../lib/withTraksProxy'

afterEach(() => {
  delete process.env.NEXT_TRAKS_SCRIPT_PATH
  delete process.env.NEXT_TRAKS_API_PATH
  delete process.env.NEXT_TRAKS_PROXY
})

test('adds rewrites and env vars with defaults', async () => {
  const config = withTraksProxy({
    src: 'https://analytics-collect.example.com/t.js',
  })({})

  const rewrites = await config.rewrites?.()

  expect(rewrites).toEqual([
    {
      basePath: false,
      source: '/t.js',
      destination: 'https://analytics-collect.example.com/t.js',
    },
    {
      basePath: false,
      source: '/api/event',
      destination: 'https://analytics-collect.example.com/api/event',
    },
  ])

  expect(config.env).toEqual({
    NEXT_TRAKS_PROXY: 'true',
    NEXT_TRAKS_SCRIPT_PATH: '/t.js',
    NEXT_TRAKS_API_PATH: '/api/event',
  })
})

test('respects custom scriptPath', async () => {
  const config = withTraksProxy({
    src: 'https://analytics-collect.example.com/t.js',
    scriptPath: '/js/script.js',
  })({})

  const rewrites = await config.rewrites?.()

  expect(rewrites).toEqual([
    {
      basePath: false,
      source: '/js/script.js',
      destination: 'https://analytics-collect.example.com/t.js',
    },
    {
      basePath: false,
      source: '/api/event',
      destination: 'https://analytics-collect.example.com/api/event',
    },
  ])
})

test('respects basePath', async () => {
  const config = withTraksProxy({
    src: 'https://analytics-collect.example.com/t.js',
  })({ basePath: '/blog' })

  const rewrites = await config.rewrites?.()

  expect(rewrites).toEqual([
    {
      basePath: false,
      source: '/blog/t.js',
      destination: 'https://analytics-collect.example.com/t.js',
    },
    {
      basePath: false,
      source: '/blog/api/event',
      destination: 'https://analytics-collect.example.com/api/event',
    },
  ])
})

test('preserves existing rewrites as arrays', async () => {
  const config = withTraksProxy({
    src: 'https://analytics-collect.example.com/t.js',
  })({
    rewrites: async () => [
      { source: '/existing', destination: 'https://example.com/existing' },
    ],
  })

  const rewrites = await config.rewrites?.()

  expect(rewrites).toEqual([
    { source: '/existing', destination: 'https://example.com/existing' },
    {
      basePath: false,
      source: '/t.js',
      destination: 'https://analytics-collect.example.com/t.js',
    },
    {
      basePath: false,
      source: '/api/event',
      destination: 'https://analytics-collect.example.com/api/event',
    },
  ])
})

test('preserves existing rewrites as objects', async () => {
  const config = withTraksProxy({
    src: 'https://analytics-collect.example.com/t.js',
  })({
    rewrites: async () => ({
      beforeFiles: [
        { source: '/before', destination: 'https://example.com/before' },
      ],
    }),
  })

  const rewrites = await config.rewrites?.()

  expect(rewrites).toEqual({
    beforeFiles: [
      { source: '/before', destination: 'https://example.com/before' },
    ],
    afterFiles: [
      {
        basePath: false,
        source: '/t.js',
        destination: 'https://analytics-collect.example.com/t.js',
      },
      {
        basePath: false,
        source: '/api/event',
        destination: 'https://analytics-collect.example.com/api/event',
      },
    ],
  })
})

test('does not mutate the original rewrites object', async () => {
  const userRewrites = async () => ({
    beforeFiles: [
      { source: '/before', destination: 'https://example.com/before' },
    ],
  })

  const config = withTraksProxy({
    src: 'https://analytics-collect.example.com/t.js',
  })({
    rewrites: userRewrites,
  })

  await config.rewrites?.()
  const rewrites = await config.rewrites?.()

  expect(rewrites).toEqual({
    beforeFiles: [
      { source: '/before', destination: 'https://example.com/before' },
    ],
    afterFiles: [
      {
        basePath: false,
        source: '/t.js',
        destination: 'https://analytics-collect.example.com/t.js',
      },
      {
        basePath: false,
        source: '/api/event',
        destination: 'https://analytics-collect.example.com/api/event',
      },
    ],
  })
})

test('throws when src is missing', () => {
  expect(() => withTraksProxy({} as unknown as { src: string })({})).toThrow(
    "next-traks: withTraksProxy requires a src option, e.g. 'https://analytics-collect.your-domain.com/t.js'"
  )
})

test('throws when src is not a valid URL', () => {
  expect(() => withTraksProxy({ src: 'not a url' })({})).toThrow(
    'next-traks: withTraksProxy src is not a valid URL: not a url'
  )
})

test('throws when scriptPath does not start with /', () => {
  expect(() =>
    withTraksProxy({
      src: 'https://analytics-collect.example.com/t.js',
      scriptPath: 'js/script.js',
    })({})
  ).toThrow(
    'next-traks: scriptPath must start with "/". Received: js/script.js'
  )
})

test('accepts a config subtype without casting', async () => {
  interface PWAConfig extends NextConfig {
    pwa?: { dest?: string }
  }

  const pwaConfig: PWAConfig = {
    basePath: '/blog',
    pwa: { dest: 'public' },
  }

  // Passing a config that extends NextConfig should not require `as any` or `as NextConfig`.
  const config = withTraksProxy({
    src: 'https://analytics-collect.example.com/t.js',
  })(pwaConfig)

  const rewrites = await config.rewrites?.()

  expect(rewrites).toEqual([
    {
      basePath: false,
      source: '/blog/t.js',
      destination: 'https://analytics-collect.example.com/t.js',
    },
    {
      basePath: false,
      source: '/blog/api/event',
      destination: 'https://analytics-collect.example.com/api/event',
    },
  ])

  expect((config as PWAConfig).pwa).toEqual({ dest: 'public' })
})
