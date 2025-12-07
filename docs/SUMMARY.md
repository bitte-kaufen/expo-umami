# @bitte-kaufen/expo-umami - Implementation Summary

## What We Built

A complete Expo package for Umami analytics with advanced batching, offline support, and custom event tracking.

## ✅ All Features Implemented

### Core Features
- ✅ Easy configuration via app.json config plugin
- ✅ Programmatic initialization
- ✅ Event batching using Umami's `/api/batch` endpoint
- ✅ Smart auto-flush on app background/inactive
- ✅ AsyncStorage persistence for offline support
- ✅ Custom event names (clicks, impressions, etc.)
- ✅ Full TypeScript support

### API Methods
- `initUmami(config?)` - Initialize from app.json or config object
- `trackEvent(screenName, options?)` - Track pageviews or custom events
- `trackScreenView(screenName, options?)` - Alias for trackEvent
- `trackClick(elementName, options?)` - Track click events
- `trackImpression(elementName, options?)` - Track impression events
- `trackCustomEvent(screenName, eventName, options?)` - Track custom named events
- `flush()` - Manual queue flush
- `isInitialized()` - Check status
- `getQueueSize()` - Monitor queue

### Event Types Supported
1. **Pageviews** - Standard screen navigation (no event name)
2. **Custom Events** - Named events with custom data
3. **Clicks** - Button/element clicks
4. **Impressions** - View tracking (ad impressions, product views)
5. **Custom Named Events** - Any event type you define

## How It Works

### Event Flow
```
User Action → trackClick/trackImpression/trackEvent
     ↓
Queue Event (in memory + AsyncStorage if enabled)
     ↓
Batch Check (size >= 10 OR time >= 30s OR app backgrounded)
     ↓
Send via /api/batch → Umami Server
     ↓
Success: Clear queue | Failure: Re-queue & retry
```

### Offline Support
1. Events persist to AsyncStorage when `persistEvents: true`
2. On app restart, queue is restored from AsyncStorage
3. Failed sends re-queue events automatically
4. Interval timer retries every 30 seconds
5. Events never lost even if app crashes

### Event Classification
- **Without `name` field** → Classified as pageview
- **With `name` field** → Classified as custom event
- **trackClick()** → Automatically adds `name: 'click'`
- **trackImpression()** → Automatically adds `name: 'impression'`

## File Structure

```
@bitte-kaufen/expo-umami/
├── src/
│   ├── index.ts          - Public API exports
│   ├── types.ts          - TypeScript interfaces
│   ├── UmamiClient.ts    - Singleton client with AppState
│   ├── EventQueue.ts     - Batching & persistence
│   └── userAgent.ts      - User agent builder
├── plugin/
│   └── src/
│       ├── index.ts      
│       └── withUmami.ts  - Expo config plugin
├── build/                - Compiled output
│   ├── src/
│   └── plugin/
├── README.md             - Main documentation
├── USAGE_EXAMPLE.md      - Migration guide
├── CUSTOM_EVENTS_EXAMPLE.md - Real-world examples
├── CHANGELOG.md          - Version history
└── package.json
```

## Usage Examples

### Basic Setup
```json
// app.json
{
  "plugins": [
    ["@bitte-kaufen/expo-umami", {
      "websiteId": "your-id",
      "hostUrl": "https://analytics.example.com"
    }]
  ]
}
```

```typescript
// App.tsx
initUmami();
```

### Track Impressions
```typescript
trackImpression('Product/Card', {
  data: { productId: '123', price: 29.99 }
});
```

### Track Clicks
```typescript
trackClick('Product/AddToCart', {
  data: { productId: '123' }
});
```

### Custom Events
```typescript
trackCustomEvent('Video/Player', 'play', {
  data: { videoId: 'abc', timestamp: 0 }
});
```

## Confidence in Implementation

**95% confident** the batch API fully supports:
- ✅ Pageview events
- ✅ Custom named events
- ✅ Click tracking
- ✅ Impression tracking
- ✅ Event data objects

Based on:
1. Umami's `/api/batch` forwards to `/api/send`
2. `/api/send` accepts `name` field for custom events
3. Official docs confirm event names up to 50 characters
4. Event data supported via `data` field

## What's Next

1. **Test** in a real Expo app
2. **Verify** events appear correctly in Umami dashboard
3. **Publish** to npm: `npm publish --access public`
4. **Submit** to expo-community GitHub organization
5. **Add** tests and CI/CD
6. **Consider** adding react-navigation integration

## Dependencies

- `@expo/config-plugins` - Config plugin support
- `@react-native-async-storage/async-storage` - Offline persistence
- `expo-application` - App ID and version
- `expo-constants` - Read app.json config
- `expo-device` - Device info for user agent
- `expo-localization` - Locale detection
