import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  external: [
    'react',
    'react-dom',
    '@radix-ui/*',
    'framer-motion',
    'lucide-react',
    'class-variance-authority',
    'clsx',
    'tailwind-merge'
  ],
  treeshake: true,
  sourcemap: true,
  minify: true,
  splitting: false,
  keepNames: true,
  outDir: 'dist'
}); 