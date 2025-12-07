# Changelog

## [0.1.0] - 2024-12-07

### Added
- Initial release of @bitte-kaufen/expo-umami
- Easy configuration via `app.json` config plugin or programmatic initialization
- Automatic event batching using Umami's `/api/batch` endpoint
- Smart queue flushing on app background/inactive state
- Optional AsyncStorage persistence for offline event support
- Event name support for custom events (clicks, impressions, etc.)
- Convenience methods: `trackClick()`, `trackImpression()`, `trackCustomEvent()`
- Automatic user agent generation for iOS and Android
- Automatic screen name formatting and URL generation
- TypeScript support with full type definitions
- Debug logging mode
- Manual flush capability
- Queue size monitoring

### Features
- **Batching**: Configurable batch size (default: 10 events) and interval (default: 30s)
- **Offline Support**: Events persist across app restarts when enabled
- **App State Management**: Auto-flush when app backgrounds
- **Custom Events**: Support for event names to track clicks, impressions, and custom interactions
- **Flexible API**: Choose between pageviews and custom events based on your needs

### API
- `initUmami(config?)` - Initialize client
- `trackEvent(screenName, options?)` - Track events/pageviews
- `trackScreenView(screenName, options?)` - Alias for trackEvent
- `trackClick(elementName, options?)` - Track click events
- `trackImpression(elementName, options?)` - Track impression events
- `trackCustomEvent(screenName, eventName, options?)` - Track custom named events
- `flush()` - Manually flush queue
- `isInitialized()` - Check initialization status
- `getQueueSize()` - Get current queue size
