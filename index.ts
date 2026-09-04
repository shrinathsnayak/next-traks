import useTraks from './lib/useTraks'
import withTraksProxy from './lib/withTraksProxy'
import TraksProvider from './lib/TraksProvider'

export type {
  TraksEventProps,
  Events as TraksEvents,
  TraksProviderProps,
  Rewrite as TraksRewrite,
} from './lib/types'

export { useTraks, withTraksProxy }
export default TraksProvider
