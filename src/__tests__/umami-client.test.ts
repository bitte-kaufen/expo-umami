import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { UmamiClient } from '../umami-client';
import type { UmamiConfig } from '../types';
import { Dimensions } from 'react-native';

describe('UmamiClient', () => {
  let client: UmamiClient;
  const mockConfig: UmamiConfig = {
    websiteId: 'test-website-id',
    hostUrl: 'https://analytics.test.com',
    batchSize: 10,
    batchInterval: 30000,
    persistEvents: false,
    debug: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
    client = UmamiClient.getInstance();
  });

  afterEach(() => {
    if (client.isInitialized()) {
      client.destroy();
    }
  });

  describe('initialization', () => {
    it('should initialize with provided config', async () => {
      await client.init(mockConfig);
      expect(client.isInitialized()).toBe(true);
    });

    it('should warn on duplicate initialization', async () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      await client.init(mockConfig);
      await client.init(mockConfig);
      
      expect(consoleSpy).toHaveBeenCalledWith(
        '[expo-umami] Already initialized. Ignoring init call.'
      );
      
      consoleSpy.mockRestore();
    });

    it('should throw if not initialized before tracking', async () => {
      await expect(client.trackEvent('/test')).rejects.toThrow(
        '[expo-umami] Client not initialized. Call init() first.'
      );
    });
  });

  describe('URL normalization', () => {
    beforeEach(async () => {
      await client.init(mockConfig);
    });

    it('should keep URLs that start with /', async () => {
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => ({ size: 1, processed: 1, errors: 0 }),
      });

      await client.trackEvent('/home');
      await client.flush();

      const fetchCall = (global.fetch as any).mock.calls[0];
      const body = JSON.parse(fetchCall[1].body);
      
      expect(body[0].payload.url).toBe('/home');
    });

    it('should add leading / to URLs without it', async () => {
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => ({ size: 1, processed: 1, errors: 0 }),
      });

      await client.trackEvent('home');
      await client.flush();

      const fetchCall = (global.fetch as any).mock.calls[0];
      const body = JSON.parse(fetchCall[1].body);
      
      expect(body[0].payload.url).toBe('/home');
    });

    it('should preserve URL paths exactly as provided', async () => {
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => ({ size: 1, processed: 1, errors: 0 }),
      });

      await client.trackEvent('/home/ProductList');
      await client.flush();

      const fetchCall = (global.fetch as any).mock.calls[0];
      const body = JSON.parse(fetchCall[1].body);
      
      // Should NOT convert to kebab-case
      expect(body[0].payload.url).toBe('/home/ProductList');
    });

    it('should not remove "Screen" suffix from URLs', async () => {
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => ({ size: 1, processed: 1, errors: 0 }),
      });

      await client.trackEvent('/SettingsScreen');
      await client.flush();

      const fetchCall = (global.fetch as any).mock.calls[0];
      const body = JSON.parse(fetchCall[1].body);
      
      // Should keep "Screen" in the URL
      expect(body[0].payload.url).toBe('/SettingsScreen');
    });
  });

  describe('title handling', () => {
    beforeEach(async () => {
      await client.init(mockConfig);
    });

    it('should default title to url when not provided', async () => {
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => ({ size: 1, processed: 1, errors: 0 }),
      });

      await client.trackEvent('/home');
      await client.flush();

      const fetchCall = (global.fetch as any).mock.calls[0];
      const body = JSON.parse(fetchCall[1].body);
      
      expect(body[0].payload.title).toBe('/home');
    });

    it('should use custom title when provided', async () => {
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => ({ size: 1, processed: 1, errors: 0 }),
      });

      await client.trackEvent('/home', { title: 'Home Screen' });
      await client.flush();

      const fetchCall = (global.fetch as any).mock.calls[0];
      const body = JSON.parse(fetchCall[1].body);
      
      expect(body[0].payload.title).toBe('Home Screen');
      expect(body[0].payload.url).toBe('/home');
    });

    it('should allow different title and url', async () => {
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => ({ size: 1, processed: 1, errors: 0 }),
      });

      await client.trackEvent('/product/123', { title: 'Product Details' });
      await client.flush();

      const fetchCall = (global.fetch as any).mock.calls[0];
      const body = JSON.parse(fetchCall[1].body);
      
      expect(body[0].payload.url).toBe('/product/123');
      expect(body[0].payload.title).toBe('Product Details');
    });
  });

  describe('event tracking', () => {
    beforeEach(async () => {
      await client.init(mockConfig);
    });

    it('should track pageview events without eventName', async () => {
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => ({ size: 1, processed: 1, errors: 0 }),
      });

      await client.trackEvent('/home');
      await client.flush();

      const fetchCall = (global.fetch as any).mock.calls[0];
      const body = JSON.parse(fetchCall[1].body);
      
      expect(body[0].payload).not.toHaveProperty('name');
      expect(body[0].payload.url).toBe('/home');
    });

    it('should track custom events with eventName', async () => {
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => ({ size: 1, processed: 1, errors: 0 }),
      });

      await client.trackEvent('/button', { eventName: 'click' });
      await client.flush();

      const fetchCall = (global.fetch as any).mock.calls[0];
      const body = JSON.parse(fetchCall[1].body);
      
      expect(body[0].payload.name).toBe('click');
      expect(body[0].payload.url).toBe('/button');
    });

    it('should include custom data', async () => {
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => ({ size: 1, processed: 1, errors: 0 }),
      });

      await client.trackEvent('/product', {
        data: { productId: '123', price: 29.99 },
      });
      await client.flush();

      const fetchCall = (global.fetch as any).mock.calls[0];
      const body = JSON.parse(fetchCall[1].body);
      
      expect(body[0].payload.data).toEqual({ productId: '123', price: 29.99 });
    });

    it('should include all required Umami fields', async () => {
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => ({ size: 1, processed: 1, errors: 0 }),
      });

      await client.trackEvent('/test');
      await client.flush();

      const fetchCall = (global.fetch as any).mock.calls[0];
      const body = JSON.parse(fetchCall[1].body);
      const payload = body[0].payload;
      
      expect(payload).toHaveProperty('hostname');
      expect(payload).toHaveProperty('language');
      expect(payload).toHaveProperty('screen');
      expect(payload).toHaveProperty('title');
      expect(payload).toHaveProperty('url');
      expect(payload).toHaveProperty('website', mockConfig.websiteId);
    });

    it('should round screen dimensions to integers', async () => {
      // Mock Dimensions to return decimal values
      const mockDimensions = vi.spyOn(Dimensions, 'get');
      mockDimensions.mockReturnValue({ width: 390.5, height: 844.7 });

      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => ({ size: 1, processed: 1, errors: 0 }),
      });

      await client.trackEvent('/test');
      await client.flush();

      const fetchCall = (global.fetch as any).mock.calls[0];
      const body = JSON.parse(fetchCall[1].body);
      
      // Screen dimensions should be rounded to integers
      expect(body[0].payload.screen).toBe('391x845');
      
      mockDimensions.mockRestore();
    });
  });

  describe('queue management', () => {
    beforeEach(async () => {
      await client.init(mockConfig);
    });

    it('should return queue size', async () => {
      expect(client.getQueueSize()).toBe(0);
      
      await client.trackEvent('/home');
      expect(client.getQueueSize()).toBe(1);
      
      await client.trackEvent('/about');
      expect(client.getQueueSize()).toBe(2);
    });

    it('should flush queue manually', async () => {
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => ({ size: 2, processed: 2, errors: 0 }),
      });

      await client.trackEvent('/home');
      await client.trackEvent('/about');
      expect(client.getQueueSize()).toBe(2);
      
      await client.flush();
      
      // Queue should be cleared after flush
      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(client.getQueueSize()).toBe(0);
    });
  });
});
