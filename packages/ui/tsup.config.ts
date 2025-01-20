import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: {
    compilerOptions: {
      moduleResolution: "bundler",
      jsx: "react-jsx"
    }
  },
  splitting: false,
  clean: true,
  external: ['react', 'react-dom'],
  treeshake: true,
  sourcemap: true,
  minify: false,
  outDir: 'dist'
}); 