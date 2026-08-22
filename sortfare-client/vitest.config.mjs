import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve('.'),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.js'],
    css: false,
    deps: {
      inline: [/@heroui/],
    },
    exclude: ['tests/e2e/**', 'node_modules/**'],
  },
})
