import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { EventQueue } from '../event-queue';
import type { UmamiEvent } from '../types';

describe('EventQueue', () => {
  let queue: EventQueue;
  const mockHostUrl = 'https://analytics.test.com';
  const mockWebsiteId = 'test-website-id';

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  afterEach(() => {
    if (queue) {
      queue.destroy();
    }
  });

  it('should create a queue with default settings', () => {
    queue = new EventQueue(mockHostUrl, mockWebsiteId);
    expect(queue).toBeDefined();
    expect(queue.getQueueSize()).toBe(0);
  });

  it('should enqueue an event', async () => {
    queue = new EventQueue(mockHostUrl, mockWebsiteId);
    await queue.init();

    const event: UmamiEvent = {
      hostname: 'com.test.app',
      language: 'en-US',
      screen: '390x844',
      title: 'Home',
      url: '/home',
      website: mockWebsiteId,
      data: {},
    };

    await queue.enqueue(event);
    expect(queue.getQueueSize()).toBe(1);
  });

  it('should auto-flush when batch size is reached', async () => {
    const batchSize = 3;
    queue = new EventQueue(mockHostUrl, mockWebsiteId, batchSize);
    await queue.init();

    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ size: 3, processed: 3, errors: 0 }),
    });

    const event: UmamiEvent = {
      hostname: 'com.test.app',
      language: 'en-US',
      screen: '390x844',
      title: 'Test',
      url: '/test',
      website: mockWebsiteId,
      data: {},
    };

    // Enqueue 3 events
    await queue.enqueue(event);
    await queue.enqueue(event);
    await queue.enqueue(event);

    // Wait for flush
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(global.fetch).toHaveBeenCalledWith(
      `${mockHostUrl}/api/batch`,
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
    );
  });

  it('should re-queue events on flush failure', async () => {
    queue = new EventQueue(mockHostUrl, mockWebsiteId, 1);
    await queue.init();

    (global.fetch as any).mockRejectedValue(new Error('Network error'));

    const event: UmamiEvent = {
      hostname: 'com.test.app',
      language: 'en-US',
      screen: '390x844',
      title: 'Test',
      url: '/test',
      website: mockWebsiteId,
      data: {},
    };

    await queue.enqueue(event);

    // Wait for flush attempt
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Event should be back in queue after failed flush
    expect(queue.getQueueSize()).toBe(1);
  });

  it('should add website ID to events', async () => {
    queue = new EventQueue(mockHostUrl, mockWebsiteId, 10);
    await queue.init();

    const event: UmamiEvent = {
      hostname: 'com.test.app',
      language: 'en-US',
      screen: '390x844',
      title: 'Test',
      url: '/test',
      website: '',
      data: {},
    };

    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ size: 1, processed: 1, errors: 0 }),
    });

    await queue.enqueue(event);
    await queue.flush();

    const fetchCall = (global.fetch as any).mock.calls[0];
    const body = JSON.parse(fetchCall[1].body);

    expect(body[0].website).toBe(mockWebsiteId);
  });
});
