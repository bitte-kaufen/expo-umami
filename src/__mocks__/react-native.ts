import { vi } from 'vitest';

export const Platform = {
  OS: 'ios',
  select: vi.fn((obj: any) => obj.ios),
};

export const Dimensions = {
  get: vi.fn(() => ({ width: 390, height: 844 })),
};

export const AppState = {
  addEventListener: vi.fn(() => ({ remove: vi.fn() })),
  currentState: 'active',
};
