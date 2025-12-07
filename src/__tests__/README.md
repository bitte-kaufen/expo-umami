# Tests

This package uses **Vitest** for testing - a modern, fast alternative to Jest.

## Running Tests

```bash
# Run all tests once
yarn test

# Run tests in watch mode (re-runs on file changes)
yarn test:watch

# Run tests with coverage
yarn test:coverage
```

## Test Structure

- `setup.ts` - Mocks for React Native and Expo modules
- `event-queue.test.ts` - Tests for the EventQueue batching logic

## What's Tested

### EventQueue
- ✅ Queue creation with default settings
- ✅ Event enqueueing
- ✅ Auto-flush when batch size reached
- ✅ Re-queueing on flush failure
- ✅ Website ID injection

## Adding More Tests

To add tests, create files with `.test.ts` extension in `src/__tests__/`.

Example:
```typescript
import { describe, it, expect } from 'vitest';

describe('MyFeature', () => {
  it('should do something', () => {
    expect(true).toBe(true);
  });
});
```

## Why Vitest?

- **10-100x faster** than Jest
- **Better DX** - faster feedback loop
- **Jest-compatible API** - easy to learn if you know Jest
- **ESM native** - modern JavaScript
- **Better error messages**
