import AsyncStorage from '@react-native-async-storage/async-storage';
import { QueuedEvent, UmamiEvent, BatchResponse } from './types';

const STORAGE_KEY = '@expo-umami/event-queue';

export class EventQueue {
  private queue: QueuedEvent[] = [];
  private batchSize: number;
  private batchInterval: number;
  private persistEvents: boolean;
  private debug: boolean;
  private intervalId?: NodeJS.Timeout;
  private hostUrl: string;
  private websiteId: string;
  private isFlushing = false;

  constructor(
    hostUrl: string,
    websiteId: string,
    batchSize = 10,
    batchInterval = 30000,
    persistEvents = false,
    debug = false
  ) {
    this.hostUrl = hostUrl;
    this.websiteId = websiteId;
    this.batchSize = batchSize;
    this.batchInterval = batchInterval;
    this.persistEvents = persistEvents;
    this.debug = debug;
  }

  async init(): Promise<void> {
    if (this.persistEvents) {
      await this.loadPersistedEvents();
    }

    this.intervalId = setInterval(() => {
      this.flush();
    }, this.batchInterval);
  }

  private async loadPersistedEvents(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.queue = JSON.parse(stored);
        this.log(`Loaded ${this.queue.length} persisted events`);
      }
    } catch (error) {
      this.log('Error loading persisted events:', error);
    }
  }

  private async persistQueue(): Promise<void> {
    if (!this.persistEvents) return;

    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(this.queue));
    } catch (error) {
      this.log('Error persisting queue:', error);
    }
  }

  async enqueue(payload: UmamiEvent): Promise<void> {
    const event: QueuedEvent = {
      payload: { ...payload, website: this.websiteId },
      timestamp: Date.now(),
    };

    this.queue.push(event);
    this.log(`Event queued. Queue size: ${this.queue.length}`);

    if (this.persistEvents) {
      await this.persistQueue();
    }

    if (this.queue.length >= this.batchSize) {
      await this.flush();
    }
  }

  async flush(): Promise<void> {
    if (this.queue.length === 0 || this.isFlushing) {
      return;
    }

    this.isFlushing = true;
    const eventsToSend = [...this.queue];
    this.queue = [];

    this.log(`Flushing ${eventsToSend.length} events`);

    try {
      const payloads = eventsToSend.map((e) => e.payload);
      const response = await this.sendBatch(payloads);

      this.log('Batch sent successfully:', response);

      if (this.persistEvents) {
        await this.persistQueue();
      }
    } catch (error) {
      this.log('Error sending batch, re-queuing events:', error);
      this.queue = [...eventsToSend, ...this.queue];

      if (this.persistEvents) {
        await this.persistQueue();
      }
    } finally {
      this.isFlushing = false;
    }
  }

  private async sendBatch(events: UmamiEvent[]): Promise<BatchResponse> {
    const url = `${this.hostUrl}/api/batch`;

    this.log(`Sending batch to ${url}`, events);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(events),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  destroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }

  private log(...args: any[]): void {
    if (this.debug) {
      console.log('[expo-umami]', ...args);
    }
  }

  getQueueSize(): number {
    return this.queue.length;
  }
}
