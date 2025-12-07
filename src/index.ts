import { UmamiClient } from './umami-client';
import { UmamiConfig, TrackEventOptions } from './types';

export { UmamiConfig, TrackEventOptions } from './types';

export async function initUmami(config?: UmamiConfig): Promise<void> {
  const client = UmamiClient.getInstance();
  await client.init(config);
}

export async function trackEvent(
  screenName: string,
  options?: TrackEventOptions
): Promise<void> {
  const client = UmamiClient.getInstance();
  await client.trackEvent(screenName, options);
}

export async function trackScreenView(
  screenName: string,
  options?: TrackEventOptions
): Promise<void> {
  return trackEvent(screenName, options);
}

export async function flush(): Promise<void> {
  const client = UmamiClient.getInstance();
  await client.flush();
}

export function isInitialized(): boolean {
  const client = UmamiClient.getInstance();
  return client.isInitialized();
}

export function getQueueSize(): number {
  const client = UmamiClient.getInstance();
  return client.getQueueSize();
}

export async function trackClick(
  elementName: string,
  options?: Omit<TrackEventOptions, 'name'>
): Promise<void> {
  const client = UmamiClient.getInstance();
  await client.trackEvent(elementName, {
    ...options,
    name: 'click',
  });
}

export async function trackImpression(
  elementName: string,
  options?: Omit<TrackEventOptions, 'name'>
): Promise<void> {
  const client = UmamiClient.getInstance();
  await client.trackEvent(elementName, {
    ...options,
    name: 'impression',
  });
}

export async function trackCustomEvent(
  screenName: string,
  eventName: string,
  options?: Omit<TrackEventOptions, 'name'>
): Promise<void> {
  const client = UmamiClient.getInstance();
  await client.trackEvent(screenName, {
    ...options,
    name: eventName,
  });
}
