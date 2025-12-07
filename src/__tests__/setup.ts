import { vi } from 'vitest';

// Mock React Native modules
vi.mock('react-native', () => ({
  Platform: {
    OS: 'ios',
    select: vi.fn((obj) => obj.ios),
  },
  Dimensions: {
    get: vi.fn(() => ({ width: 390, height: 844 })),
  },
  AppState: {
    addEventListener: vi.fn(() => ({ remove: vi.fn() })),
    currentState: 'active',
  },
}));

// Mock Expo modules
vi.mock('expo-application', () => ({
  applicationId: 'com.test.app',
  nativeApplicationVersion: '1.0.0',
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
      extra: {},
    },
  },
}));

vi.mock('@react-native-async-storage/async-storage', () => ({
  default: {
    getItem: vi.fn(async () => null),
    setItem: vi.fn(async () => {}),
    removeItem: vi.fn(async () => {}),
  },
}));

// Mock change-case to avoid any parsing issues
vi.mock('change-case', () => ({
  kebabCase: vi.fn((str: string) => str.toLowerCase().replace(/\s+/g, '-')),
}));

// Mock fetch
global.fetch = vi.fn();
