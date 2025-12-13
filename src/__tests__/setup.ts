import { vi } from 'vitest';

// React Native is aliased in vitest.config.ts to use our mock

// Mock Expo modules
vi.mock('expo-application', () => ({
  applicationId: 'com.test.app',
  nativeApplicationVersion: '1.0.0',
  applicationName: 'TestApp',
}));

vi.mock('expo-device', () => ({
  osVersion: '17.0',
  modelName: 'iPhone 15 Pro',
}));

vi.mock('expo-localization', () => ({
  getLocales: vi.fn(() => [{ languageTag: 'en-US' }]),
}));

vi.mock('expo-constants', () => ({
  default: {
    expoConfig: {
      name: 'TestApp',
      extra: {},
    },
    expoVersion: '52.0.0',
  },
}));

vi.mock('@react-native-async-storage/async-storage', () => ({
  default: {
    getItem: vi.fn(async () => null),
    setItem: vi.fn(async () => {}),
    removeItem: vi.fn(async () => {}),
  },
}));

// Mock fetch
global.fetch = vi.fn();
