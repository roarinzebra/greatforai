import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  external: [
    '@greatforai/core',
    '@greatforai/database',
    '@greatforai/ai-core'
  ],
  treeshake: true,
  sourcemap: true,
  minify: false,
  outDir: 'dist',
}); 