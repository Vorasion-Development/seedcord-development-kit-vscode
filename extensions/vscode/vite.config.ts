import { defineConfig } from 'vite-plus'

export default defineConfig({
  pack: {
    deps: {
      onlyBundle: false,
      neverBundle: ['vscode'],
    },
    entry: ['src/extension.ts'],
    format: ['cjs'],
    minify: true,
    sourcemap: true,
    target: 'node22',
  },
})
