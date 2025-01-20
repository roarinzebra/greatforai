import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  splitting: false,
  clean: true,
  external: ['react', 'react-dom', '@greatforai/core'],
  treeshake: true,
  sourcemap: true,
  minify: false,
  outDir: 'dist',
  tsconfig: './tsconfig.json'
}); 