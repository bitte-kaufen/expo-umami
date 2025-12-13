# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is `@bitte-kaufen/expo-umami`, an npm package that provides Umami analytics integration for Expo/React Native apps. It features automatic event batching, offline support via AsyncStorage, and an Expo config plugin for easy setup.

## Common Commands

```bash
yarn build        # Compile TypeScript to build/
yarn test         # Run tests with Vitest
yarn test:watch   # Run tests in watch mode
yarn typecheck    # Type-check without emitting
yarn clean        # Remove build directory
```

Run a single test file:
```bash
yarn vitest run src/__tests__/event-queue.test.ts
```

## Workflow Requirements

- **Before committing**: Always run `yarn test` and ensure all tests pass
- **Pull requests**: Add the `ai-assisted` label to any PR created with Claude's help

## Architecture

### Core Components

- **`src/index.ts`** - Public API exports. All tracking functions (`trackEvent`, `trackScreenView`, `trackClick`, etc.) delegate to the singleton `UmamiClient`.

- **`src/umami-client.ts`** - Singleton client that manages initialization, configuration, and app state lifecycle. Listens for app backgrounding to flush events. Enriches events with device metadata (hostname, language, screen dimensions).

- **`src/event-queue.ts`** - Handles event batching and network communication. Events are queued in memory and sent to Umami's `/api/batch` endpoint when batch size is reached or interval expires. Failed sends are re-queued. Optionally persists to AsyncStorage for offline support.

- **`src/types.ts`** - TypeScript interfaces for config, events, and API responses.

- **`src/user-agent.ts`** - Builds platform-appropriate User-Agent strings for iOS/Android.

### Expo Config Plugin

- **`plugin/src/with-umami.ts`** - Expo config plugin that injects Umami settings into `config.extra.umami`. This allows `initUmami()` to be called without parameters.

- **`app.plugin.js`** - Entry point that points to `build/plugin/src/index.js`.

### Test Setup

Tests use Vitest with mocked React Native and Expo modules. The mock setup is in `src/__tests__/setup.ts`. React Native is aliased to `src/__mocks__/react-native.ts` in vitest.config.ts.

## Code Conventions

- Use dasherized file names (e.g., `event-queue.ts`, not `eventQueue.ts`)
- Follow Conventional Commits: `feat:`, `fix:`, `docs:`, `test:`, `chore:`
