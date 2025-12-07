# Usage Example

## Quick Start

### 1. Install the package

```bash
npx expo install @bitte-kaufen/expo-umami @react-native-async-storage/async-storage expo-application expo-constants expo-device expo-localization
```

### 2. Configure in app.json

```json
{
  "expo": {
    "name": "My App",
    "plugins": [
      [
        "@bitte-kaufen/expo-umami",
        {
          "websiteId": "ed825179-00f1-4828-a8a3-df52b68b58b5",
          "hostUrl": "https://analytics.bitte.kaufen",
          "batchSize": 10,
          "batchInterval": 30000,
          "persistEvents": true,
          "debug": __DEV__
        }
      ]
    ]
  }
}
```

### 3. Initialize in your app

```typescript
// app/_layout.tsx or App.tsx
import { useEffect } from 'react';
import { initUmami } from '@bitte-kaufen/expo-umami';

export default function RootLayout() {
  useEffect(() => {
    initUmami(); // Reads config from app.json
  }, []);

  return (
    // Your app content
  );
}
```

### 4. Track events

```typescript
// In any screen component
import { useEffect } from 'react';
import { trackEvent } from '@bitte-kaufen/expo-umami';

export default function HomeScreen() {
  useEffect(() => {
    // Track screen view
    trackEvent('Home');
  }, []);

  const handleButtonClick = () => {
    // Track button click with custom data
    trackEvent('Home/ButtonClick', {
      data: {
        buttonName: 'Get Started',
        timestamp: Date.now(),
      },
    });
  };

  return (
    // Your screen content
  );
}
```

## How It Works

1. **Batching**: Events are queued in memory and sent in batches
2. **Auto-flush**: Queue is flushed when:
   - Batch size is reached (default: 10 events)
   - Time interval expires (default: 30 seconds)
   - App goes to background/inactive
3. **Offline support**: When enabled, events persist to AsyncStorage
4. **Smart formatting**: Screen names are automatically converted to URLs

## Migration from Your Current Code

**Before:**
```typescript
umami.init({
  websiteId: "ed825179-00f1-4828-a8a3-df52b68b58b5",
  hostUrl: "https://analytics.bitte.kaufen",
  userAgent: buildUserAgent(),
});

export async function trackEventUmami(_screenName: string, data: object = {}) {
  const screenName = _screenName.replace(/Screen/g, "");
  const urlFragments = screenName.split("/").map((fragment) => kebabCase(fragment));
  const trackingParams = {
    hostname: Application.applicationId ?? "unknown.app",
    language: i18n.currentLocale(),
    screen: `${Layout.window.width}x${Layout.window.height}`,
    title: screenName,
    url: `/${urlFragments.join("/")}`,
    data: { ...data },
  };
  console.log(`Tracking event Umami: ${screenName}`, trackingParams);
  umami.track(trackingParams);
}

trackEventUmami(screenName, args);
```

**After:**
```typescript
// app.json
{
  "plugins": [
    ["@bitte-kaufen/expo-umami", {
      "websiteId": "ed825179-00f1-4828-a8a3-df52b68b58b5",
      "hostUrl": "https://analytics.bitte.kaufen"
    }]
  ]
}

// App code
import { initUmami, trackEvent } from '@bitte-kaufen/expo-umami';

// Initialize once
initUmami();

// Track events - all the boilerplate is handled automatically!
trackEvent(screenName, { data: args });
```

## Benefits Over Direct Umami SDK

1. **Batching**: Reduces network requests by grouping events
2. **Offline support**: Events are saved and sent when back online
3. **Auto-flush**: Smart flushing on app state changes
4. **Less boilerplate**: No need to manually build tracking params
5. **Type safety**: Full TypeScript support
6. **Expo-optimized**: Works seamlessly with Expo workflows
