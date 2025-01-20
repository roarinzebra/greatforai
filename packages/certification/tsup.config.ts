import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  external: ['react', 'react-dom', '@greatforai/core'],
  treeshake: true,
  sourcemap: true,
  minify: false,
  outDir: 'dist'
}); 