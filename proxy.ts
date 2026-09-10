/**
 * Node-safe entry for next.config.* — no React or next/script imports.
 * Prefer: import { withTraksProxy } from 'next-traks/proxy'
 */
import withTraksProxy from './lib/withTraksProxy'

export { withTraksProxy }
export default withTraksProxy
