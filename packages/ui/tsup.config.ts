import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: {
    entry: './src/index.ts',
    resolve: true,
    compilerOptions: {
      composite: true,
      tsBuildInfoFile: './dist/.tsbuildinfo'
    }
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