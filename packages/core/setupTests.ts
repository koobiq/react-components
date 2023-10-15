import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

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
