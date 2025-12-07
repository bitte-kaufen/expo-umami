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
  name?: string;
  data?: Record<string, any>;
}

export interface TrackEventOptions {
  name?: string;
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
