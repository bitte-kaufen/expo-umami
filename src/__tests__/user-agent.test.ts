import { describe, it, expect, vi, beforeEach } from 'vitest';
import { buildUserAgent } from '../user-agent';
import { Platform } from 'react-native';

// Mock the modules
vi.mock('expo-device', () => ({
  osVersion: '14.0',
  modelName: 'Pixel 7',
}));

vi.mock('expo-application', () => ({
  nativeApplicationVersion: '1.2.3',
  applicationName: 'TestApp',
}));

vi.mock('expo-constants', () => ({
  default: {
    expoConfig: {
      name: 'TestApp',
    },
    expoVersion: '52.0.0',
  },
}));

describe('buildUserAgent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should build correct User-Agent for Android', () => {
    vi.spyOn(Platform, 'OS', 'get').mockReturnValue('android');

    const userAgent = buildUserAgent();

    expect(userAgent).toBe('TestApp/1.2.3 (Linux; Android 14.0; Pixel 7) Expo/52.0.0');
    expect(userAgent).not.toContain('Mozilla');
    expect(userAgent).not.toContain('Chrome');
  });

  it('should build correct User-Agent for iOS', () => {
    vi.spyOn(Platform, 'OS', 'get').mockReturnValue('ios');

    const userAgent = buildUserAgent();

    expect(userAgent).toBe('Mozilla/5.0 (Pixel 7; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/1.2.3 Mobile/15E148 Safari/605.1.15');
    expect(userAgent).toContain('Mozilla');
    expect(userAgent).toContain('Safari');
  });

  it('should use expo config name when available', () => {
    vi.spyOn(Platform, 'OS', 'get').mockReturnValue('android');

    const userAgent = buildUserAgent();

    expect(userAgent).toContain('TestApp');
  });

  it('should include all required components', () => {
    vi.spyOn(Platform, 'OS', 'get').mockReturnValue('android');

    const userAgent = buildUserAgent();

    // Check format includes app name, version, and Expo
    expect(userAgent).toContain('TestApp');
    expect(userAgent).toContain('1.2.3');
    expect(userAgent).toContain('Expo/52.0.0');
    expect(userAgent).toContain('Android');
  });
});
