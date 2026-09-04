import { useCallback } from 'react'
import type { Events, DefaultEvents, EventArgs, TraksWindow } from './types'

export default function useTraks<E extends Events = DefaultEvents>() {
  return useCallback(function <N extends keyof E & string>(
    eventName: N,
    ...rest: EventArgs<E, N>
  ) {
    const [props, value] = rest
    const traks = (window as TraksWindow).traks

    if (props !== undefined) {
      return value !== undefined
        ? traks?.(eventName, props, value)
        : traks?.(eventName, props)
    }

    return value !== undefined ? traks?.(eventName, value) : traks?.(eventName)
  }, [])
}
