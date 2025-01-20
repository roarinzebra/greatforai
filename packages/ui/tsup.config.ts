import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: {
    entry: './src/index.ts',
    resolve: true
  },
  clean: true,
  external: [
    'react',
    'react-dom',
    '@greatforai/core'
  ],
  treeshake: true,
  sourcemap: true,
  minify: false,
  outDir: 'dist',
}); 