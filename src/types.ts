export interface UmamiConfig {
  websiteId: string;
  hostUrl: string;
  batchSize?: number;
  batchInterval?: number;
  persistEvents?: boolean;
  debug?: boolean;
}

export interface UmamiEvent {
  hostname: string;
  language: string;
  screen: string;
  title: string;
  url: string;
  website: string;
  name?: string;  // Maps to eventName in options, 'name' is required by Umami API
  data?: Record<string, any>;
}

export interface TrackEventOptions {
  title?: string;
  eventName?: string;
  data?: Record<string, any>;
}

export type EventType = 'pageview' | 'event' | 'impression' | 'click';

export interface QueuedEvent {
  payload: UmamiEvent;
  timestamp: number;
}

export interface BatchResponse {
  size: number;
  processed: number;
  errors: number;
  details?: Array<{
    index: number;
    response: any;
  }>;
}
