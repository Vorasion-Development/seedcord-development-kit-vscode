import { defineConfig } from 'tsdown'

export default defineConfig({
  deps: {
    onlyBundle: false,
    neverBundle: ['vscode'],
  },
  entry: ['src/extension.ts'],
  format: ['cjs'],
  minify: true,
  sourcemap: true,
  target: 'node22',
})
