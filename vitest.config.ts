import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./src/__tests__/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['build/**', 'node_modules/**', '**/*.d.ts', '**/__tests__/**'],
    },
  },
  resolve: {
    alias: {
      'react-native': path.resolve(__dirname, './src/__mocks__/react-native.ts'),
    },
  },
});
