import { AppState, AppStateStatus, Dimensions, Platform } from 'react-native';
import * as Application from 'expo-application';
import * as Localization from 'expo-localization';
import Constants from 'expo-constants';
import { UmamiConfig, UmamiEvent, TrackEventOptions } from './types';
import { EventQueue } from './event-queue';

export class UmamiClient {
  private static instance: UmamiClient | null = null;
  private config: UmamiConfig | null = null;
  private eventQueue: EventQueue | null = null;
  private appStateSubscription: any = null;

  private constructor() {}

  static getInstance(): UmamiClient {
    if (!UmamiClient.instance) {
      UmamiClient.instance = new UmamiClient();
    }
    return UmamiClient.instance;
  }

  async init(config?: UmamiConfig): Promise<void> {
    if (this.config) {
      console.warn('[expo-umami] Already initialized. Ignoring init call.');
      return;
    }

    let finalConfig: UmamiConfig;

    if (config) {
      finalConfig = config;
    } else {
      const pluginConfig = Constants.expoConfig?.extra?.umami;
      if (!pluginConfig) {
        throw new Error(
          '[expo-umami] No configuration provided. Either pass config to init() or configure via app.json plugin.'
        );
      }
      finalConfig = pluginConfig;
    }

    this.config = {
      batchSize: 10,
      batchInterval: 30000,
      persistEvents: false,
      debug: false,
      ...finalConfig,
    };

    this.eventQueue = new EventQueue(
      this.config.hostUrl,
      this.config.websiteId,
      this.config.batchSize,
      this.config.batchInterval,
      this.config.persistEvents,
      this.config.debug
    );

    await this.eventQueue.init();
    this.setupAppStateListener();

    this.log('Umami client initialized', this.config);
  }

  private setupAppStateListener(): void {
    this.appStateSubscription = AppState.addEventListener(
      'change',
      this.handleAppStateChange.bind(this)
    );
  }

  private handleAppStateChange(nextAppState: AppStateStatus): void {
    if (nextAppState === 'background' || nextAppState === 'inactive') {
      this.log('App backgrounded, flushing queue');
      this.flush();
    }
  }

  async trackEvent(url: string, options: TrackEventOptions = {}): Promise<void> {
    if (!this.config || !this.eventQueue) {
      throw new Error('[expo-umami] Client not initialized. Call init() first.');
    }

    // Ensure URL starts with /
    const normalizedUrl = url.startsWith('/') ? url : `/${url}`;

    const { width, height } = Dimensions.get('window');
    const locale = Localization.getLocales()[0]?.languageTag || 'en-US';

    const payload: UmamiEvent = {
      hostname: Application.applicationId ?? 'unknown.app',
      language: locale,
      screen: `${Math.round(width)}x${Math.round(height)}`,
      title: options.title || url,
      url: normalizedUrl,
      website: this.config.websiteId,
      ...(options.eventName ? { name: options.eventName } : {}),
      data: options.data || {},
    };

    this.log(`Tracking event: ${url}${options.eventName ? ` (${options.eventName})` : ''}`, payload);

    await this.eventQueue.enqueue(payload);
  }

  async flush(): Promise<void> {
    if (this.eventQueue) {
      await this.eventQueue.flush();
    }
  }

  destroy(): void {
    if (this.eventQueue) {
      this.eventQueue.destroy();
      this.eventQueue = null;
    }

    if (this.appStateSubscription) {
      this.appStateSubscription.remove();
      this.appStateSubscription = null;
    }

    this.config = null;
    UmamiClient.instance = null;
  }

  isInitialized(): boolean {
    return this.config !== null;
  }

  getQueueSize(): number {
    return this.eventQueue?.getQueueSize() || 0;
  }

  private log(...args: any[]): void {
    if (this.config?.debug) {
      console.log('[expo-umami]', ...args);
    }
  }
}
