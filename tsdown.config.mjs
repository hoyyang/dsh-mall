/**
 * Client bundle: a closure-factory artifact for the web shell's module
 * loader. Externals resolve through the injected require (module table);
 * everything else inlines. Node half is emitted by tsc.
 */
const EXTERNALS = [
  'react',
  'react/jsx-runtime',
  'react-dom',
  '@deepseek-ai/cordis',
  '@deepseek-ai/dsh-client-ui-primitives',
]

export default {
  name: 'dsh-mall/client',
  entry: { client: 'src/client/index.ts' },
  outDir: 'client',
  format: 'cjs',
  platform: 'browser',
  target: 'es2022',
  dts: false,
  sourcemap: false,
  clean: false,
  external: [...EXTERNALS],
  noExternal: (id) => (EXTERNALS.includes(id) ? undefined : true),
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV ?? 'production'),
  },
  outputOptions: {
    entryFileNames: 'client.js',
      },
}
