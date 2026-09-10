import typescript from 'rollup-plugin-typescript2'
import pkg from './package.json'

const external = [...Object.keys(pkg.peerDependencies), /^next\//]

const sharedPlugins = [typescript()]

export default [
  {
    input: 'index.ts',
    output: [
      {
        file: pkg.module,
        format: 'esm',
        sourcemap: true,
      },
      {
        file: pkg.main,
        format: 'cjs',
        sourcemap: true,
        exports: 'named',
      },
    ],
    plugins: sharedPlugins,
    external,
  },
  {
    input: 'proxy.ts',
    output: [
      {
        file: 'dist/proxy.esm.js',
        format: 'esm',
        sourcemap: true,
      },
      {
        file: 'dist/proxy.js',
        format: 'cjs',
        sourcemap: true,
        exports: 'named',
      },
    ],
    plugins: sharedPlugins,
    external,
  },
]
