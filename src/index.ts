import { TrackEventOptions, UmamiConfig } from "./types";
import { UmamiClient } from "./umami-client";

export { TrackEventOptions, UmamiConfig } from "./types";

// Initialization

export async function initUmami(config?: UmamiConfig): Promise<void> {
  const client = UmamiClient.getInstance();
  await client.init(config);
}

export function isInitialized(): boolean {
  const client = UmamiClient.getInstance();
  return client.isInitialized();
}

// Queue handling

export async function flush(): Promise<void> {
  const client = UmamiClient.getInstance();
  await client.flush();
}

export function getQueueSize(): number {
  const client = UmamiClient.getInstance();
  return client.getQueueSize();
}

// Event tracking

export async function trackEvent(screenName: string, options?: TrackEventOptions): Promise<void> {
  const client = UmamiClient.getInstance();
  await client.trackEvent(screenName, options);
}

export async function trackScreenView(screenName: string, options?: TrackEventOptions): Promise<void> {
  return trackEvent(screenName, options);
}

export async function trackClick(elementName: string, options?: Omit<TrackEventOptions, "eventName">): Promise<void> {
  const client = UmamiClient.getInstance();
  await client.trackEvent(elementName, {
    ...options,
    eventName: "click",
  });
}

export async function trackImpression(elementName: string, options?: Omit<TrackEventOptions, "eventName">): Promise<void> {
  const client = UmamiClient.getInstance();
  await client.trackEvent(elementName, {
    ...options,
    eventName: "impression",
  });
}

export async function trackCustomEvent(
  url: string,
  eventName: string,
  options?: Omit<TrackEventOptions, "eventName">
): Promise<void> {
  const client = UmamiClient.getInstance();
  await client.trackEvent(url, {
    ...options,
    eventName: eventName,
  });
}
