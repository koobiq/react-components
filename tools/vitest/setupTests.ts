import '@testing-library/jest-dom/vitest';
import { once } from '@koobiq/logger';
import { beforeEach, vi } from 'vitest';
import failOnConsole from 'vitest-fail-on-console';

// Both flags are library defaults, pinned against an upstream change.
failOnConsole({
  shouldFailOnWarn: true,
  shouldFailOnError: true,
  // Only for output the repo cannot fix at the source. One link per entry.
  // jsdom, unimplemented browser APIs:
  // https://github.com/jsdom/jsdom/blob/main/lib/jsdom/browser/not-implemented.js
  silenceMessage: (message) => message.startsWith('Error: Not implemented:'),
});

// Without a reset, only the first test emitting a `once` message can observe it.
beforeEach(() => {
  once.clear();
});

global.matchMedia = vi.fn().mockImplementation((query) => ({
  matches: false,
  media: query,
  onchange: null,
  /** @deprecated */
  addListener: vi.fn(),
  /** @deprecated */
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}));
