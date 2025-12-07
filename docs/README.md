# @bitte-kaufen/expo-umami

Easy Umami analytics integration for Expo apps with automatic batching, offline support, and app state management.

## Features

- **Easy Setup**: Configure via `app.json` or programmatically
- **Automatic Batching**: Groups events and sends them in batches to reduce network calls
- **Smart Flushing**: Automatically flushes queue when app backgrounds or closes
- **Offline Support**: Optional AsyncStorage persistence for offline events
- **TypeScript**: Full type safety out of the box
- **Expo Integration**: Built specifically for Expo applications

## Installation

```bash
npx expo install @bitte-kaufen/expo-umami @react-native-async-storage/async-storage expo-application expo-constants expo-device expo-localization
```

## Configuration

### Option 1: Config Plugin (Recommended)

Add the plugin to your `app.json`:

```json
{
  "expo": {
    "plugins": [
      [
        "@bitte-kaufen/expo-umami",
        {
          "websiteId": "your-website-id",
          "hostUrl": "https://analytics.example.com",
          "batchSize": 10,
          "batchInterval": 30000,
          "persistEvents": true,
          "debug": false
        }
      ]
    ]
  }
}
```

Then initialize in your app without parameters:

```typescript
import { initUmami } from '@bitte-kaufen/expo-umami';

// In your App.tsx or _layout.tsx
useEffect(() => {
  initUmami(); // Reads config from app.json
}, []);
```

### Option 2: Programmatic Configuration

```typescript
import { initUmami } from '@bitte-kaufen/expo-umami';

useEffect(() => {
  initUmami({
    websiteId: 'ed825179-00f1-4828-a8a3-df52b68b58b5',
    hostUrl: 'https://analytics.bitte.kaufen',
    batchSize: 10,        // Send after 10 events (default: 10)
    batchInterval: 30000, // Or every 30 seconds (default: 30000)
    persistEvents: true,  // Save to AsyncStorage for offline (default: false)
    debug: true,          // Enable debug logging (default: false)
  });
}, []);
```

## Usage

### Track Screen Views

```typescript
import { trackEvent, trackScreenView } from '@bitte-kaufen/expo-umami';

function HomeScreen() {
  useEffect(() => {
    trackScreenView('Home');
  }, []);

  return <View>...</View>;
}
```

### Track Events with Data

```typescript
import { trackEvent } from '@bitte-kaufen/expo-umami';

function ProductScreen() {
  const handlePurchase = () => {
    trackEvent('Product/Purchase', {
      data: {
        productId: '123',
        price: 29.99,
        currency: 'USD',
      },
    });
  };

  return <Button onPress={handlePurchase}>Buy Now</Button>;
}
```

### Track Custom Events (Clicks, Impressions, etc.)

```typescript
import { trackClick, trackImpression, trackCustomEvent } from '@bitte-kaufen/expo-umami';

function ProductCard({ product }) {
  useEffect(() => {
    // Track when product card is viewed
    trackImpression('Product/Card', {
      data: { productId: product.id, price: product.price },
    });
  }, [product]);

  const handleAddToCart = () => {
    // Track button click
    trackClick('Product/AddToCart', {
      data: { productId: product.id },
    });
  };

  const handleShare = () => {
    // Track custom event with any name
    trackCustomEvent('Product/Card', 'share', {
      data: { productId: product.id, method: 'social' },
    });
  };

  return (
    <View>
      <Button onPress={handleAddToCart}>Add to Cart</Button>
      <Button onPress={handleShare}>Share</Button>
    </View>
  );
}
```

### Advanced: Custom Event Names

You can also pass a custom event name to `trackEvent`:

```typescript
trackEvent('Home/Hero', {
  name: 'banner_interaction',
  data: { position: 'top', action: 'swipe' },
});
```

### Manual Flush

```typescript
import { flush } from '@bitte-kaufen/expo-umami';

// Force send all queued events immediately
await flush();
```

### Check Status

```typescript
import { isInitialized, getQueueSize } from '@bitte-kaufen/expo-umami';

console.log('Initialized:', isInitialized());
console.log('Queued events:', getQueueSize());
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `websiteId` | string | **required** | Your Umami website ID |
| `hostUrl` | string | **required** | Your Umami instance URL |
| `batchSize` | number | `10` | Number of events before auto-flush |
| `batchInterval` | number | `30000` | Milliseconds between auto-flushes |
| `persistEvents` | boolean | `false` | Save events to AsyncStorage for offline |
| `debug` | boolean | `false` | Enable console logging |

## How It Works

1. **Event Queueing**: Events are added to an in-memory queue
2. **Batch Sending**: Events are sent when:
   - Queue reaches `batchSize` events, or
   - `batchInterval` milliseconds have passed, or
   - App goes to background/inactive state
3. **Batch API**: Uses Umami's `/api/batch` endpoint for efficient bulk sending
4. **Offline Support**: When enabled, events persist to AsyncStorage and survive app restarts
5. **Auto Formatting**: Automatically formats screen names and generates proper URLs

## Event Formatting

Screen names are automatically transformed:

```typescript
trackEvent('Home/ProductList');
// Sends: url = '/home/product-list', title = 'Home/ProductList'

trackEvent('SettingsScreen');
// Sends: url = '/settings', title = 'Settings' (removes 'Screen' suffix)
```

## API Reference

### `initUmami(config?: UmamiConfig): Promise<void>`

Initialize the Umami client. Can be called without parameters if using config plugin.

### `trackEvent(screenName: string, options?: TrackEventOptions): Promise<void>`

Track a screen view or event. Options include:
- `name?: string` - Custom event name (makes it a custom event instead of pageview)
- `data?: Record<string, any>` - Custom event data

### `trackScreenView(screenName: string, options?: TrackEventOptions): Promise<void>`

Alias for `trackEvent`. Use whichever reads better in your code.

### `trackClick(elementName: string, options?: TrackEventOptions): Promise<void>`

Track a click event. Automatically sets event name to 'click'.

### `trackImpression(elementName: string, options?: TrackEventOptions): Promise<void>`

Track an impression event. Automatically sets event name to 'impression'.

### `trackCustomEvent(screenName: string, eventName: string, options?: TrackEventOptions): Promise<void>`

Track a custom event with a specific event name.

### `flush(): Promise<void>`

Manually flush all queued events immediately.

### `isInitialized(): boolean`

Check if the client has been initialized.

### `getQueueSize(): number`

Get the current number of queued events.

## Example App

```typescript
// app/_layout.tsx
import { useEffect } from 'react';
import { initUmami } from '@bitte-kaufen/expo-umami';
import { Stack } from 'expo-router';

export default function RootLayout() {
  useEffect(() => {
    initUmami(); // Uses app.json config
  }, []);

  return <Stack />;
}

// app/index.tsx
import { useEffect } from 'react';
import { View, Text } from 'react-native';
import { trackScreenView } from '@bitte-kaufen/expo-umami';

export default function HomeScreen() {
  useEffect(() => {
    trackScreenView('Home');
  }, []);

  return (
    <View>
      <Text>Welcome!</Text>
    </View>
  );
}
```

## Migration from Umami Tracker

If you're currently using `umami.track()` directly:

**Before:**
```typescript
umami.track({
  hostname: Application.applicationId ?? "unknown.app",
  language: i18n.currentLocale(),
  screen: `${Layout.window.width}x${Layout.window.height}`,
  title: screenName,
  url: `/my-page`,
  data: { foo: 'bar' },
});
```

**After:**
```typescript
trackEvent('MyPage', {
  data: { foo: 'bar' },
});
```

All the boilerplate (hostname, language, screen size, URL formatting) is handled automatically.

## License

MIT

## Contributing

Contributions are welcome! Please open an issue or PR on GitHub.
