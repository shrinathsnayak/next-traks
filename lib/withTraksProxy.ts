import { NextConfig } from 'next'
import type { Rewrite, WithTraksProxyOptions } from './types'
import { ENV_PROXY, ENV_SCRIPT_PATH, ENV_API_PATH } from './constants'

export default function withTraksProxy(options: WithTraksProxyOptions) {
  if (!options?.src) {
    throw new Error(
      "next-traks: withTraksProxy requires a src option, e.g. 'https://analytics-collect.your-domain.com/t.js'"
    )
  }

  let srcUrl: URL
  try {
    srcUrl = new URL(options.src)
  } catch {
    throw new Error(
      `next-traks: withTraksProxy src is not a valid URL: ${options.src}`
    )
  }

  return <T extends NextConfig>(nextConfig: T): NextConfig => {
    const scriptPath =
      (nextConfig.basePath ?? '') + (options.scriptPath ?? '/t.js')
    const apiPath = (nextConfig.basePath ?? '') + '/api/event'

    if (!scriptPath.startsWith('/')) {
      throw new Error(
        `next-traks: scriptPath must start with "/". Received: ${options.scriptPath}`
      )
    }

    const testDomain = process.env.NEXT_TRAKS_TEST_DOMAIN
    let scriptDestination: string
    let apiDestination: string

    if (testDomain) {
      let testUrl: URL
      try {
        testUrl = new URL(testDomain)
      } catch {
        throw new Error(
          `next-traks: NEXT_TRAKS_TEST_DOMAIN is not a valid URL: ${testDomain}`
        )
      }
      scriptDestination = testUrl.origin + srcUrl.pathname
      apiDestination = testUrl.origin + '/api/event'
    } else {
      scriptDestination = options.src
      apiDestination = srcUrl.origin + '/api/event'
    }

    const traksRewrites: Rewrite[] = [
      {
        basePath: false,
        source: scriptPath,
        destination: scriptDestination,
      },
      {
        basePath: false,
        source: apiPath,
        destination: apiDestination,
      },
    ]

    if (process.env.NEXT_TRAKS_DEBUG) {
      console.log('traksRewrites = ', traksRewrites)
    }

    return {
      ...nextConfig,
      env: {
        ...nextConfig.env,
        [ENV_PROXY]: 'true',
        [ENV_SCRIPT_PATH]: scriptPath,
        [ENV_API_PATH]: apiPath,
      },
      rewrites: async () => {
        const userRewrites = await nextConfig.rewrites?.()

        if (!userRewrites) {
          return traksRewrites
        }

        if (Array.isArray(userRewrites)) {
          return userRewrites.concat(traksRewrites)
        }

        return {
          ...userRewrites,
          afterFiles: [...(userRewrites.afterFiles ?? []), ...traksRewrites],
        }
      },
    }
  }
}
