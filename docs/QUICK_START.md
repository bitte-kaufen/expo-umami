# Quick Start Guide

Get up and running with `@bitte-kaufen/expo-umami` in 3 minutes.

## Step 1: Install (30 seconds)

```bash
npx expo install @bitte-kaufen/expo-umami @react-native-async-storage/async-storage expo-application expo-constants expo-device expo-localization
```

## Step 2: Configure (1 minute)

Add to your `app.json`:

```json
{
  "expo": {
    "plugins": [
      [
        "@bitte-kaufen/expo-umami",
        {
          "websiteId": "YOUR_WEBSITE_ID",
          "hostUrl": "https://your-umami-instance.com",
          "batchSize": 10,
          "batchInterval": 30000,
          "persistEvents": true
        }
      ]
    ]
  }
}
```

## Step 3: Initialize (30 seconds)

```typescript
// app/_layout.tsx or App.tsx
import { useEffect } from 'react';
import { initUmami } from '@bitte-kaufen/expo-umami';

export default function App() {
  useEffect(() => {
    initUmami(); // That's it!
  }, []);

  return <YourApp />;
}
```

## Step 4: Track Events (1 minute)

```typescript
import {
  trackEvent,
  trackClick,
  trackImpression
} from '@bitte-kaufen/expo-umami';

// Track screen views
function HomeScreen() {
  useEffect(() => {
    trackEvent('Home');
  }, []);

  return <View />;
}

// Track button clicks
function handleButtonPress() {
  trackClick('Home/CTA', {
    data: { buttonText: 'Get Started' }
  });
}

// Track impressions
function ProductCard({ product }) {
  useEffect(() => {
    trackImpression('Product/Card', {
      data: {
        productId: product.id,
        price: product.price
      }
    });
  }, [product]);

  return <View />;
}
```

## That's It! 🎉

Your app is now tracking:
- ✅ Screen views
- ✅ Button clicks
- ✅ Product impressions
- ✅ Custom events

Events are automatically batched, persisted offline, and sent to your Umami instance.

## Common Use Cases

### E-Commerce
```typescript
trackImpression('Product/Card', { data: { productId } });
trackClick('Product/AddToCart', { data: { productId, price } });
```

### Video Player
```typescript
trackCustomEvent('Video', 'play', { data: { videoId } });
trackCustomEvent('Video', 'complete', { data: { videoId, duration } });
```

### Forms
```typescript
trackImpression('Checkout/Form');
trackClick('Checkout/Submit', { data: { totalAmount } });
```

### Search
```typescript
trackCustomEvent('Search', 'query', { data: { query, results } });
trackClick('Search/Result', { data: { resultId, position } });
```

## Configuration Options

| Option | Default | Description |
|--------|---------|-------------|
| `websiteId` | required | Your Umami website ID |
| `hostUrl` | required | Your Umami instance URL |
| `batchSize` | 10 | Events per batch |
| `batchInterval` | 30000 | Milliseconds between batches |
| `persistEvents` | false | Save events to AsyncStorage |
| `debug` | false | Enable console logging |

## Need Help?

- 📖 [Full Documentation](./README.md)
- 💡 [Custom Events Examples](./CUSTOM_EVENTS_EXAMPLE.md)
- 🔄 [Migration Guide](./USAGE_EXAMPLE.md)
